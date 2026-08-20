import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuctionBids } from '#/components/auction-detail/bids-panel'
import { AuctionDetailsBody } from '#/components/auction-detail/details'
import { AuctionGallery } from '#/components/auction-detail/gallery'
import { OtherAuctions } from '#/components/auction-detail/other-auctions'
import { AuctionDetailsTopBar } from '#/components/auction-detail/top-bar'
import { TopControls } from '#/components/auction-detail/top-controls'
import { Loading } from '#/components/loading'
import { LISTING_KIND_IDS } from '#/lib/app-data'
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
    return <Loading visible />
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

  return (
    <div className="flex w-full flex-col">
      <div className="hidden sm:block">
        <TopControls auction={currentAuction} />
      </div>
      <AuctionGallery auction={currentAuction} />
      <div className="sm:hidden">
        <TopControls auction={currentAuction} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-2 py-4 sm:px-0">
        <div className="flex w-full flex-col gap-4">
          <AuctionDetailsTopBar auction={currentAuction} seller={seller} />
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-5">
            <div className={isBuyNow ? 'sm:col-span-5' : 'sm:col-span-3'}>
              <AuctionDetailsBody auction={currentAuction} />
            </div>
            {!isBuyNow && (
              <div className="sm:col-span-2">
                <AuctionBids auction={currentAuction} />
              </div>
            )}
          </div>
        </div>
      </div>

      <OtherAuctions currentAuctionId={currentAuction.id} />
    </div>
  )
}
