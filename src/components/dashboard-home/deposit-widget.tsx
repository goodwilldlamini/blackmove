import { usePaystackPayment } from 'react-paystack'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '#/components/confirm-dialog'
import { Button } from '#/components/ui/button'
import { WatchButton } from '#/components/watch-button'
import { STATUS_IDS, TRANSACTION_STATUS_IDS, TRANSACTION_TYPE_IDS } from '#/lib/app-data'
import { APP_MESSAGES } from '#/lib/app-messages'
import { APP_NAME, DEPOSIT_AMOUNT } from '#/lib/constants'
import { payStackConfig } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'
import type { EdTransaction } from '#/types/transaction'

export function DepositWidget() {
  const user = userStore((s) => s.user)
  const bidAuctions = userStore((s) => s.bidAuctions)
  const myTransactions = userStore((s) => s.myTransactions)
  const setLoading = appStore((s) => s.setLoading)
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)

  const hasDeposit = !!user?.deposit
  const depositRefundPending = myTransactions.some(
    (el) =>
      el.status === TRANSACTION_STATUS_IDS.pending &&
      el.type === TRANSACTION_TYPE_IDS.depositPaidOut,
  )

  const initializePayment = usePaystackPayment(payStackConfig(DEPOSIT_AMOUNT, user, 'deposit'))

  async function saveDeposit(ref: unknown) {
    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    const transaction: EdTransaction = {
      createdAt: new Date(),
      amount: DEPOSIT_AMOUNT,
      ref,
      uid: user?.uid,
      status: TRANSACTION_STATUS_IDS.complete,
      type: TRANSACTION_TYPE_IDS.depositPaid,
    }
    try {
      await dbWrite.createTransaction(transaction)
      await dbWrite.updateUser({
        uid: user?.uid,
        deposit: { createdAt: new Date(), amount: DEPOSIT_AMOUNT, ref },
      })
      toast.success(APP_MESSAGES.alert.success.depositPaid)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  function makePayment() {
    initializePayment({
      onSuccess: (reference: unknown) => saveDeposit(reference),
      onClose: () => {},
    })
  }

  function onRequestRefundClick() {
    const activeBidAuctions = bidAuctions.filter((el) => el.status === STATUS_IDS.published)
    if (activeBidAuctions.some((el) => el.lastBid?.uid === user?.uid)) {
      toast.warning(APP_MESSAGES.toast.warning.activeBidCantRefund)
      return
    }
    setShowRefundConfirm(true)
  }

  async function onRequestRefundConfirmed() {
    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    const newTransaction: EdTransaction = {
      amount: user!.deposit!.amount!,
      type: TRANSACTION_TYPE_IDS.depositPaidOut,
      createdAt: new Date(),
      uid: user!.uid,
      status: TRANSACTION_STATUS_IDS.pending,
    }
    try {
      await dbWrite.createTransaction(newTransaction)
      toast.success(APP_MESSAGES.alert.success.depositRefundRequested)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <WatchButton title={`${APP_NAME} deposits`} />
      <div className="w-full rounded-xl bg-white p-4 shadow-md sm:p-6">
        <div className="flex w-full flex-col items-center gap-6 sm:flex-row">
          <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
            <span
              className={`text-sm font-semibold capitalize sm:text-base ${
                user?.deposit ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {APP_NAME} deposit
            </span>
            <span
              className={`text-5xl font-bold sm:text-7xl ${
                user?.deposit ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className="text-base align-top">R</span>
              {user?.deposit ? user.deposit.amount?.toFixed(2) : '0.00'}
            </span>
          </div>
          {user?.deposit ? (
            <Button size="lg" disabled={depositRefundPending} onClick={onRequestRefundClick}>
              {depositRefundPending ? 'refund requested' : 'Request refund'}
            </Button>
          ) : (
            <Button size="lg" onClick={makePayment}>
              Pay deposit
            </Button>
          )}
        </div>
        {!hasDeposit && (
          <div className="mt-3 flex w-full items-center justify-center gap-2">
            <Info className="size-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              A deposit is required before you can place a bid
            </span>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showRefundConfirm}
        onOpenChange={setShowRefundConfirm}
        model={{
          title: APP_MESSAGES.alert.title.requestRefund,
          message: APP_MESSAGES.alert.confirm.requestRefund,
        }}
        onConfirm={onRequestRefundConfirmed}
      />
    </div>
  )
}
