"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ExternalLink, Gift } from "lucide-react"

interface Offer {
  id: string
  title: string
  description: string
  category: string
  link?: string | null
  eligibility?: number
}

interface OfferBannerProps {
  offers?: Offer[]
}

export default function OfferBanner({ offers = [] }: OfferBannerProps) {
  const [currentOffer, setCurrentOffer] = useState(0)

  // Default offers if none provided
  const defaultOffers = [
    {
      id: "1",
      title: "Welcome to George Banking",
      description: "Discover all the digital banking features available to you",
      category: "WELCOME",
      link: null,
      eligibility: 0
    }
  ]

  const displayOffers = offers.length > 0 ? offers : defaultOffers
  const totalOffers = displayOffers.length

  const nextOffer = () => {
    setCurrentOffer((prev) => (prev + 1) % totalOffers)
  }

  const prevOffer = () => {
    setCurrentOffer((prev) => (prev - 1 + totalOffers) % totalOffers)
  }

  const handleOfferClick = (offer: Offer) => {
    if (offer.link) {
      window.open(offer.link, '_blank', 'noopener,noreferrer')
    }
  }

  const currentOfferData = displayOffers[currentOffer]

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-georgel-purple to-georgel-blue text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="bg-white/20 p-3 rounded-full">
              <Gift className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {currentOfferData.category}
                </Badge>
                {currentOfferData.eligibility && currentOfferData.eligibility >= 18 && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {currentOfferData.eligibility}+
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 truncate">
                {currentOfferData.title}
              </h3>

              <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                {currentOfferData.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-6">
            {/* Navigation for multiple offers */}
            {totalOffers > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={prevOffer}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex space-x-1">
                  {displayOffers.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${index === currentOffer ? 'bg-white' : 'bg-white/40'
                        }`}
                      onClick={() => setCurrentOffer(index)}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={nextOffer}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* CTA Button */}
            <Button
              variant="secondary"
              className="bg-white text-georgel-purple hover:bg-white/90 whitespace-nowrap"
              onClick={() => handleOfferClick(currentOfferData)}
              disabled={!currentOfferData.link}
            >
              {currentOfferData.link ? (
                <>
                  Learn More
                  <ExternalLink className="w-4 h-4 ml-2" />
                </>
              ) : (
                "View Details"
              )}
            </Button>
          </div>
        </div>

        {/* Offer counter */}
        {totalOffers > 1 && (
          <div className="absolute top-4 right-4">
            <span className="text-xs text-white/70">
              {currentOffer + 1} of {totalOffers}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
