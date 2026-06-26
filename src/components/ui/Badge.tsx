import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'running'

const variants: Record<BadgeVariant, string> = {
  success: 'bg-green-900/40 text-green-400 border-green-800/60',
  warning: 'bg-yellow-900/40 text-yellow-400 border-yellow-800/60',
  danger: 'bg-red-900/40 text-red-400 border-red-800/60',
  info: 'bg-blue-900/40 text-blue-400 border-blue-800/60',
  neutral: 'bg-[#2d3447]/40 text-[#8b98a9] border-[#2d3447]',
  running: 'bg-slate-900/60 text-slate-400 border-slate-700/60',
}

export default function Badge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
