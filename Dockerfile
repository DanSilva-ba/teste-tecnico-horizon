# ---------- build ----------
FROM node:26.13.1-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund \
      --maxsockets=5 \
      --fetch-retries=5 \
      --fetch-retry-mintimeout=20000 \
      --fetch-retry-maxtimeout=120000

COPY tsconfig*.json nest-cli.json prisma7.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate --config prisma7.config.ts \
 && npm run build

# ---------- runtime ----------
FROM node:26.13.1-slim

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma7.config.ts ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && node dist/main.js"]