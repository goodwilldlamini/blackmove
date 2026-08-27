import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyWidget({
  text,
  action,
}: {
  text: string
  action?: ReactNode
}) {
  // the dashed panel only reads as intentional when there's something to do in
  // it — inline callers without an action keep the plain centred treatment
  const className = action
    ? 'flex w-full flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center'
    : 'flex w-full flex-col items-center gap-3 py-16 text-center'

  return (
    <div className={className}>
      <Inbox className="size-10 text-muted-foreground" />
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  )
}
