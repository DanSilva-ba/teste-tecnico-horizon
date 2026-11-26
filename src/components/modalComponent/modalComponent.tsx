import { useEffect, useRef, type ReactNode } from 'react'
import style from './modal.module.css'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function ModalComponent({ title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className={style.dialog}
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <h2 id="modal-title" className={style.title}>
        {title}
      </h2>
      <div className={style.body}>{children}</div>
    </dialog>
  )
}
