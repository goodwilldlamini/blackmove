import { createFileRoute } from '@tanstack/react-router'
import { HelpCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Banner } from '#/components/banner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { Badge } from '#/components/ui/badge'
import { FAQCategories, faqs } from '#/lib/faq'

export const Route = createFileRoute('/_public/faq')({
  component: FaqPage,
})

const ALL_CATEGORY = { id: 'all-categories', label: 'All' }

function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ALL_CATEGORY.id,
  )

  const questions = useMemo(
    () =>
      selectedCategory === ALL_CATEGORY.id
        ? faqs
        : faqs.filter((el) => el.category === selectedCategory),
    [selectedCategory],
  )

  return (
    <div className="flex w-full flex-col items-center">
      <Banner title="Frequently asked questions" />
      <div className="w-full max-w-4xl px-4 py-12">
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-2">
            {[ALL_CATEGORY, ...FAQCategories].map((item) => {
              const isSelected = selectedCategory === item.id
              return (
                <Badge
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id)}
                  variant={isSelected ? 'default' : 'secondary'}
                  className="cursor-pointer gap-1.5 rounded-full px-4 py-2 text-sm capitalize"
                >
                  <HelpCircle className="size-4" />
                  {item.label} questions
                </Badge>
              )
            })}
          </div>
          <Accordion type="multiple" className="w-full">
            {questions.map((question) => (
              <AccordionItem key={question.id} value={question.id}>
                <AccordionTrigger className="text-base sm:text-lg">
                  {question.q}
                </AccordionTrigger>
                <AccordionContent>{question.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
