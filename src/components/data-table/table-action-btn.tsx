import type { LucideIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function TableAction({
  icon: Icon,
  onClick,
  tooltip,
  variant = 'ghost',
}: {
  icon: LucideIcon
  onClick: () => void
  tooltip?: string
  variant?: 'ghost' | 'outline' | 'default' | 'destructive' | 'secondary'
}) {
  return (
    <Button
      size="icon"
      variant={variant}
      className="shadow-none"
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip || 'action'}
    >
      <Icon />
    </Button>
  )
}
