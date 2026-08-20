import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { userStore } from '#/state/user.store'

export const Route = createFileRoute('/_public/_auth')({
  component: AuthLayout,
})

// Redirects away from login/register/reset if already signed in — mirrors
// old/src/pages/layouts/auth.layout.tsx.
function AuthLayout() {
  const user = userStore((s) => s.user)

  if (user) {
    return <Navigate to="/dashboard/home" replace />
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <Outlet />
    </div>
  )
}
