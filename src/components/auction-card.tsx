import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'
import { Progress } from '#/components/ui/progress'
import { CoverImage } from '#/components/auction-card/cover-image'
import { LikeButton } from '#/components/auction-card/like-button'
import { EdTimer, TimerText } from '#/components/timer'
import {
  BREED_TYPES,
  GENDERS,
  LISTING_KIND_IDS,
  LISTING_KINDS,
  PROD_SYSTEMS,
  STATUS_IDS,
} from '#/lib/app-data'
import { auctionLocation, highBid, listingProgress } from '#/lib/helpers'
import type { Listing } from '#/types/auction'

export function AuctionCard({ auction }: { auction: Listing }) {
  const isSold = auction.status === STATUS_IDS.concludedSold
  const isReserved = auction.status === STATUS_IDS.reserved
  const hasPassed = auction.status === STATUS_IDS.concluded || isSold
  const isBuyNow = auction.kind === LISTING_KIND_IDS.buyNow
  // legacy listings carry no kind, so they fall back to auction
  const kind =
    LISTING_KINDS.find((el) => el.value === auction.kind) ?? LISTING_KINDS[0]
  const isLive = !hasPassed && !isReserved
  const progress = isLive ? listingProgress(auction) : null

  const chips = [
    GENDERS.find((el) => el.value === auction.sex)?.label,
    BREED_TYPES.find((el) => el.value === auction.breedType)?.label,
    ...(auction.prodSystems || []).map(
      (sys) => PROD_SYSTEMS.find((el) => el.value === sys)?.label,
    ),
  ].filter(Boolean)

  return (
    <article className="group relative flex w-full flex-col gap-3">
      <div className="relative w-full">
        <CoverImage auction={auction} />
        {/* above the title's stretched link, so it stays clickable */}
        <div className="absolute top-3 right-3 z-10">
          <LikeButton hideText auction={auction} />
        </div>
        <Badge
          className={`absolute bottom-3 left-3 backdrop-blur-sm ${
            isLive
              ? 'bg-foreground/90 text-background'
              : 'bg-background/95 text-foreground'
          }`}
        >
          {isSold ? (
            <TimerText className="text-destructive">SOLD</TimerText>
          ) : isReserved ? (
            <TimerText className="text-warning">RESERVED</TimerText>
          ) : hasPassed ? (
            <TimerText className="text-destructive">CLOSED</TimerText>
          ) : isBuyNow && !auction.closeDate ? (
            // a buy-now listing runs until it sells, so there is no timer
            <TimerText className="text-background">AVAILABLE</TimerText>
          ) : (
            <EdTimer className="text-background" date={auction.closeDate} />
          )}
        </Badge>
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <Link
          to="/auctions/$id"
          params={{ id: auction.id! }}
          className="display-title line-clamp-2 text-base font-bold leading-snug after:absolute after:inset-0"
        >
          {auction.title}
        </Link>
        <span className="text-sm text-muted-foreground">
          {auctionLocation(auction)}
        </span>

        {progress !== null && <Progress value={progress} className="mt-1 h-1" />}

        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="display-title text-xl font-extrabold">
            {highBid(auction)}
          </span>
          <span className="text-xs text-muted-foreground">
            {isBuyNow ? 'price' : 'current bid'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="tint" className="capitalize">
            {kind.label}
          </Badge>
          {chips.map((label) => (
            <Badge key={label} variant="tint" className="capitalize">
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  )
}
