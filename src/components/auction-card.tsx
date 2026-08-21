import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'
import { CoverImage } from '#/components/auction-card/cover-image'
import { LikeButton } from '#/components/auction-card/like-button'
import { EdTimer, TimerText } from '#/components/timer'
import {
  BREED_TYPES,
  GENDERS,
  LISTING_KIND_IDS,
  PROD_SYSTEMS,
  STATUS_IDS,
} from '#/lib/app-data'
import { auctionLocation, highBid } from '#/lib/helpers'
import type { Listing } from '#/types/auction'

export function AuctionCard({ auction }: { auction: Listing }) {
  const isSold = auction.status === STATUS_IDS.concludedSold
  const isReserved = auction.status === STATUS_IDS.reserved
  const hasPassed = auction.status === STATUS_IDS.concluded || isSold
  const isBuyNow = auction.kind === LISTING_KIND_IDS.buyNow

  return (
    <div className="group relative w-full">
      <div className="flex w-full flex-col gap-2">
        <div className="relative w-full rounded-xl transition-shadow duration-200 hover:shadow-md">
          <CoverImage auction={auction} />
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <LikeButton hideText auction={auction} />
            <Badge
              variant="secondary"
              className={hasPassed ? 'bg-muted' : 'bg-success/15 text-success'}
            >
              {isSold ? (
                <TimerText className="text-destructive">SOLD</TimerText>
              ) : isReserved ? (
                <TimerText className="text-warning">RESERVED</TimerText>
              ) : hasPassed ? (
                <TimerText className="text-destructive">CLOSED</TimerText>
              ) : isBuyNow && !auction.closeDate ? (
                <TimerText>BUY NOW</TimerText>
              ) : (
                <EdTimer date={auction.closeDate} />
              )}
            </Badge>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-2">
            <Link
              to="/auctions/$id"
              params={{ id: auction.id! }}
              className="display-title flex-1 text-lg font-semibold text-foreground/90 sm:text-xl"
            >
              {auction.title}
            </Link>
            <Badge variant="outline">{highBid(auction)}</Badge>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {auctionLocation(auction)}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" title="sex">
                {GENDERS.find((el) => el.value === auction.sex)?.label}
              </Badge>
              <Badge variant="outline" title="breed type">
                {
                  BREED_TYPES.find((el) => el.value === auction.breedType)
                    ?.label
                }
              </Badge>
              {auction.prodSystems && auction.prodSystems.length > 0 && (
                <Badge variant="outline" title="production systems">
                  {auction.prodSystems
                    .map(
                      (sys) =>
                        PROD_SYSTEMS.find((el) => el.value === sys)?.label,
                    )
                    .join(', ')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
