import { LikeButton } from '#/components/auction-card/like-button'
import { ShareButton } from '#/components/auction-card/share-button'
import { auctionLocation } from '#/lib/helpers'
import type { Listing } from '#/types/auction'

export function TopControls({ auction }: { auction: Listing }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-2 py-4 sm:px-0">
      <div className="flex flex-1 flex-col gap-0">
        <h1 className="text-lg font-medium sm:text-3xl">{auction.title}</h1>
        <span className="text-sm underline">{auctionLocation(auction)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-4">
        <ShareButton />
        <LikeButton auction={auction} />
      </div>
    </div>
  )
}
