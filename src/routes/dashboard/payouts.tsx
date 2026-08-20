import { createFileRoute } from '@tanstack/react-router'
import { Bell, Coins } from 'lucide-react'
import { PageTitle } from '#/components/page-title'
import { NotificationsTab } from '#/components/settings/notifications-tab'
import { PayoutMethodsTab } from '#/components/settings/payout-methods-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'

export const Route = createFileRoute('/dashboard/payouts')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageTitle text="settings" hideDivider />
      <Tabs defaultValue="payouts" className="w-full items-center">
        <TabsList>
          <TabsTrigger value="payouts">
            <Coins /> payouts
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell /> notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="payouts" className="w-full">
          <PayoutMethodsTab />
        </TabsContent>
        <TabsContent value="notifications" className="w-full">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
