import { AuctionCard } from '#/components/auction-card'
import { publicStore } from '#/state/public.store'

export function OtherAuctions({ currentAuctionId }: { currentAuctionId?: string }) {
  const liveAuctions = publicStore((s) => s.liveAuctions)
  const others = liveAuctions.filter((el) => el.id !== currentAuctionId)

  if (others.length === 0) return null

  return (
    <section className="w-full border-t border-border bg-muted/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex w-full flex-col items-start gap-6">
          <h2 className="display-title text-2xl font-bold capitalize sm:text-3xl">
            Listings closing soon
          </h2>
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
