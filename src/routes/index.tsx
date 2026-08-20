import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '#/components/footer'
import { CategoriesSection } from '#/components/landing/categories-section'
import { Hero } from '#/components/landing/hero'
import { HowItWorksSection } from '#/components/landing/how-it-works-section'
import { LatestAuctionsSection } from '#/components/landing/latest-auctions-section'
import { SignUpCta } from '#/components/landing/signup-cta'
import { Navbar } from '#/components/navbar'
import { SafetyBanner } from '#/components/safety-banner'
import { WhyUsSection } from '#/components/why-us-section'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <LatestAuctionsSection />
      <hr className="border-border" />
      <HowItWorksSection />
      <hr className="border-border" />
      <CategoriesSection />
      <hr className="border-border" />
      <WhyUsSection />
      <SafetyBanner />
      <hr className="border-border" />
      <SignUpCta />
      <Footer />
    </div>
  )
}
