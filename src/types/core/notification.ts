export interface EdNotification {
  id?: string
  type: NotificationType
  read?: boolean
  createdAt?: Date
  // optional fields
  link?: string
  auctionId?: string
  auctionTitle?: string
}

export interface NotificationInfo {
  desc: string
  title?: string
}

export enum NotificationType {
  accountVerification = '0',
  accountDeVerification = '1',
  newHigherBid = '2',
  auctionClosedLost = '3',
  auctionClosedWon = '4',
  auctionClosedSold = '5',
  auctionClosedNotSold = '6',
  depositSettlement = '7',
}

export const NOTIFICATIONS: {
  [key in NotificationType as string]: NotificationInfo
} = {
  [NotificationType.accountVerification]: {
    title: 'account activated',
    desc: 'Your account has been activated - You may start transacting on LivestockAuctions',
  },
  [NotificationType.accountDeVerification]: {
    title: 'account unverified',
    desc: 'Your account verification has been revoked - Your activity has been paused',
  },
  [NotificationType.newHigherBid]: {
    title: 'New Higher Bid',
    desc: `A new bid just came in for `,
  },
  [NotificationType.auctionClosedLost]: {
    title: 'Auction closed',
    desc: `This auction has closed and your bid did not win`,
  },
  [NotificationType.auctionClosedWon]: {
    title: 'Auction closed',
    desc: `Congratulations! This auction has closed and your bid won `,
  },
  [NotificationType.depositSettlement]: {
    title: 'Deposit refunded',
    desc: `Your deposit has been refunded, please allow for 3-5 working days for it to reflect`,
  },
}
