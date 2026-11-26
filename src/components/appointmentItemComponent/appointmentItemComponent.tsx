import type { Appointment } from '../../models/appointment'
import {
  canCancel,
  canComplete,
  canDelete,
  canEdit,
  canReschedule,
} from '../../models/appointmentRules'
import ButtonComponent from '../buttonComponent/buttonComponent'
import StatusBadgeComponent from '../statusBadgeComponent/statusBadgeComponent'
import { formatDay, formatTime } from '../../utils/date'
import style from './appointmentItem.module.css'

interface AppointmentItemProps {
  appointment: Appointment
  busy: boolean
  onEdit: (a: Appointment) => void
  onReschedule: (a: Appointment) => void
  onComplete: (a: Appointment) => void
  onCancel: (a: Appointment) => void
  onDelete: (a: Appointment) => void
}

export default function AppointmentItemComponent({
  appointment: a,
  busy,
  onEdit,
  onReschedule,
  onComplete,
  onCancel,
  onDelete,
}: AppointmentItemProps) {
  const scheduledButNotToday = a.status === 'SCHEDULED' && !canComplete(a)

  return (
    <li className={style.item}>
      <div className={style.when}>
        <strong>{formatTime(a.appointmentDate)}</strong>
        <span>{formatDay(a.appointmentDate)}</span>
      </div>

      <div className={style.who}>
        <strong>{a.patientName}</strong>
        <span>
          {a.specialty} · CPF {a.patientCpf}
        </span>
        {a.observations && <em>{a.observations}</em>}
      </div>

      <StatusBadgeComponent status={a.status} />

      <div className={style.actions}>
        {canEdit(a) && (
          <ButtonComponent small disabled={busy} onClick={() => onEdit(a)}>
            Editar
          </ButtonComponent>
        )}
        {canReschedule(a) && (
          <ButtonComponent small disabled={busy} onClick={() => onReschedule(a)}>
            Remarcar
          </ButtonComponent>
        )}
        {canComplete(a) && (
          <ButtonComponent small variant="primary" disabled={busy} onClick={() => onComplete(a)}>
            Marcar como realizada
          </ButtonComponent>
        )}
        {canCancel(a) && (
          <ButtonComponent small disabled={busy} onClick={() => onCancel(a)}>
            Cancelar
          </ButtonComponent>
        )}
        {canDelete() && (
          <ButtonComponent small variant="danger" disabled={busy} onClick={() => onDelete(a)}>
            Excluir
          </ButtonComponent>
        )}
        {scheduledButNotToday && (
          <p className={style.hint}>Só pode ser marcada como realizada no dia da consulta.</p>
        )}
      </div>
    </li>
  )
}
