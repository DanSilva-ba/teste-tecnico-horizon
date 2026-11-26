# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:26.13.1-slim AS builder

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    for registry in https://registry.npmjs.org https://registry.npmjs.org https://registry.npmmirror.com; do \
      npm ci --no-audit --no-fund --registry="$registry" \
        --maxsockets=3 --fetch-retries=5 \
        --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 && break; \
      echo ">> npm ci falhou usando $registry, tentando de novo em 10s..."; sleep 10; \
    done \
 && test -x node_modules/.bin/nest

# Copia só o necessário (sem node_modules do Windows e sem .env)
COPY tsconfig*.json nest-cli.json prisma7.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate --config prisma7.config.ts \
 && npm run build

# ---------- runtime ----------
FROM node:26.13.1-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma7.config.ts ./

EXPOSE 3000

# Aplica as migrações (incluindo os 70 registros de exemplo) e sobe a API
CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && node dist/main.js"]
