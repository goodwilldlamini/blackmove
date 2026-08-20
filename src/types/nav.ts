import type { ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id?: string
  icon?: LucideIcon
  element?: ReactElement
  title?: string
  children?: NavItem[]
  onClick?: () => void
  route: string
}
