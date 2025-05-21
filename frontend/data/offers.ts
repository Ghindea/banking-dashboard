import type { Offer, OfferCategory } from "@/types/offers"

// Helper function to generate a unique ID
const generateId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// Create offers data from the provided information
export const offers: Offer[] = [
  {
    id: generateId("Martea MASTERCARD"),
    title: "MASTERCARD Tuesday",
    description: "Every Tuesday, you can receive 10% cashback on your first supermarket payment.",
    imageUrl: "/image.png",
    category: "FOOD",
    cardTypes: ["MASTERCARD"],
    conditions: [
      { description: "Valid only for supermarket payments" },
      { description: "Cashback applied only for the first payment on Tuesday" },
    ],
    ctaText: "Activate offer",
    ctaUrl: "/offers/martea-mastercard",
    badge: "10% CASHBACK",
  },
  {
    id: generateId("George x Freshful"),
    title: "George x Freshful",
    description: "Enjoy 10% discount on your first order of minimum 300 RON, paid with your BCR card.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=grocery%20delivery",
    category: "FOOD",
    cardTypes: ["VISA", "MASTERCARD"],
    conditions: [{ description: "George Customer" }, { description: "Minimum order of 300 RON" }],
    ctaText: "Order now",
    ctaUrl: "/offers/george-freshful",
    partner: "Freshful",
    badge: "10% DISCOUNT",
  },
  {
    id: generateId("MedLife X George"),
    title: "MedLife X George",
    description:
      "Open a George Account before 30.06.2025 and receive money back for payments made in selected participating MedLife centers.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=healthcare%20services",
    category: "HEALTH",
    cardTypes: ["VISA", "MASTERCARD"],
    conditions: [{ description: "George Customer" }, { description: "Payments in participating MedLife centers" }],
    ctaText: "Learn more",
    ctaUrl: "/offers/medlife-george",
    partner: "MedLife",
    expiryDate: "30.06.2025",
  },
  {
    id: generateId("Kaufland Card X George"),
    title: "Kaufland Card X George",
    description:
      "Open a George Account from the Kaufland Card app by 30.06.2025 and get cashback on purchases made in the store.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=kaufland%20store",
    category: "FOOD",
    cardTypes: ["BCR"],
    conditions: [
      { description: "George Customer" },
      { description: "Kaufland Account" },
      { description: "MoneyBack active" },
    ],
    ctaText: "Open account",
    ctaUrl: "/offers/kaufland-george",
    partner: "Kaufland",
    expiryDate: "30.06.2025",
  },
  {
    id: generateId("George 3.0 pentru clientii Dedeman"),
    title: "George 3.0 for Dedeman customers",
    description:
      "Open a George Account from the DEDEMAN website by 30.06.2025 and get cashback on transactions made in stores.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=home%20improvement%20store",
    category: "UTILITIES",
    cardTypes: ["BCR"],
    conditions: [{ description: "George Customer" }, { description: "MoneyBack active" }],
    ctaText: "Open account",
    ctaUrl: "/offers/george-dedeman",
    partner: "Dedeman",
    expiryDate: "30.06.2025",
  },
  {
    id: generateId("GEORGE X OLX"),
    title: "GEORGE X OLX",
    description: "Open a George Account by 30.06.2025 and get cashback on POS or online transactions.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=online%20marketplace",
    category: "E-COMMERCE",
    cardTypes: ["BCR"],
    conditions: [
      { description: "New George Account" },
      { description: "Opened through OLX" },
      { description: "No BCR account in the last 12 months" },
      { description: "MoneyBack active" },
    ],
    ctaText: "Open account",
    ctaUrl: "/offers/george-olx",
    partner: "OLX",
    expiryDate: "30.06.2025",
  },
  {
    id: generateId("Genius Anual pentru clientii George"),
    title: "Annual Genius for George customers",
    description:
      "Open a George Account and get a 100% discount on the eMAG Annual Genius subscription in the first year of activation",
    imageUrl: "/placeholder.svg?height=200&width=400&query=emag%20genius",
    category: "E-COMMERCE",
    cardTypes: ["BCR"],
    conditions: [
      { description: "New George Account" },
      { description: "Opened through eMAG" },
      { description: "No BCR account in the last 12 months" },
      { description: "MoneyBack active" },
    ],
    ctaText: "Activate Genius",
    ctaUrl: "/offers/genius-george",
    partner: "eMAG",
    badge: "100% DISCOUNT",
  },
  {
    id: generateId("George 3.0 pentru clientii Genius"),
    title: "George 3.0 for Genius customers",
    description:
      "Open a George account from the eMAG app and enjoy up to 300 lei cashback on purchases.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=emag%20shopping",
    category: "E-COMMERCE",
    cardTypes: ["BCR"],
    conditions: [
      { description: "New George Account" },
      { description: "Opened through eMAG" },
      { description: "No BCR account in the last 12 months" },
      { description: "MoneyBack active" },
    ],
    ctaText: "Open account",
    ctaUrl: "/offers/george-genius",
    partner: "eMAG",
    badge: "UP TO 300 LEI CASHBACK",
  },
  {
    id: generateId("George 3.0 pentru clientii Vodafone"),
    title: "George 3.0 for Vodafone customers",
    description:
      "Open a George Account from the MyVodafone app by 30.06.2025 and get cashback for transactions made.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=vodafone%20store",
    category: "E-COMMERCE",
    cardTypes: ["BCR"],
    conditions: [
      { description: "New George Account" },
      { description: "Opened through MyVodafone" },
      { description: "No BCR account in the last 12 months" },
      { description: "MoneyBack active" },
    ],
    ctaText: "Open account",
    ctaUrl: "/offers/george-vodafone",
    partner: "Vodafone",
    expiryDate: "30.06.2025",
  },
  {
    id: generateId("GEORGE X PARALELA 45"),
    title: "GEORGE X PARALELA 45",
    description:
      "Campaign organized by Romanian Commercial Bank (BCR) in partnership with Paralela 45, aimed at promoting George banking services and Paralela 45 travel offers.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=travel%20agency",
    category: "TRAVEL",
    cardTypes: ["VISA", "MASTERCARD"],
    conditions: [{ description: "George Customer" }, { description: "Internet & Mobile Banking active" }],
    ctaText: "Discover offers",
    ctaUrl: "/offers/george-paralela45",
    partner: "Paralela 45",
  },
  {
    id: generateId("Asigurare obligatorie gratuita"),
    title: "Get mandatory insurance free for one year!",
    description: "Get your insurance through George and receive mandatory insurance for one year on us!",
    imageUrl: "/placeholder.svg?height=200&width=400&query=home%20insurance",
    category: "HOUSE_INSURANCE",
    cardTypes: ["ANY"],
    conditions: [{ description: "George Customer" }, { description: "Purchase of optional insurance policy" }],
    ctaText: "Insure your home",
    ctaUrl: "/offers/asigurare-obligatorie",
    badge: "1 YEAR FREE",
  },
  {
    id: generateId("1 luna Multi Protect gratuita"),
    title: "1 month Multi Protect free",
    description:
      "Choose to protect your valuable items with Multi Protect insurance, and we'll pay your insurance premium for one month",
    imageUrl: "/placeholder.svg?height=200&width=400&query=insurance%20protection",
    category: "MISCELLANEOUS_INSURANCE",
    cardTypes: ["ANY"],
    conditions: [{ description: "George Customer" }, { description: "Purchase of MultiProtect policy" }],
    ctaText: "Activate insurance",
    ctaUrl: "/offers/multi-protect",
    badge: "1 MONTH FREE",
  },
  {
    id: generateId("Dertour X George"),
    title: "Dertour X George",
    description:
      "DERTOUR offers you a 4% discount for packages including accommodation, flight tickets, and airport-hotel-airport transfers.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=travel%20package",
    category: "TRAVEL",
    cardTypes: ["BCR"],
    conditions: [{ description: "George Customer" }],
    ctaText: "Book now",
    ctaUrl: "/offers/dertour-george",
    partner: "Dertour",
    badge: "4% DISCOUNT",
  },
  {
    id: generateId("Plateste cu cardul Visa FIFA"),
    title: "Pay with Visa card during FIFA World Cup 2022",
    description:
      "Visa cardholders can win a KIA electric car during the FIFA World Cup 2022.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=fifa%20world%20cup",
    category: "TRAVEL",
    cardTypes: ["VISA"],
    conditions: [{ description: "International transaction" }],
    ctaText: "Learn details",
    ctaUrl: "/offers/visa-fifa",
    badge: "WIN A KIA ELECTRIC",
  },
  {
    id: generateId("Black Friday Mastercard x Fashion Days"),
    title: "Black Friday Mastercard x Fashion Days",
    description:
      "Special discounts and offers for Mastercard users on the Fashion Days platform during Black Friday.",
    imageUrl: "/placeholder.svg?height=200&width=400&query=fashion%20black%20friday",
    category: "FASHION",
    cardTypes: ["MASTERCARD"],
    conditions: [{ description: "Payment on FashionDays" }],
    ctaText: "See offers",
    ctaUrl: "/offers/mastercard-fashiondays",
    partner: "Fashion Days",
    badge: "BLACK FRIDAY",
  },
]

