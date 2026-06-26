import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50',
  secondary:
    'bg-[#1c2333] hover:bg-[#212840] text-[#e2e8f0] border border-[#2d3447] disabled:opacity-50',
  danger: 'bg-red-700 hover:bg-red-600 text-white disabled:opacity-50',
  ghost: 'text-[#8b98a9] hover:text-[#e2e8f0] hover:bg-[#1c2333] disabled:opacity-50',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0d1117] disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
