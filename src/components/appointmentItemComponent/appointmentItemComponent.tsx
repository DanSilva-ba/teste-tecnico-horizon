import { useEffect, useRef } from 'react'
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
import { maskCpf } from '../../utils/cpf'
import style from './appointmentItem.module.css'

interface AppointmentItemProps {
  appointment: Appointment
  busy: boolean
  highlighted?: boolean
  onEdit: (a: Appointment) => void
  onReschedule: (a: Appointment) => void
  onComplete: (a: Appointment) => void
  onCancel: (a: Appointment) => void
  onDelete: (a: Appointment) => void
}

export default function AppointmentItemComponent({
  appointment: a,
  busy,
  highlighted = false,
  onEdit,
  onReschedule,
  onComplete,
  onCancel,
  onDelete,
}: AppointmentItemProps) {
  const itemRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (highlighted) itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlighted])

  const scheduledButNotToday = a.status === 'AGENDADA' && !canComplete(a)

  return (
    <li ref={itemRef} className={`${style.item} ${highlighted ? style.highlighted : ''}`}>
      <div className={style.when}>
        <strong>{formatTime(a.appointmentDate)}</strong>
        <span>{formatDay(a.appointmentDate)}</span>
      </div>

      <div className={style.who}>
        <strong>{a.patientName}</strong>
        <span>
          {a.specialty} · CPF {maskCpf(a.patientCpf)}
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