// Group offers by category
export const getOffersByCategory = (): Record<OfferCategory, Offer[]> => {
  const categories: Record<OfferCategory, Offer[]> = {
    FOOD: [],
    HEALTH: [],
    UTILITIES: [],
    "E-COMMERCE": [],
    TRAVEL: [],
    HOUSE_INSURANCE: [],
    LIFE_INSURANCE: [],
    MISCELLANEOUS_INSURANCE: [],
    FINANCIAL_INSURANCE: [],
    CULTURAL: [],
    SOCIAL_MEDIA: [],
    FASHION: [],
    TRANSPORT: [],
    CHILDREN: [],
    ALL: offers,
  }

  offers.forEach((offer) => {
    categories[offer.category].push(offer)
  })

  return categories
}

// Get all unique categories that have offers
export const getActiveCategories = (): OfferCategory[] => {
  const categories = getOffersByCategory()
  const activeCategories = Object.keys(categories).filter(
    (key) => key !== "ALL" && categories[key as OfferCategory].length > 0,
  ) as OfferCategory[]
  
  return ["ALL", ...activeCategories]
}

// Get category display names
export const getCategoryDisplayName = (category: OfferCategory): string => {
  const displayNames: Record<OfferCategory, string> = {
    FOOD: "Food",
    HEALTH: "Health",
    UTILITIES: "Utilities",
    "E-COMMERCE": "Online Shopping",
    TRAVEL: "Travel",
    HOUSE_INSURANCE: "Home Insurance",
    LIFE_INSURANCE: "Life Insurance",
    MISCELLANEOUS_INSURANCE: "Other Insurance",
    FINANCIAL_INSURANCE: "Financial Insurance",
    CULTURAL: "Culture",
    SOCIAL_MEDIA: "Social Media",
    FASHION: "Fashion",
    TRANSPORT: "Transport",
    CHILDREN: "Children",
    ALL: "All Offers",
  }

  return displayNames[category]
}
