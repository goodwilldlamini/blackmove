import { useEffect } from 'react'
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { onAuthStateChanged } from 'firebase/auth'

import appCss from '../styles.css?url'
import { Button } from '#/components/ui/button'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import { APP_NAME } from '#/lib/constants'
import { fsAuth } from '#/lib/firebase'
import { appStore } from '#/state/app.store'
import { userStore } from '#/state/user.store'
import type { EdUser } from '#/types/user'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: APP_NAME,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="p-8">
      <h1 className="display-title text-4xl font-bold">Page not found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  )
}

// Wires Firebase auth state into userStore/appStore. Runs client-only (both
// because it's a useEffect, and because db.service.ts — a self-subscribing
// Firestore listener singleton — is dynamically imported here rather than
// statically, so it's never evaluated during SSR).
function AuthListener() {
  useEffect(() => {
    let cancelled = false

    import('#/services/db.service').then(({ dbService }) => {
      if (cancelled) return

      const unsubscribe = onAuthStateChanged(fsAuth, (fbUser) => {
        if (fbUser) {
          const localUser = localStorage.getItem('user')
          const cached: EdUser | null = localUser
            ? JSON.parse(localUser)
            : null
          if (cached) {
            userStore.setState({
              user: { ...cached, likes: cached.likes || [] },
            })
          }
          dbService.listenToUserData()
        } else {
          // Full reset (not a partial merge) so no stale data from a
          // previous session's user survives into the logged-out state.
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
          fsAuth.signOut()
          localStorage.clear()
          dbService.unsubscribeUser()
        }
        appStore.getState().setAuthChecked(true)
      })

      return () => unsubscribe()
    })

    return () => {
      cancelled = true
    }
  }, [])

  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // TODO: Integrate OneSignal push notifications
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthListener />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
