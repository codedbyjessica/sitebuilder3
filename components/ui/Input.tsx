import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'
import FormField from './FormField'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <FormField label={label} error={error} hint={hint} id={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'block w-full rounded-lg border px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-maple focus:border-transparent transition-colors',
            error ? 'border-red-300 bg-red-50' : 'border-ink/15 bg-white',
            className
          )}
          {...props}
        />
      </FormField>
    )
  }
)
Input.displayName = 'Input'
export default Input
