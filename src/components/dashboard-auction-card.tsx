import { useNavigate } from '@tanstack/react-router'
import { Eye, Pencil, Radio, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { ConfirmDialog } from '#/components/confirm-dialog'
import { EdTimer } from '#/components/timer'
import {
  AUCTION_STATUSES,
  LISTING_KIND_IDS,
  ORDER_STATUS_IDS,
  STATUS_IDS,
} from '#/lib/app-data'
import { APP_MESSAGES } from '#/lib/app-messages'
import { dateFormat } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'
import type { Listing } from '#/types/auction'

export function DashAuctionCard({ auction }: { auction: Listing }) {
  const isLive = auction.status === STATUS_IDS.published
  const status = AUCTION_STATUSES.find((el) => el.value === auction.status)

  return (
    <div className="relative w-full rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Badge
          variant="outline"
          className={isLive ? 'border-teal-400 text-teal-700' : 'border-blue-400 text-blue-700'}
        >
          {status?.title}
        </Badge>
        {isLive && <EdTimer date={auction.closeDate} />}
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        <Avatar className="size-16">
          <AvatarImage src={auction.cover || auction.images?.[0]} alt={auction.title} />
          <AvatarFallback>{auction.title?.[0]}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold capitalize hover:text-info sm:text-xl">
          {auction.title}
        </h3>
        <AuctionActions auction={auction} />
        <div className="flex w-full justify-between text-xs text-muted-foreground">
          <span>close date: {auction.closeDate ? dateFormat(auction.closeDate) : 'not set'}</span>
        </div>
      </div>
    </div>
  )
}

function AuctionActions({ auction }: { auction: Listing }) {
  const navigate = useNavigate()
  const user = userStore((s) => s.user)
  const setLoading = appStore((s) => s.setLoading)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false)

  const isBuyNow = auction.kind === LISTING_KIND_IDS.buyNow

  const actions = [
    {
      label: 'edit',
      hidden: auction.status! > STATUS_IDS.paused,
      icon: Pencil,
      onClick: () => navigate({ to: '/dashboard/my-auctions/$id', params: { id: auction.id! } }),
    },
    {
      label: 'preview',
      hidden: auction.status !== STATUS_IDS.concluded,
      icon: Eye,
      onClick: () => navigate({ to: '/auctions/$id', params: { id: auction.id! } }),
    },
    {
      label: 'publish',
      hidden: auction.status !== STATUS_IDS.saved,
      icon: Radio,
      onClick: onPublishClick,
    },
    {
      label: 'release',
      hidden: auction.status !== STATUS_IDS.reserved,
      icon: Undo2,
      onClick: () => setShowReleaseConfirm(true),
    },
    {
      label: 'delete',
      hidden: auction.status !== STATUS_IDS.saved,
      icon: Trash2,
      colorClass: 'text-destructive',
      onClick: () => setShowDeleteConfirm(true),
    },
  ]

  function onPublishClick() {
    // a buy-now listing runs until it sells, so it needs no close date
    if (!auction.closeDate && !isBuyNow) {
      toast.error(APP_MESSAGES.error.noCloseDate)
      return
    }
    if (!user?.verified) {
      toast.error(APP_MESSAGES.toast.error.accountInactive)
      return
    }
    setShowPublishConfirm(true)
  }

  async function onPublishConfirmed() {
    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.updateAuction({ id: auction.id, status: STATUS_IDS.published })
      toast.success(APP_MESSAGES.toast.auctionPublished)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function onReleaseConfirmed() {
    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.releaseListingReservation({
        listingId: auction.id!,
        orderId: auction.orderId!,
        status: ORDER_STATUS_IDS.cancelled,
        cancelledBy: user?.uid,
        cancelReason: 'Reservation released by the seller',
      })
      toast.success('Reservation released, your listing is live again')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function onDeleteConfirmed() {
    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.deleteAuction(auction.id!)
      toast.success(APP_MESSAGES.toast.auctionDeleted)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full justify-evenly">
      {actions
        .filter((a) => !a.hidden)
        .map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`flex flex-col items-center gap-0.5 ${action.colorClass || 'text-info'}`}
          >
            <action.icon className="size-4" />
            <span className="text-xs capitalize">{action.label}</span>
          </button>
        ))}

      <ConfirmDialog
        open={showPublishConfirm}
        onOpenChange={setShowPublishConfirm}
        model={{
          title: APP_MESSAGES.alert.title.publishAuction,
          message: APP_MESSAGES.alert.publishAuction,
        }}
        onConfirm={onPublishConfirmed}
      />
      <ConfirmDialog
        open={showReleaseConfirm}
        onOpenChange={setShowReleaseConfirm}
        model={{
          title: 'Release reservation',
          message: `This cancels the buyer's pending order and puts the listing back on the market. Only do this if payment is not coming.`,
        }}
        onConfirm={onReleaseConfirmed}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        model={{
          title: APP_MESSAGES.alert.title.deleteAuction,
          message: APP_MESSAGES.alert.deleteAuction,
        }}
        onConfirm={onDeleteConfirmed}
      />
    </div>
  )
}
