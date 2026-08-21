export interface PayoutMethod {
  id?: string
  bank?: string
  name?: string
  acc?: string // text, not a number: account numbers can carry leading zeros
  type?: string
  createdAt?: Date
}
