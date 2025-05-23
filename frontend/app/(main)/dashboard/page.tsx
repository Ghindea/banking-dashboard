"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowRight, CreditCard as CreditCardIcon, Banknote, PiggyBank, FileText, Send, Settings, X, TrendingUp, Calendar, Target } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import OfferBanner from "@/components/offer-banner"
import SummaryCard from "@/components/summary-card"
import TransactionItem from "@/components/transaction-item"
import DebitCard from "@/components/debit-card"
import CreditCard from "@/components/credit-card"
import Link from "next/link"
import axios from "axios"

interface SpendingCategory {
  name: string
  value: number
  color: string
  percentage?: number
}

interface DashboardMetrics {
  totalNetPosition: {
    amount: number
    trend: string
    trendValue: string
  }
  availableCredit: {
    amount: number
    trend: string
    trendValue: string
  }
  lastInflow: {
    amount: number
    daysAgo: number
    description: string
  }
  digitalServices: {
    status: string
    description: string
    activeServices: string[]
    totalServices: number
    activeCount: number
  }
  spendingData: SpendingCategory[]
  totalSpending: number
  loanInfo: {
    hasLoans: boolean
    preApproved: boolean
    preApprovedAmount: number
    totalRequests: number
    rejectedRequests: number
  }
  cardInfo: {
    hasDebitCard: boolean
    hasCreditCard: boolean
    debitBalance: number
    creditBalance: number
    creditLimit: number
    debitCardCount: number
    creditCardCount: number
  }
}

interface OffersResponse {
  offers: {
    client_id: string
    offers: Array<{
      CATEG: string
      DESCR: string
      ELIG: string
      LINK: string | null
      PROD: string
      SEG_ID: string
    }>
  }
}

const ROMANIAN_MALE_NAMES = [
  "Andrei", "Mihai", "Alexandru", "Ion", "Cristian", "Vlad", "Gabriel",
  "Florin", "Radu", "Ștefan", "Cătălin", "Valentin", "Bogdan", "Alin",
  "Paul", "George", "Darius", "Cosmin", "Iulian", "Marian"
];

const ROMANIAN_FEMALE_NAMES = [
  "Maria", "Ana", "Elena", "Ioana", "Andreea", "Cristina", "Gabriela",
  "Roxana", "Alina", "Bianca", "Alexandra", "Larisa", "Adriana",
  "Mihaela", "Irina", "Daniela", "Nicoleta", "Loredana", "Ramona", "Simona"
];


function getRandomNameByGender(genderCode: string): string {
  if (genderCode === 'M') {
    return ROMANIAN_MALE_NAMES[Math.floor(Math.random() * ROMANIAN_MALE_NAMES.length)];
  } else if (genderCode === 'F') {
    return ROMANIAN_FEMALE_NAMES[Math.floor(Math.random() * ROMANIAN_FEMALE_NAMES.length)];
  } else {
    // Default fallback if gender code is not M or F
    return "Adrian";
  }
}



// Helper functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

