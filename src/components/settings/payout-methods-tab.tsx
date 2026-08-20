import { useForm } from '@tanstack/react-form'
import { Pencil, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { SelectField } from '#/components/form/select-field'
import { TextField } from '#/components/form/text-field'
import { EmptyWidget } from '#/components/empty'
import { Button } from '#/components/ui/button'
import { BANKS, defaultRequiredMessage, USER_TYPE_IDS } from '#/lib/app-data'
import { toast } from '#/lib/toast'
import { requiredValidator } from '#/lib/validators'
import { appStore } from '#/state/app.store'
import { DEFAULT_VALUES, tempStore } from '#/state/temp.store'
import { userStore } from '#/state/user.store'

const schema = z.object({
  bank: requiredValidator,
  acc: z.number({ error: defaultRequiredMessage }).min(1, defaultRequiredMessage),
  type: requiredValidator,
  name: requiredValidator,
})

export function PayoutMethodsTab() {
  const user = userStore((s) => s.user)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex w-full flex-col items-center gap-4 py-4">
      <Button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) tempStore.setState({ tempMethod: DEFAULT_VALUES.method })
        }}
      >
        {isOpen ? <X /> : <Plus />}
        {isOpen ? 'cancel' : 'New Payout Account'}
      </Button>

      {(user?.payoutMethods?.length ?? 0) < 1 && !isOpen && (
        <EmptyWidget
          text={`Add an account where your ${
            user?.type === USER_TYPE_IDS.seller ? 'auction proceeds' : 'deposit refunds'
          } can be paid out to`}
        />
      )}

      {isOpen && <NewPayoutMethod onClose={() => setIsOpen(false)} />}

      <div className="flex w-full flex-col gap-3">
        {user?.payoutMethods?.map((method) => {
          const bank = BANKS.find((el) => el.value === method.bank)
          return (
            <div key={method.id} className="flex w-full items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <input
                type="radio"
                className="size-5"
                checked={method.id === user.defaultPayout}
                onChange={async () => {
                  const dbWrite = (await import('#/services/db-write.service')).default
                  dbWrite.updateUser({ uid: user.uid!, defaultPayout: method.id })
                }}
              />
              <div className="flex flex-1 flex-col">
                <span className="font-semibold">{bank?.label}</span>
                <span className="text-sm capitalize text-muted-foreground">{method.type}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  tempStore.setState({ tempMethod: method })
                  setIsOpen(true)
                }}
              >
                <Pencil />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function NewPayoutMethod({ onClose }: { onClose: () => void }) {
  const tempMethod = tempStore((s) => s.tempMethod)
  const setLoading = appStore((s) => s.setLoading)
  const user = userStore((s) => s.user)
  const isEditing = !!tempMethod.id

  const form = useForm({
    defaultValues: {
      bank: tempMethod.bank || '',
      acc: tempMethod.acc || 0,
      type: tempMethod.type || '',
      name: tempMethod.name || '',
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      setLoading(true)
      const methods = user?.payoutMethods || []
      if (isEditing) {
        const index = methods.findIndex((el) => el.id === tempMethod.id)
        if (index !== -1) {
          methods[index] = { ...tempMethod, ...value }
        }
      } else {
        methods.push({ ...value, id: crypto.randomUUID(), createdAt: new Date() })
      }
      const dbWrite = (await import('#/services/db-write.service')).default
      try {
        await dbWrite.updateUser({ uid: user?.uid, payoutMethods: methods })
        toast.info(`Payout account ${isEditing ? 'updated' : 'added'}`)
        onClose()
        tempStore.setState({ tempMethod: DEFAULT_VALUES.method })
      } catch {
        // no-op — matches old app's silent catch here
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <form
      className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="bank">
        {(field) => <SelectField field={field} label="bank name" options={BANKS} />}
      </form.Field>
      <form.Field name="acc">
        {(field) => <TextField field={field} type="number" label="account number" />}
      </form.Field>
      <form.Field name="type">
        {(field) => <TextField field={field} label="account type" />}
      </form.Field>
      <form.Field name="name">
        {(field) => <TextField field={field} label="Account Holder's name" />}
      </form.Field>
      <Button type="submit">{isEditing ? 'update' : 'add'} payout account</Button>
    </form>
  )
}
