import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountsPage() {
  return (
    <div className="container py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Accounts & Balances</h1>
        <p className="text-gray-500">View and manage all your financial products</p>
      </div>

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
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Current Accounts</td>
                  <td className="py-3 px-4">2 / 2</td>
                  <td className="py-3 px-4">€1,349.06</td>
                  <td className="py-3 px-4">€2,698.12</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Deposits</td>
                  <td className="py-3 px-4">1 / 1</td>
                  <td className="py-3 px-4">€5,000.00</td>
                  <td className="py-3 px-4">€5,000.00</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Savings Plans</td>
                  <td className="py-3 px-4">1 / 2</td>
                  <td className="py-3 px-4">€2,761.40</td>
                  <td className="py-3 px-4">€2,761.40</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Loans & Overdraft</td>
                  <td className="py-3 px-4">1 / 1</td>
                  <td className="py-3 px-4">-€5,000.00</td>
                  <td className="py-3 px-4">-€5,000.00</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">Credit Cards</td>
                  <td className="py-3 px-4">2 / 2</td>
                  <td className="py-3 px-4">-€450.32</td>
                  <td className="py-3 px-4">-€900.64</td>
                </tr>
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
                <span>Used: €350.00</span>
                <span>Limit: €1,000.00</span>
              </div>
              <Progress value={35} className="h-2" />
              <p className="text-sm text-gray-500">35% utilized - Low risk</p>
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
                <span>Used: €1,250.00</span>
                <span>Limit: €2,500.00</span>
              </div>
              <Progress value={50} className="h-2" />
              <p className="text-sm text-gray-500">50% utilized - Medium risk</p>
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
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Term Deposit #1</td>
                      <td className="py-3 px-4">€5,000.00</td>
                      <td className="py-3 px-4">6.00% p.a.</td>
                      <td className="py-3 px-4">June 15, 2024</td>
                      <td className="py-3 px-4">26</td>
                    </tr>
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
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Credit Card #1</td>
                      <td className="py-3 px-4">€35.00</td>
                      <td className="py-3 px-4">May 25, 2024</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Due soon</span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Personal Loan</td>
                      <td className="py-3 px-4">€250.00</td>
                      <td className="py-3 px-4">June 1, 2024</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Scheduled</span>
                      </td>
                    </tr>
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