function calculateSpendingCategories(userData: any): { spendingData: SpendingCategory[], totalSpending: number } {
  // Define spending categories with their corresponding MCC fields and colors
  const categoryMappings = [
    {
      name: 'Food & Dining',
      fields: ['MCC_FOOD_AMT'],
      color: '#0088FE'
    },
    {
      name: 'Shopping',
      fields: ['MCC_MISCELLANEOUS_STORES_AMT', 'MCC_RETAIL_OUTLET_SERV_AMT', 'MCC_CLOTHING_STORES_AMT'],
      color: '#FF8042'
    },
    {
      name: 'Transportation',
      fields: ['MCC_TRANSPORTATION_AMT', 'MCC_CAR_RENTAL_AMT'],
      color: '#00C49F'
    },
    {
      name: 'Digital & Electronics',
      fields: ['MCC_ELECT_AND_DIG_GOODS_AMT', 'MCC_CONTRACTED_SERV_AMT'],
      color: '#8884D8'
    },
    {
      name: 'Utilities & Bills',
      fields: ['MCC_UTILITY_SERV_AMT', 'MCC_GOVERNMENT_SERV_AMT', 'MCC_FINANCIAL_INST_AMT'],
      color: '#82CA9D'
    },
    {
      name: 'Leisure & Travel',
      fields: ['MCC_LEISURE_AMT', 'MCC_TRAVEL_AMT'],
      color: '#FFBB28'
    },
    {
      name: 'Professional Services',
      fields: ['MCC_PROFESSIONAL_SERV_AMT', 'MCC_BUSINESS_SERV_AMT', 'MCC_BANKING_ALTER_AMT'],
      color: '#FF8A80'
    },
    {
      name: 'Home & Construction',
      fields: ['MCC_HOME_AND_CONSTR_AMT'],
      color: '#A569BD'
    }
  ]

  // Debug log to see what data we're receiving
  console.log("User data keys:", Object.keys(userData || {}));
  console.log("Sample MCC field values:", {
    food: userData?.MCC_FOOD_AMT,
    shopping: userData?.MCC_MISCELLANEOUS_STORES_AMT,
    transport: userData?.MCC_TRANSPORTATION_AMT
  });

  // Calculate spending for each category
  const spendingData: SpendingCategory[] = []
  let totalSpending = 0

  categoryMappings.forEach(category => {
    let categoryTotal = 0

    // Sum all fields for this category
    category.fields.forEach(field => {
      const rawValue = userData?.[field];
      // Handle both string and number values
      const amount = typeof rawValue === 'string' ? parseFloat(rawValue) : (rawValue || 0);
      if (!isNaN(amount) && amount > 0) {
        categoryTotal += amount
      }
    })

    // Only include categories with spending > 0
    if (categoryTotal > 0) {
      spendingData.push({
        name: category.name,
        value: categoryTotal,
        color: category.color
      })
      totalSpending += categoryTotal
    }
  })

  // Calculate percentages
  spendingData.forEach(item => {
    item.percentage = totalSpending > 0 ? (item.value / totalSpending) * 100 : 0
  })

  // Sort by value descending
  spendingData.sort((a, b) => b.value - a.value)

  console.log("Calculated spending data:", spendingData);
  console.log("Total spending:", totalSpending);

  // If no real spending data is available, create sample data
  if (spendingData.length === 0) {
    const sampleData = [
      { name: 'Food & Dining', value: 500, color: '#0088FE', percentage: 33.3 },
      { name: 'Shopping', value: 400, color: '#FF8042', percentage: 26.7 },
      { name: 'Transportation', value: 300, color: '#00C49F', percentage: 20.0 },
      { name: 'Entertainment', value: 200, color: '#FFBB28', percentage: 13.3 },
      { name: 'Other', value: 100, color: '#A569BD', percentage: 6.7 }
    ]
    return { spendingData: sampleData, totalSpending: 1500 }
  }

  return { spendingData, totalSpending }
}

