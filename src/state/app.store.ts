import { create } from 'zustand'

type AppStoreModel = {
  isLoading: boolean
  isMobileNavOpen: boolean
  isNotificationsOpen: boolean
  // true once the initial Firebase onAuthStateChanged callback has fired at
  // least once (client-side only). Route guards must wait for this before
  // redirecting, since `userStore.user` is legitimately null both before
  // hydration and while Firebase is still resolving.
  authChecked: boolean

  setIsMobileNavOpen: (newVal: boolean) => void
  setIsNotificationsOpen: (newVal: boolean) => void
  setLoading: (isLoading: boolean) => void
  setAuthChecked: (authChecked: boolean) => void

  // search params
  searchArg: string
  searchSex: string
  searchProvince: string
  searchCategory: string
  searchBreedType: string
  searchProdSystem: string[]
  searchKind: string
}

export const appStore = create<AppStoreModel>((set) => ({
  searchArg: '',
  searchProvince: '',
  searchCategory: '',
  searchSex: '',
  searchBreedType: '',
  searchProdSystem: [],
  searchKind: '',
  isLoading: false,
  isNotificationsOpen: false,
  isMobileNavOpen: false,
  authChecked: false,
  setIsMobileNavOpen(isMobileNavOpen) {
    set({ isMobileNavOpen })
  },
  setIsNotificationsOpen(isNotificationsOpen) {
    set({ isNotificationsOpen })
  },
  setLoading(isLoading) {
    set({ isLoading })
  },
  setAuthChecked(authChecked) {
    set({ authChecked })
  },
}))
