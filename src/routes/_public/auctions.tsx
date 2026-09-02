import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AuctionCard } from '#/components/auction-card'
import { EmptyWidget } from '#/components/empty'
import { FilterWidget } from '#/components/auctions-filter'
import {
  ActiveFilterChips,
  AuctionsFilterBar,
} from '#/components/auctions/filter-bar'
import { Button } from '#/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '#/components/ui/sheet'
import { Skeleton } from '#/components/ui/skeleton'
import { isAuctionFeatureActive } from '#/lib/feature-flags'
import { appStore } from '#/state/app.store'
import { publicStore } from '#/state/public.store'
import type { Listing } from '#/types/auction'

export const Route = createFileRoute('/_public/auctions')({
  component: AuctionsLayout,
})

// auctions.$id.tsx nests under this route structurally (dot-segment
// convention) — only show the list on the exact /auctions match.
function AuctionsLayout() {
  const matches = useMatches()
  const isExact = matches[matches.length - 1]?.routeId === Route.id

  return isExact ? <AuctionsListPage /> : <Outlet />
}

function AuctionsListPage() {
  const liveAuctions = publicStore((s) => s.liveAuctions)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filteredAuctions, setFilteredAuctions] = useState<Listing[]>([])
  const [isFiltering, setIsFiltering] = useState(true)
  const searchArg = appStore((s) => s.searchArg)
  const searchProvince = appStore((s) => s.searchProvince)
  const searchCategory = appStore((s) => s.searchCategory)
  const searchBreedType = appStore((s) => s.searchBreedType)
  const searchProdSystem = appStore((s) => s.searchProdSystem)
  const searchSex = appStore((s) => s.searchSex)
  const searchKind = appStore((s) => s.searchKind)

  const isSearchEnabled =
    !!searchArg ||
    !!searchProvince ||
    !!searchCategory ||
    !!searchBreedType ||
    searchProdSystem.length > 0 ||
    !!searchSex ||
    !!searchKind

  useEffect(() => {
    setIsFiltering(true)
    let auctions = liveAuctions
    if (searchArg) {
      auctions = auctions.filter(
        (el) =>
          el.title?.toLowerCase().includes(searchArg.toLowerCase()) ||
          searchArg.toLowerCase().includes(el.title!.toLowerCase()),
      )
    }
    if (searchKind) auctions = auctions.filter((el) => el.kind === searchKind)
    if (searchCategory) auctions = auctions.filter((el) => el.category === searchCategory)
    if (searchProvince) auctions = auctions.filter((el) => el.province === searchProvince)
    if (searchSex) auctions = auctions.filter((el) => el.sex === searchSex)
    if (searchBreedType) auctions = auctions.filter((el) => el.breedType === searchBreedType)
    if (searchProdSystem.length > 0) {
      auctions = auctions.filter((auction) =>
        auction.prodSystems?.some((opt) => searchProdSystem.includes(opt)),
      )
    }
    setFilteredAuctions(auctions)
    const timeout = setTimeout(() => setIsFiltering(false), 500)
    return () => clearTimeout(timeout)
  }, [liveAuctions, searchArg, searchProvince, searchCategory, searchBreedType, searchProdSystem, searchSex, searchKind])

  function onReset() {
    appStore.setState({
      searchArg: '',
      searchProvince: '',
      searchCategory: '',
      searchBreedType: '',
      searchProdSystem: [],
      searchSex: '',
      searchKind: '',
    })
  }

  return (
    <div className="flex w-full flex-col">
      <section className="w-full border-b border-border bg-muted/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-2">
            <h1 className="display-title text-3xl font-extrabold sm:text-5xl">
              Livestock listings
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              {isAuctionFeatureActive
                ? 'Browse live auctions and buy-now listings from farmers and buyers across South Africa.'
                : 'Browse fixed-price livestock listings from farmers and buyers across South Africa.'}
            </p>
          </div>
          <AuctionsFilterBar onOpenFilters={() => setFiltersOpen(true)} />
          <ActiveFilterChips onReset={onReset} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {isFiltering ? (
          <AuctionGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </AuctionGrid>
        ) : filteredAuctions.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {filteredAuctions.length}{' '}
              {filteredAuctions.length === 1 ? 'listing' : 'listings'}
            </p>
            <AuctionGrid>
              {filteredAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </AuctionGrid>
          </>
        ) : (
          <EmptyWidget
            text={
              isSearchEnabled
                ? 'There are no listings matching your search'
                : 'There are currently no live listings'
            }
            action={
              isSearchEnabled ? (
                <Button variant="outline" onClick={onReset}>
                  Clear all filters
                </Button>
              ) : undefined
            }
          />
        )}
      </section>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="display-title text-xl font-bold">
              Filters
            </SheetTitle>
          </SheetHeader>
          <FilterWidget
            onReset={onReset}
            onDone={() => setFiltersOpen(false)}
            resultCount={filteredAuctions.length}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

function AuctionGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  )
}

function AuctionCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton className="aspect-4/3 w-full rounded-2xl" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-1 h-6 w-1/3" />
      </div>
    </div>
  )
}
