import { AuctionCard } from '#/components/auction-card'
import { publicStore } from '#/state/public.store'

export function OtherAuctions({ currentAuctionId }: { currentAuctionId?: string }) {
  const liveAuctions = publicStore((s) => s.liveAuctions)
  const others = liveAuctions.filter((el) => el.id !== currentAuctionId)

  if (others.length === 0) return null

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-6 sm:px-0">
      <div className="flex w-full flex-col items-start gap-4">
        <h2 className="text-base font-semibold capitalize sm:text-xl">
          Listings closing soon
        </h2>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {others.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </div>
  )
}
