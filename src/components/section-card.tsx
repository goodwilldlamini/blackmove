import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function SectionIconChip({
  icon: Icon,
  size = 'md',
  className,
}: {
  icon: LucideIcon
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ${
        size === 'sm' ? 'size-7 sm:size-8' : 'size-9 sm:size-10'
      } ${className || ''}`}
    >
      <Icon className={size === 'sm' ? 'size-3.5' : 'size-4 sm:size-[18px]'} />
    </div>
  )
}

export function SectionCard({
  title,
  icon,
  rightElement,
  height,
  variant = 'card',
  children,
}: {
  title: string
  icon: LucideIcon
  rightElement?: ReactNode
  height?: string
  /**
   * `card` is the boxed treatment used across the dashboard and wizard.
   * `plain` drops the box and icon chip for a heading over a hairline rule —
   * the section rhythm used on the public listing detail page.
   */
  variant?: 'card' | 'plain'
  children: ReactNode
}) {
  if (variant === 'plain') {
    return (
      <section
        className={`flex w-full flex-col items-start gap-4 border-t border-border pt-6 ${height || ''}`}
      >
        <div className="flex w-full items-center gap-3">
          <h2 className="display-title flex-1 text-xl font-bold capitalize">
            {title}
          </h2>
          {rightElement}
        </div>
        {children}
      </section>
    )
  }

  return (
    <div
      className={`w-full rounded-none border-0 bg-card p-4 shadow-none sm:rounded-xl sm:border sm:p-6 ${height || ''}`}
    >
      <div className="flex h-full w-full flex-col items-start gap-3 sm:gap-4">
        <div className="flex w-full items-center gap-3">
          <SectionIconChip icon={icon} />
          <h3 className="flex-1 text-sm font-semibold capitalize sm:text-base">
            {title}
          </h3>
          {rightElement}
        </div>
        <hr className="w-full border-border" />
        {children}
      </div>
    </div>
  )
}
