import type { PaginationMeta } from '../../models/appointment'
import ButtonComponent from '../buttonComponent/buttonComponent'
import style from './pagination.module.css'

interface PaginationProps {
  meta: PaginationMeta
  disabled: boolean
  onPageChange: (page: number) => void
}

export default function PaginationComponent({ meta, disabled, onPageChange }: PaginationProps) {
  if (meta.total <= meta.limit) return null

  const first = (meta.page - 1) * meta.limit + 1
  const last = Math.min(meta.page * meta.limit, meta.total)

  return (
    <nav className={style.pager} aria-label="Paginação das consultas">
      <span>
        Mostrando {first}–{last} de {meta.total}
      </span>
      <div className={style.buttons}>
        <ButtonComponent disabled={disabled || meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
          Anteriores
        </ButtonComponent>
        <ButtonComponent
          variant="primary"
          disabled={disabled || meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Ver mais
        </ButtonComponent>
      </div>
    </nav>
  )
}
