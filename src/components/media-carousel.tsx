import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function MediaCarousel({
  images,
  onItemClick,
  autoPlay,
  className,
}: {
  images: string[]
  onItemClick?: (index: number) => void
  autoPlay?: boolean
  className?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function scrollToIndex(index: number) {
    const track = trackRef.current
    if (!track) return
    const clamped = (index + images.length) % images.length
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!autoPlay || images.length < 2) return
    const timer = setInterval(() => scrollToIndex(activeIndex + 1), 4000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, activeIndex, images.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    function onScroll() {
      if (!track) return
      setActiveIndex(Math.round(track.scrollLeft / track.clientWidth))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  if (images.length === 0) return null

  return (
    <div className={`relative w-full ${className || ''}`}>
      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((src, index) => (
          <button
            type="button"
            key={src}
            onClick={() => onItemClick?.(index)}
            className="aspect-4/3 w-full shrink-0 snap-center"
          >
            <img src={src} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="previous"
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="next"
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
          >
            <ChevronRight className="size-6" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((src, index) => (
              <span
                key={src}
                className={`size-1.5 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
