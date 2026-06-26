import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export default function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-[#2d3447] bg-[#1c2333] p-5',
        onClick && 'cursor-pointer hover:border-[#3d4557] transition-colors',
        className,
      )}
    >
      {children}
    </div>
  )
}
