import { createFileRoute } from '@tanstack/react-router'
import { AuctionCard } from '#/components/auction-card'
import { EmptyWidget } from '#/components/empty'
import { PageTitle } from '#/components/page-title'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/dashboard/bookmarks')({
  component: BookmarksPage,
})

function BookmarksPage() {
  const savedAuctions = userStore((s) => s.savedAuctions)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle text="saved auctions" />
      {savedAuctions.length < 1 && (
        <EmptyWidget text="Your saved auctions will appear here" />
      )}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {savedAuctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  )
}
