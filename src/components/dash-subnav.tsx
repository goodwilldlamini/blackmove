import { useLocation, useNavigate } from '@tanstack/react-router'
import {
  Heart,
  Home,
  List,
  LogOut,
  Receipt,
  Table2,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { USER_TYPE_IDS } from '#/lib/app-data'
import { ROUTES } from '#/lib/constants'
import { fsAuth } from '#/lib/firebase'
import { toast } from '#/lib/toast'
import { userStore } from '#/state/user.store'

type SubNavItem = { title: string; route: string; icon: LucideIcon; onClick?: () => void }

const DASH_HOME_ITEM: SubNavItem = { title: 'dashboard', route: ROUTES.dashHome, icon: Home }
const DASH_NAV_ITEMS: SubNavItem[] = [
  { title: 'Orders', route: ROUTES.myOrders, icon: Receipt },
  { title: 'Saved Auctions', route: ROUTES.bookmarks, icon: Heart },
  { title: 'Profile', route: ROUTES.profile, icon: User },
]

function userNavItems(type?: string): SubNavItem[] {
  if (type === USER_TYPE_IDS.seller) {
    return [{ title: 'my Auctions', route: ROUTES.myAuctions, icon: List }]
  }
  if (type === USER_TYPE_IDS.admin) {
    return [
      { title: 'Users', route: ROUTES.users, icon: Users },
      { title: 'auctions', route: ROUTES.adminAuctions, icon: Table2 },
    ]
  }
  return []
}

export function SubNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = userStore((s) => s.user)

  async function logout() {
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
      myPurchaseOrders: [],
      mySaleOrders: [],
    })
    toast.info('Logged out', 'auth')
  }

  const items: SubNavItem[] = [DASH_HOME_ITEM, ...userNavItems(user?.type), ...DASH_NAV_ITEMS]

  const isInSetup = location.pathname === ROUTES.setup || !user?.setup

  function itemClasses(disabled: boolean, isActive: boolean) {
    return `flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap capitalize ${
      disabled
        ? 'cursor-not-allowed border-transparent text-gray-300'
        : isActive
          ? 'border-primary text-primary'
          : 'border-transparent hover:text-primary'
    }`
  }

  return (
    <nav className="flex w-full items-stretch justify-evenly overflow-x-auto border-b shadow-sm">
      {items.map((item) => {
        const isActive = location.pathname === item.route
        const disabled = isInSetup && item.route !== ROUTES.setup
        return (
          <button
            type="button"
            key={item.title}
            disabled={disabled}
            onClick={() => navigate({ href: item.route })}
            title={disabled ? 'finish setting up your account' : undefined}
            className={itemClasses(disabled, isActive)}
          >
            <item.icon className="size-4" />
            {item.title}
          </button>
        )
      })}
      <button
        type="button"
        onClick={logout}
        className={itemClasses(false, false)}
      >
        <LogOut className="size-4" />
        logout
      </button>
    </nav>
  )
}
