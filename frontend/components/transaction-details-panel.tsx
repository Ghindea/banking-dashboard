"use client"

import { format } from "date-fns"
import { type Transaction, type TransactionType, getTotalAmountByType } from "@/utilis/calendar-data"
import { Receipt, CreditCard, Banknote, ArrowDownCircle, ArrowUpCircle, CalendarClock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface TransactionDetailsPanelProps {
  date: Date
  transactions: Transaction[]
  onClose: () => void
}

export function TransactionDetailsPanel({ date, transactions, onClose }: TransactionDetailsPanelProps) {
  const formattedDate = format(date, "EEEE, MMMM d, yyyy")

  const getIconForType = (type: TransactionType) => {
    switch (type) {
      case "bill":
        return <Receipt className="h-5 w-5 text-red-500" />
      case "subscription":
        return <CalendarClock className="h-5 w-5 text-purple-500" />
      case "loan":
        return <CreditCard className="h-5 w-5 text-orange-500" />
      case "income":
        return <ArrowDownCircle className="h-5 w-5 text-green-500" />
      case "expense":
        return <ArrowUpCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Banknote className="h-5 w-5 text-gray-500" />
    }
  }

  const getBadgeForType = (type: TransactionType) => {
    switch (type) {
      case "bill":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Bill
          </Badge>
        )
      case "subscription":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Subscription
          </Badge>
        )
      case "loan":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Loan
          </Badge>
        )
      case "income":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Income
          </Badge>
        )
      case "expense":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Expense
          </Badge>
        )
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  // Group transactions by type
  const bills = transactions.filter((t) => t.type === "bill")
  const subscriptions = transactions.filter((t) => t.type === "subscription")
  const loans = transactions.filter((t) => t.type === "loan")
  const incomes = transactions.filter((t) => t.type === "income")

  // Calculate totals
  const totalBills = getTotalAmountByType(transactions, "bill")
  const totalSubscriptions = getTotalAmountByType(transactions, "subscription")
  const totalLoans = getTotalAmountByType(transactions, "loan")
  const totalIncome = getTotalAmountByType(transactions, "income")
  const totalOutgoing = totalBills + totalSubscriptions + totalLoans

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{formattedDate}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Outgoing</p>
                <p className="text-2xl font-bold text-red-600">€{totalOutgoing.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-green-600">€{totalIncome.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {bills.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-5 w-5 text-red-500" />
              <h3 className="font-medium">Bills</h3>
              <Badge variant="outline" className="ml-auto">
                €{totalBills.toFixed(2)}
              </Badge>
            </div>
            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center p-3 border rounded-md bg-white">
                  <div className="flex-1">
                    <p className="font-medium">{bill.title}</p>
                    <p className="text-sm text-gray-500">{bill.description}</p>
                  </div>
                  <p className="font-semibold text-red-600">€{bill.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {subscriptions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium">Subscriptions</h3>
              <Badge variant="outline" className="ml-auto">
                €{totalSubscriptions.toFixed(2)}
              </Badge>
            </div>
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center p-3 border rounded-md bg-white">
                  <div className="flex-1">
                    <p className="font-medium">{subscription.title}</p>
                    <p className="text-sm text-gray-500">{subscription.description}</p>
                  </div>
                  <p className="font-semibold text-purple-600">€{subscription.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loans.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium">Loans</h3>
              <Badge variant="outline" className="ml-auto">
                €{totalLoans.toFixed(2)}
              </Badge>
            </div>
            <div className="space-y-3">
              {loans.map((loan) => (
                <div key={loan.id} className="flex items-center p-3 border rounded-md bg-white">
                  <div className="flex-1">
                    <p className="font-medium">{loan.title}</p>
                    <p className="text-sm text-gray-500">{loan.description}</p>
                  </div>
                  <p className="font-semibold text-orange-600">€{loan.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {incomes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ArrowDownCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Income</h3>
              <Badge variant="outline" className="ml-auto">
                €{totalIncome.toFixed(2)}
              </Badge>
            </div>
            <div className="space-y-3">
              {incomes.map((income) => (
                <div key={income.id} className="flex items-center p-3 border rounded-md bg-white">
                  <div className="flex-1">
                    <p className="font-medium">{income.title}</p>
                    <p className="text-sm text-gray-500">{income.description}</p>
                  </div>
                  <p className="font-semibold text-green-600">€{income.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <CalendarClock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions</h3>
            <p className="text-gray-500">There are no transactions scheduled for this date.</p>
          </div>
        )}
      </div>
    </div>
  )
}
