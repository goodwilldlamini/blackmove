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
  children,
}: {
  title: string
  icon: LucideIcon
  rightElement?: ReactNode
  height?: string
  children: ReactNode
}) {
  return (
    <div
      className={`w-full rounded-none border-0 bg-white p-4 shadow-none sm:rounded-3xl sm:border sm:p-6 sm:shadow-sm ${height || ''}`}
    >
      <div className="flex h-full w-full flex-col items-start gap-3 sm:gap-4">
        <div className="flex w-full items-center gap-3">
          <SectionIconChip icon={icon} />
          <h3 className="flex-1 text-sm font-semibold capitalize sm:text-base">
            {title}
          </h3>
          {rightElement}
        </div>
        <hr className="w-full border-gray-100" />
        {children}
      </div>
    </div>
  )
}
