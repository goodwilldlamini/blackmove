import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { WatchButton } from '#/components/watch-button'
import { ROUTES } from '#/lib/constants'

export function Hero() {
  return (
    <div
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center bg-cover bg-center px-4 py-16"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), url(/images/home/bg.jpg)',
      }}
    >
      <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="display-title text-4xl font-extrabold text-white capitalize sm:text-6xl md:text-7xl">
            Your online livestock marketplace
          </h1>
          <p className="text-sm font-bold text-white text-primary-light sm:text-xl">
            Buy &amp; sell livestock from farmers &amp; buyers across South
            Africa
          </p>
        </div>
        <WatchButton title="selling on LivestockAuctions" />
        <Link
          to={ROUTES.auctions}
          className="group flex w-max items-center gap-1 rounded-full bg-gray-300/90 p-1 text-sm hover:bg-primary hover:text-white"
        >
          <span className="rounded-full bg-primary px-3 py-1 text-xs leading-none text-white sm:text-sm">
            Browse auctions
          </span>
          <span className="flex items-center gap-1 px-1 text-primary group-hover:text-white">
            <span className="text-xs sm:text-sm">
              See what auctions are currently live
            </span>
            <ChevronRight className="size-4" />
          </span>
        </Link>
      </div>
    </div>
  )
}
