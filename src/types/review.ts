export interface EdReview {
  reviewer?: { name: string; photoURL: string; email: string; phone: string }
  reviewerUid?: string
  text?: string
  uid?: string
  lotId?: string
  id?: string
  createdAt: Date
  updatedAt: Date
  rating: number
}
