export const APP_NAME = 'LivestockAuctions'
export const INSPECTION_COST = 150

export const colors = {
  primary: '#193D32',
  primaryDark: '#629058',
  primaryLight: '#EDFDFD',
  error: '#BA0252',
  errorLight: '#FBC9DF',
  success: '#06d6a0',
  successDark: '#04A67B',
  successLight: '#DEFBF3',
  warning: '#DA6303',
  warningLight: '#FDF2D7D7',
  info: '#3a86ff',
  infoLight: '#C6DBFD',
  accent: '#5E01C9',
  accentLight: '#C6A6F4',
  text: '#073b4c',
  whiteAlpha: {
    900: 'RGBA(255, 255, 255, 0.92)',
    800: 'RGBA(255, 255, 255, 0.80)',
    700: 'RGBA(255, 255, 255, 0.64)',
    600: 'RGBA(255, 255, 255, 0.48)',
  },
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
  },
}

export const UI_CONST = {
  border: `1px solid ${colors.gray[200]}`,
  navHeight: 24,
  dashBg: colors.gray[50],
  headingFont: 'Fraunces',
  inputFont: 'Manrope',
  inputColor: colors.gray[600],
  font: 'Manrope',
  transition: '0.5s all ease',
}

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
