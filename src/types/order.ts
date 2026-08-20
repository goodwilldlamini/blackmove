export interface EdOrder {
  id?: string
  listingId: string
  listingTitle?: string
  listingCover?: string
  sellerUid: string
  buyerUid: string
  amount: number // snapshot of the listing price at claim time
  status: string // ORDER_STATUS_IDS
  paymentMethod: string // ORDER_PAYMENT_METHOD_IDS

  // online (paystack)
  paystackRef?: string
  paystackVerifiedAt?: Date // only set once verified server side

  // offline (eft)
  eftReference?: string
  eftProofUrl?: string
  eftSubmittedAt?: Date

  confirmedBy?: string // uid of the seller/admin that confirmed payment
  confirmedAt?: Date
  cancelledBy?: string
  cancelledAt?: Date
  cancelReason?: string

  createdAt: Date
  updatedAt?: Date
  expiresAt?: Date // reservation hold expiry
}
