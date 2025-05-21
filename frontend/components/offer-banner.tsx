"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Offer {
  id: number
  title: string
  description: string
  imageSrc: string
  actionText: string
  bgColor: string
}

const offers: Offer[] = [
  {
    id: 1,
    title: "Freshful x Georgel",
    description: "Get 5% cashback on all grocery purchases through Freshful for 3 months.",
    imageSrc: "/placeholder.svg?height=80&width=150",
    actionText: "Try for free",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "Premium Card Offer",
    description: "Upgrade to our premium card and get airport lounge access worldwide.",
    imageSrc: "/placeholder.svg?height=80&width=150",
    actionText: "Upgrade now",
    bgColor: "bg-purple-50",
  },
  {
    id: 3,
    title: "Mortgage Rate Special",
    description: "Fixed 4.5% interest rate on new mortgages. Limited time offer.",
    imageSrc: "/placeholder.svg?height=80&width=150",
    actionText: "Apply today",
    bgColor: "bg-green-50",
  },
]

export default function OfferBanner() {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)

  const nextOffer = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % offers.length)
  }

  const prevOffer = () => {
    setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length)
  }

  const currentOffer = offers[currentOfferIndex]

  return (
    <Card className={`overflow-hidden ${currentOffer.bgColor}`}>
      <div className="flex items-center p-6">
        <Button variant="ghost" size="icon" className="mr-2" onClick={prevOffer} aria-label="Previous offer">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex flex-col md:flex-row md:items-center">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold mb-2">
              Offer<span className="text-georgel-blue"> {currentOffer.title}</span>
            </h2>
            <p className="text-sm text-gray-600 mb-4">{currentOffer.description}</p>
            <Button className="bg-georgel-purple hover:bg-georgel-purple/90">{currentOffer.actionText}</Button>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="rounded-md overflow-hidden">
              <img
                src={currentOffer.imageSrc || "/placeholder.svg"}
                alt={currentOffer.title}
                width={150}
                height={80}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="ml-2" onClick={nextOffer} aria-label="Next offer">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-center pb-2">
        {offers.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 w-6 mx-1 rounded-full ${
              index === currentOfferIndex ? "bg-georgel-purple" : "bg-gray-300"
            }`}
            onClick={() => setCurrentOfferIndex(index)}
            aria-label={`Go to offer ${index + 1}`}
          />
        ))}
      </div>
    </Card>
  )
}