function calculateDashboardMetrics(userData: any): DashboardMetrics {
  // Calculate Total Net Position
  const cecBalance = parseFloat(userData?.CEC_TOTAL_BALANCE_AMT || 0)
  const depBalance = parseFloat(userData?.DEP_TOTAL_BALANCE_AMT || 0)
  const savBalance = parseFloat(userData?.SAV_TOTAL_BALANCE_AMT || 0)
  const crtBalance = parseFloat(userData?.CRT_TOTAL_BALANCE_AMT || 0)
  const cloBalance = parseFloat(userData?.CLO_TOTAL_BALANCE_AMT || 0)
  const ovdBalance = parseFloat(userData?.OVD_TOTAL_BALANCE_AMT || 0)

  // Sum positive balances (assets) and subtract negative balances (liabilities)
  const assets = Math.max(0, cecBalance) + Math.max(0, depBalance) + Math.max(0, savBalance)
  const liabilities = Math.abs(Math.min(0, cloBalance)) + Math.abs(Math.min(0, crtBalance)) + Math.abs(Math.min(0, ovdBalance))
  const totalNetPosition = assets - liabilities

  // Calculate Available Credit
  const ovdRemaining = parseFloat(userData?.OVD_REMAINING_LIMIT_AMT || 0)
  const iccRemaining = parseFloat(userData?.ICC_REMAINING_LIMIT_AMT || 0)
  const availableCredit = ovdRemaining + iccRemaining

  // Calculate Last Inflow
  const lastSalaryDays = parseInt(userData?.GPI_LST_SALARY_ND || 0)
  const inflowAmount = parseFloat(userData?.TRX_IN_ALL_AMT || 0)

  // Digital Services Status
  const georgePay = parseInt(userData?.GEORGE_PAY_FLAG || 0)
  const applePay = parseInt(userData?.APPLE_PAY_FLAG || 0)
  const googlePay = parseInt(userData?.GOOGLE_PAY_FLAG || 0)
  const wallet = parseInt(userData?.WALLET_FLAG || 0)
  const internetBanking = userData?.PTS_IB_FLAG === 'Y' ? 1 : 0

  const activeServices = []
  if (internetBanking) activeServices.push('Internet Banking')
  if (georgePay) activeServices.push('George Pay')
  if (applePay) activeServices.push('Apple Pay')
  if (googlePay) activeServices.push('Google Pay')
  if (wallet) activeServices.push('Digital Wallet')

  // Calculate spending categories from MCC data
  const { spendingData, totalSpending } = calculateSpendingCategories(userData)

  // Loan Information
  const totalLoanRequests = parseInt(userData?.PTS_TOTAL_LOANS_REQ_CNT || 0)
  const rejectedRequests = parseInt(userData?.PTS_REJECTED_LOANS_REQ_CNT || 0)
  const hasActiveLoans = parseInt(userData?.LOA_ALL_ACTIVE_CNT || 0) > 0

  // Card Information
  const hasDebitCard = parseInt(userData?.CEC_ALL_ACTIVE_CNT || 0) > 0
  const hasCreditCard = parseInt(userData?.CRT_ALL_ACTIVE_CNT || 0) > 0
  const creditLimit = parseFloat(userData?.ICC_APPROVED_LIMIT || userData?.CRT_MAX_BALANCE_AMT || 0)

  return {
    totalNetPosition: {
      amount: totalNetPosition,
      trend: totalNetPosition >= 0 ? 'up' : 'down',
      trendValue: '2.5%'
    },
    availableCredit: {
      amount: availableCredit,
      trend: 'neutral',
      trendValue: '0%'
    },
    lastInflow: {
      amount: inflowAmount,
      daysAgo: lastSalaryDays,
      description: lastSalaryDays === 0 ? 'Recent income' : `${lastSalaryDays} days ago`
    },
    digitalServices: {
      status: activeServices.length >= 3 ? 'Active' : 'Partial',
      description: activeServices.length >= 3 ? 'All services enabled' : `${activeServices.length} services active`,
      activeServices,
      totalServices: 5,
      activeCount: activeServices.length
    },
    spendingData,
    totalSpending,
    loanInfo: {
      hasLoans: hasActiveLoans,
      preApproved: rejectedRequests === 0 && totalLoanRequests < 3,
      preApprovedAmount: rejectedRequests === 0 ? 15000 : 0,
      totalRequests: totalLoanRequests,
      rejectedRequests
    },
    cardInfo: {
      hasDebitCard,
      hasCreditCard,
      debitBalance: cecBalance,
      creditBalance: Math.abs(crtBalance),
      creditLimit,
      debitCardCount: parseInt(userData?.CEC_ALL_ACTIVE_CNT || 0),
      creditCardCount: parseInt(userData?.CRT_ALL_ACTIVE_CNT || 0)
    }
  }
}

