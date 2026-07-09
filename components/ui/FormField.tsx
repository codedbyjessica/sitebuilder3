import { ReactNode } from 'react'

interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  id?: string
  children: ReactNode
}

export default function FormField({ label, error, hint, id, children }: FormFieldProps) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-ink/70">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink/50">{hint}</p>}
    </div>
  )
}
