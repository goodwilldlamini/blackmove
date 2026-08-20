import type { AnyFieldApi } from '@tanstack/react-form'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { fieldErrorMessage } from './text-field'

export function SelectField({
  field,
  label,
  options,
  placeholder = 'Select one',
}: {
  field: AnyFieldApi
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  const error = field.state.meta.isTouched
    ? fieldErrorMessage(field)
    : undefined

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label htmlFor={field.name} className="text-muted-foreground capitalize">
        {label || field.name}
      </Label>
      <Select
        value={field.state.value ?? ''}
        onValueChange={(value) => field.handleChange(value)}
        onOpenChange={(open) => {
          if (!open) field.handleBlur()
        }}
      >
        <SelectTrigger id={field.name} aria-invalid={!!error} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="capitalize">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
