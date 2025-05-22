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

// Define interfaces
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

  // Calculate spending for each category
  const spendingData: SpendingCategory[] = []
  let totalSpending = 0

  categoryMappings.forEach(category => {
    let categoryTotal = 0
    
    // Sum all fields for this category
    category.fields.forEach(field => {
      const amount = parseFloat(userData?.[field] || 0)
      if (amount > 0) {
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
        const response = await axios.get("http://localhost:3000/user/profile", {
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
        const occupation = response.data.GPI_CLS_CODE_PT_OCCUP || "User"
        setUserName(occupation)
        
        setError(null)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data")
        // Continue with mock data on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
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
        <OfferBanner />
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
            <Tabs defaultValue="cards">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {/* Show Debit Card if user has current accounts */}
                  {dashboardMetrics.cardInfo.hasDebitCard && (
                    <div className="flex flex-col">
                      <div className="mb-2 text-center">
                        <span className="text-sm font-medium text-gray-600">
                          Debit Card ({dashboardMetrics.cardInfo.debitCardCount} active)
                        </span>
                        <div className="text-lg font-bold text-green-600">
                          Balance: {formatCurrency(dashboardMetrics.cardInfo.debitBalance)}
                        </div>
                      </div>
                      <DebitCard />
                    </div>
                  )}
                  
                  {/* Show Credit Card if user has credit cards */}
                  {dashboardMetrics.cardInfo.hasCreditCard && (
                    <div className="flex flex-col">
                      <div className="mb-2 text-center">
                        <span className="text-sm font-medium text-gray-600">
                          Credit Card ({dashboardMetrics.cardInfo.creditCardCount} active)
                        </span>
                        <div className="text-lg font-bold text-red-600">
                          Balance: -{formatCurrency(dashboardMetrics.cardInfo.creditBalance)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Limit: {formatCurrency(dashboardMetrics.cardInfo.creditLimit)}
                        </div>
                      </div>
                      <CreditCard />
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
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <CreditCardIcon className="h-12 w-12 mb-3 opacity-40" />
                      <h4 className="font-medium text-gray-700 mb-1">Get a Credit Card</h4>
                      <p className="text-sm text-gray-500 mb-3">Build credit and earn rewards</p>
                      <Button variant="outline" size="sm">
                        Apply Now
                      </Button>
                    </div>
                  )}
                  
                  {(!dashboardMetrics.cardInfo.hasDebitCard && dashboardMetrics.cardInfo.hasCreditCard) && (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <CreditCardIcon className="h-12 w-12 mb-3 opacity-40" />
                      <h4 className="font-medium text-gray-700 mb-1">Get a Debit Card</h4>
                      <p className="text-sm text-gray-500 mb-3">Easy access to your account</p>
                      <Button variant="outline" size="sm">
                        Order Card
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="transactions" className="m-0 space-y-4">
                <TransactionItem name="Starbucks Coffee" date="22.05.2024 09:34" amount="-€5.30" type="expense" />
                <TransactionItem name="Salary Transfer" date="21.05.2024 10:00" amount="+€3,250" type="income" />
                <TransactionItem name="Grocery Shopping" date="20.05.2024 18:45" amount="-€67.50" type="expense" />
                <TransactionItem name="Online Purchase" date="19.05.2024 14:20" amount="-€29.99" type="expense" />
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
    </div>
  )
}