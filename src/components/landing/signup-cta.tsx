import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { ROUTES } from '#/lib/constants'

export function SignUpCta() {
  return (
    <div
      className="w-full bg-cover bg-center bg-primary"
      style={{ backgroundImage: 'url(/images/bg/home.jpeg)' }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 sm:flex-row sm:justify-center">
        <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
          <h2 className="text-center text-xl font-bold text-white sm:text-left sm:text-4xl">
            Join the online market
          </h2>
          <p className="max-w-lg text-center text-sm font-medium text-gray-100 sm:text-left sm:text-lg">
            In two simple steps you can create your account and begin buying
            and selling instantly
          </p>
        </div>
        <Button
          size="lg"
          className="bg-warning text-warning-foreground hover:bg-warning/90"
          asChild
        >
          <Link to={ROUTES.register}>Create free account</Link>
        </Button>
      </div>
    </div>
  )
}
