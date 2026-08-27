import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { LikeButton } from '#/components/auction-card/like-button'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { LISTING_KINDS } from '#/lib/app-data'
import { ROUTES } from '#/lib/constants'
import { auctionLocation } from '#/lib/helpers'
import type { Listing } from '#/types/auction'

export function TopControls({ auction }: { auction: Listing }) {
  // legacy listings carry no kind, so they fall back to auction
  const kind =
    LISTING_KINDS.find((el) => el.value === auction.kind) ?? LISTING_KINDS[0]

  return (
    <div className="flex w-full flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="-ml-3 w-fit">
        <Link to={ROUTES.auctions}>
          <ChevronLeft />
          All listings
        </Link>
      </Button>
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="display-title text-2xl font-extrabold sm:text-4xl">
            {auction.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {auctionLocation(auction)}
            </span>
            <Badge variant="tint" className="capitalize">
              {kind.label}
            </Badge>
          </div>
        </div>
        <div className="shrink-0">
          <LikeButton auction={auction} />
        </div>
      </div>
    </div>
  )
}
