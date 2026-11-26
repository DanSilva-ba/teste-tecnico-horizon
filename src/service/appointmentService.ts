import type {
  Appointment,
  AppointmentFilters,
  AppointmentFormValues,
  AppointmentStatus,
  Paginated,
} from '../models/appointment'
import { inputValueToIso, toDayKey } from '../utils/date'
import { request } from './http'

export const PAGE_SIZE = 5

const PATH = '/appointment'

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
})

function toPayload(values: AppointmentFormValues) {
  const now = new Date().toISOString()
  return {
    patientName: values.patientName.trim(),
    patientCpf: values.patientCpf.replace(/\D/g, ''),
    appointmentDateAndTime: inputValueToIso(values.appointmentDate),
    specialty: values.specialty.trim(),
    observations: values.observations.trim() || null,
    status: 'AGENDADA' satisfies AppointmentStatus,
    createdAt: now,
    updatedAt: now,
  }
}

function toEditPayload(values: AppointmentFormValues) {
  return {
    patientName: values.patientName.trim(),
    patientCpf: values.patientCpf.replace(/\D/g, ''),
    appointmentDateAndTime: inputValueToIso(values.appointmentDate),
    specialty: values.specialty.trim(),
    observations: values.observations.trim() || null,
  }
}

function applyFilters(list: Appointment[], filters: AppointmentFilters): Appointment[] {
  const search = filters.search.trim().toLowerCase()
  const searchDigits = search.replace(/\D/g, '')

  return list
    .filter((a) => filters.status === 'ALL' || a.status === filters.status)
    .filter((a) => !filters.date || toDayKey(a.appointmentDate) === filters.date)
    .filter(
      (a) =>
        !search ||
        a.patientName.toLowerCase().includes(search) ||
        (searchDigits.length > 0 && a.patientCpf.includes(searchDigits)),
    )
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate))
}

function paginate<T>(items: T[], page: number, limit: number): Paginated<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * limit
  return {
    data: items.slice(start, start + limit),
    meta: { page: current, limit, total, totalPages },
  }
}

function updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
  return request<Appointment>(PATH, json('PUT', { id, status }))
}

export const appointmentService = {
  async list(filters: AppointmentFilters, page: number, limit = PAGE_SIZE): Promise<Paginated<Appointment>> {
    const all = await request<Appointment[]>(PATH)
    return paginate(applyFilters(all, filters), page, limit)
  },

  /** Página (com os filtros atuais) em que a consulta aparece, ou null se ela não aparece na lista. */
  async pageOf(id: number, filters: AppointmentFilters, limit = PAGE_SIZE): Promise<number | null> {
    const all = await request<Appointment[]>(PATH)
    const index = applyFilters(all, filters).findIndex((a) => a.id === id)
    return index < 0 ? null : Math.floor(index / limit) + 1
  },

  create(values: AppointmentFormValues): Promise<Appointment> {
    return request<Appointment>(PATH, json('POST', toPayload(values)))
  },

  complete(id: number): Promise<Appointment> {
    return updateStatus(id, 'REALIZADA')
  },

  cancel(id: number): Promise<Appointment> {
    return updateStatus(id, 'CANCELADA')
  },

  remove(id: number): Promise<Appointment> {
    return request<Appointment>(`${PATH}/${id}`, json('DELETE'))
  },

  update(id: number, values: AppointmentFormValues): Promise<Appointment> {
    return request<Appointment>(`${PATH}/${id}`, json('PUT', toEditPayload(values)))
  },

  reschedule(id: number, appointmentDate: string): Promise<Appointment> {
    return request<Appointment>(
      `${PATH}/rescheduleAppointment`,
      json('PUT', { id, date: inputValueToIso(appointmentDate) }),
    )
  },
}
