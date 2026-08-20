import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { SelectField } from '#/components/form/select-field'
import { TextField } from '#/components/form/text-field'
import { Button } from '#/components/ui/button'
import { nonAdminUserTypes, USER_TYPE_IDS, userTypes } from '#/lib/app-data'
import { APP_NAME, ROUTES } from '#/lib/constants'
import { authErrorMessage } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { emailValidation, validateName } from '#/lib/validators'
import { appStore } from '#/state/app.store'
import { tempStore } from '#/state/temp.store'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/_public/_auth/register')({
  validateSearch: (search: Record<string, unknown>) => ({
    acc: typeof search.acc === 'string' ? search.acc : undefined,
  }),
  component: RegisterPage,
})

const schema = z.object({
  type: z.string().min(1),
  name: z.string().refine((v) => !validateName(v), {
    error: 'Please provide your name & surname divided by a space',
  }),
  email: emailValidation,
  password: z.string().min(6, 'Your password must contain atleast 6 characters'),
})

function RegisterPage() {
  const navigate = useNavigate()
  const { acc } = Route.useSearch()
  const tempUser = tempStore((s) => s.tempUser)
  const updateTempUser = tempStore((s) => s.updateTempUser)
  const setLoading = appStore((s) => s.setLoading)

  useEffect(() => {
    const type = userTypes.find((el) => el.label.toLowerCase() === acc?.toLowerCase())
    if (type) {
      updateTempUser({ type: type.value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acc])

  const form = useForm({
    defaultValues: {
      type: tempUser.type || '',
      name: tempUser.name || '',
      email: tempUser.email || '',
      password: '',
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      setLoading(true)
      updateTempUser({
        type: value.type,
        name: value.name,
        email: value.email,
      })
      const authService = (await import('#/services/auth.service')).default
      try {
        const usr = await authService.register(
          { ...tempUser, type: value.type, name: value.name, email: value.email },
          value.password,
        )
        userStore.setState({ user: usr })
        navigate({
          to:
            usr.type === USER_TYPE_IDS.buyer ? ROUTES.dashHome : ROUTES.setup,
        })
      } catch (e) {
        toast.error(authErrorMessage(e as any))
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-bold capitalize sm:text-4xl">
        Create account
      </h1>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="type">
          {(field) => (
            <SelectField
              field={field}
              label="account type"
              options={nonAdminUserTypes.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          )}
        </form.Field>
        <form.Field name="name">
          {(field) => (
            <TextField field={field} label="full name" placeholder="Firstname lastname" />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => <TextField field={field} type="email" label="email address" />}
        </form.Field>
        <form.Field name="password">
          {(field) => <TextField field={field} type="password" />}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              Create account
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="text-center text-sm">
        By creating an account you agree to {APP_NAME}'s Terms of use and
        Privacy Policy
      </p>
    </div>
  )
}
