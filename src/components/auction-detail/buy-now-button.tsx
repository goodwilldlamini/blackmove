import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import { ConfirmDialog } from '#/components/confirm-dialog'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { UploadWidget } from '#/components/upload-widget'
import {
  COMPANY_BANK_DETAILS,
  EFT_HOLD_HOURS,
  ORDER_PAYMENT_METHODS,
  ORDER_PAYMENT_METHOD_IDS,
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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showDepositPrompt, setShowDepositPrompt] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)

  const isOwnListing = !!user && user.uid === auction.uid

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

  return (
    <>
      <Button onClick={onBuyNowClick} size="lg" disabled={isOwnListing}>
        {isOwnListing ? 'Your listing' : 'Buy now'}
      </Button>

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
      />
    </>
  )
}

function BuyNowModal({
  auction,
  open,
  onOpenChange,
}: {
  auction: Listing
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const user = userStore((s) => s.user)
  const isLoading = appStore((s) => s.isLoading)
  const setLoading = appStore((s) => s.setLoading)

  const [method, setMethod] = useState(ORDER_PAYMENT_METHOD_IDS.online)
  const [orderId, setOrderId] = useState('')
  const [eftReference, setEftReference] = useState('')
  const [eftProofUrl, setEftProofUrl] = useState('')

  const amount = auction.price || 0
  const initializePayment = usePaystackPayment(
    payStackConfig(amount, user, 'order'),
  )

  function reset() {
    setOrderId('')
    setEftReference('')
    setEftProofUrl('')
    onOpenChange(false)
  }

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
        // keep the modal open so the buyer can capture their payment proof
        setOrderId(newOrderId)
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
      reset()
      navigate({ to: ROUTES.myOrders })
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmitEftProof() {
    if (!eftReference.trim()) {
      toast.error('Please enter the reference you paid with')
      return
    }
    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.submitEftProof(orderId, {
        eftReference: eftReference.trim(),
        eftProofUrl: eftProofUrl || undefined,
      })
      toast.success('Proof submitted, we will confirm your payment shortly')
      reset()
      navigate({ to: ROUTES.myOrders })
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const paymentRef = orderId ? `ORD-${orderId.slice(-8).toUpperCase()}` : ''

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : reset())}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{orderId ? 'Pay by EFT' : 'Buy now'}</DialogTitle>
        </DialogHeader>

        {!orderId ? (
          <div className="flex w-full flex-col gap-6 py-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm text-muted-foreground">Total due</span>
              <h2 className="text-3xl font-bold">{currencyFormat(amount)}</h2>
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
                    <span className="font-semibold capitalize">
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4 py-2">
            <p className="text-sm text-muted-foreground">
              This lot is reserved for you for {EFT_HOLD_HOURS} hours. Transfer{' '}
              <b>{currencyFormat(amount)}</b> using the reference below, then
              upload your proof of payment.
            </p>
            <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-3 text-sm">
              <BankRow label="Account name" value={COMPANY_BANK_DETAILS.accountName} />
              <BankRow label="Bank" value={COMPANY_BANK_DETAILS.bank} />
              <BankRow label="Account number" value={COMPANY_BANK_DETAILS.accountNumber} />
              <BankRow label="Branch code" value={COMPANY_BANK_DETAILS.branchCode} />
              <BankRow label="Account type" value={COMPANY_BANK_DETAILS.accountType} />
              <BankRow label="Reference" value={paymentRef} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="eft-ref">Your payment reference</Label>
              <Input
                id="eft-ref"
                value={eftReference}
                placeholder={paymentRef}
                onChange={(e) => setEftReference(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Proof of payment (optional)</Label>
              {eftProofUrl ? (
                <p className="text-xs text-primary">Proof uploaded</p>
              ) : (
                <UploadWidget
                  max={1}
                  path={`documents/orders/${orderId}`}
                  accepted={['image/', 'application/pdf']}
                  updateFiles={(files) => setEftProofUrl(files[0]?.url || '')}
                />
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={reset}>
            Close
          </Button>
          <Button
            disabled={isLoading}
            onClick={orderId ? onSubmitEftProof : onContinue}
          >
            {orderId ? 'Submit proof' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
