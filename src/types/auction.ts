import type { FieldValue } from 'firebase/firestore'
import type { Bid } from './bid'

export type AuctionDuration = {
  days?: number
  hours?: number
  minutes?: number
}

export interface Listing {
  kind?: string // LISTING_KIND_IDS - absent on legacy docs, read as `auction`
  status?: number // STATUS_IDS
  closeDate?: Date
  createdAt?: Date
  updatedAt?: Date
  uid?: string
  cover?: string
  images?: string[]
  bids?: Bid[] | any
  winnerUid?: string
  id?: string
  inspectionPassed?: boolean
  likes?: string[] | any
  duration?: AuctionDuration
  title?: string
  price?: number // fixed price on buy-now listings, minimum acceptable bid on auctions
  minBid?: number // minimum acceptable bid
  startBid?: number
  // details
  age?: number
  quantity?: number
  sex?: string
  weight?: number
  category?: string
  breedType?: string
  breed?: string
  breed2?: string
  ageClass?: string

  // multiselect
  prodSystems?: string[]
  vaccines?: string[]
  lastBid?: Bid
  town?: string
  province?: string
  address?: any
  desc?: string

  bidUids?: string[] | FieldValue // uids of all users that have placed a bid

  // buy-now purchase tracking
  buyerUid?: string // set once a buy-now purchase is claimed
  orderId?: string // the orders/{id} doc holding the current claim
  holdExpiresAt?: Date // reservation hold expiry, mirrored from the order
  soldAt?: Date // set when the owning order reaches `paid`
}
