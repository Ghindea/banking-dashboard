import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface OfferCardProps {
  offer: {
    id: string
    title: string
    description: string
    category: string
    eligibility: number
    link?: string | null
    ctaText?: string
    minAge?: number
    cardTypes?: string[]
  }
}

export function OfferCard({ offer }: OfferCardProps) {
  const handleCTAClick = () => {
    if (offer.link) {
      window.open(offer.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="flex-grow p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs font-normal">
            {offer.category}
          </Badge>
          {offer.minAge && (
            <Badge variant="outline" className="text-xs font-normal">
              {offer.minAge}+
            </Badge>
          )}
          {offer.link && (
            <Badge className="bg-green-100 text-green-800 text-xs font-normal">
              <ExternalLink className="w-3 h-3 mr-1" />
              Link Available
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{offer.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-4">{offer.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className={`w-full ${offer.link
              ? "bg-georgel-purple hover:bg-georgel-purple/90"
              : "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
            }`}
          onClick={handleCTAClick}
          disabled={!offer.link}
        >
          {offer.link ? "Learn More" : "No Link Available"}
          {offer.link && <ExternalLink className="w-4 h-4 ml-2" />}
        </Button>
      </CardFooter>
    </Card>
  )
}