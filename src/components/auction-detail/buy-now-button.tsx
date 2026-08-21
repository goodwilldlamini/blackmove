import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import { ConfirmDialog } from '#/components/confirm-dialog'
import { EftPaymentDialog } from '#/components/eft-payment-dialog'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Label } from '#/components/ui/label'
import {
  ORDER_PAYMENT_METHODS,
  ORDER_PAYMENT_METHOD_IDS,
  ORDER_STATUS_IDS,
  STATUS_IDS,
  USER_TYPE_IDS,
  userTypes,
} from '#/lib/app-data'
import { ROUTES } from '#/lib/constants'
import { currencyFormat, payStackConfig } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'
import type { Listing } from '#/types/auction'

export function BuyNowButton({ auction }: { auction: Listing }) {
  const navigate = useNavigate()
  const user = userStore((s) => s.user)
  const myPurchaseOrders = userStore((s) => s.myPurchaseOrders)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showDepositPrompt, setShowDepositPrompt] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [eftOrderId, setEftOrderId] = useState('')

  const isOwnListing = !!user && user.uid === auction.uid

  // the order behind the current claim, when that claim is ours
  const myOrder =
    auction.orderId && auction.buyerUid && auction.buyerUid === user?.uid
      ? myPurchaseOrders.find((el) => el.id === auction.orderId)
      : undefined

  function onBuyNowClick() {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    if (!user.deposit) {
      setShowDepositPrompt(true)
      return
    }
    setShowBuyModal(true)
  }

  /**
   * Only the trigger reacts to the listing status - the dialogs below stay
   * mounted no matter what, otherwise claiming the listing (which flips it to
   * `reserved` through the live listener) would tear down the dialog the buyer
   * is busy with.
   */
  function trigger() {
    if (isOwnListing) {
      return (
        <Button size="lg" disabled>
          Your listing
        </Button>
      )
    }
    if (auction.status === STATUS_IDS.concludedSold) {
      return (
        <Button size="lg" disabled>
          Sold
        </Button>
      )
    }
    if (auction.status === STATUS_IDS.reserved) {
      // we hold the claim, so let ourselves back into the payment we started
      if (myOrder?.status === ORDER_STATUS_IDS.pendingPayment &&
        myOrder.paymentMethod === ORDER_PAYMENT_METHOD_IDS.eft) {
        return (
          <Button size="lg" onClick={() => setEftOrderId(auction.orderId!)}>
            Complete payment
          </Button>
        )
      }
      if (myOrder?.status === ORDER_STATUS_IDS.awaitingEftConfirmation) {
        return (
          <Button size="lg" disabled>
            Payment pending
          </Button>
        )
      }
      return (
        <Button size="lg" disabled>
          Reserved
        </Button>
      )
    }
    if (auction.status === STATUS_IDS.published) {
      return (
        <Button onClick={onBuyNowClick} size="lg">
          Buy now
        </Button>
      )
    }
    return null
  }

  return (
    <>
      {trigger()}

      <ConfirmDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        model={{
          title: 'Not logged in',
          message:
            'Please log in or create an account before you can buy this lot',
          confirmButtonText: 'Login',
          cancelButtonText: 'Create account',
        }}
        onConfirm={() => navigate({ to: ROUTES.login })}
        onCancel={() =>
          navigate({
            to: ROUTES.register,
            search: {
              acc: userTypes.find((t) => t.value === USER_TYPE_IDS.buyer)?.label,
            },
          })
        }
      />

      <ConfirmDialog
        open={showDepositPrompt}
        onOpenChange={setShowDepositPrompt}
        model={{
          title: 'No deposit',
          message:
            'You will need to place a security deposit before you can buy a lot',
          confirmButtonText: 'Pay deposit',
          cancelButtonText: 'cancel',
        }}
        onConfirm={() => navigate({ to: ROUTES.dashHome })}
      />

      <BuyNowModal
        auction={auction}
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        onEftClaimed={(orderId) => {
          setShowBuyModal(false)
          setEftOrderId(orderId)
        }}
      />

      <EftPaymentDialog
        open={!!eftOrderId}
        onOpenChange={(o) => !o && setEftOrderId('')}
        orderId={eftOrderId}
        amount={myOrder?.amount ?? auction.price ?? 0}
        defaultReference={myOrder?.eftReference}
        defaultProofUrl={myOrder?.eftProofUrl}
        onSubmitted={() => navigate({ to: ROUTES.myOrders })}
      />
    </>
  )
}

function BuyNowModal({
  auction,
  open,
  onOpenChange,
  onEftClaimed,
}: {
  auction: Listing
  open: boolean
  onOpenChange: (open: boolean) => void
  onEftClaimed: (orderId: string) => void
}) {
  const navigate = useNavigate()
  const user = userStore((s) => s.user)
  const isLoading = appStore((s) => s.isLoading)
  const setLoading = appStore((s) => s.setLoading)

  const [method, setMethod] = useState(ORDER_PAYMENT_METHOD_IDS.online)

  const amount = auction.price || 0
  const initializePayment = usePaystackPayment(
    payStackConfig(amount, user, 'order'),
  )

  /** Reserves the listing so no one else can buy it while we take payment. */
  async function claim(): Promise<string | null> {
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      return await dbWrite.claimListing({
        listingId: auction.id!,
        buyerUid: user!.uid!,
        paymentMethod: method,
      })
    } catch (e: any) {
      toast.error(e.message)
      return null
    }
  }

  async function onContinue() {
    setLoading(true)
    try {
      const newOrderId = await claim()
      if (!newOrderId) return

      if (method === ORDER_PAYMENT_METHOD_IDS.eft) {
        // hand over to the eft dialog so the buyer can capture their proof
        onEftClaimed(newOrderId)
        return
      }

      initializePayment({
        onSuccess: (reference: any) => payOnline(newOrderId, reference),
        onClose: () => {
          toast.warning(
            'Payment cancelled - the lot is held for you for a short while',
          )
        },
      })
    } finally {
      setLoading(false)
    }
  }

  async function payOnline(newOrderId: string, reference: any) {
    setLoading(true)
    try {
      // never trust the client callback alone - confirm with paystack first
      const { verifyPaystackPayment } = await import(
        '#/services/paystack-verify'
      )
      const verified = await verifyPaystackPayment({
        data: { reference: reference?.reference, expectedAmount: amount },
      })

      const dbWrite = (await import('#/services/db-write.service')).default
      await dbWrite.markOrderPaid({
        orderId: newOrderId,
        listingId: auction.id!,
        paystackRef: verified.reference,
        paystackVerifiedAt: new Date(verified.verifiedAt),
      })
      toast.success('Payment received, this lot is yours')
      onOpenChange(false)
      navigate({ to: ROUTES.myOrders })
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buy now</DialogTitle>
        </DialogHeader>

        <div className="flex w-full flex-col gap-6 py-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-muted-foreground">Total due</span>
            <h2 className="display-title text-3xl font-semibold">{currencyFormat(amount)}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <Label>How would you like to pay?</Label>
            {ORDER_PAYMENT_METHODS.map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => setMethod(item.value)}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                  method === item.value
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted'
                }`}
              >
                <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="flex flex-col">
                  <span className="font-semibold capitalize">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.desc}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button disabled={isLoading} onClick={onContinue}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
