import { create } from 'zustand'
import { STATUS_IDS } from '#/lib/app-data'
import type { Listing } from '#/types/auction'
import type { EdFile } from '#/types/file'
import type { PayoutMethod } from '#/types/payout-method'
import type { EdUser } from '#/types/user'

type TempStoreModel = {
  tempAuction: Listing
  tempUser: EdUser
  tempMethod: PayoutMethod
  tempFiles: EdFile[]
  addTempFiles: (files: EdFile[]) => void
  setTempFiles: (files: EdFile[]) => void
  updateTempMethod: (update: PayoutMethod) => void
  updateTempUser: (update: EdUser) => void
  updateTempAuction: (update: Listing) => void
}

export const DEFAULT_VALUES: {
  auction: Listing
  user: EdUser
  method: PayoutMethod
} = {
  user: {
    hasBusiness: false,
  },
  auction: {
    status: STATUS_IDS.saved,
  },
  method: {},
}

export const tempStore = create<TempStoreModel>((set) => ({
  tempMethod: {},
  tempFiles: [],
  tempAuction: DEFAULT_VALUES.auction,
  tempUser: DEFAULT_VALUES.user,
  addTempFiles(files) {
    set((state) => ({ tempFiles: [...state.tempFiles, ...files] }))
  },
  setTempFiles(files) {
    set((state) => ({ ...state, tempFiles: files }))
  },
  updateTempAuction(update) {
    set((state) => ({ tempAuction: { ...state.tempAuction, ...update } }))
  },
  updateTempUser(update) {
    set((state) => ({ tempUser: { ...state.tempUser, ...update } }))
  },
  updateTempMethod(update) {
    set((state) => ({ tempMethod: { ...state.tempMethod, ...update } }))
  },
}))
