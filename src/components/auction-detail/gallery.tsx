import { ImageGallery } from '#/components/image-gallery'
import { MediaCarousel } from '#/components/media-carousel'
import type { Listing } from '#/types/auction'

export function AuctionGallery({ auction }: { auction: Listing }) {
  const images = [
    ...(auction.cover ? [auction.cover] : []),
    ...(auction.images || []),
  ]

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl sm:hidden">
        <MediaCarousel images={images} autoPlay />
      </div>
      <div className="hidden sm:block">
        <ImageGallery images={images} />
      </div>
    </div>
  )
}
