import { createFileRoute } from '@tanstack/react-router'
import { AuctionWizard } from '#/components/wizard/auction-wizard'

export const Route = createFileRoute('/dashboard/my-auctions/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <AuctionWizard auctionId={id} />
}
