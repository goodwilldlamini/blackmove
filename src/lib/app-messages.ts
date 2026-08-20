import { APP_NAME } from './constants'

export const APP_MESSAGES = {
  button: {
    alertConfirm: 'Yes, continue',
    alertCancel: 'No, cancel',
  },
  empty: {
    transactions: `Your ${APP_NAME} transactions will appear here`,
    bids: '0 bids. Use the button above to place a bid',
  },
  form: {
    fieldRequired: 'This field is required',
    helper: {
      addressPrivacy: 'Your street address will not be shared publicly',
    },
  },
  error: {
    noCloseDate:
      'Please edit your auction and indicate a close date before you can publish',
  },
  alert: {
    confirm: {
      cancelTransaction: `Are you sure you wish to cancel the transaction?`,
      requestRefund: `Are you sure you'd like to get a reund of your deposit? Please note, standard processing fees apply.`,
    },
    success: {
      depositRefundRequested: `Refund requested. We'll notify you when your refund is processed`,
      depositPaid:
        'Thank you for placing your deposit - you can start placing bids on any live auction now',
    },
    title: {
      cancelTransaction: 'cancel transaction',
      requestRefund: 'Request refund',
      deleteAuction: 'Delete auction',
      publishAuction: 'Publish auction',
    },
    publishAuction:
      'This will open up your auction to the public and start accepting bids. Do you wish to continue?',
    deleteAuction:
      'Are you sure you wish to delete this auction from your records? The action is irreversible',
  },
  toast: {
    info: {
      transactionCancelled: 'Transaction cancelled',
    },
    error: {
      durationMissing: 'Please specify a duration for your auction',
      accountInactive:
        'Your account is not verified yet, you may not publish an auction',
    },
    success: {
      profileUpdated: 'Profile updated',
      bidPlaced: `Bid placed successfully`,
      refundCancelled: 'Refund request cancelled',
    },
    warning: {
      activeBidCantRefund: `You currently hold the highest bid on an auction, we may not process your refund.`,
    },
    auctionPublished: 'Auction published',
    auctionDeleted: 'Auction deleted',
  },
}
