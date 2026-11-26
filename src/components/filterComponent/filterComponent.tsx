import { useEffect, useState } from 'react'
import { STATUS_LABEL, type AppointmentFilters, type AppointmentStatus } from '../../models/appointment'
import style from './filter.module.css'

interface FilterProps {
  filters: AppointmentFilters
  onChange: (filters: AppointmentFilters) => void
}

const STATUS_TABS: { value: AppointmentFilters['status']; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  ...(['SCHEDULED', 'COMPLETED', 'CANCELED'] as AppointmentStatus[]).map((s) => ({
    value: s,
    label: `${STATUS_LABEL[s]}s`,
  })),
]

const SEARCH_DEBOUNCE_MS = 400

export default function FilterComponent({ filters, onChange }: FilterProps) {
  const [searchText, setSearchText] = useState(filters.search)

  // Só avisa a página depois que o usuário para de digitar, evitando uma busca por tecla.
  useEffect(() => {
    if (searchText === filters.search) return
    const timer = window.setTimeout(
      () => onChange({ ...filters, search: searchText }),
      SEARCH_DEBOUNCE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [searchText, filters, onChange])

  return (
    <div className={style.box__filter__buttons}>
      <div className={style.tabs} role="group" aria-label="Filtrar por status">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={style.filter__button}
            aria-pressed={filters.status === tab.value}
            onClick={() => onChange({ ...filters, status: tab.value })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        className={style.search}
        placeholder="Buscar por nome ou CPF"
        aria-label="Buscar por nome ou CPF"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <input
        type="date"
        className={style.date}
        aria-label="Filtrar por data"
        value={filters.date}
        onChange={(e) => onChange({ ...filters, date: e.target.value })}
      />
    </div>
  )
}
