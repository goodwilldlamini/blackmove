import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { WatchButton } from '#/components/watch-button'
import {
  HOW_IT_WORKS_STEPS,
  LISTING_KINDS,
  LISTING_KIND_IDS,
  userTypes,
} from '#/lib/app-data'
import { APP_NAME, ROUTES } from '#/lib/constants'

const STEP_CLASSES = [
  'bg-primary/10 border-primary/20 text-primary',
  'bg-warning/10 border-warning/20 text-warning',
  'bg-info/10 border-info/20 text-info',
]

/**
 * Buyer-facing copy for the two purchase modes - the `LISTING_KINDS` blurbs are
 * written for the seller wizard, so only the label and icon are shared.
 */
const PURCHASE_MODES = [
  {
    kind: LISTING_KIND_IDS.auction,
    tagline: 'Compete for the lot',
    points: [
      'Place your bid before the timer runs out',
      'The highest bid at close wins',
    ],
    classes: 'bg-primary/10 border-primary/20 text-primary',
  },
  {
    kind: LISTING_KIND_IDS.buyNow,
    tagline: 'Skip the waiting',
    points: [
      'One fixed price, no bidding',
      'Pay by card or EFT - first payment takes the lot',
    ],
    classes: 'bg-info/10 border-info/20 text-info',
  },
]

export function HowItWorksSection() {
  return (
    <div className="w-full bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-xs font-extrabold tracking-wider text-primary uppercase">
              How it works
            </span>
            <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl md:text-3xl">
              How {APP_NAME} works
            </h2>
            <p className="max-w-2xl text-sm text-gray-500 sm:text-base">
              Getting started takes just a few simple steps — whether you're
              here to buy stock or to sell it. Buy your way: bid on a live
              auction, or pay a fixed price on a buy now listing.
            </p>
          </div>

          <Tabs defaultValue={HOW_IT_WORKS_STEPS[0]?.id} className="w-full items-center">
            <TabsList>
              {HOW_IT_WORKS_STEPS.map((step) => (
                <TabsTrigger key={step.id} value={step.id}>
                  {userTypes.find((el) => el.value === step.id)?.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {HOW_IT_WORKS_STEPS.map((step) => (
              <TabsContent key={step.id} value={step.id} className="mt-6 w-full">
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
                  {step.steps.map((item, index) => {
                    const classes = STEP_CLASSES[index] ?? STEP_CLASSES[0]
                    return (
                      <div
                        key={item.desc}
                        className="relative overflow-hidden rounded-xl border bg-white p-6"
                      >
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="relative">
                            <div
                              className={`flex size-14 items-center justify-center rounded-2xl border-2 sm:size-16 ${classes}`}
                            >
                              <item.icon className="size-6 sm:size-7" />
                            </div>
                            <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-extrabold text-primary-foreground">
                              {index + 1}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 capitalize sm:text-xl">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 sm:text-base">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex w-full flex-col items-center gap-4">
            <h3 className="text-base font-semibold text-gray-700 sm:text-lg">
              Two ways to buy
            </h3>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              {PURCHASE_MODES.map((mode) => {
                const kind = LISTING_KINDS.find((el) => el.value === mode.kind)
                if (!kind) return null
                return (
                  <div
                    key={mode.kind}
                    className="rounded-xl border bg-white p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 ${mode.classes}`}
                      >
                        <kind.icon className="size-6" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="text-lg font-semibold text-gray-700 capitalize">
                          {kind.label}
                        </h4>
                        <p className="text-sm font-medium text-gray-600">
                          {mode.tagline}
                        </p>
                        <ul className="flex flex-col gap-1 text-sm text-gray-500">
                          {mode.points.map((point) => (
                            <li key={point} className="flex items-start gap-2">
                              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="max-w-2xl text-center text-sm text-gray-500">
              Both modes use the same one-off security deposit, so you're free
              to bid on one lot and buy another outright.
            </p>
          </div>

          <div className="flex w-full items-center justify-center gap-3">
            <WatchButton title={`how ${APP_NAME} works`} />
            <Button variant="outline" asChild>
              <Link to={ROUTES.about}>learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
