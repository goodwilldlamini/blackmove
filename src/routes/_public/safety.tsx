import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react'
import { Banner } from '#/components/banner'
import { WhyUsSection } from '#/components/why-us-section'

export const Route = createFileRoute('/_public/safety')({
  component: SafetyPage,
})

const METHODS = [
  {
    title: 'information security',
    id: 'd4dade90-3684-11ed-ab44-11590a37e7b0',
    desc: `Nisi sit voluptate tempor officia amet. Duis est nulla culpa minim ut sit tempor ad officia adipisicing enim dolor. Quis in voluptate qui consequat irure officia cupidatat ullamco non. Cupidatat esse aliquip cupidatat elit mollit sit do qui est consectetur dolor proident commodo. Aliqua aute officia sint ullamco veniam id consequat et consequat adipisicing amet. Aliquip adipisicing consequat pariatur commodo id ipsum adipisicing non et exercitation consequat minim occaecat sit. Voluptate magna enim mollit est minim proident anim sint duis ullamco dolor elit esse.`,
  },
  {
    title: 'payment information',
    id: 'd9efae60-3684-11ed-ab44-11590a37e7b0',
    desc: `Ullamco voluptate sunt enim elit officia voluptate. Commodo amet reprehenderit exercitation ea exercitation. Aute ea sint sunt nostrud adipisicing amet dolor amet Lorem dolore incididunt labore do nulla. Id culpa elit sit duis irure aliquip eu sint qui pariatur tempor.`,
  },
  {
    title: 'address information',
    id: 'df2dff30-3684-11ed-ab44-11590a37e7b0',
    desc: `Dolore sunt nulla excepteur consectetur occaecat velit in sint nisi et. Occaecat nostrud culpa sint ad in in eiusmod ut magna sint laborum velit. Duis cupidatat enim sunt non ipsum pariatur minim.`,
  },
  {
    title: 'user vetting',
    id: 'df2dff31-3684-11ed-ab44-11590a37e7b0',
    desc: `Dolore sunt nulla excepteur consectetur occaecat velit in sint nisi et. Occaecat nostrud culpa sint ad in in eiusmod ut magna sint laborum velit. Duis cupidatat enim sunt non ipsum pariatur minim.`,
  },
]

function SafetyPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <Banner title="safety & trust" />
      <div className="w-full bg-gray-800 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4">
          <h2 className="max-w-xl text-center text-2xl font-semibold text-white sm:text-3xl">
            These are some of the ways we keep you safe...
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {METHODS.map((method) => (
              <div key={method.id} className="flex w-full items-start gap-3">
                <CheckCircle2 className="mt-1 size-6 shrink-0 text-white" />
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-lg font-semibold text-white/90 capitalize sm:text-xl">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-400">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <WhyUsSection />
    </div>
  )
}
