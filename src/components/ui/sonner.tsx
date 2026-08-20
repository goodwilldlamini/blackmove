import { Toaster as Sonner, type ToasterProps } from 'sonner'

// No theme toggle exists in this app yet (old app was light-mode only), so this
// intentionally skips next-themes and just uses Sonner's CSS-variable styling —
// revisit if/when a dark-mode toggle is added.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
