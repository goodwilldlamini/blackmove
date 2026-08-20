import { createFileRoute } from '@tanstack/react-router'
import { Banner } from '#/components/banner'
import { SignUpCta } from '#/components/landing/signup-cta'
import { SafetyBanner } from '#/components/safety-banner'

export const Route = createFileRoute('/_public/contact')({
  component: ContactPage,
})

const DETAILS = [
  { label: 'email', value: 'admin@agriimporium.co.za' },
  { label: 'our office', value: '1100 William Str, Brooklyn, Pretoria' },
  { label: 'phone', value: '(+27) 00 000 1234' },
]

function ContactPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <Banner title="contact us" />
      <div className="w-full max-w-4xl px-4 py-8">
        <div className="flex w-full flex-col justify-evenly gap-6 py-6 sm:flex-row">
          {DETAILS.map((detail) => (
            <div key={detail.label} className="flex flex-col items-center gap-1">
              <h3 className="text-xs font-extrabold tracking-wide uppercase">
                {detail.label}
              </h3>
              <p className="text-base sm:text-lg">{detail.value}</p>
            </div>
          ))}
        </div>
        <SafetyBanner />
      </div>
      <SignUpCta />
    </div>
  )
}
