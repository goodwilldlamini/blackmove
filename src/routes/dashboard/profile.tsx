import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Building2, Pencil, User as UserIcon } from 'lucide-react'
import { useLayoutEffect } from 'react'
import { z } from 'zod'
import { SelectField } from '#/components/form/select-field'
import { TextField } from '#/components/form/text-field'
import { Loading } from '#/components/loading'
import { PageTitle } from '#/components/page-title'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import { UploadWidget } from '#/components/upload-widget'
import { nonAdminUserTypes, PROVINCES, userTitles } from '#/lib/app-data'
import { toast } from '#/lib/toast'
import { emailValidation, phoneValidation } from '#/lib/validators'
import { appStore } from '#/state/app.store'
import { tempStore } from '#/state/temp.store'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

const schema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  name: z.string().min(1),
  phone: phoneValidation,
  email: emailValidation,
  province: z.string().min(1),
  town: z.string().min(1),
  hasBusiness: z.boolean(),
  cName: z.string(),
  cReg: z.string(),
})

function ProfilePage() {
  const user = userStore((s) => s.user)
  const userDataReady = userStore((s) => s.userDataReady)
  const tempUser = tempStore((s) => s.tempUser)
  const updateTempUser = tempStore((s) => s.updateTempUser)
  const setLoading = appStore((s) => s.setLoading)

  useLayoutEffect(() => {
    if (userDataReady && user?.uid) {
      tempStore.setState({ tempUser: user })
    }
  }, [userDataReady, user])

  const form = useForm({
    defaultValues: {
      type: user?.type || '',
      title: user?.title || '',
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      province: user?.province || '',
      town: user?.town || '',
      hasBusiness: user?.hasBusiness || false,
      cName: user?.cName || '',
      cReg: user?.cReg || '',
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      setLoading(true)
      const dbWrite = (await import('#/services/db-write.service')).default
      try {
        await dbWrite.updateUser({
          ...tempUser,
          ...value,
          uid: user?.uid,
          createdAt: user?.createdAt,
          updatedAt: new Date(),
          setup: true,
        })
        toast.success('Profile updated')
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setLoading(false)
      }
    },
  })

  if (!userDataReady) {
    return <Loading visible />
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <PageTitle text="profile" />
      {!user?.setup && (
        <Alert className="mb-4 border-success/30 bg-success/10">
          <AlertDescription>
            Please finish setting up your account
          </AlertDescription>
        </Alert>
      )}
      <form
        className="flex w-full flex-col gap-6 rounded-xl bg-white p-4 shadow-lg sm:p-6"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FormHeading icon={UserIcon} text="Personal details" />
        <ProfilePicture />

        <form.Field name="type">
          {(field) => (
            <SelectField
              field={field}
              label="account type"
              options={nonAdminUserTypes.map((t) => ({ value: t.value, label: t.label }))}
            />
          )}
        </form.Field>
        <form.Field name="title">
          {(field) => (
            <SelectField
              field={field}
              label="title"
              options={userTitles.map((t) => ({ value: t.value, label: t.label }))}
            />
          )}
        </form.Field>
        <form.Field name="name">
          {(field) => <TextField field={field} label="full name" />}
        </form.Field>
        <form.Field name="phone">
          {(field) => <TextField field={field} type="tel" label="phone number" />}
        </form.Field>
        <form.Field name="email">
          {(field) => <TextField field={field} type="email" label="email address" />}
        </form.Field>
        <form.Field name="province">
          {(field) => (
            <SelectField field={field} label="province" options={PROVINCES} />
          )}
        </form.Field>
        <form.Field name="town">
          {(field) => <TextField field={field} label="town" />}
        </form.Field>

        <form.Field name="hasBusiness">
          {(field) => (
            <div className="flex w-full flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground capitalize">
                Business status
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!field.state.value ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    field.handleChange(false)
                    updateTempUser({ hasBusiness: false })
                  }}
                >
                  I DO NOT have a registered business
                </Button>
                <Button
                  type="button"
                  variant={field.state.value ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    field.handleChange(true)
                    updateTempUser({ hasBusiness: true })
                  }}
                >
                  I have a registered business
                </Button>
              </div>
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.hasBusiness}>
          {(hasBusiness) =>
            hasBusiness && (
              <>
                <FormHeading icon={Building2} text="Business details" />
                <form.Field name="cName">
                  {(field) => <TextField field={field} label="company name" />}
                </form.Field>
                <form.Field name="cReg">
                  {(field) => <TextField field={field} label="company registration #" />}
                </form.Field>
              </>
            )
          }
        </form.Subscribe>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              Update Profile
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}

function FormHeading({
  icon: Icon,
  text,
}: {
  icon: typeof UserIcon
  text: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
        <Icon className="size-4" />
      </div>
      <h2 className="text-base font-semibold capitalize sm:text-lg">{text}</h2>
    </div>
  )
}

function ProfilePicture() {
  const user = userStore((s) => s.user)

  async function onFileUpdate(files: { url?: string }[]) {
    if (files.length === 0) return
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.updateUser({ uid: user?.uid, photoURL: files[0].url })
      toast.success('Profile updated')
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="flex w-full justify-center">
      <div className="relative">
        <Avatar className="size-20">
          <AvatarImage src={user?.photoURL} alt={user?.name} />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <UploadWidget path={`images/profile/${user?.uid}`} max={1} updateFiles={onFileUpdate}>
          <div className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-primary/20 bg-primary text-white">
            <Pencil className="size-3.5" />
          </div>
        </UploadWidget>
      </div>
    </div>
  )
}
