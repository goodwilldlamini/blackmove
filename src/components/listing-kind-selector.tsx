import { LISTING_KINDS } from '#/lib/app-data'

export function ListingKindSelector({
  onSelect,
}: {
  onSelect: (kind: (typeof LISTING_KINDS)[number]) => void
}) {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {LISTING_KINDS.map((item) => (
        <button
          type="button"
          key={item.value}
          onClick={() => onSelect(item)}
          className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-md transition-shadow hover:shadow-xl"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
            <item.icon className="size-7 text-primary" />
          </span>
          <span className="text-xl font-semibold capitalize">{item.label}</span>
          <span className="text-sm text-muted-foreground">{item.desc}</span>
        </button>
      ))}
    </div>
  )
}
