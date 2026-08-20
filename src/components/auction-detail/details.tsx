import {
  Calendar,
  Eye,
  Feather,
  Hash,
  Info,
  List,
  ShieldCheck,
  Sprout,
  Syringe,
  UserRound,
} from 'lucide-react'
import { DetailRow } from '#/components/detail-row'
import { SectionCard, SectionIconChip } from '#/components/section-card'
import {
  AGE_CLASSES,
  BREEDS,
  BREED_TYPES,
  CATEGORIES,
  GENDERS,
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
    <div className="flex w-full flex-col gap-4">
      <SectionCard icon={List} title="Description">
        <p>{auction.desc}</p>
      </SectionCard>
      <GeneralDetails auction={auction} />
      <DetailsBox auction={auction} />
    </div>
  )
}

function GeneralDetails({ auction }: { auction: Listing }) {
  const inspectionPassed = !!auction.inspectionPassed

  const details = [
    { label: 'views', icon: Eye, value: '12 views' },
    {
      label: 'inspection',
      icon: ShieldCheck,
      value: inspectionPassed ? 'passed' : 'pending',
      valueClass: inspectionPassed ? 'text-success' : 'text-warning',
    },
    { label: 'close date', icon: Calendar, value: dateFormat(auction.closeDate) },
  ]

  return (
    <SectionCard icon={Info} title="general">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
          >
            <SectionIconChip icon={detail.icon} />
            <div className="flex min-w-0 flex-1 flex-col gap-0">
              <span className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                {detail.label}
              </span>
              <span
                className={`truncate text-xs font-bold capitalize sm:text-sm ${detail.valueClass || 'text-gray-700'}`}
              >
                {detail.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function DetailsBox({ auction }: { auction: Listing }) {
  const details: {
    label: string
    value: string | undefined
    icon: typeof Info
  }[] = [
    {
      label: 'type',
      value: CATEGORIES.find((el) => el.value === auction.category)?.label,
      icon: Hash,
    },
    { label: 'Quantity', value: `${auction.quantity} units`, icon: Hash },
    {
      label: 'sex',
      value: GENDERS.find((el) => el.value === auction.sex)?.label,
      icon: UserRound,
    },
    {
      label: 'age class',
      value: AGE_CLASSES.find((el) => el.value === auction.ageClass)?.label,
      icon: List,
    },
    {
      label: 'breed type',
      value: BREED_TYPES.find((el) => el.value === auction.breedType)?.label,
      icon: List,
    },
    {
      label: 'breed',
      value: BREEDS.find((el) => el.value === auction.breed)?.label,
      icon: Feather,
    },
  ]

  if (auction.breed2) {
    details.push({
      label: 'breed 2',
      value: BREEDS.find((el) => el.value === auction.breed2)?.label,
      icon: Feather,
    })
  }

  details.push(
    {
      label: 'production system',
      value: mapLabels(auction.prodSystems, PROD_SYSTEMS),
      icon: Sprout,
    },
    {
      label: 'vaccines',
      value:
        auction.vaccines && auction.vaccines.length > 0
          ? mapLabels(auction.vaccines, VACCINES)
          : 'Not specified',
      icon: Syringe,
    },
  )

  return (
    <SectionCard icon={Info} title="Details">
      <div className="grid w-full grid-cols-1 gap-x-6 sm:grid-cols-2">
        {details.map((detail, index) => (
          <DetailRow
            key={`${detail.label}_${index}`}
            icon={detail.icon}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </div>
    </SectionCard>
  )
}
