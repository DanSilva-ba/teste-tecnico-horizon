import type { ToastState } from '../../hooks/useToast'
import style from './toast.module.css'

export default function ToastComponent({ toast }: { toast: ToastState | null }) {
  if (!toast) return null
  return (
    <div
      className={`${style.toast} ${style[toast.type]}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
    >
      {toast.message}
    </div>
  )
}
