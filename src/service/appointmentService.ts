import type {
  Appointment,
  AppointmentFilters,
  AppointmentFormValues,
  Paginated,
} from '../models/appointment'
import { inputValueToIso } from '../utils/date'
import { request } from './http'

export const PAGE_SIZE = 5

const PATH = '/appointments'

function toPayload(values: AppointmentFormValues) {
  const observations = values.observations.trim()
  return {
    patientName: values.patientName.trim(),
    patientCpf: values.patientCpf,
    appointmentDateAndTime: inputValueToIso(values.appointmentDate),
    specialty: values.specialty.trim(),
    ...(observations ? { observations } : {}),
  }
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
})

export const appointmentService = {
  list(filters: AppointmentFilters, page: number, limit = PAGE_SIZE): Promise<Paginated<Appointment>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (filters.status !== 'ALL') params.set('status', filters.status)
    const search = filters.search.trim()
    if (search) params.set('search', search)
    if (filters.date) params.set('date', filters.date)
    return request<Paginated<Appointment>>(`${PATH}?${params.toString()}`)
  },

  create(values: AppointmentFormValues): Promise<Appointment> {
    return request<Appointment>(PATH, json('POST', toPayload(values)))
  },

  update(id: number, values: AppointmentFormValues): Promise<Appointment> {
    return request<Appointment>(`${PATH}/${id}`, json('PATCH', toPayload(values)))
  },

  reschedule(id: number, appointmentDate: string): Promise<Appointment> {
    return request<Appointment>(
      `${PATH}/${id}/reschedule`,
      json('PATCH', { appointmentDateAndTime: inputValueToIso(appointmentDate) }),
    )
  },

  complete(id: number): Promise<Appointment> {
    return request<Appointment>(`${PATH}/${id}/complete`, json('PATCH'))
  },

  cancel(id: number): Promise<Appointment> {
    return request<Appointment>(`${PATH}/${id}/cancel`, json('PATCH'))
  },

  remove(id: number): Promise<void> {
    return request<void>(`${PATH}/${id}`, json('DELETE'))
  },
}
