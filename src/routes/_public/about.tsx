import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react'
import { Banner } from '#/components/banner'
import { SafetyBanner } from '#/components/safety-banner'
import { WhyUsSection } from '#/components/why-us-section'
import { APP_NAME } from '#/lib/constants'

export const Route = createFileRoute('/_public/about')({
  component: AboutPage,
})

const SECTIONS = [
  {
    label: 'buying',
    image: '/images/about/1.jpg',
    steps: [
      `Ad labore minim excepteur consectetur.`,
      `Cillum ut enim irure eu anim deserunt irure officia dolor cupidatat.`,
      `Aliqua anim do officia ad sunt esse sint occaecat ipsum.`,
    ],
    desc: 'Dolore aute velit qui sint magna eiusmod. Cupidatat exercitation aliquip sunt laborum enim sit. Occaecat aliqua est dolor nostrud consequat est ullamco aliqua nulla aute eiusmod tempor sunt sint. Sit eu incididunt culpa consectetur aliqua labore aliquip deserunt commodo reprehenderit.',
  },
  {
    label: 'selling',
    image: '/images/about/2.jpg',
    steps: [
      `Do ea nulla excepteur non voluptate sunt sint in ea aliquip.`,
      `Aute culpa est labore ut aliqua ea velit.`,
      `Nostrud est enim velit ea dolore qui velit anim sit id veniam.`,
    ],
    desc: 'Enim voluptate minim cillum ea in nisi qui excepteur fugiat et reprehenderit ex. Occaecat qui id ea amet fugiat commodo id cillum eu deserunt cupidatat. Eu aliqua sit dolor consequat pariatur est. Deserunt laborum laborum magna aliqua labore proident ullamco Lorem mollit fugiat sunt non. Eiusmod anim ad elit aliqua ea est in exercitation irure cupidatat ad adipisicing nisi.',
  },
  {
    label: 'finalizing a sale',
    image: '/images/about/3.jpg',
    steps: [
      `Ad labore minim excepteur consectetur.`,
      `Cillum ut enim irure eu anim deserunt irure officia dolor cupidatat.`,
      `Aliqua anim do officia ad sunt esse sint occaecat ipsum.`,
    ],
    desc: 'Dolore aute velit qui sint magna eiusmod. Cupidatat exercitation aliquip sunt laborum enim sit. Occaecat aliqua est dolor nostrud consequat est ullamco aliqua nulla aute eiusmod tempor sunt sint. Sit eu incididunt culpa consectetur aliqua labore aliquip deserunt commodo reprehenderit.',
  },
]

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
