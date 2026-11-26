import type { ButtonHTMLAttributes } from 'react'
import style from './button.module.css'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  small?: boolean
}

export default function ButtonComponent({
  variant = 'secondary',
  small = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [style.button, style[variant], small ? style.small : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return <button type={type} className={classes} {...rest} />
}
