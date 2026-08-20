import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  CollectionReference,
  collection,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { STATUS_IDS, USER_TYPE_IDS } from './app-data'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const fsStore = getFirestore(app)
export const fsStorage = getStorage(app)
export const fsAuth = getAuth(app)

export const DBTABLES = {
  user: 'users',
  auction: 'auctions',
  transaction: 'transactions',
  notification: 'notifications',
  order: 'orders',
}

export const COLLECTIONS: {
  [key in keyof typeof DBTABLES]: CollectionReference
} = Object.assign(
  {},
  ...Object.keys(DBTABLES).map((ky) => ({
    [ky]: collection(
      fsStore,
      Object.entries(DBTABLES).find((entry) => entry[0] === ky)![1],
    ),
  })),
)

export const QUERIES = {
  users: query(COLLECTIONS.user, where('type', '!=', USER_TYPE_IDS.admin)),
  liveAuctions: query(
    COLLECTIONS.auction,
    where('status', 'in', [
      STATUS_IDS.published,
      STATUS_IDS.concluded,
      STATUS_IDS.concludedSold,
    ]),
    orderBy('createdAt'),
  ),
  myAuctions: (uid?: string) =>
    query(COLLECTIONS.auction, where('uid', '==', uid), orderBy('createdAt')),
  savedAuctions: (uid: string) =>
    query(
      COLLECTIONS.auction,
      where('likes', 'array-contains', uid),
      orderBy('createdAt'),
    ),
  myNotifications: (uid?: string) =>
    query(
      collection(fsStore, `${DBTABLES.user}/${uid}/${DBTABLES.notification}`),
      orderBy('createdAt'),
    ),
  myTransactions: (uid?: string) =>
    query(
      COLLECTIONS.transaction,
      where('uid', '==', uid),
      orderBy('createdAt'),
    ),
  bidAuctions: (uid?: string) =>
    query(
      COLLECTIONS.auction,
      where('bidUids', 'array-contains', uid),
      orderBy('createdAt'),
    ),
  myPurchaseOrders: (uid?: string) =>
    query(COLLECTIONS.order, where('buyerUid', '==', uid), orderBy('createdAt')),
  mySaleOrders: (uid?: string) =>
    query(
      COLLECTIONS.order,
      where('sellerUid', '==', uid),
      orderBy('createdAt'),
    ),
}
