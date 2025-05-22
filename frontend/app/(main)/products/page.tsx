"use client"

import { useState, useEffect } from "react"
import { OfferCard } from "@/components/offer-card"
import { OffersTabs } from "@/components/offers-tabs"
import { offers, getActiveCategories, getOffersByCategory } from "@/data/offers"
import type { OfferCategory } from "@/types/offers"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
	const router = useRouter()
	const [activeCategory, setActiveCategory] = useState<OfferCategory>("ALL")
	const [searchQuery, setSearchQuery] = useState("")
	const [filteredOffers, setFilteredOffers] = useState(offers)
	const categories = getActiveCategories()

	useEffect(() => {
		const offersByCategory = getOffersByCategory()
		let filtered = offersByCategory[activeCategory]

		if (searchQuery) {
			filtered = filtered.filter(
				(offer) =>
					offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(offer.partner && offer.partner.toLowerCase().includes(searchQuery.toLowerCase())),
			)
		}

		setFilteredOffers(filtered)
	}, [activeCategory, searchQuery])

	return (
		<div className="container pt-0 pb-8 max-w-7xl">
			<div className="mb-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Products & Services</h1>
					<Button onClick={() => router.push("/dashboard")} variant="ghost" className="text-gray-500">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Dashboard
					</Button>
				</div>
				<p className="text-gray-500">Explore banking products and services tailored for you</p>
			</div>

			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
				<div className="w-full md:w-auto flex-1 md:max-w-md">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search products..."
							className="pl-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<div className="w-full md:w-auto flex-1">
					<OffersTabs
						categories={categories as OfferCategory[]}
						activeCategory={activeCategory}
						onCategoryChange={setActiveCategory}
					/>
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
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
					<p className="text-gray-500">We couldn't find any products matching your search criteria.</p>
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