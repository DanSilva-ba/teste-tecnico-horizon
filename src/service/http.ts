const BASE_URL: string = import.meta.env.VITE_API_URL ?? '/api'

const FALLBACK_BY_STATUS: Record<number, string> = {
  400: 'Os dados enviados são inválidos. Revise o formulário e tente novamente.',
  404: 'Consulta não encontrada. Ela pode ter sido excluída.',
  409: 'Essa ação conflita com o estado atual da consulta.',
  422: 'Não foi possível processar os dados enviados.',
}
const SERVER_ERROR = 'Ocorreu um erro no servidor. Tente novamente em instantes.'
const NETWORK_ERROR = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'

export class ApiError extends Error {
  status: number
  messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0])
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }
}

/** Lista de mensagens amigáveis para qualquer erro capturado. */
export function getErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) return error.messages
  return [SERVER_ERROR]
}

function extractMessages(body: unknown, status: number): string[] {
  if (status >= 500) return [SERVER_ERROR]
  if (body && typeof body === 'object' && 'message' in body) {
    const { message } = body as { message: unknown }
    if (typeof message === 'string' && message) return [message]
    if (Array.isArray(message)) {
      const list = message.filter((m): m is string => typeof m === 'string' && m.length > 0)
      if (list.length) return list
    }
  }
  return [FALLBACK_BY_STATUS[status] ?? SERVER_ERROR]
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError(0, [NETWORK_ERROR])
  }

  if (response.status === 204) return undefined as T

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, extractMessages(body, response.status))
  return body as T
}
