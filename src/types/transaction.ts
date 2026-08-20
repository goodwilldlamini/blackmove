export interface EdTransaction {
  amount: number
  id?: string
  ref?: any
  uid?: string
  status?: string
  createdAt: Date
  type: string
  auctionId?: string
  auctionTitle?: string
}
