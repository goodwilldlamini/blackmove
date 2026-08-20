import { APP_NAME } from './constants'

export const enum FAQID {
  general = '52a92bd0-342b-11ed-b75e-75f7cc16decd',
  payments = '574c4e10-342b-11ed-b75e-75f7cc16decd',
}

export const FAQCategories = [
  { id: FAQID.general, label: 'general' },
  { id: FAQID.payments, label: 'payments' },
]

export const faqs = [
  {
    category: FAQID.general,
    id: 'c075d0c0-342e-11ed-b75e-75f7cc16decd',
    q: 'How do i receive my livestock after winning an auction?',
    a: 'Consectetur irure fugiat consequat excepteur non culpa sunt pariatur eu ut ex id.',
  },
  {
    category: FAQID.general,
    id: 'c479a5c0-342e-11ed-b75e-75f7cc16decd',
    q: 'What should I do if I feel my username and/or password have been compromisedcompromised?',
    a: 'Consectetur irure fugiat consequat excepteur non culpa sunt pariatur eu ut ex id.',
  },
  {
    category: FAQID.general,
    id: 'cdd212b0-342e-11ed-b75e-75f7cc16decd',
    q: 'How old must i be to participate in an auction?',
    a: 'Consectetur irure fugiat consequat excepteur non culpa sunt pariatur eu ut ex id.',
  },
  {
    category: FAQID.payments,
    id: 'd14344a0-342e-11ed-b75e-75f7cc16decd',
    q: `What percentage admin fee is payable to ${APP_NAME}?`,
    a: 'Consectetur irure fugiat consequat excepteur non culpa sunt pariatur eu ut ex id.',
  },
  {
    category: FAQID.payments,
    id: 'd47dd630-342e-11ed-b75e-75f7cc16decd',
    q: `What percentage admin fee do sellers from Namibia and Botswana have to pay?`,
    a: 'Consectetur irure fugiat consequat excepteur non culpa sunt pariatur eu ut ex id.',
  },
  {
    category: FAQID.payments,
    id: 'd864d460-342e-11ed-b75e-75f7cc16decd',
    q: `How much commission do buyers pay?`,
    a: 'Consectetur irure fugiat consequat excepteur non culpa sunt pariatur eu ut ex id.',
  },
]
