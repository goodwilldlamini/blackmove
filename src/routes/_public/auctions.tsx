import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuctionCard } from '#/components/auction-card'
import { EmptyWidget } from '#/components/empty'
import { FilterWidget } from '#/components/auctions-filter'
import { Button } from '#/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '#/components/ui/sheet'
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
  const searchArg = appStore((s) => s.searchArg)
  const setLoading = appStore((s) => s.setLoading)
  const searchProvince = appStore((s) => s.searchProvince)
  const searchCategory = appStore((s) => s.searchCategory)
  const searchBreedType = appStore((s) => s.searchBreedType)
  const searchProdSystem = appStore((s) => s.searchProdSystem)
  const searchSex = appStore((s) => s.searchSex)
  const searchKind = appStore((s) => s.searchKind)

  const isSearchEnabled =
    !!searchArg ||
    !!searchCategory ||
    !!searchBreedType ||
    searchProdSystem.length > 0 ||
    !!searchSex ||
    !!searchKind

  useEffect(() => {
    setLoading(true)
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
    const timeout = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [liveAuctions, searchArg, searchProvince, searchCategory, searchBreedType, searchProdSystem, searchSex, searchKind, setLoading])

  function onReset() {
    appStore.setState({
      searchArg: '',
      searchCategory: '',
      searchBreedType: '',
      searchProdSystem: [],
      searchSex: '',
      searchKind: '',
    })
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between border-b p-4 shadow-sm">
        <h1 className="text-xs font-semibold sm:text-2xl">Auctions</h1>
        <Button
          variant="outline"
          className="sm:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          Filters
          <SlidersHorizontal />
        </Button>
      </div>
      <div className="flex w-full flex-1 flex-row">
        <div className="hidden w-72 shrink-0 sm:flex">
          <FilterWidget onReset={onReset} />
        </div>
        {filteredAuctions.length > 0 ? (
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="flex-1">
            <EmptyWidget
              text={
                isSearchEnabled
                  ? 'There are no auctions matching your search'
                  : 'There are currently no live auctions'
              }
            />
          </div>
        )}
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="sr-only">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterWidget onReset={onReset} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
