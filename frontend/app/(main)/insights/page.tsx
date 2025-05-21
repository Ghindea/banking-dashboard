import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowRight, PiggyBank, CreditCard, TrendingUp } from "lucide-react"

// Sample data for the what-if chart
const whatIfData = [
  { name: "Current", value: 35 },
  { name: "After 1 Year", value: 108 },
  { name: "After 2 Years", value: 187 },
  { name: "After 3 Years", value: 275 },
]

export default function InsightsPage() {
  return (
    <div className="container py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Personalized Insights & Offers</h1>
        <p className="text-gray-500">Discover tailored financial recommendations just for you</p>
      </div>

      {/* Segmentation Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Customer Segment</CardTitle>
            <Badge className="bg-georgel-purple">Mass Affluent</Badge>
          </div>
          <CardDescription>Here's what makes you part of this segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">High Deposit Balances</h3>
              <p className="text-sm text-gray-500 mb-2">Your savings exceed 98% of customers in your age group.</p>
              <div className="flex items-center space-x-2">
                <Progress value={98} className="h-1.5" />
                <span className="text-xs font-medium">98%</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Regular Income</h3>
              <p className="text-sm text-gray-500 mb-2">You receive consistent monthly salary payments.</p>
              <div className="flex items-center space-x-2">
                <Progress value={85} className="h-1.5" />
                <span className="text-xs font-medium">85%</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Digital Engagement</h3>
              <p className="text-sm text-gray-500 mb-2">You use all our digital services more than most customers.</p>
              <div className="flex items-center space-x-2">
                <Progress value={90} className="h-1.5" />
                <span className="text-xs font-medium">90%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Term Deposit</CardTitle>
            <CardDescription>Earn higher interest on your savings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Based on your current balances, you could earn up to{" "}
              <span className="font-semibold text-blue-600">6% APY</span> on a 12-month term deposit.
            </p>
            <div className="flex items-center mt-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+0.5% higher rate</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Gold Credit Card</CardTitle>
            <CardDescription>Upgrade to premium benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              You're pre-approved for our Gold Credit Card with airport lounge access and enhanced rewards.
            </p>
            <div className="flex items-center mt-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">€50 annual fee waived</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Investment Fund</CardTitle>
            <CardDescription>Start building your investment portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Our balanced fund has returned an average of 8.5% annually over the past 5 years.
            </p>
            <div className="flex items-center mt-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">No minimum investment</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Explore Funds <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* What-If Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>What-If Scenarios</CardTitle>
          <CardDescription>See how small changes could improve your financial future</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">If you move €1,000 to a term deposit</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You could earn an extra <span className="font-semibold text-green-600">€60 per year</span> in
                  interest.
                </p>
                <Button variant="outline" size="sm">
                  Set up a Deposit <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">If you consolidate your loans</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your monthly payment could drop by <span className="font-semibold text-green-600">15%</span> from €350
                  to €297.50.
                </p>
                <Button variant="outline" size="sm">
                  Learn About Consolidation <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="h-[300px]">
              <h3 className="font-medium mb-2">If you invest €50/month</h3>
              <p className="text-sm text-gray-500 mb-4">Potential growth of your investment over time (in €)</p>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={whatIfData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}`, "Value"]} />
                  <Bar dataKey="value" fill="#6153CC" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
