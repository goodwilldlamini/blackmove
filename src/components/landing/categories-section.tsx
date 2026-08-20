import { Link } from '@tanstack/react-router'
import { CATEGORIES } from '#/lib/app-data'
import { APP_NAME, ROUTES } from '#/lib/constants'

export function CategoriesSection() {
  return (
    <div className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-xs font-extrabold tracking-wider text-warning uppercase">
              Categories
            </span>
            <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl md:text-3xl">
              Browse by category
            </h2>
            <p className="max-w-2xl text-sm text-gray-500 sm:text-base">
              From cattle to poultry, explore live auctions across every kind
              of livestock traded on {APP_NAME}.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                to={ROUTES.auctions}
                className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                <category.icon className="size-8 text-primary" />
                <span className="font-medium text-gray-700 capitalize">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
