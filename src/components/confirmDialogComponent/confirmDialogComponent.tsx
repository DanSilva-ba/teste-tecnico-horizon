import { useState } from 'react'
import { getErrorMessages } from '../../service/http'
import ButtonComponent from '../buttonComponent/buttonComponent'
import ModalComponent from '../modalComponent/modalComponent'
import style from './confirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export default function ConfirmDialogComponent({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setBusy(true)
    setError(null)
    try {
      await onConfirm()
    } catch (e) {
      setError(getErrorMessages(e).join(' '))
      setBusy(false)
    }
  }

  return (
    <ModalComponent title={title} onClose={onClose}>
      <p className={style.message}>{message}</p>
      {error && (
        <p role="alert" className={style.error}>
          {error}
        </p>
      )}
      <div className={style.actions}>
        <ButtonComponent onClick={onClose} disabled={busy}>
          Voltar
        </ButtonComponent>
        <ButtonComponent variant="danger" onClick={handleConfirm} disabled={busy}>
          {busy ? 'Excluindo…' : confirmLabel}
        </ButtonComponent>
      </div>
    </ModalComponent>
  )
}
