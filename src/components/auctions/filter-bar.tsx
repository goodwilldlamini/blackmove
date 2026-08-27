import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  BREED_TYPES,
  CATEGORIES,
  GENDERS,
  LISTING_KINDS,
  PROD_SYSTEMS,
  PROVINCES,
} from '#/lib/app-data'
import { appStore } from '#/state/app.store'

/** Search field, listing-kind quick filters, and the "all filters" trigger. */
export function AuctionsFilterBar({
  onOpenFilters,
}: {
  onOpenFilters: () => void
}) {
  const searchArg = appStore((s) => s.searchArg)
  const searchKind = appStore((s) => s.searchKind)
  const [searchStr, setSearchStr] = useState(searchArg)

  // keep the field in step when the store is cleared from elsewhere (a chip's
  // × , or "clear all") without fighting the user mid-type
  useEffect(() => {
    setSearchStr((current) => (searchArg === '' ? '' : current))
  }, [searchArg])

  useEffect(() => {
    const timeout = setTimeout(() => {
      appStore.setState({ searchArg: searchStr })
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchStr])

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
            placeholder="Search listings"
            aria-label="Search listings by title"
            className="rounded-full bg-background pl-11"
          />
        </div>
        <Button variant="outline" onClick={onOpenFilters} className="shrink-0">
          <SlidersHorizontal />
          All filters
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <KindPill
          label="All"
          isActive={!searchKind}
          onClick={() => appStore.setState({ searchKind: '' })}
        />
        {LISTING_KINDS.map((kind) => (
          <KindPill
            key={kind.value}
            label={kind.label}
            isActive={searchKind === kind.value}
            onClick={() => appStore.setState({ searchKind: kind.value })}
          />
        ))}
      </div>
    </div>
  )
}

function KindPill({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Button
      size="sm"
      variant={isActive ? 'default' : 'outline'}
      aria-pressed={isActive}
      onClick={onClick}
      className="capitalize"
    >
      {label}
    </Button>
  )
}

type ActiveChip = { key: string; label: string; onRemove: () => void }

/** One removable pill per active filter, plus "clear all". */
export function ActiveFilterChips({ onReset }: { onReset: () => void }) {
  const searchArg = appStore((s) => s.searchArg)
  const searchProvince = appStore((s) => s.searchProvince)
  const searchCategory = appStore((s) => s.searchCategory)
  const searchBreedType = appStore((s) => s.searchBreedType)
  const searchProdSystem = appStore((s) => s.searchProdSystem)
  const searchSex = appStore((s) => s.searchSex)

  const chips: ActiveChip[] = []

  if (searchArg) {
    chips.push({
      key: 'arg',
      label: `"${searchArg}"`,
      onRemove: () => appStore.setState({ searchArg: '' }),
    })
  }

  const single: {
    key: string
    value: string
    options: { value: string; label: string }[]
    clear: () => void
  }[] = [
    {
      key: 'province',
      value: searchProvince,
      options: PROVINCES,
      clear: () => appStore.setState({ searchProvince: '' }),
    },
    {
      key: 'category',
      value: searchCategory,
      options: CATEGORIES,
      clear: () => appStore.setState({ searchCategory: '' }),
    },
    {
      key: 'sex',
      value: searchSex,
      options: GENDERS,
      clear: () => appStore.setState({ searchSex: '' }),
    },
    {
      key: 'breedType',
      value: searchBreedType,
      options: BREED_TYPES,
      clear: () => appStore.setState({ searchBreedType: '' }),
    },
  ]

  for (const filter of single) {
    if (!filter.value) continue
    const label = filter.options.find((el) => el.value === filter.value)?.label
    if (!label) continue
    chips.push({ key: filter.key, label, onRemove: filter.clear })
  }

  for (const sys of searchProdSystem) {
    const label = PROD_SYSTEMS.find((el) => el.value === sys)?.label
    if (!label) continue
    chips.push({
      key: `prod_${sys}`,
      label,
      onRemove: () =>
        appStore.setState({
          searchProdSystem: appStore
            .getState()
            .searchProdSystem.filter((v) => v !== sys),
        }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-medium capitalize transition-colors hover:bg-foreground/10"
        >
          {chip.label}
          <X className="size-3" />
          <span className="sr-only">remove filter</span>
        </button>
      ))}
      <Button variant="link" size="sm" onClick={onReset} className="px-1">
        Clear all
      </Button>
    </div>
  )
}
