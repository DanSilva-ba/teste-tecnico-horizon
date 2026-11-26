export type AppointmentStatus = 'AGENDADA' | 'REALIZADA' | 'CANCELADA'

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  AGENDADA: 'Agendada',
  REALIZADA: 'Realizada',
  CANCELADA: 'Cancelada',
}

/** Consulta como a API devolve (datas em ISO 8601). */
export interface Appointment {
  id: number
  patientName: string
  patientCpf: string
  appointmentDate: string
  specialty: string
  observations: string | null
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}


export interface AppointmentFormValues {
  patientName: string
  patientCpf: string
  appointmentDate: string
  specialty: string
  observations: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

export interface AppointmentFilters {
  status: AppointmentStatus | 'ALL'
  search: string
  date: string
}

export const EMPTY_FILTERS: AppointmentFilters = { status: 'ALL', search: '', date: '' }
