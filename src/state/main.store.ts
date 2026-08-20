import { create } from 'zustand'
import type { Listing } from '#/types/auction'
import type { EdOrder } from '#/types/order'
import type { EdTransaction } from '#/types/transaction'
import type { EdUser } from '#/types/user'

type MainStoreModel = {
  users: EdUser[]
  auctions: Listing[]
  transactions: EdTransaction[]
  orders: EdOrder[]
}

export const mainStore = create<MainStoreModel>(() => ({
  users: [],
  transactions: [],
  auctions: [],
  orders: [],
}))
