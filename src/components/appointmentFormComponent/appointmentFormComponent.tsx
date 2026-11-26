import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Appointment, AppointmentFormValues } from '../../models/appointment'
import { getErrorMessages } from '../../service/http'
import { maskCpf } from '../../utils/cpf'
import { formatDay, formatTime, nowInputValue, toInputValue } from '../../utils/date'
import { validateAppointment, type FormErrors } from '../../utils/validation'
import ButtonComponent from '../buttonComponent/buttonComponent'
import ModalComponent from '../modalComponent/modalComponent'
import style from './appointmentForm.module.css'

export type FormMode = 'create' | 'edit' | 'reschedule'

interface AppointmentFormProps {
  mode: FormMode
  appointment?: Appointment
  onSubmit: (values: AppointmentFormValues) => Promise<void>
  onClose: () => void
}

const TITLES: Record<FormMode, string> = {
  create: 'Nova consulta',
  edit: 'Editar consulta',
  reschedule: 'Remarcar consulta',
}
const SUBMIT_LABELS: Record<FormMode, string> = {
  create: 'Agendar consulta',
  edit: 'Salvar alterações',
  reschedule: 'Remarcar consulta',
}

function initialValues(appointment?: Appointment): AppointmentFormValues {
  return {
    patientName: appointment?.patientName ?? '',
    patientCpf: maskCpf(appointment?.patientCpf ?? ''),
    appointmentDate: appointment ? toInputValue(appointment.appointmentDate) : '',
    specialty: appointment?.specialty ?? '',
    observations: appointment?.observations ?? '',
  }
}

export default function AppointmentFormComponent({
  mode,
  appointment,
  onSubmit,
  onClose,
}: AppointmentFormProps) {
  const [values, setValues] = useState(() => initialValues(appointment))
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const originalDate = appointment ? toInputValue(appointment.appointmentDate) : undefined
  const isReschedule = mode === 'reschedule'

  function handleChange(field: keyof AppointmentFormValues) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === 'patientCpf' ? maskCpf(e.target.value) : e.target.value
      setValues((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateAppointment(values, {
      fields: isReschedule ? ['appointmentDate'] : undefined,
      originalDate,
      requireDateChange: isReschedule,
    })
    setErrors(found)
    setServerError(null)
    if (Object.keys(found).length) return

    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      setServerError(getErrorMessages(error).join(' '))
      setSubmitting(false)
    }
  }

  const dateField = (
    <Field label="Data e hora" error={errors.appointmentDate} htmlFor="appointmentDate">
      <input
        id="appointmentDate"
        type="datetime-local"
        value={values.appointmentDate}
        min={mode === 'edit' ? undefined : nowInputValue()}
        onChange={handleChange('appointmentDate')}
        aria-invalid={!!errors.appointmentDate}
      />
    </Field>
  )

  return (
    <ModalComponent title={TITLES[mode]} onClose={onClose}>
      <form className={style.form} onSubmit={handleSubmit} noValidate>
        {isReschedule && appointment ? (
          <>
            <p className={style.summary}>
              <strong>{appointment.patientName}</strong>
              <br />
              {appointment.specialty} · atual: {formatDay(appointment.appointmentDate)} às{' '}
              {formatTime(appointment.appointmentDate)}
            </p>
            {dateField}
          </>
        ) : (
          <>
            <Field label="Nome do paciente" error={errors.patientName} htmlFor="patientName">
              <input
                id="patientName"
                value={values.patientName}
                onChange={handleChange('patientName')}
                maxLength={150}
                autoComplete="off"
                aria-invalid={!!errors.patientName}
              />
            </Field>
            <div className={style.row}>
              <Field label="CPF" error={errors.patientCpf} htmlFor="patientCpf">
                <input
                  id="patientCpf"
                  value={values.patientCpf}
                  onChange={handleChange('patientCpf')}
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  autoComplete="off"
                  aria-invalid={!!errors.patientCpf}
                />
              </Field>
              {dateField}
            </div>
            <Field
              label="Especialidade ou motivo"
              error={errors.specialty}
              htmlFor="specialty"
            >
              <input
                id="specialty"
                value={values.specialty}
                onChange={handleChange('specialty')}
                maxLength={100}
                autoComplete="off"
                aria-invalid={!!errors.specialty}
              />
            </Field>
            <Field
              label="Observações (opcional)"
              error={errors.observations}
              htmlFor="observations"
              hint={`${values.observations.length}/1000`}
            >
              <textarea
                id="observations"
                rows={3}
                value={values.observations}
                onChange={handleChange('observations')}
                aria-invalid={!!errors.observations}
              />
            </Field>
          </>
        )}

        {serverError && (
          <p role="alert" className={style.serverError}>
            {serverError}
          </p>
        )}

        <div className={style.actions}>
          <ButtonComponent onClick={onClose} disabled={submitting}>
            Fechar
          </ButtonComponent>
          <ButtonComponent type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Salvando…' : SUBMIT_LABELS[mode]}
          </ButtonComponent>
        </div>
      </form>
    </ModalComponent>
  )
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className={style.field}>
      <label htmlFor={htmlFor}>
        {label}
        {hint && <span className={style.hint}>{hint}</span>}
      </label>
      {children}
      {error && (
        <span className={style.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
