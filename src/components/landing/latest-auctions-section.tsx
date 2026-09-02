import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { AuctionCard } from '#/components/auction-card'
import { Button } from '#/components/ui/button'
import { ROUTES } from '#/lib/constants'
import { publicStore } from '#/state/public.store'

export function LatestAuctionsSection() {
  const liveAuctions = publicStore((s) => s.liveAuctions)

  return (
    <div className="w-full py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex w-full flex-col items-center gap-8">
          <h2 className="display-title text-xl font-semibold capitalize sm:text-3xl">
            latest listings
          </h2>
          {liveAuctions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No live listings yet — check back soon.
            </p>
          ) : (
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {liveAuctions.slice(0, 3).map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
          <Button asChild>
            <Link to={ROUTES.auctions}>
              <Search />
              Browse all
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
