import { Link } from '@tanstack/react-router'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { APP_NAME, ROUTES } from '#/lib/constants'

const SAFETY_POINTS = ['Verified sellers', 'Secure deposits', 'Data protection']

export function SafetyBanner() {
  return (
    <div className="w-full bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-lg sm:flex-row">
          <div className="flex items-center justify-center bg-primary px-8 py-8 sm:min-w-36 sm:py-0">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 shadow-md sm:size-20">
              <ShieldCheck className="size-7 text-white sm:size-9" />
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-5 p-6 sm:flex-row sm:p-8">
            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              <span className="text-xs font-extrabold tracking-wider text-success uppercase">
                Safety & trust
              </span>
              <h3 className="text-center text-lg font-semibold text-gray-700 sm:text-left sm:text-xl">
                Transact with confidence on {APP_NAME}
              </h3>
              <p className="max-w-md text-center text-sm text-gray-500 sm:text-left sm:text-base">
                Learn how we verify traders, protect payments, and keep your
                data secure.
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {SAFETY_POINTS.map((point) => (
                  <span
                    key={point}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <Button size="lg" className="shrink-0" asChild>
              <Link to={ROUTES.safety}>
                Learn more
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
