import { Table2, Users, Zap, type LucideIcon } from 'lucide-react'
import { USER_TYPE_IDS } from '#/lib/app-data'
import { mainStore } from '#/state/main.store'
import { userStore } from '#/state/user.store'

export function DashStats() {
  const user = userStore((s) => s.user)
  const users = mainStore((s) => s.users)
  const auctions = mainStore((s) => s.auctions)

  const stats: { title: string; value: number; icon: LucideIcon }[] =
    user?.type === USER_TYPE_IDS.admin
      ? [
          { title: 'Total auctions', value: auctions.length, icon: Table2 },
          { title: 'Live auctions', value: 0, icon: Zap },
          { title: 'Total users', value: users.length, icon: Users },
          {
            title: 'Farmers',
            value: users.filter((el) => el.type === USER_TYPE_IDS.seller).length,
            icon: Users,
          },
        ]
      : [
          { title: 'Total auctions', value: 0, icon: Table2 },
          { title: 'Live auctions', value: 0, icon: Zap },
          { title: 'Pending auctions', value: 0, icon: Table2 },
          { title: 'Completed auctions', value: 0, icon: Table2 },
        ]

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex w-full items-center gap-3 rounded-xl bg-primary p-4"
        >
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-2xl font-bold text-white">{stat.value}</span>
            <span className="text-sm text-white/90">{stat.title}</span>
          </div>
          <stat.icon className="size-10 text-white/40" />
        </div>
      ))}
    </div>
  )
}