// Mock data for fallback
const getMockMetrics = (): DashboardMetrics => ({
  totalNetPosition: {
    amount: 13459.52,
    trend: 'up',
    trendValue: '2.5%'
  },
  availableCredit: {
    amount: 2500,
    trend: 'neutral',
    trendValue: '0%'
  },
  lastInflow: {
    amount: 3250,
    daysAgo: 12,
    description: '12 days ago'
  },
  digitalServices: {
    status: 'Active',
    description: 'All services enabled',
    activeServices: ['Internet Banking', 'George Pay', 'Google Pay'],
    totalServices: 5,
    activeCount: 3
  },
  spendingData: [
    { name: 'Food & Dining', value: 500, color: '#0088FE', percentage: 33.3 },
    { name: 'Shopping', value: 400, color: '#FF8042', percentage: 26.7 },
    { name: 'Transportation', value: 300, color: '#00C49F', percentage: 20.0 },
    { name: 'Entertainment', value: 200, color: '#FFBB28', percentage: 13.3 },
    { name: 'Other', value: 150, color: '#A569BD', percentage: 10.0 }
  ],
  totalSpending: 1550,
  loanInfo: {
    hasLoans: false,
    preApproved: true,
    preApprovedAmount: 15000,
    totalRequests: 1,
    rejectedRequests: 0
  },
  cardInfo: {
    hasDebitCard: true,
    hasCreditCard: true,
    debitBalance: 2698,
    creditBalance: 450,
    creditLimit: 2500,
    debitCardCount: 1,
    creditCardCount: 2
  }
})

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null)
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>(getMockMetrics())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState("Adrian")
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const [showDigitalServicesReport, setShowDigitalServicesReport] = useState(false)
  const [activeTab, setActiveTab] = useState("cards")
  const [featuredOffers, setFeaturedOffers] = useState<any[]>([])


  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const userType = localStorage.getItem("userType")

      if (!isAuthenticated) {
        // Not authenticated, use mock data
        console.log("Not authenticated, using mock data")
        setIsLoading(false)
        return
      }

      if (userType === "admin") {
        setUserName("Admin")
        setIsLoading(false)
        return
      }

      // Try to fetch real user data
      setIsLoading(true)
      try {
        const response = await axios.get("http://20.185.231.218:5000/user/profile", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
          },
          timeout: 5000 // 5 second timeout
        })

        console.log("User data fetched:", response.data)
        setUserData(response.data)

        // Calculate dashboard metrics from user data
        const metrics = calculateDashboardMetrics(response.data)
        setDashboardMetrics(metrics)

        // Debug log for spending data
        console.log("Calculated spending data:", metrics.spendingData)
        console.log("Total spending:", formatCurrency(metrics.totalSpending))

        // Set user name from occupation or default
        const genderCode = response.data.GPI_GENDER_CODE || "M";
        const randomName = getRandomNameByGender(genderCode);
        setUserName(randomName);

        setError(null)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data")
        // Continue with mock data on error
      } finally {
        setIsLoading(false)
      }
    }

    const fetchRecommendations = async () => {
      const response = await axios.get("http://20.185.231.218:5000/user/recommendations", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      console.log("Recommendations fetched:", response.data)
      console.log(response)
    }

    fetchUserData()
    fetchRecommendations()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      // ... existing code for user data ...
    }

    const fetchRecommendations = async () => {
      const response = await axios.get("http://20.185.231.218:5000/user/recommendations", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      console.log("Recommendations fetched:", response.data)
      console.log(response)
    }

    // Add this new function to fetch offers
    const fetchOffers = async () => {
      try {
        const response = await axios.get<OffersResponse>("http://20.185.231.218:5000/user/offers", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
          },
          timeout: 5000
        })

        console.log("Offers fetched:", response.data)

        // Extract first 3 offers and format them
        const offers = response.data.offers.offers.slice(0, 3).map((offer, index) => ({
          id: index.toString(),
          title: offer.PROD,
          description: offer.DESCR,
          category: offer.CATEG,
          link: offer.LINK,
          eligibility: parseInt(offer.ELIG),
          segmentId: offer.SEG_ID
        }))

        setFeaturedOffers(offers)
        console.log("Featured offers set:", offers)
      } catch (error) {
        console.error("Error fetching offers:", error)
        // Set default offers if API fails
        setFeaturedOffers([
          {
            id: "1",
            title: "George Pay Special",
            description: "Get 10% cashback on your first payment with George Pay",
            category: "DIGITAL",
            link: null,
            eligibility: 0
          },
          {
            id: "2",
            title: "Credit Card Offer",
            description: "Apply for a new credit card and get bonus points",
            category: "FINANCIAL",
            link: null,
            eligibility: 18
          },
          {
            id: "3",
            title: "Savings Account",
            description: "Open a savings account with competitive interest rates",
            category: "BANKING",
            link: null,
            eligibility: 0
          }
        ])
      }
    }

    fetchUserData()
    fetchRecommendations()

    // Only fetch offers if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated) {
      fetchOffers()
    }
  }, [])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container py-6 max-w-7xl">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>

          {/* Banner skeleton */}
          <div className="h-32 bg-gray-200 rounded mb-6"></div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Action cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Main content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="container py-6 max-w-7xl">
      {/* Error message if any */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">{error}. Showing sample data instead.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-georgel-blue">{userName}</span>
          </h1>
          <p className="text-gray-500">Access & manage your account and transactions efficiently.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
              <path d="M9 12h6"></path>
              <path d="M12 9v6"></path>
            </svg>
            <span className="sr-only">New</span>
          </Button>
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"></path>
              <path d="m20 20-3-3"></path>
            </svg>
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      {/* Hero/Offers Banner */}
      <div className="mb-6">
        <OfferBanner offers={featuredOffers} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Net Position"
          value={formatCurrency(dashboardMetrics.totalNetPosition.amount)}
          icon={<Banknote className="h-4 w-4" />}
          trend={dashboardMetrics.totalNetPosition.trend as "up" | "down" | "neutral"}
          trendValue={dashboardMetrics.totalNetPosition.trendValue}
        />
        <SummaryCard
          title="Available Credit"
          value={formatCurrency(dashboardMetrics.availableCredit.amount)}
          icon={<CreditCardIcon className="h-4 w-4" />}
          trend={dashboardMetrics.availableCredit.trend as "up" | "down" | "neutral"}
          trendValue={dashboardMetrics.availableCredit.trendValue}
        />
        <SummaryCard
          title="Last Income Received"
          value={formatCurrency(dashboardMetrics.lastInflow.amount)}
          icon={<FileText className="h-4 w-4" />}
          secondaryText={dashboardMetrics.lastInflow.description}
        />
        <SummaryCard
          title="Digital Services"
          value={dashboardMetrics.digitalServices.status}
          icon={<Settings className="h-4 w-4" />}
          secondaryText={dashboardMetrics.digitalServices.description}
          showBadge={dashboardMetrics.digitalServices.status === "Active"}
          onClick={() => setShowDigitalServicesReport(true)} // Add this prop
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Pay a Bill</h3>
              <p className="text-sm text-gray-500">Quick transfer to your utilities</p>
            </div>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <Send className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Transfer Money</h3>
              <p className="text-sm text-gray-500">Send money to your contacts</p>
            </div>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <Link href="/loan">
            <CardContent className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="bg-green-100 p-2 rounded-full">
                <CreditCardIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Apply for Loan</h3>
                <p className="text-sm text-gray-500">
                  {dashboardMetrics.loanInfo.preApproved
                    ? `Pre-approved: ${formatCurrency(dashboardMetrics.loanInfo.preApprovedAmount)}`
                    : `${dashboardMetrics.loanInfo.totalRequests} previous requests`
                  }
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Spending Snapshot */}
        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Spending Snapshot</h3>
              <Button
                variant="link"
                size="sm"
                className="text-georgel-blue p-0 hover:text-georgel-purple transition-colors"
                onClick={() => setShowDetailedReport(true)}
              >
                View Detailed Report
              </Button>
            </div>

            {/* Total spending summary */}
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {formatCurrency(dashboardMetrics.totalSpending)}
              </p>
              <p className="text-sm text-gray-500">Total Monthly Spending</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardMetrics.spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dashboardMetrics.spendingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-semibold text-gray-800">{data.name}</p>
                              <p className="text-lg font-bold text-georgel-purple">
                                {formatCurrency(data.value)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {data.percentage?.toFixed(1)}% of total spending
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Simple legend - only colors and names in 2 columns */}
              <div className="w-full mt-6 grid grid-cols-2 gap-3">
                {dashboardMetrics.spendingData.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="h-3 w-3 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                  </div>
                ))}

                {/* Show "and X more" if there are more than 6 categories */}
                {dashboardMetrics.spendingData.length > 6 && (
                  <div className="col-span-2 text-center pt-2">
                    <span className="text-xs text-gray-500">
                      and {dashboardMetrics.spendingData.length - 6} more categories
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards and Transactions */}
        <Card className="col-span-2">
          <div className="p-4">
            <Tabs defaultValue="cards" className="relative">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <TabsContent value="cards" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-h-[300px] overflow-y-auto">
                  {/* Show Debit Card if user has current accounts */}
                  {dashboardMetrics.cardInfo.hasDebitCard && (
                    <div className="flex flex-col">
                      {/* Remove the balance info section completely */}
                      <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
                        <DebitCard />
                      </div>
                    </div>
                  )}

                  {/* Show Credit Card if user has credit cards */}
                  {dashboardMetrics.cardInfo.hasCreditCard && (
                    <div className="flex flex-col">
                      {/* Remove the balance info section completely */}
                      <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
                        <CreditCard />
                      </div>
                    </div>
                  )}

                  {/* Show message if no cards */}
                  {!dashboardMetrics.cardInfo.hasDebitCard && !dashboardMetrics.cardInfo.hasCreditCard && (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      <CreditCardIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Cards Found</h3>
                      <p className="text-gray-500 mb-4">You don't have any active debit or credit cards</p>
                      <Button variant="outline" className="mx-auto">
                        Apply for a Card
                      </Button>
                    </div>
                  )}

                  {/* Show only one card message if user has space for another */}
                  {(dashboardMetrics.cardInfo.hasDebitCard && !dashboardMetrics.cardInfo.hasCreditCard) && (
                    <div className="flex flex-col">
                      <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
                        <div
                          className="flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg"
                          style={{
                            aspectRatio: "311/185",
                            maxWidth: "380px",
                            borderRadius: "20px"
                          }}
                        >
                          <CreditCardIcon className="h-12 w-12 mb-3 opacity-40" />
                          <h4 className="font-medium text-gray-700 mb-1">Get a Credit Card</h4>
                          <p className="text-sm text-gray-500 mb-3 text-center px-4">Build credit and earn rewards</p>
                          <Button variant="outline" size="sm">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {(!dashboardMetrics.cardInfo.hasDebitCard && dashboardMetrics.cardInfo.hasCreditCard) && (
                    <div className="flex flex-col">
                      <div style={{ transform: "scale(0.87)", transformOrigin: "center" }}>
                        <div
                          className="flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg"
                          style={{
                            aspectRatio: "311/185",
                            maxWidth: "420px",
                            borderRadius: "20px"
                          }}
                        >
                          <CreditCardIcon className="h-12 w-12 mb-3 opacity-40" />
                          <h4 className="font-medium text-gray-700 mb-1">Get a Debit Card</h4>
                          <p className="text-sm text-gray-500 mb-3 text-center px-4">Easy access to your account</p>
                          <Button variant="outline" size="sm">
                            Order Card
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="transactions" className="m-0 space-y-4 min-h-[450px]">
                <TransactionItem name="Freshful Marketplace" date="May 20, 2024 14:32" amount="-€89.00" type="expense" isAnomaly={true} />
                <TransactionItem name="Spotify" date="May 20, 2024 10:05" amount="-€15.00" type="expense" />
                <TransactionItem name="Alexa Doe" date="May 19, 2024 14:54" amount="+€88.00" type="income" />
                <TransactionItem name="Figma" date="May 18, 2024 11:00" amount="-€19.99" type="expense" />
                <TransactionItem name="Fresh FAV" date="May 17, 2024 12:15" amount="-€65.00" type="expense" />
                <TransactionItem name="Sam Smith" date="May 16, 2024 16:45" amount="-€45.20" type="expense" />
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>

      {/* Detailed Spending Report Popup */}
      <Dialog open={showDetailedReport} onOpenChange={setShowDetailedReport}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-georgel-purple" />
              Detailed Spending Report
            </DialogTitle>
            <p className="text-gray-500">Complete breakdown of your monthly spending habits</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(dashboardMetrics.totalSpending)}
                  </p>
                  <p className="text-sm text-blue-600">Total Spending</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">
                    {dashboardMetrics.spendingData.length}
                  </p>
                  <p className="text-sm text-green-600">Active Categories</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">
                    {formatCurrency(dashboardMetrics.spendingData[0]?.value || 0)}
                  </p>
                  <p className="text-sm text-purple-600">Top Category</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Pie Chart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Spending Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardMetrics.spendingData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dashboardMetrics.spendingData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
                                  <p className="font-bold text-gray-800 text-lg">{data.name}</p>
                                  <p className="text-2xl font-bold text-georgel-purple">
                                    {formatCurrency(data.value)}
                                  </p>
                                  <p className="text-gray-600">
                                    {data.percentage?.toFixed(1)}% of total spending
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Category Comparison</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardMetrics.spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                        />
                        <YAxis
                          tickFormatter={(value) => formatCurrency(value)}
                          fontSize={12}
                        />
                        <Tooltip
                          formatter={(value: any, name: string) => [formatCurrency(value), 'Amount']}
                          labelFormatter={(label) => `Category: ${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {dashboardMetrics.spendingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Table */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Complete Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Category</th>
                        <th className="text-right py-3 px-4 font-semibold">Amount</th>
                        <th className="text-right py-3 px-4 font-semibold">Percentage</th>
                        <th className="text-center py-3 px-4 font-semibold">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardMetrics.spendingData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div
                                className="h-4 w-4 rounded-full mr-3"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-bold">
                            {formatCurrency(item.value)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="bg-gray-100 px-2 py-1 rounded-full text-sm font-medium">
                              {item.percentage?.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600 ml-1">+2.5%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDetailedReport(false)}>
                Close
              </Button>
              <Button className="bg-georgel-purple hover:bg-georgel-purple/90">
                Export Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Digital Services Report Popup */}
      <Dialog open={showDigitalServicesReport} onOpenChange={setShowDigitalServicesReport}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-georgel-purple" />
              Digital Services Overview
            </DialogTitle>
            <p className="text-gray-500">Complete overview of your digital banking services</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {dashboardMetrics.digitalServices.activeCount}
                  </p>
                  <p className="text-sm text-blue-600">Active Services</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">
                    {dashboardMetrics.digitalServices.totalServices}
                  </p>
                  <p className="text-sm text-green-600">Total Available</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">
                    {Math.round((dashboardMetrics.digitalServices.activeCount / dashboardMetrics.digitalServices.totalServices) * 100)}%
                  </p>
                  <p className="text-sm text-purple-600">Adoption Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Internet Banking */}
              <Card className={`border-2 ${userData?.PTS_IB_FLAG === 'Y' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${userData?.PTS_IB_FLAG === 'Y' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    <svg className={`w-8 h-8 ${userData?.PTS_IB_FLAG === 'Y' ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Internet Banking</h3>
                  <p className={`text-sm ${userData?.PTS_IB_FLAG === 'Y' ? 'text-green-600' : 'text-gray-500'}`}>
                    {userData?.PTS_IB_FLAG === 'Y' ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Access your accounts online 24/7
                  </p>
                  {userData?.PTS_IB_FLAG !== 'Y' && (
                    <Button variant="outline" size="sm" className="mt-3">
                      Activate
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* George Pay */}
              <Card className={`border-2 ${parseInt(userData?.GEORGE_PAY_FLAG || 0) ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${parseInt(userData?.GEORGE_PAY_FLAG || 0) ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    <svg className={`w-8 h-8 ${parseInt(userData?.GEORGE_PAY_FLAG || 0) ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">George Pay</h3>
                  <p className={`text-sm ${parseInt(userData?.GEORGE_PAY_FLAG || 0) ? 'text-green-600' : 'text-gray-500'}`}>
                    {parseInt(userData?.GEORGE_PAY_FLAG || 0) ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Our digital wallet solution
                  </p>
                  {!parseInt(userData?.GEORGE_PAY_FLAG || 0) && (
                    <Button variant="outline" size="sm" className="mt-3">
                      Activate
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Apple Pay */}
              <Card className={`border-2 ${parseInt(userData?.APPLE_PAY_FLAG || 0) ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${parseInt(userData?.APPLE_PAY_FLAG || 0) ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    <svg className={`w-8 h-8 ${parseInt(userData?.APPLE_PAY_FLAG || 0) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Apple Pay</h3>
                  <p className={`text-sm ${parseInt(userData?.APPLE_PAY_FLAG || 0) ? 'text-green-600' : 'text-gray-500'}`}>
                    {parseInt(userData?.APPLE_PAY_FLAG || 0) ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Pay with your Apple devices
                  </p>
                  {!parseInt(userData?.APPLE_PAY_FLAG || 0) && (
                    <Button variant="outline" size="sm" className="mt-3">
                      Activate
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Google Pay */}
              <Card className={`border-2 ${parseInt(userData?.GOOGLE_PAY_FLAG || 0) ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${parseInt(userData?.GOOGLE_PAY_FLAG || 0) ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    <svg className={`w-8 h-8 ${parseInt(userData?.GOOGLE_PAY_FLAG || 0) ? 'text-green-600' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0 0 0 0 0 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Google Pay</h3>
                  <p className={`text-sm ${parseInt(userData?.GOOGLE_PAY_FLAG || 0) ? 'text-green-600' : 'text-gray-500'}`}>
                    {parseInt(userData?.GOOGLE_PAY_FLAG || 0) ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Pay with your Android devices
                  </p>
                  {!parseInt(userData?.GOOGLE_PAY_FLAG || 0) && (
                    <Button variant="outline" size="sm" className="mt-3">
                      Activate
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Digital Wallet */}
              <Card className={`border-2 ${parseInt(userData?.WALLET_FLAG || 0) ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${parseInt(userData?.WALLET_FLAG || 0) ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    <svg className={`w-8 h-8 ${parseInt(userData?.WALLET_FLAG || 0) ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Digital Wallet</h3>
                  <p className={`text-sm ${parseInt(userData?.WALLET_FLAG || 0) ? 'text-green-600' : 'text-gray-500'}`}>
                    {parseInt(userData?.WALLET_FLAG || 0) ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Store cards and make payments
                  </p>
                  {!parseInt(userData?.WALLET_FLAG || 0) && (
                    <Button variant="outline" size="sm" className="mt-3">
                      Activate
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Placeholder for Future Service */}
              <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-100">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
                  <p className="text-sm text-gray-500">New Service</p>
                  <p className="text-xs text-gray-400 mt-2">
                    More digital services coming
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Benefits of Digital Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">24/7 Access</h4>
                      <p className="text-sm text-gray-500">Bank anytime, anywhere</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Secure Payments</h4>
                      <p className="text-sm text-gray-500">Advanced encryption</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Instant Transfers</h4>
                      <p className="text-sm text-gray-500">Real-time transactions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 17h3v5h-3v-5zM9 17h3v5H9v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Cashback & Rewards</h4>
                      <p className="text-sm text-gray-500">Earn while you spend</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Expense Tracking</h4>
                      <p className="text-sm text-gray-500">Monitor your spending</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Customer Support</h4>
                      <p className="text-sm text-gray-500">Get help when needed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDigitalServicesReport(false)}>
                Close
              </Button>
              <Button className="bg-georgel-purple hover:bg-georgel-purple/90">
                Manage Services
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}