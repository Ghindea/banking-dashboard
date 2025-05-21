"use client"

import { useState, useRef } from "react"
import type { OfferCategory } from "@/types/offers"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCategoryDisplayName } from "@/data/offers"

interface OffersTabsProps {
  categories: OfferCategory[]
  activeCategory: OfferCategory
  onCategoryChange: (category: OfferCategory) => void
}

export function OffersTabs({ categories, activeCategory, onCategoryChange }: OffersTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(true)

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
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap mr-2 rounded-full",
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
