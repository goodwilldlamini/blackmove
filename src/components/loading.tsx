import { Loader2 } from 'lucide-react'
import { appStore } from '#/state/app.store'

export function Loading({ visible }: { visible?: boolean }) {
  const isLoading = appStore((s) => s.isLoading)
  if (!isLoading && !visible) {
    return null
  }
  return (
    <div className="fixed inset-0 z-40 flex h-screen w-screen items-center justify-center bg-black/60">
      <CustomSpinner />
    </div>
  )
}

export function CustomSpinner() {
  return <Loader2 className="size-12 animate-spin text-primary" />
}
