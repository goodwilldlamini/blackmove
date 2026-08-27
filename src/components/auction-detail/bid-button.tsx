import { useNavigate } from '@tanstack/react-router'
import { arrayUnion } from 'firebase/firestore'
import { useState } from 'react'
import { ConfirmDialog } from '#/components/confirm-dialog'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Slider } from '#/components/ui/slider'
import { USER_TYPE_IDS, userTypes } from '#/lib/app-data'
import { ROUTES } from '#/lib/constants'
import {
  basicUserDetails,
  currencyFormat,
  highBidAmount,
} from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'
import type { Listing } from '#/types/auction'
import type { Bid } from '#/types/bid'
import type { EdUser } from '#/types/user'

const INCREMENTS = [0, 0.05, 0.1, 0.2, 0.25]

export function BidButton({
  auction,
  className,
}: {
  auction: Listing
  className?: string
}) {
  const navigate = useNavigate()
  const user = userStore((s) => s.user)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showDepositPrompt, setShowDepositPrompt] = useState(false)
  const [showBidModal, setShowBidModal] = useState(false)

  function onPlaceBidClick() {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    if (!user.deposit) {
      setShowDepositPrompt(true)
      return
    }
    setShowBidModal(true)
  }

  return (
    <>
      <Button onClick={onPlaceBidClick} size="lg" className={className}>
        Place bid
      </Button>

      <ConfirmDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        model={{
          title: 'Not logged in',
          message:
            'Please log in or create an account before you can place a bid',
          confirmButtonText: 'Login',
          cancelButtonText: 'Create account',
        }}
        onConfirm={() => navigate({ to: ROUTES.login })}
        onCancel={() =>
          navigate({
            to: ROUTES.register,
            search: { acc: userTypes.find((t) => t.value === USER_TYPE_IDS.buyer)?.label },
          })
        }
      />

      <ConfirmDialog
        open={showDepositPrompt}
        onOpenChange={setShowDepositPrompt}
        model={{
          title: 'No deposit',
          message:
            'You will need to place a security deposit before you can bid',
          confirmButtonText: 'Pay deposit',
          cancelButtonText: 'cancel',
        }}
        onConfirm={() => navigate({ to: ROUTES.dashHome })}
      />

      <BidModal auction={auction} open={showBidModal} onOpenChange={setShowBidModal} />
    </>
  )
}

function BidModal({
  auction,
  open,
  onOpenChange,
}: {
  auction: Listing
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const user = userStore((s) => s.user)
  const isLoading = appStore((s) => s.isLoading)
  const setLoading = appStore((s) => s.setLoading)
  const [sliderIndex, setSliderIndex] = useState(1)

  const currentAmount = highBidAmount(auction)
  const amounts = INCREMENTS.map((el) => Math.floor(currentAmount + el * currentAmount))
  const newAmount = currentAmount + INCREMENTS[sliderIndex] * currentAmount

  async function onPlaceBid() {
    setLoading(true)
    const bid: Bid = {
      createdAt: new Date(),
      uid: user?.uid,
      amount: newAmount,
      // basicUserDetails() returns a lightweight snapshot (uid/name/photoURL/
      // phone/email) using `null` for missing fields, per Firestore
      // convention — Bid.user is typed as full EdUser (ported from the old
      // model as-is), which is looser than what's actually stored here.
      user: basicUserDetails(user!) as EdUser,
    }
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.updateAuction({
        id: auction.id,
        lastBid: bid,
        bidUids: arrayUnion(user?.uid),
        bids: arrayUnion(bid),
      })
      toast.success('Bid placed successfully')
      onOpenChange(false)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Bid</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col items-center gap-6 py-4">
          <h2 className="display-title text-3xl font-extrabold">{currencyFormat(newAmount)}</h2>
          <div className="w-full px-2">
            <Slider
              value={[sliderIndex * 25]}
              min={0}
              max={100}
              step={25}
              onValueChange={([v]) => {
                if (v !== 0) setSliderIndex(v / 25)
              }}
            />
            <div className="mt-2 flex w-full justify-between text-xs text-muted-foreground">
              {amounts.map((amount, index) => (
                <span key={`${auction.id}_${amount}_${index}`}>
                  {currencyFormat(amount)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button disabled={isLoading} onClick={onPlaceBid}>
            Place Bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
