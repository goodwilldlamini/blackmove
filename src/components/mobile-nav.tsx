import { Link } from '@tanstack/react-router'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { ROUTES } from '#/lib/constants'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'

const NAVBAR_ITEMS = [
  { title: 'auctions', route: ROUTES.auctions },
  { title: 'about', route: ROUTES.about },
  { title: 'contact', route: ROUTES.contact },
  { title: 'FAQs', route: ROUTES.faq },
]

const DASH_LINKS = [
  { title: 'dashboard', route: ROUTES.dashHome },
  { title: 'profile', route: ROUTES.profile },
  { title: 'saved auctions', route: ROUTES.bookmarks },
]

export function MobileNav() {
  const isOpen = appStore((s) => s.isMobileNavOpen)
  const setIsOpen = appStore((s) => s.setIsMobileNavOpen)
  const user = userStore((s) => s.user)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-full bg-primary text-primary-foreground">
        <SheetHeader>
          <SheetTitle className="text-primary-foreground">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col divide-y divide-primary-foreground/20 px-4">
          {NAVBAR_ITEMS.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              onClick={() => setIsOpen(false)}
              className="py-4 text-xl font-semibold capitalize"
            >
              {item.title}
            </Link>
          ))}
          {user ? (
            DASH_LINKS.map((item) => (
              <Link
                key={item.route}
                to={item.route}
                onClick={() => setIsOpen(false)}
                className="py-4 text-xl font-semibold capitalize"
              >
                {item.title}
              </Link>
            ))
          ) : (
            <Link
              to={ROUTES.login}
              onClick={() => setIsOpen(false)}
              className="py-4 text-xl font-semibold capitalize"
            >
              Login
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
