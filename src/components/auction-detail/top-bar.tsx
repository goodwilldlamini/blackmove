import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { EdTimer, TimerText } from '#/components/timer'
import { LISTING_KIND_IDS, STATUS_IDS } from '#/lib/app-data'
import { currencyFormat, highBid } from '#/lib/helpers'
import type { Listing } from '#/types/auction'
import type { EdUser } from '#/types/user'
import { BidButton } from './bid-button'
import { BuyNowButton } from './buy-now-button'

export function AuctionDetailsTopBar({
  auction,
  seller,
}: {
  auction: Listing
  seller: EdUser | null
}) {
  const hasConcluded = auction.status === STATUS_IDS.concluded
  const isBuyNow = auction.kind === LISTING_KIND_IDS.buyNow
  const isSold = auction.status === STATUS_IDS.concludedSold
  const isReserved = auction.status === STATUS_IDS.reserved

  return (
    <div className="sticky top-0 z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 bg-background px-2 py-4 sm:grid-cols-5 sm:bg-transparent sm:px-0">
      <div className="flex items-center gap-2 sm:col-span-3 sm:gap-4">
        <div className="flex flex-1 items-center justify-between gap-3 rounded-2xl bg-foreground px-3 py-3 divide-x divide-white/20 sm:px-6 sm:py-4">
          {isBuyNow ? (
            <>
              <Stat label="price">
                <TimerText className="text-white/90">
                  {currencyFormat(auction.price)}
                </TimerText>
              </Stat>
              <Stat label="status">
                <TimerText
                  className={isSold || isReserved ? 'text-warning' : 'text-white/90'}
                >
                  {isSold ? 'sold' : isReserved ? 'reserved' : 'available'}
                </TimerText>
              </Stat>
              {auction.closeDate && (
                <Stat label="time left" className="hidden sm:flex">
                  <EdTimer className="text-white/90" date={auction.closeDate} />
                </Stat>
              )}
            </>
          ) : (
            <>
              <Stat label="time left">
                {hasConcluded ? (
                  <TimerText className="text-warning">closed</TimerText>
                ) : (
                  <EdTimer className="text-white/90" date={auction.closeDate} />
                )}
              </Stat>
              <Stat label="high bid">
                <TimerText className="text-white/90">{highBid(auction)}</TimerText>
              </Stat>
              <Stat label="bids" className="hidden sm:flex">
                <TimerText className="text-white/90">
                  {auction.bids?.length || 0}
                </TimerText>
              </Stat>
            </>
          )}
        </div>
        {/* the buy-now button owns dialogs that must survive the listing
            flipping to `reserved`, so it does its own status gating */}
        {isBuyNow ? (
          <BuyNowButton auction={auction} />
        ) : (
          auction.status === STATUS_IDS.published && (
            <BidButton auction={auction} />
          )
        )}
      </div>
      <div className="flex items-center gap-3 sm:col-span-2 sm:justify-end">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar>
            <AvatarImage src={seller?.photoURL} alt={seller?.name} />
            <AvatarFallback>{seller?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              seller
            </span>
            <span className="truncate text-sm font-bold sm:text-base">
              {seller?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-2 sm:items-start sm:px-0 ${className || ''}`}>
      <span className="hidden text-[10px] font-semibold tracking-wide text-white/50 uppercase sm:block">
        {label}
      </span>
      {children}
    </div>
  )
}
