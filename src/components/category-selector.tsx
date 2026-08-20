import { CATEGORIES } from '#/lib/app-data'

export function CategorySelector({
  onSelect,
}: {
  onSelect: (category: (typeof CATEGORIES)[number]) => void
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {CATEGORIES.map((item) => (
        <button
          type="button"
          key={item.value}
          onClick={() => onSelect(item)}
          className="group relative aspect-square w-full overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-xl"
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 transition-colors group-hover:from-black/80 group-hover:to-primary/60" />
          <div className="relative flex size-full flex-col items-center justify-center gap-2">
            <item.icon className="size-8 text-white transition-transform group-hover:scale-110 sm:size-10" />
            <span className="text-xl font-semibold text-white/90 capitalize sm:text-2xl">
              {item.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
