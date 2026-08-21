import type { AnyFieldApi } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

// digits with at most one decimal point — no negatives, none of our numeric fields take them
const NUMERIC_DRAFT = /^\d*\.?\d*$/

function toDraft(value: unknown): string {
  return value === undefined || value === null ? '' : String(value)
}

// an empty box and a half-typed "." both mean "nothing entered yet"
function parseDraft(draft: string): number | undefined {
  if (draft === '') return undefined
  const parsed = Number(draft)
  return Number.isNaN(parsed) ? undefined : parsed
}

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
  const isNumber = type === 'number'
  const error = field.state.meta.isTouched
    ? fieldErrorMessage(field)
    : undefined

  // a native number input reports an empty value mid-decimal (while "12." is typed), which would
  // wipe the character back out of a controlled value — so hold the raw text and parse from it
  const value = field.state.value
  const [draft, setDraft] = useState(() => toDraft(value))

  useEffect(() => {
    if (!isNumber) return
    // resync only when the form value genuinely disagrees with what is typed, so an in-progress
    // "12." (which parses to the same 12) survives an edit-mode prefill or a form reset
    if (parseDraft(draft) !== (value ?? undefined)) setDraft(toDraft(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNumber, value])

  function onNumberChange(raw: string) {
    if (!NUMERIC_DRAFT.test(raw)) return
    setDraft(raw)
    field.handleChange(parseDraft(raw))
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label htmlFor={field.name} className="text-muted-foreground capitalize">
        {label || field.name}
      </Label>
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={isPassword ? (show ? 'text' : 'password') : isNumber ? 'text' : type}
          inputMode={isNumber ? 'decimal' : undefined}
          value={isNumber ? draft : (value ?? '')}
          onBlur={field.handleBlur}
          onChange={(e) =>
            isNumber ? onNumberChange(e.target.value) : field.handleChange(e.target.value)
          }
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
