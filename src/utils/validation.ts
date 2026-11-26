import type { AppointmentFormValues } from '../models/appointment'
import { CPF_PATTERN } from './cpf'
import { isPastInput } from './date'

export type FormErrors = Partial<Record<keyof AppointmentFormValues, string>>

interface ValidateOptions {
  fields?: (keyof AppointmentFormValues)[]
  originalDate?: string
  requireDateChange?: boolean
}

export function validateAppointment(
  values: AppointmentFormValues,
  { fields, originalDate, requireDateChange = false }: ValidateOptions = {},
): FormErrors {
  const errors: FormErrors = {}
  const check = (field: keyof AppointmentFormValues) => !fields || fields.includes(field)

  if (check('patientName')) {
    const name = values.patientName.trim()
    if (!name) errors.patientName = 'Informe o nome do paciente.'
    else if (name.length < 3) errors.patientName = 'O nome deve ter pelo menos 3 caracteres.'
    else if (name.length > 150) errors.patientName = 'O nome deve ter no máximo 150 caracteres.'
  }

  if (check('patientCpf')) {
    if (!values.patientCpf.trim()) errors.patientCpf = 'Informe o CPF do paciente.'
    else if (!CPF_PATTERN.test(values.patientCpf)) errors.patientCpf = 'Use o formato 000.000.000-00.'
  }

  if (check('appointmentDate')) {
    const unchanged = originalDate !== undefined && values.appointmentDate === originalDate
    if (!values.appointmentDate) errors.appointmentDate = 'Informe a data e a hora da consulta.'
    else if (requireDateChange && unchanged)
      errors.appointmentDate = 'Escolha uma data e hora diferentes da atual.'
    else if (!unchanged && isPastInput(values.appointmentDate))
      errors.appointmentDate = 'A data e a hora não podem estar no passado.'
  }

  if (check('specialty')) {
    const specialty = values.specialty.trim()
    if (!specialty) errors.specialty = 'Informe a especialidade ou o motivo da consulta.'
    else if (specialty.length < 3) errors.specialty = 'Informe pelo menos 3 caracteres.'
    else if (specialty.length > 100) errors.specialty = 'Use no máximo 100 caracteres.'
  }

  if (check('observations') && values.observations.length > 1000) {
    errors.observations = 'As observações devem ter no máximo 1.000 caracteres.'
  }

  return errors
}
