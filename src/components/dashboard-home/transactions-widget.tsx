import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { DataTable } from '#/components/data-table/data-table'
import { USER_TYPE_IDS, TRANSACTION_STATUSES, TRANSACTION_TYPES } from '#/lib/app-data'
import { currencyFormat, dateFormat } from '#/lib/helpers'
import type { features } from '#/lib/table-features'
import { mainStore } from '#/state/main.store'
import { userStore } from '#/state/user.store'
import type { EdTransaction } from '#/types/transaction'

// Real v9 data-grid (sorting/filtering/column-toggle/export) — the
// simplified plain-list version from Phase 6e is superseded now that the
// table v8->v9 migration has landed. Row-level view/cancel/settle actions
// (with their confirm/detail modal) are still deferred — same cut as
// dashboard-auction-card.tsx's AuctionActions, a secondary management flow.
const columns: ColumnDef<typeof features, EdTransaction>[] = [
  {
    id: 'icon',
    header: '',
    cell: (props) => {
      const type = TRANSACTION_TYPES[props.row.original.type]
      const isUp = type?.op === 1
      const Icon = isUp ? ArrowUpRight : ArrowDownLeft
      return <Icon className={`size-4 ${isUp ? 'text-success' : 'text-destructive'}`} />
    },
  },
  {
    id: 'desc',
    header: 'description',
    accessorFn: (row) => TRANSACTION_TYPES[row.type]?.desc,
  },
  {
    accessorKey: 'amount',
    header: 'amount',
    cell: (props) => currencyFormat(props.row.original.amount),
  },
  {
    accessorKey: 'createdAt',
    header: 'date created',
    accessorFn: (row) => dateFormat(row.createdAt),
  },
  {
    id: 'status',
    header: 'status',
    accessorFn: (row) => TRANSACTION_STATUSES.find((el) => el.value === row.status)?.label,
    cell: (props) => (
      <Badge variant="outline">
        {TRANSACTION_STATUSES.find((el) => el.value === props.row.original.status)?.label}
      </Badge>
    ),
  },
]

export function TransactionsWidget() {
  const user = userStore((s) => s.user)
  const myTransactions = userStore((s) => s.myTransactions)
  const transactions = mainStore((s) => s.transactions)
  const isAdmin = user?.type === USER_TYPE_IDS.admin

  return (
    <DataTable
      title="transactions"
      columns={columns}
      data={isAdmin ? transactions : myTransactions}
    />
  )
}
