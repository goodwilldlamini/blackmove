import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
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
import { isAuctionFeatureActive } from '#/lib/feature-flags'
import { appStore } from '#/state/app.store'

/**
 * The full filter set, shown in the auctions sheet. Title search and the
 * listing-kind quick filter live in `AuctionsFilterBar` instead — keeping a
 * second search field here would give `searchArg` two owners.
 */
export function FilterWidget({
  onReset,
  onDone,
  resultCount,
}: {
  onReset: () => void
  onDone?: () => void
  resultCount?: number
}) {
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

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
        {/* only worth showing while there is more than one kind to pick from */}
        {isAuctionFeatureActive && (
          <SelectFilter
            label="listing type"
            value={searchKind}
            onChange={(val) => appStore.setState({ searchKind: val })}
            options={LISTING_KINDS}
          />
        )}
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
        <div className="flex flex-col gap-2.5">
          <FilterLabel>Production system</FilterLabel>
          <div className="flex flex-wrap gap-2">
            {PROD_SYSTEMS.map((opt) => {
              const isActive = searchProdSystem.includes(opt.value)
              return (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  aria-pressed={isActive}
                  onClick={() =>
                    appStore.setState({
                      searchProdSystem: isActive
                        ? searchProdSystem.filter((v) => v !== opt.value)
                        : [...searchProdSystem, opt.value],
                    })
                  }
                >
                  {opt.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex w-full shrink-0 items-center gap-3 border-t border-border bg-background px-5 py-4">
        <Button
          disabled={!isSearchEnabled}
          variant="outline"
          onClick={onReset}
          className="flex-1"
        >
          Clear all
        </Button>
        <Button onClick={onDone} className="flex-1">
          {resultCount === undefined
            ? 'Done'
            : `Show ${resultCount} ${resultCount === 1 ? 'listing' : 'listings'}`}
        </Button>
      </div>
    </div>
  )
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </Label>
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
    <div className="flex flex-col gap-2">
      <FilterLabel>{label}</FilterLabel>
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
