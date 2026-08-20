import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '#/components/ui/dialog'

export function ImageGallery({ images }: { images: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <div className="w-full pb-4">
      <div className="grid grid-cols-5 grid-rows-3 gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="col-span-3 row-span-3"
        >
          <img
            src={images[0]}
            alt=""
            className="size-full rounded-xl object-cover"
          />
        </button>
        {images.slice(1, 6).map((src, i) => {
          const index = i + 1
          const isLast = index === 5 && images.length > 6
          return (
            <button
              type="button"
              key={src}
              onClick={() => setLightboxIndex(0)}
              className="relative"
            >
              <img
                src={src}
                alt=""
                className="size-full rounded-xl object-cover"
              />
              {isLast && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                  <span className="text-lg font-extrabold text-white sm:text-2xl">
                    See all Photos ({images.length})
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  )
}

function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}) {
  useEffect(() => {
    if (index === null) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onIndexChange(((index ?? 0) + 1) % images.length)
      if (e.key === 'ArrowLeft')
        onIndexChange(((index ?? 0) - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, images.length, onIndexChange])

  return (
    <Dialog open={index !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton
        className="flex max-w-4xl items-center justify-center border-none bg-transparent p-0 shadow-none"
      >
        <DialogTitle className="sr-only">Image {(index ?? 0) + 1}</DialogTitle>
        {index !== null && (
          <div className="relative flex w-full items-center justify-center">
            <img
              src={images[index]}
              alt=""
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="previous"
                  onClick={() =>
                    onIndexChange((index - 1 + images.length) % images.length)
                  }
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label="next"
                  onClick={() => onIndexChange((index + 1) % images.length)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
