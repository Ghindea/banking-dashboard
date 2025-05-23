// Create a new ProductCard component at /components/product-card.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
	product: {
		id: string
		title: string
		description: string
		category: string
		eligibility: number
	}
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md">
			<CardContent className="flex-grow p-4">
				<h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
				<p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<Button
					className="w-full bg-georgel-purple hover:bg-georgel-purple/90"
					disabled={true}
				>
					No Link Available
				</Button>
			</CardFooter>
		</Card>
	)
}