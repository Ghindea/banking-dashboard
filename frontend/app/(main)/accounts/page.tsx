"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"

// Types
interface ProductData {
  type: string
  active: number
  total: number
  avgBalance: number
  totalBalance: number
}

interface UtilizationData {
  used: number
  limit: number
  utilization: number
  riskLevel: 'Low' | 'Medium' | 'High'
}

interface MaturityData {
  account: string
  principal: number
  interestRate: number
  maturityDate: string
  daysLeft: number
}

interface AccountsData {
  products: ProductData[]
  overdraftUtilization: UtilizationData
  creditCardUtilization: UtilizationData
  maturities: MaturityData[]
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

function calculateRiskLevel(utilization: number): 'Low' | 'Medium' | 'High' {
  if (utilization < 30) return 'Low'
  if (utilization < 70) return 'Medium'
  return 'High'
}

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'Low': return 'text-green-600'
    case 'Medium': return 'text-yellow-600'
    case 'High': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

function addDaysToDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function calculateAccountsData(userData: any): AccountsData {
  // Product Overview Data
  const products: ProductData[] = [
    {
      type: 'Current Accounts',
      active: parseInt(userData?.CEC_ALL_ACTIVE_CNT || 0),
      total: parseInt(userData?.CEC_ALL_PROD_CNT || 0),
      avgBalance: parseFloat(userData?.CEC_AVG_BALANCE_AMT || 0),
      totalBalance: parseFloat(userData?.CEC_TOTAL_BALANCE_AMT || 0)
    },
    {
      type: 'Deposits',
      active: parseInt(userData?.DEP_ALL_ACTIVE_CNT || 0),
      total: parseInt(userData?.DEP_ALL_PROD_CNT || 0),
      avgBalance: parseFloat(userData?.DEP_AVG_BALANCE_AMT || 0),
      totalBalance: parseFloat(userData?.DEP_TOTAL_BALANCE_AMT || 0)
    },
    {
      type: 'Savings Plans',
      active: parseInt(userData?.SAV_ALL_ACTIVE_CNT || 0),
      total: parseInt(userData?.SAV_ALL_PROD_CNT || 1),
      avgBalance: parseFloat(userData?.SAV_AVG_BALANCE_AMT || 0),
      totalBalance: parseFloat(userData?.SAV_TOTAL_BALANCE_AMT || 0)
    },
    {
      type: 'Loans & Overdraft',
      active: parseInt(userData?.CLO_ALL_ACTIVE_CNT || 0) + parseInt(userData?.OVD_ALL_ACTIVE_CNT || 0),
      total: parseInt(userData?.CLO_ALL_PROD_CNT || 0) + parseInt(userData?.OVD_ALL_PROD_CNT || 0),
      avgBalance: parseFloat(userData?.CLO_AVG_BALANCE_AMT || 0) + parseFloat(userData?.OVD_AVG_BALANCE_AMT || 0),
      totalBalance: parseFloat(userData?.CLO_TOTAL_BALANCE_AMT || 0) + parseFloat(userData?.OVD_TOTAL_BALANCE_AMT || 0)
    },
    {
      type: 'Credit Cards',
      active: parseInt(userData?.CRT_ALL_ACTIVE_CNT || 0),
      total: parseInt(userData?.CRT_ALL_PROD_CNT || 0),
      avgBalance: parseFloat(userData?.CRT_AVG_BALANCE_AMT || 0),
      totalBalance: parseFloat(userData?.CRT_TOTAL_BALANCE_AMT || 0)
    }
  ].filter(product => product.total > 0) // Only show products that exist

  // Overdraft Utilization
  const ovdUsed = Math.abs(parseFloat(userData?.OVD_TOTAL_BALANCE_AMT || 0))
  const ovdLimit = parseFloat(userData?.OVD_APPROVED_LIMIT_AMT || 1000)
  const ovdUtilization = ovdLimit > 0 ? (ovdUsed / ovdLimit) * 100 : 0

  const overdraftUtilization: UtilizationData = {
    used: ovdUsed,
    limit: ovdLimit,
    utilization: ovdUtilization,
    riskLevel: calculateRiskLevel(ovdUtilization)
  }

  // Credit Card Utilization
  const crtUsed = Math.abs(parseFloat(userData?.CRT_TOTAL_BALANCE_AMT || 0))
  const crtLimit = parseFloat(userData?.CRT_MAX_BALANCE_AMT || userData?.ICC_APPROVED_LIMIT || 2500)
  const crtUtilization = crtLimit > 0 ? (crtUsed / crtLimit) * 100 : 0

  const creditCardUtilization: UtilizationData = {
    used: crtUsed,
    limit: crtLimit,
    utilization: crtUtilization,
    riskLevel: calculateRiskLevel(crtUtilization)
  }

  // Maturities Data
  const maturities: MaturityData[] = []
  const daysLeft = parseInt(userData?.DEP_MAX_MAT_LEFT_ACT_ND || 0)
  const depBalance = parseFloat(userData?.DEP_TOTAL_BALANCE_AMT || 0)
  
  if (daysLeft > 0 && depBalance > 0) {
    maturities.push({
      account: 'Term Deposit #1',
      principal: depBalance,
      interestRate: 6.0, // Mock interest rate
      maturityDate: addDaysToDate(daysLeft),
      daysLeft: daysLeft
    })
  }

  return {
    products,
    overdraftUtilization,
    creditCardUtilization,
    maturities
  }
}

// Mock data for fallback
const getMockAccountsData = (): AccountsData => ({
  products: [
    {
      type: 'Current Accounts',
      active: 2,
      total: 2,
      avgBalance: 1349.06,
      totalBalance: 2698.12
    },
    {
      type: 'Deposits',
      active: 1,
      total: 1,
      avgBalance: 5000.00,
      totalBalance: 5000.00
    },
    {
      type: 'Savings Plans',
      active: 1,
      total: 2,
      avgBalance: 2761.40,
      totalBalance: 2761.40
    },
    {
      type: 'Loans & Overdraft',
      active: 1,
      total: 1,
      avgBalance: -5000.00,
      totalBalance: -5000.00
    },
    {
      type: 'Credit Cards',
      active: 2,
      total: 2,
      avgBalance: -450.32,
      totalBalance: -900.64
    }
  ],
  overdraftUtilization: {
    used: 350.00,
    limit: 1000.00,
    utilization: 35,
    riskLevel: 'Low'
  },
  creditCardUtilization: {
    used: 1250.00,
    limit: 2500.00,
    utilization: 50,
    riskLevel: 'Medium'
  },
  maturities: [
    {
      account: 'Term Deposit #1',
      principal: 5000.00,
      interestRate: 6.0,
      maturityDate: 'June 15, 2024',
      daysLeft: 26
    }
  ]
})

export default function AccountsPage() {
  const [accountsData, setAccountsData] = useState<AccountsData>(getMockAccountsData())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccountsData = async () => {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const userType = localStorage.getItem("userType")
      
      if (!isAuthenticated || userType === "admin") {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await axios.get("http://localhost:5000/user/profile", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
          },
          timeout: 5000
        })
        
        console.log("User data fetched for accounts:", response.data)
        
        // Calculate accounts data from user data
        const calculatedData = calculateAccountsData(response.data)
        setAccountsData(calculatedData)
        
        console.log("Calculated accounts data:", calculatedData)
        setError(null)
      } catch (error) {
        console.error("Error fetching accounts data:", error)
        setError("Failed to load accounts data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccountsData()
  }, [])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container py-6 max-w-7xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Accounts & Balances</h1>
        <p className="text-gray-500">View and manage all your financial products</p>
      </div>

