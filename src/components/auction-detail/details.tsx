import { Calendar, Info, List, ShieldCheck, Tag } from 'lucide-react'
import { DetailRow } from '#/components/detail-row'
import { SectionCard } from '#/components/section-card'
import {
  AGE_CLASSES,
  BREEDS,
  BREED_TYPES,
  CATEGORIES,
  GENDERS,
  LISTING_KINDS,
  PROD_SYSTEMS,
  VACCINES,
} from '#/lib/app-data'
import { dateFormat } from '#/lib/helpers'
import type { Listing } from '#/types/auction'

function mapLabels(
  values: string[] | undefined,
  options: { value: string; label: string }[],
) {
  return values
    ?.map((v) => options.find((el) => el.value === v)?.label)
    .filter((label): label is string => Boolean(label))
    .join(', ')
}

export function AuctionDetailsBody({ auction }: { auction: Listing }) {
  return (
    <div className="flex w-full flex-col gap-8">
      <SectionCard icon={List} title="Description" variant="plain">
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {auction.desc}
        </p>
      </SectionCard>
      <GeneralDetails auction={auction} />
      <DetailsBox auction={auction} />
    </div>
  )
}

function GeneralDetails({ auction }: { auction: Listing }) {
  const inspectionPassed = !!auction.inspectionPassed

  const details = [
    {
      label: 'listing type',
      icon: Tag,
      value: LISTING_KINDS.find((el) => el.value === auction.kind)?.label,
    },
    {
      label: 'inspection',
      icon: ShieldCheck,
      value: inspectionPassed ? 'passed' : 'pending',
      valueClass: inspectionPassed ? 'text-success' : 'text-warning',
    },
    { label: 'close date', icon: Calendar, value: dateFormat(auction.closeDate) },
  ]

  return (
    <SectionCard icon={Info} title="general" variant="plain">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex min-w-0 flex-col gap-1 rounded-2xl bg-muted p-4"
          >
            <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {detail.label}
            </span>
            <span
              className={`truncate text-sm font-bold capitalize ${detail.valueClass || 'text-foreground'}`}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function DetailsBox({ auction }: { auction: Listing }) {
  const details: { label: string; value: string | undefined }[] = [
    {
      label: 'type',
      value: CATEGORIES.find((el) => el.value === auction.category)?.label,
    },
    { label: 'Quantity', value: `${auction.quantity} units` },
    {
      label: 'sex',
      value: GENDERS.find((el) => el.value === auction.sex)?.label,
    },
    {
      label: 'age class',
      value: AGE_CLASSES.find((el) => el.value === auction.ageClass)?.label,
    },
    {
      label: 'breed type',
      value: BREED_TYPES.find((el) => el.value === auction.breedType)?.label,
    },
    {
      label: 'breed',
      value: BREEDS.find((el) => el.value === auction.breed)?.label,
    },
  ]

  if (auction.breed2) {
    details.push({
      label: 'breed 2',
      value: BREEDS.find((el) => el.value === auction.breed2)?.label,
    })
  }

  details.push(
    {
      label: 'production system',
      value: mapLabels(auction.prodSystems, PROD_SYSTEMS),
    },
    {
      label: 'vaccines',
      value:
        auction.vaccines && auction.vaccines.length > 0
          ? mapLabels(auction.vaccines, VACCINES)
          : 'Not specified',
    },
  )

  return (
    <SectionCard icon={Info} title="Details" variant="plain">
      <div className="grid w-full grid-cols-1 gap-x-8 sm:grid-cols-2">
        {details.map((detail, index) => (
          <DetailRow
            key={`${detail.label}_${index}`}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </div>
    </SectionCard>
  )
}
