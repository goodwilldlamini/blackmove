import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  AuctionActionPanel,
  AuctionCta,
} from '#/components/auction-detail/action-panel'
import { AuctionBids } from '#/components/auction-detail/bids-panel'
import { AuctionDetailsBody } from '#/components/auction-detail/details'
import { AuctionGallery } from '#/components/auction-detail/gallery'
import { OtherAuctions } from '#/components/auction-detail/other-auctions'
import { TopControls } from '#/components/auction-detail/top-controls'
import { Skeleton } from '#/components/ui/skeleton'
import { LISTING_KIND_IDS, STATUS_IDS } from '#/lib/app-data'
import { publicStore } from '#/state/public.store'

export const Route = createFileRoute('/_public/auctions/$id')({
  component: AuctionDetailPage,
})

function AuctionDetailPage() {
  const { id } = Route.useParams()
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const currentAuction = publicStore((s) => s.currentAuction)
  const seller = publicStore((s) => s.seller)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { dbRead } = await import('#/services/db-read.service')
      const { dbService } = await import('#/services/db.service')

      const auction = await dbRead.getAuctionData(id)
      if (cancelled) return
      if (!auction) {
        setError(`Sorry, we couldn't find the auction you're looking for`)
        setIsFetching(false)
        return
      }

      publicStore.setState({ currentAuction: auction })
      dbService.listentoAuction(id)

      try {
        const seller = await dbRead.getUserData(auction.uid!)
        if (cancelled) return
        publicStore.setState({ seller })
      } catch (e: any) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setIsFetching(false)
      }

      return () => dbService.unsubAuction()
    }

    let cleanup: (() => void) | undefined
    load().then((c) => {
      cleanup = c
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [id])

  if (isFetching) {
    return <AuctionDetailSkeleton />
  }

  if (error || !currentAuction) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-24">
        <AlertCircle className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  const isBuyNow = currentAuction.kind === LISTING_KIND_IDS.buyNow
  // an auction that isn't published renders no CTA, so the mobile bar would
  // otherwise be an empty bordered strip
  const hasCta = isBuyNow || currentAuction.status === STATUS_IDS.published

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <TopControls auction={currentAuction} />

        <div className="mt-6 grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* on small screens the money and CTA come before the detail body */}
          <aside className="flex flex-col gap-6 lg:order-2 lg:col-span-1">
            <div className="flex flex-col gap-6 lg:sticky lg:top-20">
              <AuctionActionPanel auction={currentAuction} seller={seller} />
              {!isBuyNow && <AuctionBids auction={currentAuction} />}
            </div>
          </aside>

          <div className="flex flex-col gap-8 lg:order-1 lg:col-span-2">
            <AuctionGallery auction={currentAuction} />
            <AuctionDetailsBody auction={currentAuction} />
          </div>
        </div>
      </div>

      <OtherAuctions currentAuctionId={currentAuction.id} />

      {/* the CTA stays reachable while scrolling on small screens */}
      {hasCta && (
        <div className="sticky bottom-0 z-10 w-full border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <AuctionCta auction={currentAuction} className="w-full" />
        </div>
      )}
    </div>
  )
}

function AuctionDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <Skeleton className="h-9 w-2/3 sm:h-12" />
      <Skeleton className="mt-3 h-4 w-40" />
      <div className="mt-6 grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-6 lg:order-2 lg:col-span-1">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="flex flex-col gap-8 lg:order-1 lg:col-span-2">
          <Skeleton className="aspect-16/10 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
