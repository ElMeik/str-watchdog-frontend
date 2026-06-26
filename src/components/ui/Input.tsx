import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#e2e8f0]">
            {label}
          </label>
        )}
        <input
          {...props}
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-lg border bg-[#161b27] px-3 py-2.5 text-[#e2e8f0] placeholder-[#5a6478] transition-colors text-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            error ? 'border-red-500' : 'border-[#2d3447]',
            className,
          )}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-[#8b98a9]">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export default Input
