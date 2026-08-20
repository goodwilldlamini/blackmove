import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { COLLECTIONS, DBTABLES, fsStore, QUERIES } from '#/lib/firebase'
import type { Listing } from '#/types/auction'
import type { EdNotification } from '#/types/core/notification'
import type { EdOrder } from '#/types/order'
import type { EdTransaction } from '#/types/transaction'
import type { EdUser } from '#/types/user'
import { MODEL_CONV } from './db/model-conv'

class DbRead {
  // USER DATA LISTENERS
  listenToUser(uid: string, calback: (usr: EdUser | null) => void) {
    return onSnapshot(doc(fsStore, `${DBTABLES.user}/${uid}`), (snap) => {
      calback(MODEL_CONV.user(snap))
    })
  }
  listenToUsers(calback: (usrs: EdUser[]) => void) {
    return onSnapshot(QUERIES.users, (snap) => {
      calback(snap.docs.map((snap) => MODEL_CONV.user(snap)!))
    })
  }
  listenToAuction(id: string, calback: (auction: Listing | null) => void) {
    return onSnapshot(doc(fsStore, `${DBTABLES.auction}/${id}`), (snap) => {
      calback(MODEL_CONV.auction(snap))
    })
  }
  listenToUserAuctions(uid: string, calback: (auctions: Listing[]) => void) {
    return onSnapshot(QUERIES.myAuctions(uid), (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.auction(snap)!))
    })
  }
  listenToSavedAuctions(uid: string, calback: (auctions: Listing[]) => void) {
    return onSnapshot(QUERIES.savedAuctions(uid), (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.auction(snap)!))
    })
  }
  listenToUserNotifications(
    uid: string,
    calback: (notes: EdNotification[]) => void,
  ) {
    return onSnapshot(QUERIES.myNotifications(uid), (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.notification(snap)!))
    })
  }
  listenToUserTransactions(
    uid: string,
    calback: (notes: EdTransaction[]) => void,
  ) {
    return onSnapshot(QUERIES.myTransactions(uid), (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.transaction(snap)!))
    })
  }
  listenToBidAuctions(uid: string, calback: (auctions: Listing[]) => void) {
    return onSnapshot(QUERIES.bidAuctions(uid), (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.auction(snap)!))
    })
  }
  listenToAllAuctions(calback: (auctions: Listing[]) => void) {
    return onSnapshot(COLLECTIONS.auction, (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.auction(snap)!))
    })
  }
  listenToAllTransactions(calback: (transactions: EdTransaction[]) => void) {
    return onSnapshot(COLLECTIONS.transaction, (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.transaction(snap)!))
    })
  }
  listenToPurchaseOrders(uid: string, calback: (orders: EdOrder[]) => void) {
    return onSnapshot(QUERIES.myPurchaseOrders(uid), (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.order(snap)))
    })
  }
  listenToSaleOrders(uid: string, calback: (orders: EdOrder[]) => void) {
    return onSnapshot(QUERIES.mySaleOrders(uid), (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.order(snap)))
    })
  }
  listenToAllOrders(calback: (orders: EdOrder[]) => void) {
    return onSnapshot(COLLECTIONS.order, (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.order(snap)))
    })
  }
  listenToLiveAuctions(calback: (auctions: Listing[]) => void) {
    return onSnapshot(QUERIES.liveAuctions, (snapshot) => {
      calback(snapshot.docs.map((snap) => MODEL_CONV.auction(snap)!))
    })
  }
  // END :: USER DATA LISTENERS

  async getUserData(uid: string): Promise<EdUser | null> {
    const snap = await getDoc(doc(fsStore, `${DBTABLES.user}/${uid}`))
    return MODEL_CONV.user(snap)
  }
  async getAuctionData(id: string): Promise<Listing | null> {
    const snap = await getDoc(doc(fsStore, `${DBTABLES.auction}/${id}`))
    return MODEL_CONV.auction(snap)
  }
}

export const dbRead = new DbRead()
