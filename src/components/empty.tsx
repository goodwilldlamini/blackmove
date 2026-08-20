import { Inbox } from 'lucide-react'

export function EmptyWidget({ text }: { text: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-16 text-center">
      <Inbox className="size-10 text-muted-foreground" />
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
