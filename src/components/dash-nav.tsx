import { Link } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { NotificationBell } from '#/components/notification-bell'
import { fsAuth } from '#/lib/firebase'
import { ROUTES } from '#/lib/constants'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'

export function DashNav() {
  return (
    <div className="sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-primary px-4 shadow-lg sm:px-6">
      <Link to="/">
        <img src="/images/logo/logo_white.png" alt="logo" className="h-8 sm:h-10" />
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationBell />
        <NavAvatar />
      </div>
    </div>
  )
}

function NavAvatar() {
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
          <span className="hidden text-sm text-white/90 sm:block">
            {user.name}
          </span>
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
