import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SummaryCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  secondaryText?: string
  showBadge?: boolean
}

export default function SummaryCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  secondaryText,
  showBadge = false,
}: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="bg-gray-100 p-1.5 rounded-full">{icon}</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div
              className={`flex items-center text-xs font-medium ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
              }`}
            >
              {trend === "up" ? (
                <ArrowUp className="h-3 w-3 mr-0.5" />
              ) : trend === "down" ? (
                <ArrowDown className="h-3 w-3 mr-0.5" />
              ) : null}
              {trendValue}
            </div>
          )}
        </div>
        {secondaryText && <p className="text-xs text-gray-500 mt-1">{secondaryText}</p>}
        {showBadge && <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>}
      </CardContent>
    </Card>
  )
}
