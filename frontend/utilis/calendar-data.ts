import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"

export type TransactionType = "bill" | "subscription" | "loan" | "income" | "expense"

export interface Transaction {
  id: string
  title: string
  amount: number
  date: Date
  type: TransactionType
  description?: string
  category?: string
  isRecurring?: boolean
  isPaid?: boolean
  dueDate?: Date
  icon?: string
}

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 10)

// Sample transactions data
const generateTransactionsForMonth = (date: Date): Transaction[] => {
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  const transactions: Transaction[] = [
    {
      id: generateId(),
      title: "Rent Payment",
      amount: 1200,
      date: new Date(currentYear, currentMonth, 5),
      type: "bill",
      description: "Monthly apartment rent",
      category: "Housing",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 5),
    },
    {
      id: generateId(),
      title: "Electricity Bill",
      amount: 85.42,
      date: new Date(currentYear, currentMonth, 10),
      type: "bill",
      description: "Monthly electricity bill",
      category: "Utilities",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 10),
    },
    {
      id: generateId(),
      title: "Water Bill",
      amount: 45.3,
      date: new Date(currentYear, currentMonth, 12),
      type: "bill",
      description: "Monthly water bill",
      category: "Utilities",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 12),
    },
    {
      id: generateId(),
      title: "Internet Subscription",
      amount: 59.99,
      date: new Date(currentYear, currentMonth, 15),
      type: "subscription",
      description: "Monthly internet service",
      category: "Utilities",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 15),
    },
    {
      id: generateId(),
      title: "Netflix",
      amount: 14.99,
      date: new Date(currentYear, currentMonth, 18),
      type: "subscription",
      description: "Monthly streaming service",
      category: "Entertainment",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 18),
    },
    {
      id: generateId(),
      title: "Spotify",
      amount: 9.99,
      date: new Date(currentYear, currentMonth, 20),
      type: "subscription",
      description: "Monthly music streaming",
      category: "Entertainment",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 20),
    },
    {
      id: generateId(),
      title: "Car Loan Payment",
      amount: 350.0,
      date: new Date(currentYear, currentMonth, 22),
      type: "loan",
      description: "Monthly car loan payment",
      category: "Transportation",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 22),
    },
    {
      id: generateId(),
      title: "Personal Loan Payment",
      amount: 250.0,
      date: new Date(currentYear, currentMonth, 25),
      type: "loan",
      description: "Monthly personal loan payment",
      category: "Debt",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 25),
    },
    {
      id: generateId(),
      title: "Salary Deposit",
      amount: 3500.0,
      date: new Date(currentYear, currentMonth, 28),
      type: "income",
      description: "Monthly salary payment",
      category: "Income",
      isRecurring: true,
    },
    {
      id: generateId(),
      title: "Phone Bill",
      amount: 65.0,
      date: new Date(currentYear, currentMonth, 8),
      type: "bill",
      description: "Monthly phone bill",
      category: "Utilities",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 8),
    },
    {
      id: generateId(),
      title: "Gym Membership",
      amount: 45.0,
      date: new Date(currentYear, currentMonth, 3),
      type: "subscription",
      description: "Monthly gym membership",
      category: "Health & Fitness",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 3),
    },
    {
      id: generateId(),
      title: "Credit Card Payment",
      amount: 500.0,
      date: new Date(currentYear, currentMonth, 15),
      type: "bill",
      description: "Monthly credit card payment",
      category: "Debt",
      isRecurring: true,
      isPaid: false,
      dueDate: new Date(currentYear, currentMonth, 15),
    },
  ]

  return transactions
}

export const getTransactionsForDate = (date: Date): Transaction[] => {
  const allTransactions = generateTransactionsForMonth(date)
  return allTransactions.filter(
    (transaction) =>
      transaction.date.getDate() === date.getDate() &&
      transaction.date.getMonth() === date.getMonth() &&
      transaction.date.getFullYear() === date.getFullYear(),
  )
}

export const getTransactionsForMonth = (date: Date): Transaction[] => {
  return generateTransactionsForMonth(date)
}

export const getDaysWithTransactionsForMonth = (date: Date): Record<string, Transaction[]> => {
  const transactions = generateTransactionsForMonth(date)
  const result: Record<string, Transaction[]> = {}

  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  days.forEach((day) => {
    const dayStr = format(day, "yyyy-MM-dd")
    const dayTransactions = transactions.filter(
      (transaction) =>
        transaction.date.getDate() === day.getDate() &&
        transaction.date.getMonth() === day.getMonth() &&
        transaction.date.getFullYear() === day.getFullYear(),
    )

    if (dayTransactions.length > 0) {
      result[dayStr] = dayTransactions
    }
  })

  return result
}

export const getTotalAmountByType = (transactions: Transaction[], type: TransactionType): number => {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export const getTotalAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
}
