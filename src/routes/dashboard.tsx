import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { DashNav } from '#/components/dash-nav'
import { SubNav } from '#/components/dash-subnav'
import { ROUTES } from '#/lib/constants'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

// Guarded client-side (not via beforeLoad) because Firebase auth state isn't
// known during SSR — see appStore.authChecked. Mirrors
// old/src/pages/layouts/dash/dash.layout.tsx's redirect rules.
function DashboardLayout() {
  const authChecked = appStore((s) => s.authChecked)
  const user = userStore((s) => s.user)
  const path = Route.useMatch().pathname

  if (!authChecked) {
    return null
  }

  if (!user) {
    toast.warning('Login to continue', 'auth')
    return <Navigate to={ROUTES.login} search={{ redirect: path }} replace />
  }

  const isInSetup = path === ROUTES.setup
  if (!isInSetup && !user.setup) {
    toast.info('Please finish setting up your account', 'setup')
    return <Navigate to={ROUTES.setup} replace />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashNav />
      <SubNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
