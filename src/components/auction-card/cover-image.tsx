import { Link } from '@tanstack/react-router'
import type { Listing } from '#/types/auction'

export function CoverImage({ auction }: { auction: Listing }) {
  return (
    <Link
      to="/auctions/$id"
      params={{ id: auction.id! }}
      className="block aspect-4/3 w-full overflow-hidden rounded-xl bg-muted"
    >
      <img
        src={auction.cover || auction.images?.[0]}
        alt={auction.title}
        className="size-full object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105"
      />
    </Link>
  )
}
