import { Play } from 'lucide-react'
import { Button } from '#/components/ui/button'

// The old app's video modal was already disabled in production (its JSX was
// commented out, leaving just this plain button) — ported as-is. Real video
// playback belongs with the Phase 6 video-player component when there's an
// actual video source to point it at.
export function WatchButton({ title }: { title?: string }) {
  void title
  return (
    <Button variant="outline">
      <Play />
      watch video
    </Button>
  )
}
