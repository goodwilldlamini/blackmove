import { create } from 'zustand'
import type { Listing } from '#/types/auction'
import type { EdNotification } from '#/types/core/notification'
import type { Inspection } from '#/types/inspection'
import type { EdOrder } from '#/types/order'
import type { EdTransaction } from '#/types/transaction'
import type { EdUser } from '#/types/user'

type UserStoreModel = {
  user: EdUser | null
  myAuctions: Listing[] // sellers
  bidAuctions: Listing[] // buyers
  myInspections: Inspection[]
  isAuth: boolean
  savedAuctions: Listing[]
  notifications: EdNotification[]
  myTransactions: EdTransaction[]
  myPurchaseOrders: EdOrder[] // buyers
  mySaleOrders: EdOrder[] // sellers
  // true once the live Firestore user-document listener has delivered its
  // first snapshot, i.e. `user` reflects the authoritative record rather
  // than just the localStorage cache set by AuthListener on sign-in.
  userDataReady: boolean
}

export const userStore = create<UserStoreModel>((_set, get) => ({
  user: null,
  savedAuctions: [],
  notifications: [],
  myTransactions: [],
  isAuth: Boolean(get()?.user),
  myInspections: [],
  myAuctions: [],
  bidAuctions: [],
  myPurchaseOrders: [],
  mySaleOrders: [],
  userDataReady: false,
}))
