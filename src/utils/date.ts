const pad = (n: number) => String(n).padStart(2, '0')

export function toInputValue(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function nowInputValue(): string {
  return toInputValue(new Date().toISOString())
}

/** Valor do datetime-local -> ISO 8601 (UTC). */
export function inputValueToIso(value: string): string {
  return new Date(value).toISOString()
}

export function isPastInput(value: string): boolean {
  return new Date(value).getTime() < Date.now()
}


const BRASILIA_TIMEZONE = 'America/Sao_Paulo'

/** Dia (YYYY-MM-DD) de uma data ISO, no horário de Brasília. */
export function toDayKey(iso: string | Date): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: BRASILIA_TIMEZONE })
}

export function isToday(iso: string): boolean {
  return toDayKey(iso) === toDayKey(new Date())
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    timeZone: BRASILIA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  })
}
