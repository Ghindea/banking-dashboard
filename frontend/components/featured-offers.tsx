"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { offers } from "@/data/offers"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function FeaturedOffers() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featuredOffers = offers.slice(0, 5) // Take first 5 offers as featured

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredOffers.length)
  }

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredOffers.length) % featuredOffers.length)
  }

  const currentOffer = featuredOffers[currentIndex]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="relative h-48 w-full">
            <Image
              src={currentOffer.imageUrl || "/placeholder.svg"}
              alt={currentOffer.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {currentOffer.badge && (
              <Badge className="absolute top-3 right-3 bg-georgel-purple text-white font-semibold">
                {currentOffer.badge}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-xl mb-1">{currentOffer.title}</h3>
            <p className="text-sm line-clamp-2 mb-3 text-gray-100">{currentOffer.description}</p>
            <Link href={`/offers/${currentOffer.id}`}>
              <Button className="bg-white text-gray-900 hover:bg-gray-100">{currentOffer.ctaText}</Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
            onClick={prevOffer}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
            onClick={nextOffer}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
            {featuredOffers.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 w-6 mx-1 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/40"}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to offer ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
