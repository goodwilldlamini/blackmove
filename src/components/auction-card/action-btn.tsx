import type { LucideIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export function ActionIconButton({
  icon: Icon,
  onClick,
  text,
  className,
}: {
  icon: LucideIcon
  onClick: () => void
  text: string
  className?: string
}) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      className={cn('gap-1.5 shadow-none', className)}
    >
      <Icon className="size-4" />
      {text && <span className="capitalize">{text}</span>}
    </Button>
  )
}
