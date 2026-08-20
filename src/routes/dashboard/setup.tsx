import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { z } from 'zod'
import { SelectField } from '#/components/form/select-field'
import { TextField } from '#/components/form/text-field'
import { Loading } from '#/components/loading'
import { PageTitle } from '#/components/page-title'
import { Button } from '#/components/ui/button'
import { UploadWidget } from '#/components/upload-widget'
import { nonAdminUserTypes, PROVINCES, userTitles } from '#/lib/app-data'
import { ROUTES } from '#/lib/constants'
import { toast } from '#/lib/toast'
import { emailValidation, phoneValidation } from '#/lib/validators'
import { appStore } from '#/state/app.store'
import { tempStore } from '#/state/temp.store'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/dashboard/setup')({
  component: SetupPage,
})

const schema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  name: z.string().min(1),
  phone: phoneValidation,
  email: emailValidation,
  province: z.string().min(1),
  town: z.string().min(1),
})

function SetupPage() {
  const navigate = useNavigate()
  const user = userStore((s) => s.user)
  const userDataReady = userStore((s) => s.userDataReady)
  const tempUser = tempStore((s) => s.tempUser)
  const tempFiles = tempStore((s) => s.tempFiles)
  const setLoading = appStore((s) => s.setLoading)
  const [step, setStep] = useState(0)

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
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      tempStore.getState().updateTempUser(value)
      setStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })

  async function finish() {
    if (tempFiles.some((f) => !f.url)) {
      toast.error('Please wait for all documents to finish uploading')
      return
    }

    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      const documents = tempFiles.map(({ id, url, file, createdAt }) => ({
        id,
        url,
        file,
        createdAt,
      }))
      const updatedUser = {
        ...tempUser,
        uid: user?.uid,
        documents,
        createdAt: user?.createdAt,
        updatedAt: new Date(),
        setup: true,
      }
      await dbWrite.updateUser(updatedUser)
      userStore.setState({ user: updatedUser })
      localStorage.setItem('user', JSON.stringify(updatedUser))
      tempStore.setState({ tempFiles: [] })
      toast.success('Profile updated')
      navigate({ to: ROUTES.dashHome })
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (user?.setup) {
    return <Navigate to={ROUTES.dashHome} replace />
  }

  if (!userDataReady) {
    return <Loading visible />
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-6 pb-24">
      <PageTitle text="Account setup" hideDivider>
        <p className="text-sm text-gray-400 capitalize">
          a few details to complete your profile
        </p>
      </PageTitle>

      {step === 0 ? (
        <form
          className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-lg sm:p-6"
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
            {(field) => <SelectField field={field} label="province" options={PROVINCES} />}
          </form.Field>
          <form.Field name="town">
            {(field) => <TextField field={field} label="town" />}
          </form.Field>
        </form>
      ) : (
        <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-lg sm:p-6">
          <h2 className="text-lg font-medium">Supporting documents</h2>
          <UploadWidget
            path={`users/${user?.uid}`}
            accepted={['application/pdf', 'image/']}
            updateFiles={(files) => tempStore.getState().addTempFiles(files)}
          >
            <Button type="button" variant="outline" size="sm">
              Add document(s)
            </Button>
          </UploadWidget>
          <p className="text-xs text-muted-foreground">Accepted file types: Image / Pdf</p>
          <div className="flex w-full flex-col divide-y">
            {tempFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-2 py-2">
                <span className="flex-1 truncate text-sm">{file.file?.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={!file.url}
                  onClick={() => window.open(file.url, '_blank')}
                >
                  <Download />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    tempStore.setState({
                      tempFiles: tempStore.getState().tempFiles.filter((f) => f.id !== file.id),
                    })
                  }
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed right-0 bottom-0 left-0 flex justify-center border-t bg-white p-4">
        <div className="flex w-full max-w-xl items-center justify-between gap-4">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(0)}>
            <ChevronLeft /> Prev
          </Button>
          <span className="text-xs text-muted-foreground capitalize sm:text-sm">
            step {step + 1}/2: {step === 0 ? 'Personal details' : 'Supporting documents'}
          </span>
          {step === 0 ? (
            <Button onClick={() => form.handleSubmit()}>
              Next <ChevronRight />
            </Button>
          ) : (
            <Button onClick={finish}>
              finish <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
