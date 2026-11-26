import { useCallback, useEffect, useState } from 'react'
import type { Appointment, AppointmentFilters, Paginated } from '../models/appointment'
import { appointmentService } from '../service/appointmentService'
import { getErrorMessages } from '../service/http'

interface Result {
  key: string
  data?: Paginated<Appointment>
  error?: string
}

export function useAppointments(filters: AppointmentFilters, page: number) {
  const [reloadToken, setReloadToken] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const key = JSON.stringify([filters, page, reloadToken])

  useEffect(() => {
    let active = true
    appointmentService
      .list(filters, page)
      .then((data) => active && setResult({ key, data }))
      .catch((error: unknown) => active && setResult({ key, error: getErrorMessages(error)[0] }))
    return () => {
      active = false
    }
  }, [filters, page, key])

  const reload = useCallback(() => setReloadToken((n) => n + 1), [])
  const current = result?.key === key

  return {
    data: result?.data,
    loading: !current,
    error: current ? result?.error : undefined,
    reload,
  }
}
