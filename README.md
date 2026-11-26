# Horizon – Agendamento de consultas (front-end)

Interface do Sistema de Agendamento de Consultas, feita em React + TypeScript + Vite, com a identidade visual Horizon.
Consome a API REST do projeto de back-end (NestJS).

## Como rodar

Requisitos: Node.js 20 ou superior e o back-end em execução.

```bash
npm install
cp .env.example .env      # no Windows: copy .env.example .env
npm run dev
```

A aplicação abre em `http://localhost:5173`. A variável `VITE_API_URL` (em `.env`) aponta para a API e vale
`http://localhost:3000` por padrão. O back-end precisa liberar CORS para a origem do front-end.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run lint` | Roda o ESLint |
| `npm run preview` | Serve a versão de produção localmente |

## Funcionalidades

- Agendar, editar e remarcar consultas.
- Marcar como realizada, cancelar e excluir (com confirmação).
- Listagem paginada (5 por página, botões **Anteriores** / **Ver mais**) com filtros por nome/CPF, status e data.
- Formulário com validação antes do envio; erros do servidor aparecem em português, sem detalhes internos.

## Regras refletidas na interface

A tela nunca oferece uma ação que a regra de negócio vai recusar. O servidor continua sendo a fonte da verdade.

| Status | Ações disponíveis |
|---|---|
| Agendada | Editar, Remarcar, Cancelar, Excluir. **Marcar como realizada** só aparece no dia da consulta |
| Realizada | Excluir |
| Cancelada | Excluir |

Validações do formulário: nome de 3 a 150 caracteres; CPF no formato `000.000.000-00` (máscara automática, sem
validar dígitos); data e hora obrigatórias e não passadas; especialidade/motivo de 3 a 100 caracteres;
observações opcionais, até 1.000 caracteres.

## Contrato esperado da API

Os caminhos ficam centralizados em `src/service/appointmentService.ts`.

| Método e rota | Uso |
|---|---|
| `GET /appointments?page&limit&status&search&date` | Lista paginada. Resposta: `{ data, meta: { page, limit, total, totalPages } }` |
| `POST /appointments` | Agenda |
| `PATCH /appointments/:id` | Edita |
| `PATCH /appointments/:id/reschedule` | Remarca (`appointmentDateAndTime`) |
| `PATCH /appointments/:id/complete` | Marca como realizada |
| `PATCH /appointments/:id/cancel` | Cancela |
| `DELETE /appointments/:id` | Exclui (204) |

Corpo de criação e edição:
`{ patientName, patientCpf, appointmentDateAndTime (ISO 8601), specialty, observations? }`.
Status usados: `SCHEDULED`, `COMPLETED`, `CANCELED`. Erros devem vir no formato do Nest:
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
