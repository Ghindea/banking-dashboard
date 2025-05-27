"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import axios from "axios"

interface ProductsResponse {
	client_id: string
	products: Product[]
}

interface Product {
	PROD: string        // Product name
	DESCR: string       // Product description  
	SEG_ID: string      // Segment ID
	ELIG: string        // Eligibility (comes as string, not number)
}

// Simple conversion function without category filtering
const convertProductToCard = (product: Product, index: number) => ({
	id: index.toString(),
	title: product.PROD,
	description: product.DESCR,
	category: product.SEG_ID,
	eligibility: parseInt(product.ELIG),
})

export default function ProductsPage() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState("")
	const [products, setProducts] = useState<Product[]>([])
	const [filteredProducts, setFilteredProducts] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Fetch products from backend
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setIsLoading(true)
				const response = await axios.get('http://127.0.0.1:5000/user/products', {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
					},
					timeout: 5000
				})

				console.log('Full API response:', response.data)

				// Parse the nested structure correctly
				const productsData = response.data.products.products // Note: double .products
				console.log('Parsed products:', productsData)

				setProducts(productsData)
				setError(null)
			} catch (error) {
				console.error('Error fetching products:', error)
				setError('Failed to load products')
				setProducts([])
			} finally {
				setIsLoading(false)
			}
		}

		// Check if user is authenticated
		const isAuthenticated = localStorage.getItem("isAuthenticated")
		if (isAuthenticated) {
			fetchProducts()
		} else {
			setIsLoading(false)
			setError('Please log in to view products')
		}
	}, [])

	// Filter products based on search only
	useEffect(() => {
		let filtered = products

		// Filter by search query only
		if (searchQuery) {
			filtered = filtered.filter(product =>
				product.PROD.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.DESCR.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.SEG_ID.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		// Convert to card format
		const convertedProducts = filtered.map((product, index) => convertProductToCard(product, index))
		setFilteredProducts(convertedProducts)
	}, [products, searchQuery])

	// Loading state
	if (isLoading) {
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
					<p className="text-gray-500">Loading your personalized products...</p>
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
						<h1 className="text-2xl font-bold">Products & Services</h1>
						<Button onClick={() => router.push("/dashboard")} variant="ghost" className="text-gray-500">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Dashboard
						</Button>
					</div>
				</div>
				<div className="text-center py-12">
					<h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Products</h3>
					<p className="text-gray-500 mb-4">{error}</p>
					<Button onClick={() => window.location.reload()}>
						Try Again
					</Button>
				</div>
			</div>
		)
	}

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

			<div className="flex justify-start items-center mb-6">
				<div className="w-full max-w-md">
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
			</div>

			{filteredProducts.length === 0 ? (
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
					<p className="text-gray-500">
						{products.length === 0
							? "We couldn't find any personalized products for you at the moment."
							: "We couldn't find any products matching your search criteria."
						}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</div>
	)
}