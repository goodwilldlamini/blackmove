import type { Unsubscribe } from 'firebase/firestore'
import { USER_TYPE_IDS } from '#/lib/app-data'
import { mainStore } from '#/state/main.store'
import { publicStore } from '#/state/public.store'
import { userStore } from '#/state/user.store'
import { dbRead } from './db-read.service'

class DbService {
  subscriptions: Unsubscribe[] = []
  userSubscriptions: Unsubscribe[] = []
  auctionSubscription: Unsubscribe | undefined

  constructor() {
    this.listenToGlobalData()
  }

  unsubAuction() {
    if (this.auctionSubscription) {
      this.auctionSubscription()
    }
  }

  listentoAuction(id: string) {
    this.auctionSubscription = dbRead.listenToAuction(id, (newItem) => {
      if (newItem) {
        publicStore.setState({ currentAuction: newItem })
      }
    })
  }

  // USER DATA
  listenToUserData() {
    const user = userStore.getState().user
    if (!user) return
    const userSub = dbRead.listenToUser(user.uid!, (userData) => {
      if (userData) {
        userStore.setState({ user: userData, userDataReady: true })
        localStorage.setItem('user', JSON.stringify(userData))
      }
    })

    const auctionsSub = dbRead.listenToUserAuctions(
      user.uid!,
      (myAuctions) => {
        userStore.setState({ myAuctions })
      },
    )

    const notificationsSub = dbRead.listenToUserNotifications(
      user.uid!,
      (notifications) => {
        userStore.setState({ notifications })
      },
    )
    const transactionsSub = dbRead.listenToUserTransactions(
      user.uid!,
      (myTransactions) => {
        userStore.setState({ myTransactions })
      },
    )

    const bidAuctionsSub = dbRead.listenToBidAuctions(
      user.uid!,
      (bidAuctions) => {
        userStore.setState({ bidAuctions })
      },
    )
    const savedAuctionsSub = dbRead.listenToSavedAuctions(
      user.uid!,
      (savedAuctions) => {
        userStore.setState({ savedAuctions })
      },
    )
    const purchaseOrdersSub = dbRead.listenToPurchaseOrders(
      user.uid!,
      (myPurchaseOrders) => {
        userStore.setState({ myPurchaseOrders })
      },
    )
    const saleOrdersSub = dbRead.listenToSaleOrders(
      user.uid!,
      (mySaleOrders) => {
        userStore.setState({ mySaleOrders })
      },
    )
    this.userSubscriptions = [
      userSub,
      auctionsSub,
      notificationsSub,
      bidAuctionsSub,
      savedAuctionsSub,
      transactionsSub,
      purchaseOrdersSub,
      saleOrdersSub,
    ]

    // listen to admin data
    if (user.type === USER_TYPE_IDS.admin) {
      const usersSub = dbRead.listenToUsers((users) => {
        mainStore.setState({ users })
      })
      const auctionsSub = dbRead.listenToAllAuctions((auctions) => {
        mainStore.setState({ auctions })
      })
      const adminTransactionsSub = dbRead.listenToAllTransactions(
        (transactions) => {
          mainStore.setState({ transactions })
        },
      )
      const adminOrdersSub = dbRead.listenToAllOrders((orders) => {
        mainStore.setState({ orders })
      })

      this.userSubscriptions = [
        ...this.userSubscriptions,
        usersSub,
        auctionsSub,
        adminTransactionsSub,
        adminOrdersSub,
      ]
    }
  }
  // END :: USER DATA

  listenToGlobalData() {
    const auctionsSub = dbRead.listenToLiveAuctions((liveAuctions) => {
      publicStore.setState({ liveAuctions })
    })

    this.subscriptions = [auctionsSub]
  }

  unsubscribe() {
    ;[...this.subscriptions, ...this.userSubscriptions].forEach((sub) =>
      sub(),
    )
  }
  unsubscribeUser() {
    ;[...this.userSubscriptions].forEach((sub) => sub())
    userStore.setState({ userDataReady: false })
  }
}

export const dbService = new DbService()
