import type { ReactNode } from 'react'

export function PageTitle({
  text,
  children,
  hideDivider,
}: {
  text: string
  children?: ReactNode
  hideDivider?: boolean
}) {
  return (
    <div className="mb-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 pb-4 sm:justify-between">
        <h1 className="hidden text-xl font-semibold capitalize sm:flex sm:text-2xl md:text-4xl">
          {text}
        </h1>
        {children}
      </div>
      {!hideDivider && <hr className="hidden border-border sm:block" />}
    </div>
  )
}
