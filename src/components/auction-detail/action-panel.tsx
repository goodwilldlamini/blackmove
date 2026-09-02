import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Progress } from '#/components/ui/progress'
import { EdTimer } from '#/components/timer'
import { LISTING_KIND_IDS, STATUS_IDS } from '#/lib/app-data'
import { isAuctionFeatureActive } from '#/lib/feature-flags'
import { currencyFormat, highBid, listingProgress } from '#/lib/helpers'
import type { Listing } from '#/types/auction'
import type { EdUser } from '#/types/user'
import { BidButton } from './bid-button'
import { BuyNowButton } from './buy-now-button'

/**
 * The listing's money surface and primary call to action. Sticks alongside the
 * detail content on large screens; renders inline above it on small ones.
 */
export function AuctionActionPanel({
  auction,
  seller,
}: {
  auction: Listing
  seller: EdUser | null
}) {
  const isBuyNow = auction.kind === LISTING_KIND_IDS.buyNow
  const isSold = auction.status === STATUS_IDS.concludedSold
  const isReserved = auction.status === STATUS_IDS.reserved
  const hasConcluded = auction.status === STATUS_IDS.concluded || isSold
  const isLive = !hasConcluded && !isReserved
  const progress = isLive ? listingProgress(auction) : null
  const bidCount = auction.bids?.length || 0

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <span className="display-title text-3xl font-extrabold sm:text-4xl">
          {isBuyNow ? currencyFormat(auction.price) : highBid(auction)}
        </span>
        <span className="text-sm text-muted-foreground">
          {isBuyNow
            ? 'price'
            : `current bid · ${bidCount} ${bidCount === 1 ? 'bid' : 'bids'}`}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {progress !== null && <Progress value={progress} className="h-1" />}
        <ListingStatus auction={auction} />
      </div>

      <AuctionCta auction={auction} className="w-full" />

      <hr className="border-border" />

      <div className="flex min-w-0 items-center gap-3">
        <Avatar>
          <AvatarImage src={seller?.photoURL} alt={seller?.name} />
          <AvatarFallback>{seller?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            seller
          </span>
          <span className="truncate text-sm font-bold">{seller?.name}</span>
        </div>
      </div>
    </div>
  )
}

function ListingStatus({ auction }: { auction: Listing }) {
  const isBuyNow = auction.kind === LISTING_KIND_IDS.buyNow
  const isSold = auction.status === STATUS_IDS.concludedSold
  const isReserved = auction.status === STATUS_IDS.reserved
  const hasConcluded = auction.status === STATUS_IDS.concluded || isSold

  if (isSold) {
    return <Badge className="bg-destructive/10 text-destructive">Sold</Badge>
  }
  if (isReserved) {
    return <Badge className="bg-warning/15 text-warning">Reserved</Badge>
  }
  if (hasConcluded) {
    return <Badge className="bg-destructive/10 text-destructive">Closed</Badge>
  }
  // a buy-now listing with no close date runs until it sells
  if (!auction.closeDate) {
    return <Badge variant="tint">{isBuyNow ? 'Available' : 'Live'}</Badge>
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Closes in</span>
      <EdTimer className="text-foreground" date={auction.closeDate} />
    </div>
  )
}

/**
 * The primary action, shared by the panel and the mobile sticky bar. Buy-now
 * owns dialogs that must survive the listing flipping to `reserved`, so it does
 * its own status gating; auctions are gated here.
 */
export function AuctionCta({
  auction,
  className,
}: {
  auction: Listing
  className?: string
}) {
  if (auction.kind === LISTING_KIND_IDS.buyNow) {
    return <BuyNowButton auction={auction} className={className} />
  }
  // no bidding at all while auctions are switched off
  if (!isAuctionFeatureActive) return null
  if (auction.status !== STATUS_IDS.published) return null
  return <BidButton auction={auction} className={className} />
}