      {/* Error message if any */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">{error}. Showing sample data instead.</p>
        </div>
      )}

      {/* Product Overview Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product Type</th>
                  <th className="text-left py-3 px-4">Active / Total</th>
                  <th className="text-left py-3 px-4">Avg. Balance</th>
                  <th className="text-left py-3 px-4">Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {accountsData.products.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{product.type}</td>
                    <td className="py-3 px-4">{product.active} / {product.total}</td>
                    <td className="py-3 px-4">
                      <span className={product.avgBalance < 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(product.avgBalance)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={product.totalBalance < 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(product.totalBalance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Limit Utilization Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Overdraft Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {formatCurrency(accountsData.overdraftUtilization.used)}</span>
                <span>Limit: {formatCurrency(accountsData.overdraftUtilization.limit)}</span>
              </div>
              <Progress value={accountsData.overdraftUtilization.utilization} className="h-2" />
              <p className={`text-sm ${getRiskColor(accountsData.overdraftUtilization.riskLevel)}`}>
                {accountsData.overdraftUtilization.utilization.toFixed(1)}% utilized - {accountsData.overdraftUtilization.riskLevel} risk
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Card Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {formatCurrency(accountsData.creditCardUtilization.used)}</span>
                <span>Limit: {formatCurrency(accountsData.creditCardUtilization.limit)}</span>
              </div>
              <Progress value={accountsData.creditCardUtilization.utilization} className="h-2" />
              <p className={`text-sm ${getRiskColor(accountsData.creditCardUtilization.riskLevel)}`}>
                {accountsData.creditCardUtilization.utilization.toFixed(1)}% utilized - {accountsData.creditCardUtilization.riskLevel} risk
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maturities & Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Maturities & Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="maturities">
            <TabsList className="mb-4">
              <TabsTrigger value="maturities">Term Deposits</TabsTrigger>
              <TabsTrigger value="payments">Upcoming Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="maturities">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Account</th>
                      <th className="text-left py-3 px-4">Principal</th>
                      <th className="text-left py-3 px-4">Interest Rate</th>
                      <th className="text-left py-3 px-4">Maturity Date</th>
                      <th className="text-left py-3 px-4">Days Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsData.maturities.length > 0 ? (
                      accountsData.maturities.map((maturity, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{maturity.account}</td>
                          <td className="py-3 px-4">{formatCurrency(maturity.principal)}</td>
                          <td className="py-3 px-4">{maturity.interestRate.toFixed(2)}% p.a.</td>
                          <td className="py-3 px-4">{maturity.maturityDate}</td>
                          <td className="py-3 px-4">{maturity.daysLeft}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Term Deposit #1</td>
                        <td className="py-3 px-4">€5,000.00</td>
                        <td className="py-3 px-4">6.00% p.a.</td>
                        <td className="py-3 px-4">June 15, 2024</td>
                        <td className="py-3 px-4">26</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Due Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsData.products.find(p => p.type === 'Credit Cards' && p.totalBalance < 0) ? (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Credit Card #1</td>
                        <td className="py-3 px-4">
                          {formatCurrency(Math.abs(accountsData.products.find(p => p.type === 'Credit Cards')?.totalBalance || 0) * 0.05)}
                        </td>
                        <td className="py-3 px-4">{addDaysToDate(3)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Due soon</span>
                        </td>
                      </tr>
                    ) : (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Credit Card #1</td>
                        <td className="py-3 px-4">€35.00</td>
                        <td className="py-3 px-4">May 25, 2024</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Due soon</span>
                        </td>
                      </tr>
                    )}
                    
                    {accountsData.products.find(p => p.type === 'Loans & Overdraft' && p.totalBalance < 0) ? (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Personal Loan</td>
                        <td className="py-3 px-4">€250.00</td>
                        <td className="py-3 px-4">{addDaysToDate(10)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Scheduled</span>
                        </td>
                      </tr>
                    ) : (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Personal Loan</td>
                        <td className="py-3 px-4">€250.00</td>
                        <td className="py-3 px-4">June 1, 2024</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Scheduled</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}