import { Bell } from 'lucide-react'
import { EmptyWidget } from '#/components/empty'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { dateFormat } from '#/lib/helpers'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'
import { NOTIFICATIONS } from '#/types/core/notification'

export function NotificationBell() {
  const isOpen = appStore((s) => s.isNotificationsOpen)
  const setIsOpen = appStore((s) => s.setIsNotificationsOpen)
  const notifications = userStore((s) => s.notifications)
  const user = userStore((s) => s.user)

  const unread = notifications.filter((el) => !el.read)
  const hasUnread = unread.length > 0

  async function onOpen() {
    setIsOpen(true)
    if (!hasUnread || !user?.uid) return
    const dbWrite = (await import('#/services/db-write.service')).default
    dbWrite.markNotificationsRead(user.uid, unread)
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="relative rounded-full p-2 text-white hover:bg-white/10"
        aria-label="notifications"
      >
        <Bell className="size-5 sm:size-6" />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {notifications.length}
          </span>
        )}
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-4">
            {notifications.length < 1 && (
              <EmptyWidget text="Your notifications will appear here" />
            )}
            {notifications.map((note) => {
              const info = NOTIFICATIONS[note.type]
              return (
                <div key={note.id} className="flex w-full flex-col gap-2 border-b pb-4">
                  <p className="text-sm">{info.desc}</p>
                  <span className="text-xs text-muted-foreground">
                    {dateFormat(note.createdAt)}
                  </span>
                </div>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
