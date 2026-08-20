import { createFileRoute } from '@tanstack/react-router'
import { DashStats } from '#/components/dashboard-home/dash-stats'
import { DepositWidget } from '#/components/dashboard-home/deposit-widget'
import { TransactionsWidget } from '#/components/dashboard-home/transactions-widget'
import { USER_TYPE_IDS } from '#/lib/app-data'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/dashboard/home')({
  component: DashHomePage,
})

function DashHomePage() {
  const user = userStore((s) => s.user)
  const isBuyer = user?.type === USER_TYPE_IDS.buyer
  const isSeller = user?.type === USER_TYPE_IDS.seller
  const isAdmin = user?.type === USER_TYPE_IDS.admin

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      {(isSeller || isAdmin) && <DashStats />}
      {isBuyer && <DepositWidget />}
      <TransactionsWidget />
    </div>
  )
}
