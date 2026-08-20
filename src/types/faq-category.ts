import type { QANDAItem } from './q-and-a-item'

export interface FAQCategory {
  faqs: QANDAItem[]
  id: string
  label: string
}
