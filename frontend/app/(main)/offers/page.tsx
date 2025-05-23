"use client"

import { useState, useEffect } from "react"
import { OfferCard } from "@/components/offer-card"
import { OffersTabs } from "@/components/offers-tabs"
import type { OfferCategory } from "@/types/offers"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { cn } from "@/lib/utils"

interface OffersResponse {
  offers: {
    client_id: string
    offers: Offer[]
  }
}

interface Offer {
  CATEG: string       // Category
  DESCR: string       // Description  
  ELIG: string        // Eligibility
  LINK: string | null // Link to offer
  PROD: string        // Product name
  SEG_ID: string      // Segment ID
}

// Convert backend offer to frontend offer format
const convertOfferToCard = (offer: Offer, index: number) => ({
  id: index.toString(),
  title: offer.PROD,
  description: offer.DESCR,
  category: offer.CATEG as OfferCategory,
  eligibility: parseInt(offer.ELIG),
  link: offer.LINK,
  segmentId: offer.SEG_ID,
  // Add default values for OfferCard compatibility
  imageUrl: "/placeholder.svg",
  badge: parseInt(offer.ELIG) >= 18 ? "18+" : undefined,
  partner: undefined,
  cardTypes: [offer.CATEG],
  minAge: parseInt(offer.ELIG) >= 18 ? parseInt(offer.ELIG) : undefined,
  conditions: [],
  expiryDate: undefined,
  ctaText: offer.LINK ? "Learn More" : "View Details",
})

export default function OffersPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<OfferCategory>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [offers, setOffers] = useState<Offer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Add this new state for category cycling
  const [categoryStartIndex, setCategoryStartIndex] = useState(0)

  // Get unique categories from offers
  const getCategories = (): OfferCategory[] => {
    const uniqueCategories = Array.from(new Set(offers.map(o => o.CATEG as OfferCategory)))
    return ["ALL", ...uniqueCategories]
  }

  // Fetch offers from backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get<OffersResponse>('http://20.185.231.218:5000/user/offers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
          },
          timeout: 5000
        })

        console.log('Full API response:', response.data)

        // Parse the nested structure correctly
        const offersData = response.data.offers.offers // Note: double .offers
        console.log('Parsed offers:', offersData)

        setOffers(offersData)
        setError(null)
      } catch (error) {
        console.error('Error fetching offers:', error)
        setError('Failed to load offers')
        setOffers([])
      } finally {
        setIsLoading(false)
      }
    }

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated) {
      fetchOffers()
    } else {
      setIsLoading(false)
      setError('Please log in to view offers')
    }
  }, [])

  // Filter offers based on category and search
  useEffect(() => {
    let filtered = offers

    // Filter by category
    if (activeCategory !== "ALL") {
      filtered = filtered.filter(offer => offer.CATEG === activeCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(offer =>
        offer.PROD.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.DESCR.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.CATEG.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.SEG_ID.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Convert to card format
    const convertedOffers = filtered.map((offer, index) => convertOfferToCard(offer, index))
    setFilteredOffers(convertedOffers)
  }, [offers, activeCategory, searchQuery])

  // Add this function to cycle through categories
  const cycleCategories = () => {
    const categories = getCategories()
    const maxVisible = 6 // Show 6 categories at a time
    const nextIndex = (categoryStartIndex + maxVisible) % categories.length
    setCategoryStartIndex(nextIndex)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container pt-0 pb-8 max-w-7xl">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Special Offers</h1>
            <Button onClick={() => router.push("/dashboard")} variant="ghost" className="text-gray-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <p className="text-gray-500">Loading your personalized offers...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container pt-0 pb-8 max-w-7xl">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Special Offers</h1>
            <Button onClick={() => router.push("/dashboard")} variant="ghost" className="text-gray-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Offers</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const categories = getCategories()

  return (
    <div className="container pt-0 pb-8 max-w-7xl">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Special Offers</h1>
          <Button onClick={() => router.push("/dashboard")} variant="ghost" className="text-gray-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <p className="text-gray-500">Discover exclusive offers and promotions tailored for you</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className={cn(
          "w-full transition-all duration-300 ease-in-out",
          isSearchFocused
            ? "md:w-1/2 md:flex-none"
            : "md:w-auto md:flex-1 md:max-w-md"
        )}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search offers..."
              className={cn(
                "pl-10 transition-all duration-300 ease-in-out",
                isSearchFocused ? "ring-2 ring-georgel-purple/20 border-georgel-purple" : ""
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        <div className={cn(
          "w-full transition-all duration-300 ease-in-out flex items-center gap-2",
          isSearchFocused
            ? "md:w-1/2 md:flex-none"
            : "md:w-auto md:flex-1"
        )}>
          <div className="flex-1">
            <OffersTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Persistent cycle button */}
          <Button
            variant="outline"
            size="sm"
            onClick={cycleCategories}
            className="flex-shrink-0 h-10 px-3 border-georgel-purple/20 hover:bg-georgel-purple/10 text-georgel-purple"
            disabled={categories.length <= 6}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </Button>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No offers found</h3>
          <p className="text-gray-500">
            {offers.length === 0
              ? "We couldn't find any personalized offers for you at the moment."
              : "We couldn't find any offers matching your search criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  )
}