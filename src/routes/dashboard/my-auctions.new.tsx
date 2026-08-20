import { createFileRoute } from '@tanstack/react-router'
import { AuctionWizard } from '#/components/wizard/auction-wizard'

export const Route = createFileRoute('/dashboard/my-auctions/new')({
  component: () => <AuctionWizard />,
})
