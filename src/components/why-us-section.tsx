import { Link } from '@tanstack/react-router'
import { ChevronRight, Gavel, Globe, ShoppingBag, UserCheck } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { APP_NAME, ROUTES } from '#/lib/constants'
import { isAuctionFeatureActive } from '#/lib/feature-flags'

const SELLING_POINTS = [
  isAuctionFeatureActive
    ? {
        title: 'your sale ring, online',
        color: 'primary',
        icon: Gavel,
        desc: `Take the traditional livestock auction online. List your lots with photos and full details, set your starting bid and reserve, and let buyers compete from anywhere in South Africa — without the cost and hassle of hauling stock to a physical sale.`,
      } as const
    : ({
        title: 'your sale yard, online',
        color: 'primary',
        icon: ShoppingBag,
        desc: `Sell your stock without hauling it to a physical sale. List your lots with photos and full details, set the price you want for them, and reach buyers anywhere in South Africa — no sale day, no commission ring, no waiting for the gavel.`,
      } as const),
  {
    title: 'verified traders you can trust',
    color: 'warning',
    icon: UserCheck,
    desc: isAuctionFeatureActive
      ? `Sellers are vetted before they can list, and every auction is reviewed before it goes live. Buyers place a security deposit before bidding, so you trade with people who are serious about buying and selling.`
      : `Sellers are vetted before they can list, and every listing is reviewed before it goes live. Buyers place a security deposit before they can buy, so you trade with people who are serious about buying and selling.`,
  },
  {
    title: 'reach buyers nationwide',
    color: 'success',
    icon: Globe,
    desc: `Connect with farmers and buyers across the country from a single platform. Browse live listings for cattle, sheep, goats, pigs, and poultry — or list your own stock and tap into a market far beyond your local sale yard.`,
  },
] as const

const ICON_WRAP_CLASSES: Record<(typeof SELLING_POINTS)[number]['color'], string> = {
  primary: 'bg-primary/10 border-primary/20 text-primary',
  warning: 'bg-warning/10 border-warning/20 text-warning',
  success: 'bg-success/10 border-success/20 text-success',
}

export function WhyUsSection({ hideButton }: { hideButton?: boolean }) {
  return (
    <div className="w-full bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-xs font-extrabold tracking-wider text-success uppercase">
              Why us
            </span>
            <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl md:text-3xl">
              Why {APP_NAME}?
            </h2>
            <p className="max-w-2xl text-sm text-gray-500 sm:text-base">
              The online livestock marketplace built for South African farmers
              and traders.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {SELLING_POINTS.map((point) => (
              <div
                key={point.title}
                className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-lg"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl border-2 sm:size-16 ${ICON_WRAP_CLASSES[point.color]}`}
                >
                  <point.icon className="size-6 sm:size-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-700 capitalize sm:text-xl">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

          {!hideButton && (
            <Button size="lg" asChild>
              <Link to={ROUTES.about}>
                Learn more
                <ChevronRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
