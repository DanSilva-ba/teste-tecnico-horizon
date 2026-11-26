import { STATUS_LABEL, type AppointmentStatus } from '../../models/appointment'
import style from './statusBadge.module.css'

export default function StatusBadgeComponent({ status }: { status: AppointmentStatus }) {
  return <span className={`${style.badge} ${style[status]}`}>{STATUS_LABEL[status]}</span>
}
