"use client"
import type { Transaction, TransactionType } from "@/utilis/calendar-data"
import { Receipt, CreditCard, Banknote, ArrowDownCircle, ArrowUpCircle, CalendarClock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarDayCellProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  transactions: Transaction[]
  onClick: () => void
}

export function CalendarDayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  transactions,
  onClick,
}: CalendarDayCellProps) {
  const dayNumber = date.getDate()

  const getIconForType = (type: TransactionType) => {
    switch (type) {
      case "bill":
        return <Receipt className="h-4 w-4 text-red-500" />
      case "subscription":
        return <CalendarClock className="h-4 w-4 text-purple-500" />
      case "loan":
        return <CreditCard className="h-4 w-4 text-orange-500" />
      case "income":
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />
      case "expense":
        return <ArrowUpCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Banknote className="h-4 w-4 text-gray-500" />
    }
  }

  // Group transactions by type
  const transactionsByType: Record<TransactionType, Transaction[]> = {
    bill: [],
    subscription: [],
    loan: [],
    income: [],
    expense: [],
  }

  transactions.forEach((transaction) => {
    transactionsByType[transaction.type].push(transaction)
  })

  // Get unique transaction types
  const uniqueTypes = Object.keys(transactionsByType).filter(
    (type) => transactionsByType[type as TransactionType].length > 0,
  ) as TransactionType[]

  // Calculate total amount for the day
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div
      onClick={onClick}
      className={cn(
        "h-full min-h-[100px] p-2 border border-gray-200 transition-colors",
        isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400",
        isToday ? "border-blue-500 border-2" : "",
        isSelected ? "bg-blue-50" : "",
        transactions.length > 0 ? "cursor-pointer hover:bg-gray-50" : "",
        "flex flex-col",
      )}
    >
      <div className="flex justify-between items-start">
        <span className={cn("font-medium text-sm", isToday ? "text-blue-500" : "")}>{dayNumber}</span>
        {transactions.length > 0 && (
          <span className="text-xs font-medium text-gray-500">{transactions.length} items</span>
        )}
      </div>

      {transactions.length > 0 && (
        <>
          <div className="mt-2 flex flex-wrap gap-1">
            {uniqueTypes.slice(0, 3).map((type) => (
              <div key={type} className="flex items-center">
                {getIconForType(type)}
              </div>
            ))}
          </div>

          {totalAmount > 0 && (
            <div className="mt-auto pt-2 text-xs font-medium text-gray-700">€{totalAmount.toFixed(2)}</div>
          )}
        </>
      )}
    </div>
  )
}
