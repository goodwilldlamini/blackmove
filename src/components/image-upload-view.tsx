import { X } from 'lucide-react'

export function ImageUploadView({
  url,
  onClear,
  onClick,
  title,
}: {
  url?: string
  onClear: () => void
  onClick?: () => void
  title?: string
}) {
  return (
    <div className="relative aspect-square w-full">
      <img
        src={url}
        onClick={onClick}
        title={title}
        className={`size-full rounded-xl object-cover ${onClick ? 'cursor-pointer' : ''}`}
        alt=""
      />
      <button
        type="button"
        onClick={onClear}
        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-white shadow"
        aria-label="remove"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
