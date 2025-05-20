"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import TransactionItem from "@/components/transaction-item"

// Sample data for the balance chart
const balanceData = [
  { date: "Apr 01", balance: 2500 },
  { date: "Apr 05", balance: 2300 },
  { date: "Apr 10", balance: 2900 },
  { date: "Apr 15", balance: 2700 },
  { date: "Apr 20", balance: 3200 },
  { date: "Apr 25", balance: 2980 },
  { date: "Apr 30", balance: 2698 },
]

export default function TransactionsPage() {
  return (
    <div className="container py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transactions & Trends</h1>
        <p className="text-gray-500">Monitor your cash flow and analyze spending patterns</p>
      </div>

      {/* Balance Chart */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Account Balance over Time</CardTitle>
          <Select defaultValue="30">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 180 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value}`, "Balance"]} labelFormatter={(label) => `Date: ${label}`} />
                <Line type="monotone" dataKey="balance" stroke="#6153CC" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Volume & Value */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction Volume & Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Metric</th>
                  <th className="text-left py-3 px-4">Count (In / Out)</th>
                  <th className="text-left py-3 px-4">Amount (In / Out)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">All Inflows / Outflows</td>
                  <td className="py-3 px-4">24 / 58</td>
                  <td className="py-3 px-4">€4,250.00 / €3,852.24</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">ATM Flows</td>
                  <td className="py-3 px-4">0 / 5</td>
                  <td className="py-3 px-4">€0.00 / €650.00</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">E-commerce</td>
                  <td className="py-3 px-4">- / 18</td>
                  <td className="py-3 px-4">- / €1,245.35</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Interbank Transfers</td>
                  <td className="py-3 px-4">- / 7</td>
                  <td className="py-3 px-4">- / €935.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Food & Dining</td>
                  <td className="py-3 px-4">- / 12</td>
                  <td className="py-3 px-4">- / €372.45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions with Anomaly Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in">Inflow</TabsTrigger>
              <TabsTrigger value="out">Outflow</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
              <div className="flex items-center text-yellow-800">
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
                  className="h-5 w-5 mr-2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <p className="font-medium">Anomaly detected: May 20 spending was 2.3× your daily average</p>
              </div>
            </div>

            <TransactionItem
              name="Freshful Marketplace"
              date="May 20, 2024 14:32"
              amount="-€89.00"
              type="expense"
              isAnomaly={true}
            />
            <TransactionItem name="Spotify" date="May 20, 2024 10:05" amount="-€15.00" type="expense" />
            <TransactionItem name="Alexa Doe" date="May 19, 2024 14:54" amount="+€88.00" type="income" />
            <TransactionItem name="Figma" date="May 18, 2024 11:00" amount="-€19.99" type="expense" />
            <TransactionItem name="Fresh FAV" date="May 17, 2024 12:15" amount="-€65.00" type="expense" />
            <TransactionItem name="Sam Smith" date="May 16, 2024 16:45" amount="-€45.20" type="expense" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
