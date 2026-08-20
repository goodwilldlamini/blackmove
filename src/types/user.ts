import type { FieldValue } from 'firebase/firestore'
import type { UserDeposit } from './deposit'
import type { EdFile } from './file'
import type { PayoutMethod } from './payout-method'
import type { EdTransaction } from './transaction'

export interface EdUser {
  hasBusiness?: boolean
  // business details
  cName?: string
  cReg?: string
  likes?: string[] | any
  province?: string
  gender?: string
  name?: string
  uid?: string
  firstname?: string
  title?: string
  lastname?: string
  photoURL?: string
  setup?: boolean
  email?: string
  phone?: string
  verified?: boolean
  verification?: any // createdAt, by
  type?: string // 0->seller 1->buyer 2->inspector
  town?: string
  transactions?: EdTransaction[] | any
  deposit?: UserDeposit
  deposits?: UserDeposit[] | FieldValue // when a deposit is refunded or used after an auction, its saved here
  createdAt?: Date
  updatedAt?: Date
  payoutMethods?: PayoutMethod[]
  defaultPayout?: string
  documents?: EdFile[]
}
