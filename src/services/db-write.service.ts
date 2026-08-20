import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  type DocumentReference,
  runTransaction,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import {
  EFT_HOLD_HOURS,
  LISTING_KIND_IDS,
  ONLINE_HOLD_MINUTES,
  ORDER_PAYMENT_METHOD_IDS,
  ORDER_STATUS_IDS,
  STATUS_IDS,
} from '#/lib/app-data'
import { COLLECTIONS, DBTABLES, fsStorage, fsStore } from '#/lib/firebase'
import type { Listing } from '#/types/auction'
import type { EdNotification } from '#/types/core/notification'
import type { EdOrder } from '#/types/order'
import type { EdTransaction } from '#/types/transaction'
import type { EdUser } from '#/types/user'

// firestore rejects undefined values, so a cleared field is left out on create
// and removed from the document on update
function forWrite(data: any, isUpdate?: boolean): any {
  return Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) => {
      if (value !== undefined) return [[key, value]]
      return isUpdate ? [[key, deleteField()]] : []
    }),
  )
}

class DbWrite {
  createUser(user: EdUser): Promise<void> {
    return setDoc(doc(fsStore, `${DBTABLES.user}/${user.uid}`), user)
  }
  updateUser(update: EdUser) {
    return updateDoc(doc(fsStore, `${DBTABLES.user}/${update.uid}`), {
      ...update,
    })
  }

  // AUCTION CRUD
  createAuction(auction: Listing) {
    return addDoc(COLLECTIONS.auction, forWrite(auction))
  }
  updateAuction(update: Listing) {
    return updateDoc(
      doc(fsStore, `${DBTABLES.auction}/${update.id}`),
      forWrite(update, true),
    )
  }
  deleteAuction(id: string) {
    return deleteDoc(doc(fsStore, `${DBTABLES.auction}/${id}`))
  }
  // END :: AUCTION CRUD

  // ORDER CRUD
  /**
   * Atomically reserves a buy-now listing for a buyer and opens the order that
   * owns the claim. Firestore retries the transaction when the listing changed
   * under us, so only one of several concurrent buyers can ever win the claim.
   */
  claimListing(params: {
    listingId: string
    buyerUid: string
    paymentMethod: string
  }): Promise<string> {
    return runTransaction(fsStore, async (tx) => {
      const listingRef = doc(fsStore, `${DBTABLES.auction}/${params.listingId}`)
      const snap = await tx.get(listingRef)
      if (!snap.exists()) throw new Error('This listing no longer exists')

      const listing: any = snap.data()
      if (listing.kind !== LISTING_KIND_IDS.buyNow) {
        throw new Error('This listing is not a buy now listing')
      }
      if (listing.uid === params.buyerUid) {
        throw new Error('You cannot buy your own listing')
      }

      const now = Date.now()
      const holdLapsed =
        !listing.holdExpiresAt || listing.holdExpiresAt.toMillis() <= now
      const isClaimable =
        listing.status === STATUS_IDS.published ||
        (listing.status === STATUS_IDS.reserved && holdLapsed)
      if (!isClaimable) {
        throw new Error('This listing is no longer available')
      }

      const holdMs =
        params.paymentMethod === ORDER_PAYMENT_METHOD_IDS.eft
          ? EFT_HOLD_HOURS * 60 * 60 * 1000
          : ONLINE_HOLD_MINUTES * 60 * 1000
      const expiresAt = new Date(now + holdMs)
      const orderRef = doc(COLLECTIONS.order)

      const order: EdOrder = {
        listingId: params.listingId,
        listingTitle: listing.title,
        listingCover: listing.cover,
        sellerUid: listing.uid,
        buyerUid: params.buyerUid,
        amount: listing.price,
        status: ORDER_STATUS_IDS.pendingPayment,
        paymentMethod: params.paymentMethod,
        createdAt: new Date(),
        expiresAt,
      }

      tx.set(orderRef, forWrite(order))
      tx.update(listingRef, {
        status: STATUS_IDS.reserved,
        buyerUid: params.buyerUid,
        orderId: orderRef.id,
        holdExpiresAt: expiresAt,
      })
      return orderRef.id
    })
  }

