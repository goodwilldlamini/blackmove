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
      <div className="sm:hidden">
        <MediaCarousel images={images} autoPlay />
      </div>
      <div className="mx-auto hidden max-w-6xl sm:block">
        <ImageGallery images={images} />
      </div>
    </div>
  )
}
