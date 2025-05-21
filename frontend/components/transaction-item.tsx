import { ArrowDown, ArrowUp } from "lucide-react"

interface TransactionItemProps {
  name: string
  date: string
  amount: string
  type: "income" | "expense"
  isAnomaly?: boolean
}

export default function TransactionItem({ name, date, amount, type, isAnomaly = false }: TransactionItemProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isAnomaly ? "bg-yellow-50" : ""}`}>
      <div className="flex items-center">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${
            type === "income" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {type === "income" ? (
            <ArrowUp className={`h-4 w-4 text-green-600`} />
          ) : (
            <ArrowDown className={`h-4 w-4 text-red-600`} />
          )}
        </div>
        <div className="ml-3">
          <h4 className="text-sm font-medium">{name}</h4>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <div className={`font-semibold ${type === "income" ? "text-georgel-success" : "text-georgel-error"}`}>
        {amount}
      </div>
    </div>
  )
}
