export type OfferCategory =
  | "FOOD"
  | "HEALTH"
  | "UTILITIES"
  | "E-COMMERCE"
  | "TRAVEL"
  | "HOUSE_INSURANCE"
  | "LIFE_INSURANCE"
  | "MISCELLANEOUS_INSURANCE"
  | "FINANCIAL_INSURANCE"
  | "CULTURAL"
  | "SOCIAL_MEDIA"
  | "FASHION"
  | "TRANSPORT"
  | "CHILDREN"
  | "ALL"

export type CardType = "VISA" | "MASTERCARD" | "MAESTRO" | "BCR" | "ANY"

export interface OfferCondition {
  description: string
}

export interface Offer {
  id: string
  title: string
  description: string
  imageUrl: string
  category: OfferCategory
  cardTypes: CardType[]
  minAge?: number
  conditions: OfferCondition[]
  ctaText: string
  ctaUrl: string
  partner?: string
  badge?: string
  expiryDate?: string
}
