import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import { COMPANY_DATA } from '#/lib/app-data'
import { APP_NAME, ROUTES } from '#/lib/constants'

type FooterLink = {
  label: string
  value?: string
  route?: string
  icon?: typeof Mail
}

function FooterSection({
  title,
  links,
}: {
  title: string
  links: FooterLink[]
}) {
  return (
    <div className="flex flex-col items-center gap-4 sm:items-start">
      <h3 className="text-sm font-semibold capitalize sm:text-base">
        {title}
      </h3>
      <div className="flex w-full flex-col items-center gap-3 sm:items-start">
        {links.map((link) => (
          <div
            key={`${title}_${link.label}`}
            className="flex w-full items-center justify-center gap-2 sm:justify-start"
          >
            {link.icon && (
              <link.icon className="size-4 text-muted-foreground" />
            )}
            {link.route ? (
              <Link
                to={link.route}
                className="text-sm text-muted-foreground capitalize hover:text-foreground"
              >
                {link.value || link.label}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground capitalize">
                {link.value || link.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const contactLinks: FooterLink[] = [
  { label: 'email', value: COMPANY_DATA.email, icon: Mail },
  { label: 'phone', value: COMPANY_DATA.phone, icon: Phone },
  { label: 'address', value: COMPANY_DATA.address, icon: MapPin },
]

const howItWorksLinks: FooterLink[] = [
  { label: 'selling livestock', route: ROUTES.about },
  { label: 'buying livestock', route: ROUTES.about },
  { label: 'finalizing a sale', route: ROUTES.about },
]

const supportLinks: FooterLink[] = [
  { label: 'frequently asked questions', route: ROUTES.faq },
  { label: 'Policies', route: ROUTES.policies },
  { label: 'trust and safety', route: ROUTES.safety },
]

const socialLinks = [
  { label: 'facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'instagram', href: 'https://instagram.com', icon: Instagram },
]

export function Footer() {
  return (
    <div className="w-full bg-white px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-3">
          <FooterSection title="contact us" links={contactLinks} />
          <FooterSection title="how it works" links={howItWorksLinks} />
          <FooterSection title="support" links={supportLinks} />
        </div>
        <hr className="border-border" />
        <div className="grid grid-cols-1 items-center gap-4 py-6 sm:grid-cols-2">
          <p className="text-center text-sm font-medium sm:text-left">
            &copy; {new Date().getFullYear()} {APP_NAME} Inc.
          </p>
          <div className="flex justify-center gap-4 sm:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <link.icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
