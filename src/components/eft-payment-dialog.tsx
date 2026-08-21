import { useEffect, useState } from 'react'
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
import { COMPANY_BANK_DETAILS, EFT_HOLD_HOURS } from '#/lib/app-data'
import { currencyFormat } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'

/**
 * The EFT leg of a buy-now purchase - bank details, the reference the buyer paid
 * with and their proof of payment. Shown right after a listing is claimed and
 * again from the orders page, so a buyer who dismissed it can still come back.
 */
export function EftPaymentDialog({
  open,
  onOpenChange,
  orderId,
  amount,
  defaultReference,
  defaultProofUrl,
  onSubmitted,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  amount: number
  defaultReference?: string
  defaultProofUrl?: string
  onSubmitted?: () => void
}) {
  const isLoading = appStore((s) => s.isLoading)
  const setLoading = appStore((s) => s.setLoading)

  const [eftReference, setEftReference] = useState(defaultReference || '')
  const [eftProofUrl, setEftProofUrl] = useState(defaultProofUrl || '')

  // the dialog outlives a single order, so pick up whatever the buyer already
  // captured whenever we are pointed at a different one
  useEffect(() => {
    setEftReference(defaultReference || '')
    setEftProofUrl(defaultProofUrl || '')
  }, [orderId, defaultReference, defaultProofUrl])

  const paymentRef = orderId ? `ORD-${orderId.slice(-8).toUpperCase()}` : ''

  async function onSubmit() {
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
      onOpenChange(false)
      onSubmitted?.()
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
          <DialogTitle>Pay by EFT</DialogTitle>
        </DialogHeader>

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
              <div className="flex items-center gap-3">
                <a
                  href={eftProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-info underline"
                >
                  view uploaded proof
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEftProofUrl('')}
                >
                  Replace
                </Button>
              </div>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button disabled={isLoading} onClick={onSubmit}>
            Submit proof
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
