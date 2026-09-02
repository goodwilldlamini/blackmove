import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react'
import { Banner } from '#/components/banner'
import { SafetyBanner } from '#/components/safety-banner'
import { WhyUsSection } from '#/components/why-us-section'
import { APP_NAME } from '#/lib/constants'
import { isAuctionFeatureActive } from '#/lib/feature-flags'

export const Route = createFileRoute('/_public/about')({
  component: AboutPage,
})

const AUCTION_SECTIONS = [
  {
    label: 'buying',
    image: '/images/about/1.jpg',
    steps: [
      `Sign up, then place the one-off security deposit that unlocks both ways to buy`,
      `Auctions: place your bid before the timer runs out - the highest bid at close wins the lot`,
      `Buy now: pay the fixed price and the lot is yours, no bidding and no waiting`,
    ],
    desc: `Every lot on ${APP_NAME} is sold one of two ways, and you can see which at a glance while you browse. Live auctions let you compete for stock and set the price yourselves, while buy now listings carry a single fixed price for buyers who would rather not wait for a timer. The same deposit covers you for both, so you are free to bid on one lot and buy another outright.`,
  },
  {
    label: 'selling',
    image: '/images/about/2.jpg',
    steps: [
      `Sign up and upload your supporting documents for verification`,
      `Create your listing - run it as an auction, or set one fixed buy now price`,
      `We review every listing before it goes live, so buyers only ever see vetted stock`,
    ],
    desc: `Once our team has verified your profile and documents you can list stock in minutes. Choose an auction when you want buyers to compete and the market to set your price, or choose buy now when you know what the lot is worth and want the first buyer who pays to take it. Either way you keep full control of your minimum price, the details buyers see, and when the listing goes out.`,
  },
  {
    label: 'finalizing a sale',
    image: '/images/about/3.jpg',
    steps: [
      `Pay by card for instant confirmation, or by EFT and upload your proof of payment`,
      `The driver inspects and verifies the livestock through the app before loading`,
      `You verify the delivery on arrival, and the seller is paid within 7 days of removal`,
    ],
    desc: `Winning a bid and clicking buy now lead to the same place: a single order you settle through ${APP_NAME}. A buy now listing is reserved for you the moment you claim it, giving you a window to complete payment before it opens back up to other buyers. From there both routes follow one process - payment, inspection at loading, verification on arrival, and payout to the seller.`,
  },
]

const BUY_NOW_SECTIONS = [
  {
    label: 'buying',
    image: '/images/about/1.jpg',
    steps: [
      `Sign up, then place the one-off security deposit that lets you buy`,
      `Browse by category, province, breed or production system to find your lot`,
      `Pay the listed price and the lot is yours - no bidding and no waiting`,
    ],
    desc: `Every lot on ${APP_NAME} carries one fixed price, so there is nothing to work out and nothing to wait for. Find the stock you want, check the photos, weights, breed and vaccination details on the listing, and pay. A one-off security deposit is all that stands between signing up and buying, and it only ever has to be paid once.`,
  },
  {
    label: 'selling',
    image: '/images/about/2.jpg',
    steps: [
      `Sign up and upload your supporting documents for verification`,
      `Create your listing and set the price you want for the lot`,
      `We review every listing before it goes live, so buyers only ever see vetted stock`,
    ],
    desc: `Once our team has verified your profile and documents you can list stock in minutes. You set the price, the details buyers see, and when the listing goes out - the first buyer to pay takes the lot. You can leave a listing up until it sells, or give it an expiry date if the stock is only available for a while.`,
  },
  {
    label: 'finalizing a sale',
    image: '/images/about/3.jpg',
    steps: [
      `Pay by card for instant confirmation, or by EFT and upload your proof of payment`,
      `The driver inspects and verifies the livestock through the app before loading`,
      `You verify the delivery on arrival, and the seller is paid within 7 days of removal`,
    ],
    desc: `Claiming a lot opens a single order you settle through ${APP_NAME}, and the listing is reserved for you the moment you claim it - giving you a window to complete payment before it opens back up to other buyers. From there the process is the same every time: payment, inspection at loading, verification on arrival, and payout to the seller.`,
  },
]

const SECTIONS = isAuctionFeatureActive ? AUCTION_SECTIONS : BUY_NOW_SECTIONS

function AboutPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <Banner title="about us" />
      <Preamble />
      <HowItWorks />
      <WhyUsSection hideButton />
      <SafetyBanner />
    </div>
  )
}

function Preamble() {
  return (
    <div className="w-full max-w-6xl px-4 pt-8">
      <div className="grid w-full grid-cols-1 gap-6 rounded-xl bg-orange-500 p-6 sm:grid-cols-[2fr_3fr] sm:p-8">
        <div className="hidden aspect-square w-full sm:block">
          <img
            src="/images/about/4.jpg"
            className="size-full rounded-full object-cover"
            alt=""
          />
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-4 sm:items-start">
          <h2 className="text-2xl font-bold text-gray-50 capitalize sm:text-4xl">
            what is {APP_NAME}?
          </h2>
          <p className="text-center text-gray-100 sm:text-left">
            {APP_NAME} is a marketplace - Anim excepteur nulla irure deserunt
            aliquip duis enim do id id dolor. Laborum sunt aliquip ea esse
            veniam dolor adipisicing nostrud commodo pariatur id quis duis.
            Eiusmod commodo do laboris esse pariatur occaecat consectetur
            reprehenderit minim fugiat mollit proident. Sint veniam
            reprehenderit proident nulla tempor anim proident magna quis. Ut
            ut exercitation fugiat duis irure laborum. Minim enim dolor
            ullamco cillum do aliquip ad proident labore minim dolor nisi
            eiusmod quis.
          </p>
        </div>
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <div className="w-full max-w-6xl px-4 py-8">
      <div className="flex w-full flex-col items-center gap-8">
        <h2 className="text-3xl font-semibold">How it works</h2>
        <div className="flex w-full flex-col gap-10">
          {SECTIONS.map((section, index) => (
            <GenericSection key={section.label} section={section} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GenericSection({
  section,
  index,
}: {
  section: (typeof SECTIONS)[number]
  index: number
}) {
  const isEven = index % 2 === 0

  const image = (
    <div className="aspect-square w-full overflow-hidden rounded-tl-sm rounded-tr-[52px] rounded-br-sm rounded-bl-[52px]">
      <img
        src={section.image}
        className="size-full object-cover"
        alt={section.label}
      />
    </div>
  )
  const content = (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
      <h3 className="text-xl font-semibold capitalize sm:text-2xl">
        {section.label}
      </h3>
      <p className="text-base text-gray-500">{section.desc}</p>
      <ul className="flex flex-col gap-3 self-start text-left">
        {section.steps.map((step) => (
          <li key={step} className="flex items-start gap-2 font-medium text-gray-500">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            {step}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div
      className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 ${
        isEven ? '' : 'sm:[&>*:first-child]:order-2'
      }`}
    >
      {image}
      {content}
    </div>
  )
}