  /** Returns a reserved listing to the market and closes its pending order. */
  async releaseListingReservation(params: {
    listingId: string
    orderId: string
    status: ORDER_STATUS_IDS.cancelled | ORDER_STATUS_IDS.expired
    cancelledBy?: string
    cancelReason?: string
  }) {
    await updateDoc(doc(fsStore, `${DBTABLES.order}/${params.orderId}`), {
      status: params.status,
      cancelledAt: new Date(),
      ...(params.cancelledBy ? { cancelledBy: params.cancelledBy } : {}),
      ...(params.cancelReason ? { cancelReason: params.cancelReason } : {}),
    })
    await updateDoc(doc(fsStore, `${DBTABLES.auction}/${params.listingId}`), {
      status: STATUS_IDS.published,
      buyerUid: deleteField(),
      orderId: deleteField(),
      holdExpiresAt: deleteField(),
    })
  }

  submitEftProof(
    orderId: string,
    proof: { eftReference: string; eftProofUrl?: string },
  ) {
    return updateDoc(doc(fsStore, `${DBTABLES.order}/${orderId}`), {
      ...forWrite(proof),
      status: ORDER_STATUS_IDS.awaitingEftConfirmation,
      eftSubmittedAt: new Date(),
      updatedAt: new Date(),
    })
  }

  /** Marks an order paid and its listing sold, guarding against double confirms. */
  markOrderPaid(params: {
    orderId: string
    listingId: string
    confirmedBy?: string
    paystackRef?: string
    paystackVerifiedAt?: Date
  }) {
    return runTransaction(fsStore, async (tx) => {
      const orderRef = doc(fsStore, `${DBTABLES.order}/${params.orderId}`)
      const snap = await tx.get(orderRef)
      if (!snap.exists()) throw new Error('This order no longer exists')
      if (snap.data().status === ORDER_STATUS_IDS.paid) return

      const now = new Date()
      tx.update(orderRef, {
        status: ORDER_STATUS_IDS.paid,
        updatedAt: now,
        ...(params.confirmedBy
          ? { confirmedBy: params.confirmedBy, confirmedAt: now }
          : {}),
        ...(params.paystackRef ? { paystackRef: params.paystackRef } : {}),
        ...(params.paystackVerifiedAt
          ? { paystackVerifiedAt: params.paystackVerifiedAt }
          : {}),
      })
      tx.update(doc(fsStore, `${DBTABLES.auction}/${params.listingId}`), {
        status: STATUS_IDS.concludedSold,
        soldAt: now,
        holdExpiresAt: deleteField(),
      })
    })
  }
  // END :: ORDER CRUD

  // Transaction CRUD
  createTransaction(transaction: EdTransaction) {
    return addDoc(COLLECTIONS.transaction, transaction)
  }
  updateTransaction(update: Partial<EdTransaction>) {
    return updateDoc(doc(fsStore, `${DBTABLES.transaction}/${update.id}`), {
      ...update,
    })
  }
  deleteTransaction(id: string) {
    return deleteDoc(doc(fsStore, `${DBTABLES.transaction}/${id}`))
  }
  // END :: Transaction CRUD

  createNotification(
    uid: string,
    note: EdNotification,
  ): Promise<DocumentReference> {
    return addDoc(
      collection(fsStore, `${DBTABLES.user}/${uid}/${DBTABLES.notification}`),
      { ...note },
    )
  }

  markNotificationsRead(uid: string, notes: EdNotification[]) {
    const batch = writeBatch(fsStore)
    notes.forEach((element) => {
      batch.update(
        doc(
          fsStore,
          `${DBTABLES.user}/${uid}/${DBTABLES.notification}/${element.id}`,
        ),
        {
          read: true,
        },
      )
    })

    return batch.commit()
  }

  deleteFile(url?: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject({ message: 'File address empty' })
        return
      }
      const rf = ref(fsStorage, url)
      return deleteObject(rf).then(resolve, reject)
    })
  }
}

const dbWrite = new DbWrite()
export default dbWrite
