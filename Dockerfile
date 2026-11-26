# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:26.13.1-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    for registry in https://registry.npmjs.org https://registry.npmjs.org https://registry.npmmirror.com; do \
      npm ci --no-audit --no-fund --registry="$registry" \
        --maxsockets=3 --fetch-retries=5 \
        --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 && break; \
      echo ">> npm ci falhou usando $registry, tentando de novo em 10s..."; sleep 10; \
    done \
 && test -x node_modules/.bin/vite

# Copia só o necessário (sem node_modules do Windows e sem .env)
COPY index.html vite.config.ts tsconfig*.json ./
COPY public ./public
COPY src ./src

# O front sempre chama /api; quem repassa para o backend é o Nginx
ENV VITE_API_URL=/api
RUN npm run build

# ---------- runtime ----------
FROM nginx:stable-alpine

COPY <<'NGINX' /etc/nginx/templates/default.conf.template
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Repassa /api/* para o backend, removendo o prefixo /api (evita CORS)
    location /api/ {
        proxy_pass ${API_URL}/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Arquivos com hash no nome podem ficar em cache por muito tempo
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Qualquer outra rota devolve o index.html (aplicação de página única)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

COPY --from=builder /app/dist /usr/share/nginx/html

# Endereço do backend visto de dentro do container (pode ser trocado no compose)
ENV API_URL=http://host.docker.internal:3000

EXPOSE 80
