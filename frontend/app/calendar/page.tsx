"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDayCell } from "@/components/calendar-day-cell"
import { TransactionDetailsPanel } from "@/components/transaction-details-panel"
import { type Transaction, getTransactionsForDate, getDaysWithTransactionsForMonth } from "@/utilis/calendar-data"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [daysWithTransactions, setDaysWithTransactions] = useState<Record<string, Transaction[]>>({})

  // Get the days of the current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the days of the previous month that appear in the first week
  const firstDay = monthStart.getDay() // 0 = Sunday, 1 = Monday, etc.
  const prevMonthDays =
    firstDay > 0
      ? eachDayOfInterval({
          start: new Date(monthStart.getFullYear(), monthStart.getMonth(), -firstDay + 1),
          end: new Date(monthStart.getFullYear(), monthStart.getMonth(), 0),
        })
      : []

  // Get the days of the next month that appear in the last week
  const lastDay = monthEnd.getDay()
  const nextMonthDays =
    lastDay < 6
      ? eachDayOfInterval({
          start: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 1),
          end: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 6 - lastDay),
        })
      : []

  // Combine all days
  const allDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Create weeks
  const weeks: Date[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  // Load transactions when month changes
  useEffect(() => {
    setDaysWithTransactions(getDaysWithTransactionsForMonth(currentDate))
  }, [currentDate])

  // Load transactions when selected date changes
  useEffect(() => {
    if (selectedDate) {
      setTransactions(getTransactionsForDate(selectedDate))
    } else {
      setTransactions([])
    }
  }, [selectedDate])

  return (
    <div className="container pt-0 pb-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Financial Calendar</h1>
        <p className="text-gray-500">Track your upcoming bills, subscriptions, and financial events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center py-2 font-medium text-sm">
                    {day}
                  </div>
                ))}

                {weeks.map((week, weekIndex) =>
                  week.map((day, dayIndex) => {
                    const dateKey = format(day, "yyyy-MM-dd")
                    const dayTransactions = daysWithTransactions[dateKey] || []

                    return (
                      <CalendarDayCell
                        key={`${weekIndex}-${dayIndex}`}
                        date={day}
                        isCurrentMonth={isSameMonth(day, currentDate)}
                        isToday={isToday(day)}
                        isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                        transactions={dayTransactions}
                        onClick={() => handleDateClick(day)}
                      />
                    )
                  }),
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="bg-red-100 p-2 rounded-full mb-2">
                    <CalendarIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-500">Bills Due</p>
                  <p className="text-xl font-bold">5</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-500">Subscriptions</p>
                  <p className="text-xl font-bold">3</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="bg-orange-100 p-2 rounded-full mb-2">
                    <CalendarIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-500">Loan Payments</p>
                  <p className="text-xl font-bold">2</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-2 rounded-full mb-2">
                    <CalendarIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">Income Events</p>
                  <p className="text-xl font-bold">1</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)]">
              {selectedDate ? (
                <TransactionDetailsPanel
                  date={selectedDate}
                  transactions={transactions}
                  onClose={() => setSelectedDate(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No date selected</h3>
                  <p className="text-gray-500">Select a date on the calendar to view transaction details.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
