import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '#/components/ui/button'
import { TextField } from '#/components/form/text-field'
import { authErrorMessage } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { emailValidation, passwordValidation } from '#/lib/validators'
import { ROUTES } from '#/lib/constants'
import { appStore } from '#/state/app.store'

function sanitizeRedirect(url: unknown): string {
  if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) {
    return ROUTES.setup
  }
  return url
}

export const Route = createFileRoute('/_public/_auth/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: sanitizeRedirect(search.redirect),
  }),
  component: LoginPage,
})

const schema = z.object({
  email: emailValidation,
  password: passwordValidation,
})

function LoginPage() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const setLoading = appStore((s) => s.setLoading)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      setLoading(true)
      const authService = (await import('#/services/auth.service')).default
      try {
        await authService.login(value.email, value.password)
        const { dbService } = await import('#/services/db.service')
        dbService.listenToUserData()
        navigate({ href: redirect })
      } catch (e) {
        toast.error(authErrorMessage(e as any))
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-bold capitalize sm:text-4xl">Log in</h1>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="email">
          {(field) => <TextField field={field} type="email" />}
        </form.Field>
        <form.Field name="password">
          {(field) => <TextField field={field} type="password" />}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              Log in
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="text-sm">
        <Link to={ROUTES.resetPassword} className="underline">
          Forgot Password
        </Link>
      </p>
    </div>
  )
}
