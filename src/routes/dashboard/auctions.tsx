import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { DataTable } from '#/components/data-table/data-table'
import { PageTitle } from '#/components/page-title'
import {
  AUCTION_STATUSES,
  CATEGORIES,
  LISTING_KINDS,
  STATUS_IDS,
} from '#/lib/app-data'
import type { features } from '#/lib/table-features'
import { mainStore } from '#/state/main.store'
import type { Listing } from '#/types/auction'

export const Route = createFileRoute('/dashboard/auctions')({
  component: AdminAuctionsPage,
})

const columns: ColumnDef<typeof features, Listing>[] = [
  {
    accessorKey: 'title',
    header: 'title',
    cell: (props) => {
      const auction = props.row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={auction.cover || auction.images?.[0]} alt={auction.title} />
            <AvatarFallback>{auction.title?.[0]}</AvatarFallback>
          </Avatar>
          <span>{auction.title}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'category',
    accessorFn: (row) => CATEGORIES.find((el) => el.value === row.category)?.label,
  },
  {
    accessorKey: 'kind',
    header: 'type',
    accessorFn: (row) => LISTING_KINDS.find((el) => el.value === row.kind)?.label,
  },
  {
    accessorKey: 'status',
    header: 'status',
    accessorFn: (row) => AUCTION_STATUSES.find((el) => el.value === row.status)?.title,
    cell: (props) => {
      const auction = props.row.original
      const isLive = auction.status === STATUS_IDS.published
      return (
        <Badge
          variant="outline"
          className={isLive ? 'border-teal-400 text-teal-700' : 'border-blue-400 text-blue-700'}
        >
          {AUCTION_STATUSES.find((el) => el.value === auction.status)?.title}
        </Badge>
      )
    },
  },
]

function AdminAuctionsPage() {
  const auctions = mainStore((s) => s.auctions)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle text="auctions" />
      <DataTable title="auctions" columns={columns} data={auctions} isSelectible />
    </div>
  )
}
