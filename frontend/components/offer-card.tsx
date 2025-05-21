import type { Offer } from "@/types/offers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface OfferCardProps {
  offer: Offer
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={offer.imageUrl || "/placeholder.svg"}
          alt={offer.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {offer.badge && (
          <Badge className="absolute top-3 right-3 bg-georgel-purple text-white font-semibold">{offer.badge}</Badge>
        )}
        {offer.partner && (
          <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow-md">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-bold">{offer.partner.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>
      <CardContent className="flex-grow p-4">
        <div className="flex items-center gap-2 mb-2">
          {offer.cardTypes.map((cardType) => (
            <Badge key={cardType} variant="outline" className="text-xs font-normal">
              {cardType}
            </Badge>
          ))}
          {offer.minAge && (
            <Badge variant="outline" className="text-xs font-normal">
              {offer.minAge}+
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{offer.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{offer.description}</p>

        {offer.conditions.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-500 mb-1">Condiții:</p>
            <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
              {offer.conditions.slice(0, 2).map((condition, index) => (
                <li key={index} className="line-clamp-1">
                  {condition.description}
                </li>
              ))}
              {offer.conditions.length > 2 && (
                <li className="text-georgel-purple cursor-pointer">+{offer.conditions.length - 2} mai multe</li>
              )}
            </ul>
          </div>
        )}

        {offer.expiryDate && (
          <p className="text-xs text-gray-500 mt-2">
            Valabil până la: <span className="font-semibold">{offer.expiryDate}</span>
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-georgel-purple hover:bg-georgel-purple/90">{offer.ctaText}</Button>
      </CardFooter>
    </Card>
  )
}
