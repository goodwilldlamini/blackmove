import { useForm } from '@tanstack/react-form'
import { createRoot } from 'react-dom/client'
import { z } from 'zod'
import { TextField } from '#/components/form/text-field'
import { numberValidator, requiredValidator, zodFormValidator } from '#/lib/validators'

const schema = z.object({
  title: requiredValidator,
  quantity: numberValidator.int('Enter a whole number').min(1, 'This field is required'),
  weight: numberValidator.min(1, 'This field is required'),
})

function Probe() {
  const form = useForm({
    defaultValues: {
      title: '' as string,
      quantity: undefined as number | undefined,
      weight: 350.5 as number | undefined,
    },
    validators: { onChange: zodFormValidator(schema) },
    onSubmit: async ({ value }) => {
      ;(window as any).__submitted = value
    },
  })
  ;(window as any).__form = form
  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="title">{(f) => <TextField field={f} />}</form.Field>
      <form.Field name="quantity">{(f) => <TextField field={f} type="number" />}</form.Field>
      <form.Field name="weight">{(f) => <TextField field={f} type="number" />}</form.Field>
      <button type="submit">submit</button>
    </form>
  )
}

createRoot(document.getElementById('root')!).render(<Probe />)
