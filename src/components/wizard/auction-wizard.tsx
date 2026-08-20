import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { CategorySelector } from '#/components/category-selector'
import { ListingKindSelector } from '#/components/listing-kind-selector'
import { DurationPicker } from '#/components/duration-picker'
import { EdTimer } from '#/components/timer'
import { MultiSelect } from '#/components/multi-select'
import { SectionCard } from '#/components/section-card'
import { SelectField } from '#/components/form/select-field'
import { TextField } from '#/components/form/text-field'
import { StatusSelector } from '#/components/status-selector'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Loading } from '#/components/loading'
import {
  AGE_CLASSES,
  BREEDS,
  BREED_TYPES,
  CATEGORIES,
  GENDERS,
  LISTING_KINDS,
  LISTING_KIND_IDS,
  PROD_SYSTEMS,
  PROVINCES,
  STATUS_IDS,
  VACCINES,
} from '#/lib/app-data'
import { APP_MESSAGES } from '#/lib/app-messages'
import { ROUTES } from '#/lib/constants'
import { DBTABLES, fsStore } from '#/lib/firebase'
import { toast } from '#/lib/toast'
import { requiredValidator } from '#/lib/validators'
import { appStore } from '#/state/app.store'
import { DEFAULT_VALUES, tempStore } from '#/state/temp.store'
import { userStore } from '#/state/user.store'
import { ImagesStep } from './images-step'

type WizardCategory = (typeof CATEGORIES)[number]
type WizardKind = (typeof LISTING_KINDS)[number]

const schema = z.object({
  title: requiredValidator,
  desc: requiredValidator,
  quantity: z.number().min(1, 'This field is required'),
  sex: requiredValidator,
  breedType: requiredValidator,
  breed: requiredValidator,
  breed2: z.string(),
  ageClass: z.string(),
  age: z.number(),
  weight: z.number().min(1, 'This field is required'),
  price: z.number().min(1, 'This field is required'),
  province: requiredValidator,
  town: requiredValidator,
})

