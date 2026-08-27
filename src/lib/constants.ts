export const APP_NAME = 'LivestockSales'
export const INSPECTION_COST = 150

export const dashPrefix = '/dashboard'

// Reference mapping only — actual routing is handled by TanStack Router's file-based
// system. Kept for display/nav labels. `howItWorks`/`forgotPassword` are carried over
// from the old app but were never wired to a real route there either.
export const ROUTES = {
  home: '/',
  about: '/about',
  policies: '/policies',
  faq: '/faq',
  safety: '/safety',
  howItWorks: '/how-it-works',
  contact: '/contact',
  login: '/login',
  resetPassword: '/reset-password',
  auctions: '/auctions',
  viewAuction: '/auctions/:id',
  register: '/register',
  forgotPassword: '/forgot-password',
  // dash
  setup: `${dashPrefix}/setup`,
  dashHome: `${dashPrefix}/home`,
  profile: `${dashPrefix}/profile`,
  payouts: `${dashPrefix}/payouts`,
  myAuctions: `${dashPrefix}/my-auctions`,
  newAuction: `${dashPrefix}/my-auctions/new`,
  myOrders: `${dashPrefix}/orders`,
  bookmarks: `${dashPrefix}/bookmarks`,
  // ADMIN ROUTES
  users: `${dashPrefix}/users`,
  adminAuctions: `${dashPrefix}/auctions`,
}

export const DEPOSIT_AMOUNT = 50
export const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY as string
