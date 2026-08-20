export interface UserDeposit {
  createdAt?: Date
  updatedAt?: Date
  amount?: number
  uid?: string
  payoutId?: string
  ref?: any
  shouldRefund?: boolean
  isProcessed?: boolean
}
