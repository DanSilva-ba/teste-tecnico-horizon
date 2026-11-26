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

export function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
