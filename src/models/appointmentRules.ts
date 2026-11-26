import type { Appointment } from './appointment'
import { isToday } from '../utils/date'

/**
 * Regras que decidem quais ações a interface oferece.
 * O objetivo é nunca mostrar uma ação que o servidor vai recusar.
 */
const isScheduled = (a: Appointment) => a.status === 'AGENDADA'

export const canEdit = isScheduled
export const canReschedule = isScheduled
export const canCancel = isScheduled
export const canComplete = (a: Appointment) => isScheduled(a) && isToday(a.appointmentDate)
export const canDelete = () => true
