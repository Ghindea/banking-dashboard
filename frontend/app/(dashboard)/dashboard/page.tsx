"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CreditCard, Banknote, PiggyBank, FileText, Send } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import OfferBanner from "@/components/offer-banner"
import SummaryCard from "@/components/summary-card"
import TransactionItem from "@/components/transaction-item"
import DebitCard from "@/components/debit-card"

const spendingData = [
  { name: "Food", value: 500, color: "#0088FE" },
  { name: "Transportation", value: 300, color: "#00C49F" },
  { name: "Entertainment", value: 200, color: "#FFBB28" },
  { name: "Shopping", value: 400, color: "#FF8042" },
  { name: "Other", value: 150, color: "#A569BD" },
]

export default function DashboardPage() {
  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-georgel-blue">Adrian</span>
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
          value="€13,459.52"
          icon={<Banknote className="h-4 w-4" />}
          trend="up"
          trendValue="2.5%"
        />
        <SummaryCard
          title="Available Credit"
          value="€2,500.00"
          icon={<CreditCard className="h-4 w-4" />}
          trend="neutral"
          trendValue="0%"
        />
        <SummaryCard
          title="Last Salary Received"
          value="€3,250.00"
          icon={<FileText className="h-4 w-4" />}
          secondaryText="12 days ago"
        />
        <SummaryCard
          title="Digital Services"
          value="Active"
          icon={<PiggyBank className="h-4 w-4" />}
          secondaryText="All services enabled"
          showBadge={true}
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
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Apply for Loan</h3>
              <p className="text-sm text-gray-500">Pre-approved: €15,000</p>
            </div>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Snapshot */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Spending Snapshot</h3>
              <Button variant="link" size="sm" className="text-georgel-blue p-0">
                View Detailed Report
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                {spendingData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debit Card and Transactions */}
        <Card className="col-span-2">
          <div className="p-4">
            <Tabs defaultValue="card">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <TabsContent value="card" className="m-0">
                <DebitCard />
              </TabsContent>
              <TabsContent value="transactions" className="m-0 space-y-4">
                <TransactionItem name="Starbucks New York LLP" date="12.01.2023 09:34" amount="-$5.30" type="expense" />
                <TransactionItem name="Walmart Marketplace" date="11.01.2023 21:34" amount="-$135" type="expense" />
                <TransactionItem name="From Catherine Pierce" date="11.01.2023 16:08" amount="+$250" type="income" />
                <TransactionItem name="From Catherine Pierce" date="11.01.2023 16:08" amount="+$250" type="income" />
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  )
}
