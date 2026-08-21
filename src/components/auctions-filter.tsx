import { FilterX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  BREED_TYPES,
  CATEGORIES,
  GENDERS,
  LISTING_KINDS,
  PROD_SYSTEMS,
  PROVINCES,
} from '#/lib/app-data'
import { appStore } from '#/state/app.store'

export function FilterWidget({ onReset }: { onReset: () => void }) {
  const [searchStr, setSearchStr] = useState('')
  const searchArg = appStore((s) => s.searchArg)
  const searchCategory = appStore((s) => s.searchCategory)
  const searchProvince = appStore((s) => s.searchProvince)
  const searchBreedType = appStore((s) => s.searchBreedType)
  const searchProdSystem = appStore((s) => s.searchProdSystem)
  const searchSex = appStore((s) => s.searchSex)
  const searchKind = appStore((s) => s.searchKind)

  const isSearchEnabled =
    !!searchArg ||
    !!searchCategory ||
    !!searchProvince ||
    !!searchBreedType ||
    searchProdSystem.length > 0 ||
    !!searchSex ||
    !!searchKind

  useEffect(() => {
    const timeout = setTimeout(() => {
      appStore.setState({ searchArg: searchStr })
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchStr])

  return (
    <div className="flex w-full flex-col border-r">
      <h2 className="px-4 pt-4 text-base font-semibold underline sm:text-lg">
        Filters
      </h2>
      <div className="flex w-full flex-1 flex-col gap-6 p-4">
        <div className="flex flex-col gap-1">
          <Label>Search by title</Label>
          <Input value={searchStr} onChange={(e) => setSearchStr(e.target.value)} />
        </div>
        <SelectFilter
          label="listing type"
          value={searchKind}
          onChange={(val) => appStore.setState({ searchKind: val })}
          options={LISTING_KINDS}
        />
        <SelectFilter
          label="province"
          value={searchProvince}
          onChange={(val) => appStore.setState({ searchProvince: val })}
          options={PROVINCES}
        />
        <SelectFilter
          label="category"
          value={searchCategory}
          onChange={(val) => appStore.setState({ searchCategory: val })}
          options={CATEGORIES}
        />
        <SelectFilter
          label="sex"
          value={searchSex}
          onChange={(val) => appStore.setState({ searchSex: val })}
          options={GENDERS}
        />
        <SelectFilter
          label="breed type"
          value={searchBreedType}
          onChange={(val) => appStore.setState({ searchBreedType: val })}
          options={BREED_TYPES}
        />
        <div className="flex flex-col gap-2">
          <Label>Production system</Label>
          {PROD_SYSTEMS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={searchProdSystem.includes(opt.value)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...searchProdSystem, opt.value]
                    : searchProdSystem.filter((v) => v !== opt.value)
                  appStore.setState({ searchProdSystem: next })
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-secondary p-4">
        <Button
          disabled={!isSearchEnabled}
          variant="secondary"
          size="lg"
          className="w-full shadow-none"
          onClick={() => {
            setSearchStr('')
            onReset()
          }}
        >
          <FilterX />
          clear filters
        </Button>
      </div>
    </div>
  )
}

function SelectFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="capitalize">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {options.map((el) => (
            <SelectItem key={el.value} value={el.value} className="capitalize">
              {el.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
