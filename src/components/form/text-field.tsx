import type { AnyFieldApi } from '@tanstack/react-form'
import { useState } from 'react'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export function fieldErrorMessage(field: AnyFieldApi): string | undefined {
  const [error] = field.state.meta.errors
  if (!error) return undefined
  return typeof error === 'string' ? error : ((error as any).message ?? String(error))
}

export function TextField({
  field,
  label,
  type = 'text',
  placeholder,
}: {
  field: AnyFieldApi
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const error = field.state.meta.isTouched
    ? fieldErrorMessage(field)
    : undefined

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label htmlFor={field.name} className="text-muted-foreground capitalize">
        {label || field.name}
      </Label>
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={field.state.value ?? ''}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={isPassword ? 'pr-14' : undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
