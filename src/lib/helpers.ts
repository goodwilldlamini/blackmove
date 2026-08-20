import type { AuthError } from 'firebase/auth'
import { format } from 'date-fns'
import type { PaystackProps } from 'react-paystack/dist/types'
import {
  PROVINCES,
  TRANSACTION_STATUS_IDS,
  USER_TYPE_IDS,
  userTypes,
} from './app-data'
import { PAYSTACK_KEY } from './constants'
import type { Listing } from '#/types/auction'
import type { EdTransaction } from '#/types/transaction'
import type { EdUser } from '#/types/user'

export function capitalize(val: string | undefined): string {
  return val
    ? val.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1),
      )
    : ''
}

export function authErrorMessage(error: AuthError): string {
  let message: string
  if (!error.code) {
    return error.message
  }
  switch (error.code.toLowerCase()) {
    case 'auth/user-not-found':
      message = `We couldn't find a user with that email address, please check and try again`
      break
    case 'auth/popup-closed-by-user':
      message = `Popup closed`
      break
    case 'auth/popup-blocked':
      message = `Popup has been blocked, check connectivity`
      break
    case 'auth/user-disabled':
      message = `This account is disabled, please contact admin for details`
      break
    case 'auth/email-already-in-use':
      message = `This email is already in use by another account`
      break
    case 'auth/wrong-password':
      message = `Password or email is incorrect - please try again`
      break
    case 'auth/too-many-attempts':
      message = `Too many attempts`
      break
    case 'auth/too-many-requests':
      message = `Too many requests`
      break

    default:
      message = error.message
      break
  }
  return message
}

export function dimBg(source: string, opacity?: number) {
  return `linear-gradient(rgba(0, 0, 0, ${opacity || 0.6}),rgba(0, 0, 0, ${
    opacity || 0.6
  })) , url(${source})`
}

export const userLabel = (user: EdUser | null) => {
  return userTypes.find((type) => type.value.toString() === user?.type)?.label
}

export const userColor = (user: EdUser): string => {
  let col: string
  switch (user.type) {
    case USER_TYPE_IDS.seller:
      col = 'teal'
      break
    case USER_TYPE_IDS.buyer:
      col = 'cyan'
      break
    case USER_TYPE_IDS.driver:
      col = 'purple'
      break
    case USER_TYPE_IDS.inspector:
      col = 'blue'
      break

    default:
      col = 'pink'
      break
  }

  return col
}

export const transactionColor = (transaction: EdTransaction): string => {
  let col: string
  switch (transaction.status) {
    case TRANSACTION_STATUS_IDS.pending:
      col = 'blue'
      break
    case TRANSACTION_STATUS_IDS.complete:
      col = 'teal'
      break

    default:
      col = 'pink'
      break
  }

  return col
}

export function dateFormat(date?: Date): string {
  return !date ? '' : format(date, 'EEE dd MMMM yyyy')
}

export function dateFormatTime(date?: Date): string {
  return !date ? '' : format(date, 'dd-MM, HH:mm')
}

export function currencyFormat(
  amount?: number | null,
  noCents?: boolean,
): string {
  if (!amount) {
    return ''
  }
  return `R ${amount.toFixed(noCents ? 0 : 2)}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ',',
  )
}

export function auctionLocation(auction?: Listing): string {
  if (!auction) return ''
  return `${auction.town}, ${
    PROVINCES.find((el) => el.value === auction.province)?.label
  }`
}

export function highBid(auction: Listing): string {
  return currencyFormat(
    auction.lastBid ? auction.lastBid.amount : auction.price,
  )
}

export function highBidAmount(auction: Listing): number {
  return auction.lastBid
    ? auction.lastBid.amount
    : auction.startBid
      ? auction.startBid
      : auction.price! * 0.8
}

export function payStackConfig(
  amount: number,
  user?: EdUser | null,
  ref_suffix?: string,
): PaystackProps {
  const now = new Date()
  if (!user) {
    return {
      email: '',
      publicKey: PAYSTACK_KEY,
      amount: amount * 100,
    }
  }

  return {
    reference: `${ref_suffix ? ref_suffix + '_' : ''}${user.uid}_${now
      .getTime()
      .toString()}`,
    email: user.email!,
    publicKey: PAYSTACK_KEY,
    amount: amount * 100,
    firstname: user.firstname!,
    lastname: user.lastname!,
    phone: user.phone || '',
    currency: 'ZAR',
  }
}

export function basicUserDetails(user: EdUser) {
  return {
    uid: user.uid,
    name: user.name,
    photoURL: user.photoURL || null,
    phone: user.phone || null,
    email: user.email,
  }
}