export function AuctionWizard({ auctionId: editingId }: { auctionId?: string }) {
  const navigate = useNavigate()
  const user = userStore((s) => s.user)
  const setLoading = appStore((s) => s.setLoading)
  const isLoading = appStore((s) => s.isLoading)
  const tempAuction = tempStore((s) => s.tempAuction)
  const updateTempAuction = tempStore((s) => s.updateTempAuction)

  const isEditing = !!editingId
  const [kind, setKind] = useState<WizardKind | null>(null)
  const [category, setCategory] = useState<WizardCategory | null>(null)
  const isBuyNow = kind?.value === LISTING_KIND_IDS.buyNow
  const [generatedId, setGeneratedId] = useState('')
  const [isFetching, setIsFetching] = useState(isEditing)
  const auctionId = editingId || generatedId

  useEffect(() => {
    async function load() {
      if (editingId) {
        setLoading(true)
        const { dbRead } = await import('#/services/db-read.service')
        const auction = await dbRead.getAuctionData(editingId)
        if (auction) {
          tempStore.setState({ tempAuction: auction })
          setCategory(CATEGORIES.find((el) => el.value === auction.category) || null)
          setKind(
            LISTING_KINDS.find((el) => el.value === auction.kind) ||
              LISTING_KINDS[0],
          )
        } else {
          toast.error('error fetching record')
        }
        setLoading(false)
        setIsFetching(false)
      } else {
        setGeneratedId(doc(fsStore, DBTABLES.auction).id)
      }
    }
    load()
    return () => {
      tempStore.setState({ tempAuction: DEFAULT_VALUES.auction })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId])

  const form = useForm({
    defaultValues: {
      title: tempAuction.title || '',
      desc: tempAuction.desc || '',
      quantity: tempAuction.quantity || 0,
      sex: tempAuction.sex || '',
      breedType: tempAuction.breedType || '',
      breed: tempAuction.breed || '',
      breed2: tempAuction.breed2 || '',
      ageClass: tempAuction.ageClass || '',
      age: tempAuction.age || 0,
      weight: tempAuction.weight || 0,
      price: tempAuction.price || 0,
      province: tempAuction.province || '',
      town: tempAuction.town || '',
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      updateTempAuction(value)
      const finalAuction = {
        ...tempAuction,
        ...value,
        id: auctionId,
        kind: kind?.value,
      }

      if (!finalAuction.prodSystems || finalAuction.prodSystems.length < 1) {
        toast.error('Please select atleast one production system')
        return
      }
      if (!finalAuction.images || finalAuction.images.length < 1) {
        toast.error('Please upload atleast 6 images of your lot')
        return
      }
      // a buy-now listing runs until it sells, so an end date is optional
      if (!isBuyNow) {
        if (
          finalAuction.status === STATUS_IDS.pendingApproval &&
          !finalAuction.duration?.days &&
          !finalAuction.duration?.hours &&
          !finalAuction.duration?.minutes
        ) {
          toast.error(APP_MESSAGES.toast.error.durationMissing)
          return
        }
        if (finalAuction.status === STATUS_IDS.published && !finalAuction.closeDate) {
          toast.error(
            'Please provide a close date for your auction if you wish to publish it now',
          )
          return
        }
      }

      setLoading(true)
      const dbWrite = (await import('#/services/db-write.service')).default
      try {
        if (isEditing) {
          await dbWrite.updateAuction({ ...finalAuction, updatedAt: new Date() })
        } else {
          await dbWrite.createAuction({
            ...finalAuction,
            uid: user?.uid,
            status: 0,
            createdAt: new Date(),
          })
        }
        toast.success(`Listing ${isEditing ? 'updated' : 'created'}`)
        navigate({ to: ROUTES.myAuctions })
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setLoading(false)
      }
    },
  })

  function onCategorySelected(cat: WizardCategory) {
    setCategory(cat)
    updateTempAuction({ category: cat.value })
  }

  function onKindSelected(item: WizardKind) {
    setKind(item)
    updateTempAuction({ kind: item.value })
  }

  if (isFetching) {
    return <Loading visible />
  }

  if (!kind) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-6">
        <h1 className="text-center text-xl font-semibold capitalize sm:text-3xl">
          New Listing: How Do You Want To Sell?
        </h1>
        <ListingKindSelector onSelect={onKindSelected} />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-6">
        <h1 className="text-center text-xl font-semibold capitalize sm:text-3xl">
          New {kind.label}: Pick Your category
        </h1>
        <CategorySelector onSelect={onCategorySelected} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
      <h1 className="text-center text-xl font-semibold capitalize sm:text-3xl">
        {isEditing ? 'update' : 'New'} {kind.label}:{' '}
        {isEditing ? tempAuction.title : category.label}
      </h1>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <SectionCard icon={CATEGORIES.find((c) => c.value === category.value)!.icon} title="general">
          <div className="flex w-full flex-col gap-4">
            <form.Field name="title">
              {(field) => <TextField field={field} />}
            </form.Field>
            <form.Field name="desc">
              {(field) => <TextField field={field} label="description" />}
            </form.Field>
          </div>
        </SectionCard>

        <SectionCard icon={category.icon} title="images">
          <ImagesStep auctionId={auctionId} />
        </SectionCard>

        <SectionCard icon={category.icon} title="details">
          <div className="flex w-full flex-col gap-4">
            <form.Field name="quantity">
              {(field) => (
                <TextField field={field} type="number" />
              )}
            </form.Field>
            <form.Field name="sex">
              {(field) => <SelectField field={field} options={GENDERS} />}
            </form.Field>
            <form.Field name="breedType">
              {(field) => (
                <SelectField field={field} label="breed type" options={BREED_TYPES} />
              )}
            </form.Field>
            <form.Field name="breed">
              {(field) => (
                <SelectField
                  field={field}
                  options={BREEDS.filter((b) => b.category === category.value)}
                />
              )}
            </form.Field>
            <form.Subscribe selector={(s) => s.values.breedType}>
              {(breedType) =>
                breedType === BREED_TYPES[BREED_TYPES.length - 1].value && (
                  <form.Field name="breed2">
                    {(field) => (
                      <SelectField
                        field={field}
                        label="2nd breed"
                        options={BREEDS.filter((b) => b.category === category.value)}
                      />
                    )}
                  </form.Field>
                )
              }
            </form.Subscribe>
            <form.Field name="ageClass">
              {(field) => (
                <SelectField
                  field={field}
                  label="age class"
                  options={AGE_CLASSES.filter((el) => el.category === category.value)}
                />
              )}
            </form.Field>
            <form.Field name="age">
              {(field) => <TextField field={field} type="number" label="Year of birth" />}
            </form.Field>
            <form.Field name="weight">
              {(field) => <TextField field={field} type="number" />}
            </form.Field>
            <MultiSelect
              max={2}
              value={tempAuction.prodSystems}
              onChange={(prodSystems) => updateTempAuction({ prodSystems })}
              label="Production system"
              options={PROD_SYSTEMS}
            />
            <MultiSelect
              max={6}
              value={tempAuction.vaccines}
              onChange={(vaccines) => updateTempAuction({ vaccines })}
              label="Vaccines"
              options={VACCINES}
            />
          </div>
        </SectionCard>

        <SectionCard icon={category.icon} title="pricing">
          <form.Field name="price">
            {(field) => (
              <TextField
                field={field}
                type="number"
                label={isBuyNow ? 'price' : 'minimum acceptable bid'}
              />
            )}
          </form.Field>
        </SectionCard>

        <SectionCard icon={category.icon} title="location">
          <div className="flex w-full flex-col gap-4">
            <form.Field name="province">
              {(field) => <SelectField field={field} options={PROVINCES} />}
            </form.Field>
            <form.Field name="town">
              {(field) => <TextField field={field} />}
            </form.Field>
            <div className="flex flex-col gap-1">
              <Label>Street address</Label>
              {/* TODO: Integrate Google Places Autocomplete */}
              <p className="text-xs text-muted-foreground">
                {APP_MESSAGES.form.helper.addressPrivacy}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={category.icon} title="availability">
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label>Status</Label>
              <StatusSelector />
            </div>
            <div className="flex flex-col gap-1">
              <Label>{isBuyNow ? 'Listing expiry (optional)' : 'Auction duration'}</Label>
              {isBuyNow && (
                <p className="text-xs text-muted-foreground">
                  Leave this empty to keep the listing up until it sells.
                </p>
              )}
              <DurationPicker />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Countdown</Label>
              <EdTimer date={tempAuction.closeDate} className="text-2xl" />
            </div>
          </div>
        </SectionCard>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full capitalize"
        >
          {isEditing ? 'update' : 'Create'} {kind.label}
        </Button>
      </form>
    </div>
  )
}
