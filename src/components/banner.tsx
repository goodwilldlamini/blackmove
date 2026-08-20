export function Banner({ title }: { title: string }) {
  return (
    <div
      className="flex h-[22vh] w-full items-center justify-center bg-cover bg-center sm:h-[35vh]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(/images/bg/banner2.jpg)`,
      }}
    >
      <div className="rounded-xl bg-black/50 px-6 py-4">
        <h1 className="display-title text-xs text-white/90 capitalize sm:text-sm">
          {title}
        </h1>
      </div>
    </div>
  )
}
