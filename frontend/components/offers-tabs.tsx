"use client"

import { useState, useRef, useEffect } from "react"
import type { OfferCategory } from "@/types/offers"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface OffersTabsProps {
  categories: OfferCategory[]
  activeCategory: OfferCategory
  onCategoryChange: (category: OfferCategory) => void
}

// Function to format category names for display
const getCategoryDisplayName = (category: string): string => {
  // Handle the "ALL" category
  if (category === "ALL") return "All"

  // Format category names from your API (e.g., "FOOD" -> "Food", "E-COMMERCE" -> "E-Commerce")
  return category
    .split(/[-_\s]+/) // Split on hyphens, underscores, or spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function OffersTabs({ categories, activeCategory, onCategoryChange }: OffersTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)

  // Check scroll position on mount and when categories change
  useEffect(() => {
    const checkScroll = () => {
      if (!tabsRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10)
    }

    // Check immediately
    checkScroll()

    // Check after a short delay to ensure rendering is complete
    const timer = setTimeout(checkScroll, 100)

    return () => clearTimeout(timer)
  }, [categories])

  const handleScroll = () => {
    if (!tabsRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
    setShowLeftScroll(scrollLeft > 0)
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scrollLeft = () => {
    if (!tabsRef.current) return
    tabsRef.current.scrollBy({ left: -200, behavior: "smooth" })
  }

  const scrollRight = () => {
    if (!tabsRef.current) return
    tabsRef.current.scrollBy({ left: 200, behavior: "smooth" })
  }

  // Don't render if no categories
  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <p className="text-gray-500 text-sm">No categories available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {showLeftScroll && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-8 w-8"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={tabsRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-2 -mx-2 scroll-smooth"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          '::WebkitScrollbar': { display: 'none' }
        } as React.CSSProperties}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap mr-2 rounded-full flex-shrink-0 min-w-fit",
              activeCategory === category ? "bg-georgel-purple hover:bg-georgel-purple/90" : "",
            )}
            onClick={() => onCategoryChange(category)}
          >
            {getCategoryDisplayName(category)}
          </Button>
        ))}
      </div>

      {showRightScroll && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-8 w-8"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}