import { useCallback, useEffect, useRef, useState } from 'react'

export interface ToastState {
  message: string
  type: 'success' | 'error'
}

export function useToast(durationMs = 4000) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const dismissToast = useCallback(() => {
    window.clearTimeout(timer.current)
    setToast(null)
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastState['type'] = 'success') => {
      window.clearTimeout(timer.current)
      setToast({ message, type })
      timer.current = window.setTimeout(() => setToast(null), durationMs)
    },
    [durationMs],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { toast, showToast, dismissToast }
}
