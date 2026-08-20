import { Link, useLocation } from '@tanstack/react-router'
import { ChevronDown, LogOut, LayoutDashboard, Menu, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { userLabel } from '#/lib/helpers'
import { fsAuth } from '#/lib/firebase'
import { ROUTES } from '#/lib/constants'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'
import { MobileNav } from './mobile-nav'

const NAVBAR_ITEMS = [
  { title: 'auctions', route: ROUTES.auctions },
  { title: 'about', route: ROUTES.about },
  { title: 'contact', route: ROUTES.contact },
  { title: 'FAQs', route: ROUTES.faq },
]

const AUTH_ROUTES: string[] = [ROUTES.login, ROUTES.register, ROUTES.resetPassword]

export function Navbar() {
  const location = useLocation()
  const user = userStore((s) => s.user)
  const setIsMobileNavOpen = appStore((s) => s.setIsMobileNavOpen)
  const isInAuth = AUTH_ROUTES.includes(location.pathname)

  return (
    <>
      <div className="sticky top-0 z-20 flex h-16 w-full items-center bg-primary px-4 text-primary-foreground shadow-lg sm:px-6">
        <Link to={ROUTES.home} className="shrink-0">
          <img
            src="/images/logo/logo_white.png"
            alt="logo"
            className="h-8 sm:h-10"
          />
        </Link>
        {!isInAuth && (
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {NAVBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.route
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  className={`font-medium capitalize ${
                    isActive ? 'text-warning' : 'text-primary-foreground/90'
                  }`}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>
        )}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            aria-label="toggle menu"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
        {!isInAuth && (
          <div className="ml-auto hidden md:flex">
            {user ? (
              <NavUserMenu />
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="lg" asChild>
                  <Link to={ROUTES.login}>Login</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                  asChild
                >
                  <Link to={ROUTES.register}>Create Account</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <MobileNav />
    </>
  )
}

function NavUserMenu() {
  const user = userStore((s) => s.user)
  const setLoading = appStore((s) => s.setLoading)

  if (!user) return null

  async function logout() {
    setLoading(true)
    const { dbService } = await import('#/services/db.service')
    dbService.unsubscribeUser()
    await fsAuth.signOut()
    localStorage.clear()
    userStore.setState({
      user: null,
      myAuctions: [],
      bidAuctions: [],
      myInspections: [],
      isAuth: false,
      savedAuctions: [],
      notifications: [],
      myTransactions: [],
    })
    setLoading(false)
    toast.info('Logged out', 'auth')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex cursor-pointer items-center gap-2">
          <Avatar>
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-0.5">
            <span className="flex items-center gap-1 text-sm text-primary-foreground/90">
              {user.name}
              <ChevronDown className="size-3" />
            </span>
            <Badge variant="secondary" className="capitalize">
              {userLabel(user)}
            </Badge>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={ROUTES.dashHome}>
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.profile}>
            <User /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.payouts}>
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} variant="destructive">
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
