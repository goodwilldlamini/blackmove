import { createFileRoute, Outlet, useMatches, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { DashAuctionCard } from '#/components/dashboard-auction-card'
import { PageTitle } from '#/components/page-title'
import { Button } from '#/components/ui/button'
import { ROUTES } from '#/lib/constants'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/dashboard/my-auctions')({
  component: MyAuctionsLayout,
})

// my-auctions.new.tsx / my-auctions.$id.tsx nest under this route
// structurally (dot-segment convention) — only show the list on the exact
// /dashboard/my-auctions match, otherwise defer entirely to the wizard.
function MyAuctionsLayout() {
  const matches = useMatches()
  const isExact = matches[matches.length - 1]?.routeId === Route.id
  return isExact ? <MyAuctionsPage /> : <Outlet />
}

function MyAuctionsPage() {
  const myAuctions = userStore((s) => s.myAuctions)
  const navigate = useNavigate()

  function onNewAuction() {
    navigate({ to: ROUTES.newAuction })
  }

  if (myAuctions.length < 1) {
    return (
      <div className="flex h-[65vh] w-full flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground">You do not have any created auctions yet</p>
        <Button onClick={onNewAuction}>
          <Plus /> new listing
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle text="My Listings">
        <Button onClick={onNewAuction}>
          <Plus /> new listing
        </Button>
      </PageTitle>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {myAuctions.map((auction) => (
          <DashAuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  )
}
