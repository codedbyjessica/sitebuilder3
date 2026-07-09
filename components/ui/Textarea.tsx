import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'
import FormField from './FormField'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <FormField label={label} error={error} hint={hint} id={fieldId}>
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(
            'block w-full rounded-lg border px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-maple focus:border-transparent transition-colors resize-none',
            error ? 'border-red-300 bg-red-50' : 'border-ink/15 bg-white',
            className
          )}
          {...props}
        />
      </FormField>
    )
  }
)
Textarea.displayName = 'Textarea'
export default Textarea
