import {
  Ban,
  Beef,
  CircleCheck,
  Drumstick,
  Footprints,
  Gavel,
  Hourglass,
  Landmark,
  Lock,
  Pause,
  PawPrint,
  Play,
  ShoppingBag,
  Star,
  ThumbsUp,
  User,
  UserCheck,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { APP_NAME } from './constants'

const imgFolder = '/images/categories'

export type AuctionStatus = {
  value: number
  id: string
  action?: string
  icon: LucideIcon
  title: string
  desc?: string
}

export const PROVINCES = [
  { value: '0', label: 'Gauteng' },
  { value: '1', label: 'Limpopo' },
  { value: '2', label: 'KwaZulu-Natal' },
  { value: '3', label: 'Mplumalanga' },
  { value: '8', label: 'Western Cape' },
  { value: '4', label: 'Eastern Cape' },
  { value: '5', label: 'Free State' },
  { value: '6', label: 'Northern Cape' },
  { value: '7', label: 'North West' },
]

export const defaultRequiredMessage = `This field is required`

export enum TITLE_IDS {
  mr = '0',
  ms = '1',
  mrs = '2',
}

export enum USER_TYPE_IDS {
  seller = '0',
  buyer = '1',
  admin = '-1',
  inspector = '2',
  driver = '3',
}

export const USER_TYPE_COLORSCHEME = {
  [USER_TYPE_IDS.buyer.toString()]: 'blue',
  [USER_TYPE_IDS.seller.toString()]: 'teal',
  [USER_TYPE_IDS.inspector.toString()]: 'purple',
  [USER_TYPE_IDS.driver.toString()]: 'pink',
}

export enum GENDER_IDS {
  male = '0',
  female = '1',
}

export const userTitles = [
  { value: TITLE_IDS.mr, label: 'Mr.', gender: GENDER_IDS.male },
  { value: TITLE_IDS.ms, label: 'Ms.', gender: GENDER_IDS.female },
  { value: TITLE_IDS.mrs, label: 'Mrs.', gender: GENDER_IDS.female },
]

export const nonAdminUserTypes = [
  { value: USER_TYPE_IDS.seller, label: 'Seller' },
  { value: USER_TYPE_IDS.buyer, label: 'Buyer' },
]

export const userTypes = [
  ...nonAdminUserTypes,
  { value: USER_TYPE_IDS.admin, label: 'Admin' },
]

export type HIW_STEP = {
  order: number
  icon: LucideIcon
  desc: string
  title: string
}

export const HOW_IT_WORKS_STEPS: { id: string; steps: HIW_STEP[] }[] = [
  {
    id: USER_TYPE_IDS.buyer,
    steps: [
      {
        order: 0,
        icon: User,
        desc: 'Create an account easily by providing us a few personal details',
        title: 'Signup',
      },
      {
        order: 1,
        icon: Wallet,
        desc: 'You will be requested to provide a standard security deposit before bidding',
        title: 'Place deposit',
      },
      {
        order: 2,
        icon: ThumbsUp,
        desc: 'You can start placing bids and winning big! :smile',
        title: 'Start bidding',
      },
    ],
  },
  {
    id: USER_TYPE_IDS.seller,
    steps: [
      {
        order: 0,
        icon: User,
        desc: 'Create an account by providing a few details and uploading all supporting documents',
        title: 'Signup',
      },
      {
        order: 1,
        icon: UserCheck,
        desc: `The ${APP_NAME} team will evaluate your profile, plus documents, and approve your account if nothing is missing`,
        title: 'Account verification',
      },
      {
        order: 2,
        icon: ThumbsUp,
        desc: 'You can start selling! Note: all auction go through a review process before launch',
        title: 'Start selling',
      },
    ],
  },
]

export enum CATEGORY_IDS {
  cattle = '0',
  sheep = '1',
  goats = '2',
  pigs = '3',
  poultry = '4',
}

// TODO(Phase 6): swap for dedicated animal-category artwork/icons — lucide-react has
// no cattle/sheep/goat/pig icons, these are the closest generic stand-ins.
export const CATEGORIES = [
  {
    value: CATEGORY_IDS.cattle,
    label: 'cattle',
    icon: Beef,
    image: `${imgFolder}/cattle_2.jpg`,
  },
  {
    value: CATEGORY_IDS.sheep,
    label: 'sheep',
    icon: Footprints,
    image: `${imgFolder}/sheep_2.jpg`,
  },
  {
    value: CATEGORY_IDS.goats,
    icon: PawPrint,
    label: 'goats',
    image: `${imgFolder}/goat.jpg`,
  },
  {
    value: CATEGORY_IDS.pigs,
    icon: Drumstick,
    label: 'pigs',
    image: `${imgFolder}/pig.jpg`,
  },
]

export const GENDERS = [
  { value: GENDER_IDS.male, label: 'Male' },
  { value: GENDER_IDS.female, label: 'female' },
]

export const VACCINES = [
  { value: 'vc_0', label: 'Brucellosis/ Epididymitis' },
  { value: 'vc_1', label: 'Rift Valley Fever (RVF)/ Enzootic Hepatitis' },
  { value: 'vc_2', label: 'Lumpy Skin Disease (LSD)' },
  { value: 'vc_3', label: 'Sheep Pox (SPP)' },
  { value: 'vc_4', label: 'Goat Pox (GTP)' },
  { value: 'vc_5', label: 'Peste Des Petits (PPR)' },
  { value: 'vc_6', label: 'Clostridial Myositis' },
  { value: 'vc_7', label: 'Gas Gangrene' },
  { value: 'vc_8', label: 'Malignant Oedema' },
  { value: 'vc_9', label: 'Black Quarter' },
  { value: 'vc_10', label: 'Uterine Gas Gangrene' },
  { value: 'vc_11', label: 'Necrotic Hepatitis' },
  { value: 'vc_12', label: 'Enterotoxaemia' },
  { value: 'vc_13', label: 'Pulpy Kidney' },
  { value: 'vc_14', label: 'Redgut' },
  { value: 'vc_15', label: 'Lamb dysentery' },
  { value: 'vc_16', label: 'Haemorrhagic enteritis)' },
  { value: 'vc_17', label: 'Tetanus/Lock-jaw/Klem-in-die-kaak' },
  { value: 'vc_18', label: 'Enzootic Abortion/Chlamydiosis' },
  { value: 'vc_19', label: 'Newcastle Disease' },
  { value: 'vc_20', label: 'Swine Erysipelas' },
  { value: 'vc_21', label: 'Marek’s Disease' },
  { value: 'vc_22', label: 'Botulism/Lamsiektel gallemsiekte' },
  { value: 'vc_23', label: 'Anthrax/ Miltsiekte' },
  { value: 'vc_24', label: 'Blue Udder/ Blue bag' },
  { value: 'vc_25', label: 'Wesselbron Disease' },
  { value: 'vc_26', label: 'Quarter Evil/Black quarter/Black Leg' },
  { value: 'vc_27', label: 'Pastruella' },
  { value: 'vc_28', label: 'Heart Water' },
  { value: 'vc_29', label: 'RickettsiosisGaseous lymphadenitis' },
  { value: 'vc_30', label: 'Cheesy gland disease' },
  { value: 'vc_31', label: 'psuendoteberculosislabsesse' },
  { value: 'vc_32', label: 'E.coli' },
  { value: 'vc_33', label: 'Vibrio' },
  { value: 'vc_34', label: 'Paratyphoid' },
  { value: 'vc_35', label: '3 day stiffness' },
  { value: 'vc_36', label: 'Mycoplasma' },
]

export const AGE_CLASSES: {
  category: string
  value: string
  label: string
}[] = [
  { category: CATEGORY_IDS.cattle, value: 'ac_0', label: `calf` },
  {
    category: CATEGORY_IDS.cattle,
    value: 'ac_1',
    label: `heifer (female that has not given birth)`,
  },
  {
    category: CATEGORY_IDS.cattle,
    value: 'ac_2',
    label: `cow (female that has given birth)`,
  },
  { category: CATEGORY_IDS.cattle, value: 'ac_3', label: `bull` },

  { category: CATEGORY_IDS.sheep, value: 'ac_4', label: 'lamb' },
  { category: CATEGORY_IDS.sheep, value: 'ac_5', label: 'ewe' },
  { category: CATEGORY_IDS.sheep, value: 'ac_6', label: 'ram (uncastrated)' },
  {
    category: CATEGORY_IDS.sheep,
    value: 'ac_7',
    label: 'wether (castrated)',
  },

  { category: CATEGORY_IDS.goats, value: 'ac_8', label: 'kid' },
  {
    category: CATEGORY_IDS.goats,
    value: 'ac_9',
    label: 'nanny (female adult)',
  },
  {
    category: CATEGORY_IDS.goats,
    value: 'ac_10',
    label: 'billy (uncastrated)',
  },
  {
    category: CATEGORY_IDS.goats,
    value: 'ac_11',
    label: 'wether (castrated)',
  },
  { value: 'ac_12', category: CATEGORY_IDS.pigs, label: 'piglet' },
  {
    value: 'ac_13',
    category: CATEGORY_IDS.pigs,
    label: 'sow (female that has given birth)',
  },
  {
    value: 'ac_14',
    category: CATEGORY_IDS.pigs,
    label: 'gilt (female that has not given birth)',
  },
  { value: 'ac_15', category: CATEGORY_IDS.pigs, label: 'boar (any male)' },
  {
    value: 'ac_16',
    category: CATEGORY_IDS.pigs,
    label: 'shoat (juvenile male)',
  },
  {
    value: 'ac_17',
    category: CATEGORY_IDS.pigs,
    label: 'barrow (castrated male)',
  },
]

export const PROD_SYSTEMS = [
  { value: 'ps_0', label: 'Feedlot' },
  { value: 'ps_1', label: 'Grainfed' },
  { value: 'ps_2', label: 'Grassfed' },
  { value: 'ps_3', label: 'Free Range' },
  { value: 'ps_4', label: 'Intensive' },
  { value: 'ps_5', label: 'Openland' },
]

export const BREED_TYPES = [
  { value: 'br_s_0', label: 'Stud' },
  { value: 'br_s_1', label: 'Commercial' },
  { value: 'br_s_2', label: 'Mixed' },
]

export const BREEDS = [
  { value: 'br_0', category: CATEGORY_IDS.cattle, label: 'Afrikaner' },
  { value: 'br_1', category: CATEGORY_IDS.cattle, label: 'Nguni' },
  { value: 'br_2', category: CATEGORY_IDS.cattle, label: 'Bonsmara' },
  { value: 'br_3', category: CATEGORY_IDS.cattle, label: 'Sanga' },
  { value: 'br_4', category: CATEGORY_IDS.cattle, label: 'Drakensberger' },
  { value: 'br_5', category: CATEGORY_IDS.cattle, label: 'Boran' },
  { value: 'br_6', category: CATEGORY_IDS.cattle, label: 'Sussex' },
  { value: 'br_7', category: CATEGORY_IDS.cattle, label: 'Beefmaster' },
  { value: 'br_8', category: CATEGORY_IDS.cattle, label: 'Belmont Red' },
  { value: 'br_9', category: CATEGORY_IDS.cattle, label: 'Brahman' },
  { value: 'br_10', category: CATEGORY_IDS.cattle, label: 'Simmentaler' },
  { value: 'br_11', category: CATEGORY_IDS.cattle, label: 'Hereford' },
  { value: 'br_12', category: CATEGORY_IDS.cattle, label: 'Angus' },
  { value: 'br_13', category: CATEGORY_IDS.cattle, label: 'Zebu' },
  { value: 'br_14', category: CATEGORY_IDS.cattle, label: 'Braford' },
  { value: 'br_15', category: CATEGORY_IDS.cattle, label: 'Braunvieh' },
  { value: 'br_16', category: CATEGORY_IDS.cattle, label: 'Charolais' },
  { value: 'br_17', category: CATEGORY_IDS.cattle, label: 'Gelbvieh' },
  { value: 'br_18', category: CATEGORY_IDS.cattle, label: 'Hereford' },
  { value: 'br_19', category: CATEGORY_IDS.cattle, label: 'Huguenot' },
  { value: 'br_20', category: CATEGORY_IDS.cattle, label: 'Limousin' },
  { value: 'br_21', category: CATEGORY_IDS.cattle, label: 'Santa Gertrudis' },
  { value: 'br_22', category: CATEGORY_IDS.cattle, label: 'Simbra' },
  { value: 'br_23', category: CATEGORY_IDS.cattle, label: 'Sussex' },
  { value: 'br_24', category: CATEGORY_IDS.cattle, label: 'Tuli' },
  { value: 'br_25', category: CATEGORY_IDS.cattle, label: 'Holstein' },
  { value: 'br_26', category: CATEGORY_IDS.cattle, label: 'Brangus' },
  { value: 'br_27', category: CATEGORY_IDS.cattle, label: 'Crossbreed' },
  // start :: goat
  { value: 'br_28', category: CATEGORY_IDS.goats, label: 'Boer' },
  { value: 'br_29', category: CATEGORY_IDS.goats, label: 'Khalahari Red' },
  { value: 'br_30', category: CATEGORY_IDS.goats, label: 'Saamem' },
  { value: 'br_31', category: CATEGORY_IDS.goats, label: 'Toggenberg' },
  { value: 'br_32', category: CATEGORY_IDS.goats, label: 'Meatmaster' },
  { value: 'br_33', category: CATEGORY_IDS.goats, label: 'Savanna White' },
  { value: 'br_34', category: CATEGORY_IDS.goats, label: 'Nguni' },
  {
    value: 'br_35',
    category: CATEGORY_IDS.goats,
    label: 'Northern Cape Speckled Goat',
  },
  {
    value: 'br_36',
    category: CATEGORY_IDS.goats,
    label: 'Eastern Cape lobe-ear goat',
  },
  // start :: sheep
  { value: 'br_37', category: CATEGORY_IDS.sheep, label: 'Dorper' },
  { value: 'br_38', category: CATEGORY_IDS.sheep, label: 'Dohne Merino' },
  { value: 'br_39', category: CATEGORY_IDS.sheep, label: 'Damara' },
  { value: 'br_40', category: CATEGORY_IDS.sheep, label: 'Merino' },
  { value: 'br_41', category: CATEGORY_IDS.sheep, label: 'Afrino' },
  { value: 'br_42', category: CATEGORY_IDS.sheep, label: 'Van Rooy' },
  { value: 'br_43', category: CATEGORY_IDS.sheep, label: 'Afrikaner' },
  { value: 'br_44', category: CATEGORY_IDS.sheep, label: 'Blackhead Persian' },
  { value: 'br_45', category: CATEGORY_IDS.sheep, label: 'Zulu' },
  { value: 'br_46', category: CATEGORY_IDS.sheep, label: 'BaPedi' },
  { value: 'br_47', category: CATEGORY_IDS.sheep, label: 'Namaqua Afrikaner' },
  { value: 'br_48', category: CATEGORY_IDS.sheep, label: 'Meatmaster' },
  { value: 'br_49', category: CATEGORY_IDS.sheep, label: 'Elliottdale' },
  // start :: pig
  { value: 'br_50', category: CATEGORY_IDS.pigs, label: 'Large White' },
  { value: 'br_51', category: CATEGORY_IDS.pigs, label: 'Landrace' },
  { value: 'br_52', category: CATEGORY_IDS.pigs, label: 'Duroc' },
  { value: 'br_53', category: CATEGORY_IDS.pigs, label: 'Chester White' },
  { value: 'br_54', category: CATEGORY_IDS.pigs, label: 'Kolbroek' },
  { value: 'br_55', category: CATEGORY_IDS.pigs, label: 'Pietrain' },
  { value: 'br_56', category: CATEGORY_IDS.pigs, label: 'Large Black' },
  { value: 'br_57', category: CATEGORY_IDS.pigs, label: 'Hampshire' },
  // start :: poultry
  { value: 'br_58', category: CATEGORY_IDS.poultry, label: 'Broiler' },
  { value: 'br_59', category: CATEGORY_IDS.poultry, label: 'Layer' },
  { value: 'br_60', category: CATEGORY_IDS.poultry, label: 'Boschveld' },
  { value: 'br_61', category: CATEGORY_IDS.poultry, label: 'Naked Neck' },
  { value: 'br_62', category: CATEGORY_IDS.poultry, label: 'Ovambo' },
  {
    value: 'br_63',
    category: CATEGORY_IDS.poultry,
    label: 'Potchefstroom Koekoek',
  },
  { value: 'br_64', category: CATEGORY_IDS.poultry, label: 'Venda' },
  { value: 'br_65', category: CATEGORY_IDS.poultry, label: 'Australorp' },
  { value: 'br_66', category: CATEGORY_IDS.poultry, label: 'Lohmann Brown' },
  { value: 'br_67', category: CATEGORY_IDS.poultry, label: 'Silkie' },
  { value: 'br_68', category: CATEGORY_IDS.poultry, label: 'Seabright' },
  { value: 'br_69', category: CATEGORY_IDS.poultry, label: 'Polish' },
  { value: 'br_70', category: CATEGORY_IDS.poultry, label: 'Old English Game' },
  { value: 'br_71', category: CATEGORY_IDS.poultry, label: 'Pekin' },
  { value: 'br_72', category: CATEGORY_IDS.poultry, label: 'Shamo' },
]

export const ANIMAL_TYPES = [
  { value: 'at_0', label: 'Dairy' },
  { value: 'at_1', label: 'Meat' },
  { value: 'at_2', label: 'Fibre' },
  { value: 'at_3', label: 'Ornamental' },
]

export const STATUS_IDS = {
  saved: 0,
  pendingApproval: 1,
  published: 2,
  paused: 3,
  ended: 4,
  concluded: 5,
  concludedSold: 6,
  cancelledByUser: 7,
  reserved: 8,
}

export enum LISTING_KIND_IDS {
  auction = '0',
  buyNow = '1',
}

export const LISTING_KINDS = [
  {
    value: LISTING_KIND_IDS.auction,
    label: 'auction',
    icon: Gavel,
    desc: `Buyers place bids and the highest bid wins when time runs out`,
  },
  {
    value: LISTING_KIND_IDS.buyNow,
    label: 'buy now',
    icon: ShoppingBag,
    desc: `Set one fixed price - the first buyer to pay takes the lot`,
  },
]

export const concludedStatus: AuctionStatus = {
  id: 'd7549560-0756-11ed-87e5-f157482f623d',
  title: 'concluded',
  icon: Lock,
  value: STATUS_IDS.concluded,
  desc: `Your auction has closed after being live`,
}
export const savedStatus: AuctionStatus = {
  id: '5e13d770-ffa8-11ec-90d6-735650c6dc1e',
  title: 'saved',
  icon: Zap,
  action: 'save and do nothing',
  value: STATUS_IDS.saved,
  desc: `Your auction is saved and visible only to you`,
}
export const approvalStatus: AuctionStatus = {
  id: 'ad4970b0-ffa9-11ec-90d6-735650c6dc1e',
  title: 'pending approval',
  icon: Star,
  action: 'submit for approval',
  value: STATUS_IDS.pendingApproval,
  desc: `Your auction is sent to admin for approval and will go live on approval`,
}
export const publishedStatus: AuctionStatus = {
  id: 'a96fb8f0-ffa9-11ec-90d6-735650c6dc1e',
  title: 'published',
  icon: Play,
  value: STATUS_IDS.published,
  desc: `Your auction is available to the public and accepting bids`,
}
export const endedStatus: AuctionStatus = {
  id: '523718f0-042f-11ed-b407-032b3ec5c649',
  icon: Ban,
  title: 'Ended by seller',
  action: 'end auction & accept last bid',
  value: STATUS_IDS.ended,
  desc: `You ended the auction before time had elapsed`,
}
export const reservedStatus: AuctionStatus = {
  id: '0f1c6a10-5b21-4c8e-9a77-2c1d4b6f8e30',
  title: 'reserved',
  icon: Hourglass,
  value: STATUS_IDS.reserved,
  desc: `A buyer has claimed this listing and payment is pending`,
}
export const concludedSoldStatus: AuctionStatus = {
  id: '7a3e5b90-1d64-4f2a-b8c5-9e07a4d61b28',
  title: 'sold',
  icon: CircleCheck,
  value: STATUS_IDS.concludedSold,
  desc: `This listing has been sold and paid for`,
}
export const pausedStatus: AuctionStatus = {
  id: 'c25d8f40-6a13-4e77-95b2-3f8c0d1e7a94',
  title: 'paused',
  icon: Pause,
  value: STATUS_IDS.paused,
  desc: `This listing is temporarily hidden from the public`,
}
export const cancelledStatus: AuctionStatus = {
  id: 'e94b2c70-8d05-41f6-a3e9-6b7d2f0c85a1',
  title: 'cancelled',
  icon: Ban,
  value: STATUS_IDS.cancelledByUser,
  desc: `You cancelled this listing`,
}

export const AUCTION_STATUSES: AuctionStatus[] = [
  savedStatus,
  approvalStatus,
  publishedStatus,
  pausedStatus,
  endedStatus,
  concludedStatus,
  concludedSoldStatus,
  cancelledStatus,
  reservedStatus,
]

export const COMPANY_DATA = {
  phone: '(+27) 78 755 4714',
  email: 'info@agrimall.com',
  address: `Unit 307, Building 3

Waterfall Point Office Park

Cnr Waterfall Drive and Woodmead Drive, Waterfall

2090`,
}

export const BANKS = [
  { value: 'bk_0', label: 'Absa Group Limited' },
  { value: 'bk_1', label: 'African Bank Limited' },
  { value: 'bk_2', label: 'Bidvest Bank Limited' },
  { value: 'bk_3', label: 'Capitec Bank Limited' },
  { value: 'bk_4', label: 'Discovery Limited' },
  { value: 'bk_5', label: 'First National Bank' },
  {
    value: 'bk_6',
    label: 'FirstRand Bank - A subsidiary of First Rand Limited',
  },
  { value: 'bk_7', label: 'Grindrod Bank Limited' },
  { value: 'bk_8', label: 'Imperial Bank South Africa' },
  { value: 'bk_9', label: 'Investec Bank Limited' },
  { value: 'bk_10', label: 'Mercantile Bank Limited' },
  { value: 'bk_11', label: 'Nedbank Limited' },
  { value: 'bk_12', label: 'Sasfin Bank Limited' },
  { value: 'bk_13', label: 'Standard Bank of South Africa' },
  { value: 'bk_14', label: 'Ubank Limited' },
  { value: 'bk_15', label: 'TymeBank' },
]

export enum TRANSACTION_STATUS_IDS {
  pending = '0',
  complete = '1',
  cancelledByAdmin = '-1',
  cancelledByUser = '-2',
}

export const TRANSACTION_STATUSES = [
  { label: 'pending', value: TRANSACTION_STATUS_IDS.pending },
  { label: 'complete', value: TRANSACTION_STATUS_IDS.complete },
  {
    label: 'cancelled by admin',
    value: TRANSACTION_STATUS_IDS.cancelledByAdmin,
  },
  {
    label: 'cancelled by user',
    value: TRANSACTION_STATUS_IDS.cancelledByUser,
  },
]

export type TransactionFee = {
  label: string
  value: number
  type: FEE_TYPE
  amount?: number
}

export enum FEE_TYPE {
  perc = '0',
  flat = '1',
}

export enum FEE_IDS {
  service = 'service',
  vat = 'vat',
  processing = 'processing',
}

export const FEES: { [key in FEE_IDS]: TransactionFee } = {
  [FEE_IDS.service]: {
    label: 'service fee',
    value: 5,
    type: FEE_TYPE.perc,
  },
  [FEE_IDS.processing]: {
    label: 'processing fee',
    value: 4,
    type: FEE_TYPE.perc,
  },
  [FEE_IDS.vat]: {
    label: 'value added tax',
    value: 15,
    type: FEE_TYPE.perc,
  },
}

export enum ORDER_STATUS_IDS {
  pendingPayment = '0',
  awaitingEftConfirmation = '1',
  paid = '2',
  cancelled = '3',
  expired = '4',
}

export const ORDER_STATUSES = [
  {
    value: ORDER_STATUS_IDS.pendingPayment,
    label: 'awaiting payment',
    icon: Hourglass,
    desc: `The listing is reserved and payment has not been made yet`,
  },
  {
    value: ORDER_STATUS_IDS.awaitingEftConfirmation,
    label: 'awaiting confirmation',
    icon: Landmark,
    desc: `The buyer submitted proof of an EFT payment awaiting confirmation`,
  },
  {
    value: ORDER_STATUS_IDS.paid,
    label: 'paid',
    icon: CircleCheck,
    desc: `Payment has been received and the sale is complete`,
  },
  {
    value: ORDER_STATUS_IDS.cancelled,
    label: 'cancelled',
    icon: Ban,
    desc: `The order was cancelled before payment was completed`,
  },
  {
    value: ORDER_STATUS_IDS.expired,
    label: 'expired',
    icon: Lock,
    desc: `The reservation hold lapsed before payment was completed`,
  },
]

export enum ORDER_PAYMENT_METHOD_IDS {
  online = '0',
  eft = '1',
}

export const ORDER_PAYMENT_METHODS = [
  {
    value: ORDER_PAYMENT_METHOD_IDS.online,
    label: 'pay online',
    icon: Wallet,
    desc: `Pay instantly by card - your purchase is confirmed right away`,
  },
  {
    value: ORDER_PAYMENT_METHOD_IDS.eft,
    label: 'bank transfer (EFT)',
    icon: Landmark,
    desc: `Pay by EFT and upload proof of payment - confirmed once received`,
  },
]

// how long a listing stays reserved for the buyer before another buyer may claim it
export const ONLINE_HOLD_MINUTES = 30
export const EFT_HOLD_HOURS = 48

// TODO: replace the placeholders with the real company banking details
export const COMPANY_BANK_DETAILS = {
  accountName: `${APP_NAME} (Pty) Ltd`,
  bank: 'Standard Bank of South Africa',
  accountNumber: '000 000 000',
  branchCode: '000000',
  accountType: 'Cheque',
}

export const TRANSACTION_TYPE_IDS = {
  depositPaid: '0',
  depositPaidOut: '1',
  depositDownPayment: '2', // deposit is taken to set
  auctionBalance: '3',
  auctionPayout: '4',
}

export const TRANSACTION_TYPES = {
  [TRANSACTION_TYPE_IDS.depositPaid]: {
    desc: 'Auction deposit paid',
    title: 'auction deposit',
    op: 0, // operator, 0 credit -, 1 debit +
  },
  [TRANSACTION_TYPE_IDS.depositPaidOut]: {
    desc: 'Auction deposit pay out',
    title: 'auction deposit',
    fees: [],
    op: 1,
  },
  [TRANSACTION_TYPE_IDS.depositDownPayment]: {
    desc: 'Deposit set as initial payment to won auction',
    title: 'auction deposit',
    op: 0,
  },
  [TRANSACTION_TYPE_IDS.auctionBalance]: {
    desc: 'Auction Balance Paid',
    title: 'auction balance',
    op: 0,
  },
  [TRANSACTION_TYPE_IDS.auctionPayout]: {
    desc: 'Auction Purchase Price Payout',
    title: 'Total price',
    op: 1,
  },
}
