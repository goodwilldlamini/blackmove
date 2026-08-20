import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { TextField } from '#/components/form/text-field'
import { Button } from '#/components/ui/button'
import { ROUTES } from '#/lib/constants'
import { requiredValidator } from '#/lib/validators'

export const Route = createFileRoute('/_public/_auth/reset-password')({
  component: PasswordResetPage,
})

const schema = z.object({ password: requiredValidator })

function PasswordResetPage() {
  const form = useForm({
    defaultValues: { password: '' },
    validators: { onChange: schema },
    onSubmit: async () => {
      // Ported as-is — old/src/pages/auth/reset/reset_password.page.tsx's
      // onSubmit was also a no-op; there's no reset-password backend flow
      // wired up yet in either app.
    },
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-bold capitalize sm:text-4xl">
        Reset password
      </h1>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="password">
          {(field) => <TextField field={field} type="password" />}
        </form.Field>
        <Button type="submit" size="lg" className="w-full">
          submit
        </Button>
      </form>
      <p className="text-sm">
        <Link to={ROUTES.login} className="underline">
          Return to Login
        </Link>
      </p>
    </div>
  )
}
