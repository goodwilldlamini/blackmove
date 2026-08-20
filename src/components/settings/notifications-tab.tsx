import { Switch } from '#/components/ui/switch'

export function NotificationsTab() {
  return (
    <div className="flex w-full justify-center py-4">
      <div className="flex w-full max-w-md items-center gap-4">
        <span className="flex-1">Push Notifications</span>
        <Switch />
      </div>
    </div>
  )
}
