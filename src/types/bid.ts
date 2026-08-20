import type { EdUser } from './user'

export interface Bid {
  [key: string]: any
  amount: number
  createdAt: Date
  user: EdUser // uid, name, phone, photo, email
  uid?: string
}
