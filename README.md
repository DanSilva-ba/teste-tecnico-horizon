# Horizon – Agendamento de consultas (front-end)

Interface do Sistema de Agendamento de Consultas, feita em React + TypeScript + Vite, com a identidade visual Horizon.
Consome a API REST do projeto de back-end (NestJS).

> O back-end precisa estar rodando antes do front-end, na porta `3000`, seja via Docker ou via terminal.
> Veja as instruções no README do back-end.

## Rodando via Docker

Requisitos: Docker e Docker Compose.

Com o back-end em execução, na raiz deste projeto, execute o comando:

```bash
docker compose up --build
```

A aplicação abre em **http://localhost:8080**.

O container usa o **Nginx**, que serve o site e repassa as chamadas `/api/*` para o back-end em
`host.docker.internal:3000`, que é a porta 3000 do seu computador. Por isso funciona com o back-end rodando no
Docker ou pelo terminal, sem precisar de CORS.

Variáveis opcionais, que podem ficar em um arquivo `.env` na raiz:

| Variável | Descrição | Padrão |
|---|---|---|
| `WEB_PORT` | Porta do site no seu computador | `8080` |
| `API_URL` | Endereço do back-end visto de dentro do container | `http://host.docker.internal:3000` |

Comandos úteis:

| Comando | O que faz |
|---|---|
| `docker compose up -d --build` | Sobe em segundo plano |
| `docker compose logs -f web` | Acompanha os logs |
| `docker compose down` | Para o container |

## Rodando via terminal (cmd)

Requisitos: Node.js **26.13.1** (versão usada no desenvolvimento).

Antes de rodar, **renomeie o arquivo `.env.example` para `.env`**:

```bash
# Windows (cmd)
ren .env.example .env

# Linux / macOS / Git Bash
mv .env.example .env
```

Depois:

```bash
npm install
npm run dev
```

A aplicação abre em **http://localhost:5173**.

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | Prefixo das chamadas à API. Deixe `/api` para usar o proxy do Vite | `/api` |

Em desenvolvimento, o Vite repassa `/api/*` para `http://localhost:3000` (veja `vite.config.ts`), então o back-end
não precisa liberar CORS. Se o back-end estiver em outra porta, defina `API_PROXY_TARGET` antes de rodar, por
exemplo `API_PROXY_TARGET=http://localhost:4000`.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run lint` | Roda o ESLint |
| `npm run preview` | Serve a versão de produção localmente |

## Funcionalidades

- Agendar, editar e remarcar consultas.
- Marcar como realizada, cancelar e excluir (com confirmação).
- Listagem paginada (5 por página, botões **Anteriores** / **Ver mais**), ordenada por data, com filtros por nome/CPF, status e data.
- Depois de agendar, editar ou remarcar, a tela vai até a página da consulta e a destaca por alguns segundos.
- Formulário com validação antes do envio. Os erros do servidor aparecem em português, sem detalhes internos.

## Regras refletidas na interface

A tela nunca oferece uma ação que a regra de negócio vai recusar. O servidor continua sendo a fonte da verdade.

| Status | Ações disponíveis |
|---|---|
| Agendada | Editar, Remarcar, Cancelar, Excluir. **Marcar como realizada** só aparece no dia da consulta |
| Realizada | Excluir |
| Cancelada | Excluir |

Validações do formulário:

- nome de 3 a 150 caracteres;
- CPF no formato `000.000.000-00` (máscara automática, sem validar os dígitos verificadores);
- data e hora obrigatórias e não passadas (antecipar ou adiar é permitido, desde que não seja para o passado);
- especialidade/motivo de 3 a 100 caracteres;
- observações opcionais, até 1.000 caracteres.

Datas são exibidas e comparadas no horário de Brasília.

## Rotas da API utilizadas

Os caminhos ficam centralizados em `src/service/appointmentService.ts`. Todas as chamadas usam o prefixo `/api`,
que o Vite (em desenvolvimento) ou o Nginx (no Docker) repassa ao back-end.

| Método e rota | Uso no front-end | Corpo |
|---|---|---|
| `GET /appointment` | Lista as consultas. Filtros, ordenação e paginação são feitos no front-end | — |
| `POST /appointment` | Agenda | `{ patientName, patientCpf, appointmentDateAndTime, specialty, observations }` |
| `PUT /appointment/:id` | Edita os dados | `{ patientName, patientCpf, appointmentDateAndTime, specialty, observations }` |
| `PUT /appointment/rescheduleAppointment` | Remarca | `{ id, date }` |
| `PUT /appointment` | Marca como realizada ou cancela | `{ id, status: "REALIZADA" \| "CANCELADA" }` |
| `DELETE /appointment/:id` | Exclui | — |

Datas são enviadas em ISO 8601 (`2026-12-20T13:00:00.000Z`) e o CPF é enviado só com os dígitos.
Status usados: `AGENDADA`, `REALIZADA`, `CANCELADA`. Os erros seguem o formato do Nest:
`{ statusCode, message: string | string[] }`.

## Estrutura

```
src/
├── components/   # componentes de interface, cada um na sua pasta com o CSS Module
├── hooks/        # useAppointments (busca) e useToast (avisos)
├── models/       # tipos e regras de negócio da interface (appointmentRules)
├── pages/Home/   # tela principal, que orquestra filtros, lista, formulário e ações
├── service/      # cliente HTTP (http.ts) e chamadas da API (appointmentService.ts)
└── utils/        # datas, máscara de CPF e validação do formulário
```
