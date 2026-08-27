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
  // no label — render as a circular chip, which is how it sits over a cover image
  const isIconOnly = !text

  return (
    <Button
      variant={isIconOnly ? 'ghost' : 'secondary'}
      size={isIconOnly ? 'icon-sm' : 'sm'}
      onClick={onClick}
      aria-label={isIconOnly ? 'save listing' : undefined}
      className={cn(
        'gap-1.5 shadow-none',
        isIconOnly &&
          'bg-background/90 backdrop-blur-sm hover:bg-background',
        className,
      )}
    >
      <Icon className="size-4" />
      {text && <span className="capitalize">{text}</span>}
    </Button>
  )
}
