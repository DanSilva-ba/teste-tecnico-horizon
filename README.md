# Horizon – Agendamento de consultas (back-end)

API REST para agendamento de consultas, feita com **NestJS**, **Prisma** e **PostgreSQL**.

## Requisitos

- **Via Docker:** Docker e Docker Compose.
- **Via terminal (cmd):** Node.js **26.13.1** (versão usada no desenvolvimento) e PostgreSQL 16 ou superior em execução.

## Variáveis de ambiente

Antes de rodar, por qualquer um dos dois caminhos, **renomeie o arquivo `.env.example` para `.env`** e preencha as variáveis:

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_HOST` | Host do PostgreSQL | `localhost` |
| `DATABASE_PORT` | Porta do PostgreSQL | `5432` |
| `DATABASE_NAME` | Nome do banco | `agendamento` |
| `DATABASE_USER` | Usuário do banco | `postgres` |
| `DATABASE_PASSWORD` | Senha do banco | `sua_senha` |
| `DATABASE_URL` | URL de conexão usada pelo Prisma (veja abaixo) | `postgresql://postgres:sua_senha@localhost:5432/agendamento?schema=public` |
| `PORT` | Porta da API (opcional, padrão `3000`) | `3000` |
| `DATABASE_EXPOSED_PORT` | Só no Docker: porta do banco no seu computador (opcional, padrão `5433`) | `5433` |

### Preenchendo a `DATABASE_URL`

A `DATABASE_URL` **não é montada automaticamente**. Escreva a URL completa, com os mesmos valores das variáveis acima, neste formato:

```
postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public
```

Cada parte corresponde a uma variável:

| Trecho da URL | Variável |
|---|---|
| `USUARIO` | `DATABASE_USER` |
| `SENHA` | `DATABASE_PASSWORD` |
| `HOST` | `DATABASE_HOST` |
| `PORTA` | `DATABASE_PORT` |
| `NOME_DO_BANCO` | `DATABASE_NAME` |

Exemplo de um `.env` preenchido:

```dotenv
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=agendamento
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/agendamento?schema=public"
```

> **Importante:**
> - Se você alterar alguma das variáveis do banco, atualize também a `DATABASE_URL`.
> - Se a senha tiver caracteres especiais (`@`, `#`, `/`, `:`), eles precisam ser codificados na URL. Por exemplo, `@` vira `%40`.
> - **No Docker**, a `DATABASE_URL` do `.env` é ignorada: o `docker-compose.yaml` monta a URL a partir das outras variáveis, usando o host `db`. Ela só é usada quando a API roda pelo terminal.
## Rodando via Docker

Com o `.env` preenchido, na raiz do projeto:

```No terminal, rodar o seguinte comando:
    docker compose up --build
```

O Docker sobe dois containers:

- **`agendamento-db`:** PostgreSQL 16, acessível no seu computador em `localhost:5433` (ou na porta definida em `DATABASE_EXPOSED_PORT`).
- **`agendamento-api`:** a API, em `http://localhost:3000`.

Ao iniciar, a API aplica as migrações automaticamente, incluindo a carga inicial de **70 consultas de exemplo**. No Docker, a `DATABASE_URL` é montada pelo próprio `docker-compose.yaml` a partir das outras variáveis. Por isso, `DATABASE_HOST` e `DATABASE_URL` do `.env` não são usadas nesse modo.

Comandos úteis:

| Comando | O que faz |
|---|---|
| `docker compose up -d --build` | Sobe em segundo plano |
| `docker compose logs -f api` | Acompanha os logs da API |
| `docker compose down` | Para os containers e mantém os dados |
| `docker compose down -v` | Para os containers e **apaga o banco**. No próximo `up`, as migrações e os 70 registros são recriados |

## Rodando via terminal (cmd)

Com o PostgreSQL rodando e o `.env` preenchido (aqui, a `DATABASE_URL` precisa apontar para o seu banco local):

```bash
# 1. Instalar as dependências
npm install

# 2. Gerar o client do Prisma (a pasta src/generated não é versionada)
npx prisma generate --config prisma7.config.ts

# 3. Criar as tabelas e inserir os 70 registros de exemplo
npx prisma migrate deploy --config prisma7.config.ts

# 4. Subir a API em modo de desenvolvimento
npm run start:dev
```

A API fica disponível em `http://localhost:3000`.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run build` | Compila para `dist/` |
| `npm run start:prod` | Roda a versão compilada |
| `npm run test` | Roda os testes |
| `npm run lint` | Roda o linter |
| `npx prisma migrate reset --config prisma7.config.ts` | **Apaga o banco** e reaplica as migrações com os dados de exemplo |

## Dados iniciais

A migração `20261126090000_seed_appointments` insere 70 consultas com datas **relativas ao momento em que é executada** (horário de Brasília):
- 22 realizadas e 8 canceladas nos últimos 60 dias;
- 6 agendadas para o dia da execução (permitem testar "marcar como realizada");
- 28 agendadas e 6 canceladas nos próximos 60 dias.

## Rotas

| Método e rota | Descrição |
|---|---|
| `GET /appointment` | Lista todas as consultas |
| `POST /appointment` | Agenda uma consulta |
| `PUT /appointment` | Altera o status. Corpo: `{ id, status }` |
| `DELETE /appointment/:id` | Exclui uma consulta |

