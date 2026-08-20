import { create } from 'zustand'
import type { Listing } from '#/types/auction'
import type { EdUser } from '#/types/user'

type PublicStoreModel = {
  liveAuctions: Listing[]
  setAuctions: (auction: Listing) => void
  seller: EdUser | null
  setSeller: (seller: EdUser) => void
  currentAuction: Listing | undefined
  setCurrentAuction: (currentAuction: Listing) => void
}

export const publicStore = create<PublicStoreModel>((set) => ({
  seller: null,
  setSeller(seller) {
    set({ seller })
  },
  liveAuctions: [],
  setAuctions(auction) {
    set((state) => ({ liveAuctions: [...state.liveAuctions, auction] }))
  },
  currentAuction: undefined,
  setCurrentAuction(currentAuction) {
    set({ currentAuction })
  },
}))
