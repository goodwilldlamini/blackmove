import type { DocumentSnapshot } from 'firebase/firestore'
import { LISTING_KIND_IDS } from '#/lib/app-data'
import type { Listing } from '#/types/auction'
import type { EdNotification } from '#/types/core/notification'
import type { EdOrder } from '#/types/order'
import type { EdTransaction } from '#/types/transaction'
import type { EdUser } from '#/types/user'

export const MODEL_CONV = {
  notification: (snap: DocumentSnapshot): EdNotification => {
    const data: any = snap.data()
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      id: snap.id,
    }
  },
  transaction: (snap: DocumentSnapshot): EdTransaction => {
    const data: any = snap.data()
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      id: snap.id,
    }
  },
  user: (snap: DocumentSnapshot): EdUser | null => {
    if (!snap.exists()) return null
    const data: any = snap.data()
    return {
      ...data,
      uid: snap.id,
      firstname: data.name.split(' ')[0],
      lastname: data.name.split(' ')[1],
      likes: data.likes ? data.likes : [],
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      transactions: data.transactions
        ? (data.transactions as any[]).map((transaction) => ({
            ...transaction,
            createdAt: transaction.createdAt.toDate(),
          }))
        : [],
      payoutMethods: data.payoutMethods
        ? (data.payoutMethods as any[]).map((method) => ({
            ...method,
            createdAt: method.createdAt.toDate(),
          }))
        : [],
      deposit: data.deposit
        ? {
            ...data.deposit,
            createdAt: data.deposit.createdAt.toDate(),
            updatedAt: data.deposit.updatedAt
              ? data.deposit.updatedAt.toDate()
              : null,
          }
        : null,
    }
  },

  auction: (snap: DocumentSnapshot): Listing | null => {
    if (!snap.exists()) return null
    const data: any = snap.data()
    return {
      ...data,
      id: snap.id,
      // listings created before buy-now existed carry no kind
      kind: data.kind ?? LISTING_KIND_IDS.auction,
      likes: data.likes || [],
      createdAt: data.createdAt.toDate(),
      bids: data.bids
        ? (data.bids as any[]).map((bid) => ({
            ...bid,
            createdAt: bid.createdAt.toDate(),
          }))
        : [],
      lastBid: data.lastBid
        ? { ...data.lastBid, createdAt: data.lastBid.createdAt.toDate() }
        : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      closeDate: data.closeDate ? data.closeDate.toDate() : null,
      holdExpiresAt: data.holdExpiresAt ? data.holdExpiresAt.toDate() : null,
      soldAt: data.soldAt ? data.soldAt.toDate() : null,
    }
  },

  order: (snap: DocumentSnapshot): EdOrder => {
    const data: any = snap.data()
    return {
      ...data,
      id: snap.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      expiresAt: data.expiresAt ? data.expiresAt.toDate() : null,
      eftSubmittedAt: data.eftSubmittedAt ? data.eftSubmittedAt.toDate() : null,
      confirmedAt: data.confirmedAt ? data.confirmedAt.toDate() : null,
      cancelledAt: data.cancelledAt ? data.cancelledAt.toDate() : null,
      paystackVerifiedAt: data.paystackVerifiedAt
        ? data.paystackVerifiedAt.toDate()
        : null,
    }
  },
}
