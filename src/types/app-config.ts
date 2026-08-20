import type { AgeClass } from './age-class'
import type { AnimalType } from './animal-type'
import type { Bid } from './bid'
import type { Breed } from './breed'
import type { BreedStatus } from './breed-status'
import type { Category } from './category'
import type { FAQCategory } from './faq-category'
import type { InspectListItem } from './inspect-list-item'
import type { ProdSystem } from './prod-systems'
import type { Sex } from './sex'
import type { Vaccine } from './vaccine'

// Backend-driven app configuration document (breeds/categories/fees/etc — distinct
// from the static frontend dropdown data in `lib/app-data.ts`). Was `app_data.model.ts`
// in old/, renamed here to avoid confusion with that file.
export interface AppData {
  breeds?: Breed[]
  animalTypes?: AnimalType[]
  prodSystems?: ProdSystem[]
  ageClasses?: AgeClass[]
  vaccines?: Vaccine[]
  breedStatuses?: BreedStatus[]
  categories?: Category[]
  genders?: Sex[]
  faqCategories?: FAQCategory[]
  bids?: Bid[]
  inspectListItems?: InspectListItem[]
  inspectionFee?: number
  bidDeposit?: number
  profileCover?: string
  avatar?: string
  url?: string
  notifyUrl?: string
  xyd?: string
  xyk?: string
  pfSandbox?: string
  pfLive?: string
  pfXyd?: string
  pfXyk?: string
  company?: any
}
