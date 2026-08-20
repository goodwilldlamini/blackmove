import { createFileRoute } from '@tanstack/react-router'
import { CircleDot } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { DataTable } from '#/components/data-table/data-table'
import { PageTitle } from '#/components/page-title'
import { UserTableActions } from '#/components/user-table-actions'
import { USER_TYPE_IDS, userTitles, userTypes } from '#/lib/app-data'
import { userLabel } from '#/lib/helpers'
import type { features } from '#/lib/table-features'
import { mainStore } from '#/state/main.store'
import type { EdUser } from '#/types/user'

export const Route = createFileRoute('/dashboard/users')({
  component: UsersPage,
})

function userTypeClasses(type?: string) {
  switch (type) {
    case USER_TYPE_IDS.seller:
      return 'bg-teal-100 text-teal-700'
    case USER_TYPE_IDS.buyer:
      return 'bg-cyan-100 text-cyan-700'
    case USER_TYPE_IDS.driver:
      return 'bg-purple-100 text-purple-700'
    case USER_TYPE_IDS.inspector:
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-pink-100 text-pink-700'
  }
}

const columns: ColumnDef<typeof features, EdUser>[] = [
  {
    accessorKey: 'name',
    header: 'name',
    cell: (props) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={props.row.original.photoURL} alt={props.row.original.name} />
          <AvatarFallback>{props.row.original.name?.[0]}</AvatarFallback>
        </Avatar>
        <span>{props.row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'email',
  },
  {
    accessorKey: 'title',
    accessorFn: (row) => userTitles.find((el) => el.value === row.title)?.label,
    header: 'title',
  },
  {
    accessorKey: 'type',
    accessorFn: (row) => userTypes.find((el) => el.value === row.type)?.label,
    header: 'type',
    cell: (props) => (
      <Badge variant="secondary" className={`capitalize ${userTypeClasses(props.row.original.type)}`}>
        {userLabel(props.row.original)}
      </Badge>
    ),
  },
  {
    id: 'status',
    header: 'status',
    accessorFn: (row) => (row.verified ? 'verified' : 'unverified'),
    cell: (props) => {
      const user = props.row.original
      return (
        <Badge
          variant="outline"
          className={`gap-1 capitalize ${user.verified ? 'border-teal-400 text-teal-700' : 'border-pink-400 text-pink-700'}`}
        >
          {user.verified ? '' : 'un'}verified
          <CircleDot className="size-3" />
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: (props) => <UserTableActions user={props.row.original} />,
  },
]

function UsersPage() {
  const users = mainStore((s) => s.users)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle text="Users" />
      <DataTable title="users" columns={columns} data={users} isSelectible />
    </div>
  )
}
