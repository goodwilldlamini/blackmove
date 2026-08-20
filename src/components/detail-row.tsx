import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { SectionIconChip } from './section-card'

export function DetailRow({
  label,
  value,
  icon,
  showDivider = true,
}: {
  label: string
  value?: ReactNode
  icon?: LucideIcon
  showDivider?: boolean
}) {
  return (
    <div
      className={`flex w-full items-center gap-2 py-2.5 sm:gap-3 sm:py-3 ${
        showDivider ? 'border-b border-gray-100' : ''
      }`}
    >
      {icon && <SectionIconChip icon={icon} size="sm" />}
      <span className="flex-1 truncate text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </span>
      <span className="text-right text-xs font-bold capitalize sm:text-sm">
        {value ?? '—'}
      </span>
    </div>
  )
}
