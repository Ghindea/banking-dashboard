"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Car, Briefcase, Users, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

// Types for client data
interface ClientData {
  customerId: string
  reportingMonth: string
  age: number
  occupationCode: string
  educationLevel: string
  county: string
  urbanRural: "Urban" | "Rural"
  gender: string
  maritalStatus: string
  region: string
  clientTenureDays: number
  daysSinceFirstActiveAccount: number
  daysSinceLastActiveAccount: number
  daysSinceCICOpen: number
  daysSinceLastStatus: number
  productCounts: {
    loans: { active: number; total: number }
    deposits: { active: number; total: number }
    cards: { active: number; total: number }
    overdraft: { active: number; total: number }
    refinancings: { active: number; total: number }
    insurances: { active: number; total: number }
    investments: { active: number; total: number }
    termDeposits: { active: number; total: number }
    collateralDeposits: { active: number; total: number }
  }
  balances: {
    loans: { avg: number; min: number; max: number; total: number }
    currentAccounts: { avg: number; min: number; max: number; total: number }
    deposits: { avg: number; min: number; max: number; total: number }
    cards: { avg: number; min: number; max: number; total: number }
    overdraft: { avg: number; min: number; max: number; total: number }
    savingsPlans: { avg: number; min: number; max: number; total: number }
  }
  digitalFlags: {
    internetBanking: boolean
    applePay: boolean
    googlePay: boolean
    georgePay: boolean
    wallet: boolean
  }
  overdraftLimits: {
    approved: number
    remaining: number
  }
  customerSegment: "Mass Market" | "Mass Affluent"
  loanRequests: {
    rejected: number
    total: number
  }
  utilizationGrades: string[]
  ppiFlag: boolean
  otherFlags: Record<string, any>
}

// Types for loan simulation form
interface LoanSimulationForm {
  amount: number
  tenor: number
  useCase: "Personal" | "Green" | "Refinance" | "Home" | "Vehicle" | "Business" | "Family" | "Student"
  interestRate: number
  addPPI: boolean
  useCollateral: boolean
  home_value: number
  downpayment: number
  monthly_hoa: number
  annual_property_tax: number
  annual_home_insurance: number
}

// Types for loan simulation results
interface LoanSimulationResults {
  approvedAmount: number
  interestRate: number
  monthlyPayment: number
  dae: number
  totalCost: number
  totalInterest: number
  amortizationSchedule: { month: number; principal: number; interest: number; balance: number }[]
}

export default function LoanApplicationPage() {
  const router = useRouter()
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState<LoanSimulationForm>({
    amount: 100000,
    tenor: 5,
    useCase: "Home",
    interestRate: 9.5,
    addPPI: false,
    useCollateral: false,
    home_value: 200000,
    downpayment: 40000,
    monthly_hoa: 250,
    annual_property_tax: 2400,
    annual_home_insurance: 1200,
  })

  // Results state
  const [results, setResults] = useState<LoanSimulationResults | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true)
        // In a real app, you would get the actual client ID from auth context or params
        const clientId = "12345"

        // Mock data for development
        const mockData: ClientData = {
          customerId: "12345",
          reportingMonth: "May 2024",
          age: 34,
          occupationCode: "IT Professional",
          educationLevel: "University",
          county: "Bucharest",
          urbanRural: "Urban",
          gender: "Male",
          maritalStatus: "Married",
          region: "South",
          clientTenureDays: 1825,
          daysSinceFirstActiveAccount: 1460,
          daysSinceLastActiveAccount: 30,
          daysSinceCICOpen: 1825,
          daysSinceLastStatus: 15,
          productCounts: {
            loans: { active: 1, total: 2 },
            deposits: { active: 2, total: 2 },
            cards: { active: 2, total: 2 },
            overdraft: { active: 1, total: 1 },
            refinancings: { active: 0, total: 0 },
            insurances: { active: 1, total: 1 },
            investments: { active: 0, total: 0 },
            termDeposits: { active: 1, total: 1 },
            collateralDeposits: { active: 1, total: 1 },
          },
          balances: {
            loans: { avg: 5000, min: 5000, max: 5000, total: 5000 },
            currentAccounts: { avg: 1349.06, min: 500, max: 2000, total: 2698.12 },
            deposits: { avg: 5000, min: 5000, max: 5000, total: 10000 },
            cards: { avg: -450.32, min: -600, max: -300, total: -900.64 },
            overdraft: { avg: -350, min: -350, max: -350, total: -350 },
            savingsPlans: { avg: 2761.4, min: 2761.4, max: 2761.4, total: 2761.4 },
          },
          digitalFlags: {
            internetBanking: true,
            applePay: true,
            googlePay: false,
            georgePay: true,
            wallet: true,
          },
          overdraftLimits: {
            approved: 1000,
            remaining: 650,
          },
          customerSegment: "Mass Affluent",
          loanRequests: {
            rejected: 0,
            total: 2,
          },
          utilizationGrades: ["Low", "Medium"],
          ppiFlag: true,
          otherFlags: {},
        }

        setClientData(mockData)
      } catch (err) {
        setError("Failed to load client data. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientData()
  }, [])

  // Update loan amount when home value or downpayment changes
  useEffect(() => {
    if (form.home_value && form.downpayment >= 0) {
      // Ensure downpayment doesn't exceed home value
      const validDownpayment = Math.min(form.downpayment, form.home_value);

      // Calculate new loan amount (home value minus downpayment)
      const newLoanAmount = form.home_value - validDownpayment;

      // Only update if it's different to avoid infinite loops
      if (newLoanAmount !== form.amount) {
        setForm(prev => ({
          ...prev,
          amount: newLoanAmount
        }));
      }
    }
  }, [form.home_value, form.downpayment]);

  // Handle form changes
  const handleFormChange = (field: keyof LoanSimulationForm, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    setResults(null) // Reset results when form changes
  }

  // Handle simulation submission
  // Update the handleSimulate function (around line 224):
  const handleSimulate = async () => {
    try {
      setIsSimulating(true)

      // Prepare API payload
      const payload = {
        interest_rate: form.interestRate,
        home_value: form.home_value,
        downpayment: form.downpayment,
        duration_years: form.tenor,
        monthly_hoa: form.monthly_hoa,
        annual_property_tax: form.annual_property_tax,
        annual_home_insurance: form.annual_home_insurance
      }

      console.log("Sending mortgage calculation request:", payload)

      // Call the backend API
      const response = await fetch("http://20.185.231.218:5000/calculate-mortgage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const apiResults = await response.json()
      console.log("Mortgage calculation results:", apiResults)

      // Transform API results to match your existing interface
      const transformedResults: LoanSimulationResults = {
        approvedAmount: form.amount, // This is the loan amount (home_value - downpayment)
        interestRate: form.interestRate,
        monthlyPayment: apiResults.monthly_payment.total || 0,
        dae: form.interestRate + 0.7, // You can adjust this calculation
        totalCost: (apiResults.monthly_payment.total || 0) * (form.tenor * 12),
        totalInterest: apiResults.total_interest_paid || 0,
        amortizationSchedule: generateAmortizationSchedule(
          form.amount,
          form.interestRate,
          form.tenor * 12,
          apiResults.monthly_payment.mortgage || 0
        )
      }

      setResults(transformedResults)
      setError(null) // Clear any previous errors

    } catch (err) {
      console.error("Mortgage calculation error:", err)
      setError(`Failed to calculate mortgage: ${err instanceof Error ? err.message : 'Unknown error'}`)

      setResults(null) // Clear results on error
    } finally {
      setIsSimulating(false)
    }
  }

  // Add helper function for amortization schedule generation
  const generateAmortizationSchedule = (
    principal: number,
    annualRate: number,
    months: number,
    monthlyMortgagePayment: number
  ) => {
    const monthlyRate = annualRate / 100 / 12
    let remainingBalance = principal
    const schedule = []

    for (let month = 1; month <= months; month++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = monthlyMortgagePayment - interestPayment
      remainingBalance = Math.max(0, remainingBalance - principalPayment)

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance
      })
    }

    return schedule
  }


  // Generate amortization chart data
  const amortizationChartData = results?.amortizationSchedule
    .filter((_, i) => i % 3 === 0)
    .map((item) => ({
      month: item.month,
      principal: item.principal,
      interest: item.interest,
      remaining: item.balance,
    }))

  // Data for the pie chart
  const pieData = results
    ? [
      { name: "Principal", value: form.amount, color: "#06b6d4" },
      { name: "Interest", value: results.totalInterest, color: "#f97316" },
    ]
    : []

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-georgel-purple mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container pt-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container pt-0 pb-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loan calculator</h1>
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="text-gray-500">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Loan Configuration */}
        <div className="lg:col-span-2 space-y-8">
          {/* Loan Type Tabs */}
          <Tabs defaultValue={form.useCase} onValueChange={(value: string) => handleFormChange("useCase", value)}>
            <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-gray-100">
              <TabsTrigger value="Home" className="flex items-center gap-2 py-2">
                <Home className="h-4 w-4" />
                <span>Home loan</span>
              </TabsTrigger>
              <TabsTrigger value="Vehicle" className="flex items-center gap-2 py-2">
                <Car className="h-4 w-4" />
                <span>Vehicle loan</span>
              </TabsTrigger>
              <TabsTrigger value="Business" className="flex items-center gap-2 py-2">
                <Briefcase className="h-4 w-4" />
                <span>Business loan</span>
              </TabsTrigger>
              <TabsTrigger value="Family" className="flex items-center gap-2 py-2">
                <Users className="h-4 w-4" />
                <span>Family loan</span>
              </TabsTrigger>
              <TabsTrigger value="Student" className="flex items-center gap-2 py-2">
                <GraduationCap className="h-4 w-4" />
                <span>Student loan</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Loan Amount */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-base">
                Loan amount
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={form.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("amount", Number(e.target.value))
                  }}
                  className="w-32 text-right"
                />
              </div>
            </div>
            <Slider
              value={[form.amount]}
              min={1000}
              max={500000}
              step={1000}
              onValueChange={(value: number[]) => {
                handleFormChange("amount", value[0])
              }}
              className="py-4"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="interestRate" className="text-base">
                Rate of interest
              </Label>
              <div className="flex items-center">
                <Input
                  id="interestRate"
                  type="number"
                  value={form.interestRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("interestRate", Number(e.target.value))
                  }}
                  className="w-20 text-right"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
            <Slider
              value={[form.interestRate]}
              min={1}
              max={20}
              step={0.1}
              onValueChange={(value: number[]) => {
                handleFormChange("interestRate", value[0])
              }}
              className="py-4"
            />
          </div>

          {/* Loan Tenure */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="tenor" className="text-base">
                Loan tenure
              </Label>
              <div className="flex items-center">
                <Input
                  id="tenor"
                  type="number"
                  value={form.tenor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("tenor", Number(e.target.value))
                  }}
                  className="w-20 text-right"
                />
                <span className="ml-2">Years</span>
              </div>
            </div>
            <Slider
              value={[form.tenor]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value: number[]) => {
                handleFormChange("tenor", value[0])
              }}
              className="py-4"
            />
          </div>

          {/* Home Value */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="home_value" className="text-base">
                Home value
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="home_value"
                  type="number"
                  value={form.home_value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("home_value", Number(e.target.value))
                  }}
                  className="w-32 text-right"
                />
              </div>
            </div>
            <Slider
              value={[form.home_value]}
              min={50000}
              max={1000000}
              step={10000}
              onValueChange={(value: number[]) => {
                handleFormChange("home_value", value[0])
              }}
              className="py-4"
            />
          </div>

          {/* Downpayment */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="downpayment" className="text-base">
                Downpayment
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="downpayment"
                  type="number"
                  value={form.downpayment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("downpayment", Number(e.target.value))
                  }}
                  className="w-32 text-right"
                />
              </div>
            </div>
            <Slider
              value={[form.downpayment]}
              min={0}
              max={form.home_value * 0.5}
              step={5000}
              onValueChange={(value: number[]) => {
                handleFormChange("downpayment", value[0])
              }}
              className="py-4"
            />
          </div>

          {/* Monthly HOA */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="monthly_hoa" className="text-base">
                Monthly HOA fees
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="monthly_hoa"
                  type="number"
                  value={form.monthly_hoa}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("monthly_hoa", Number(e.target.value))
                  }}
                  className="w-24 text-right"
                />
              </div>
            </div>
            <Slider
              value={[form.monthly_hoa]}
              min={0}
              max={1000}
              step={10}
              onValueChange={(value: number[]) => {
                handleFormChange("monthly_hoa", value[0])
              }}
              className="py-4"
            />
          </div>

          {/* Annual Property Tax */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="annual_property_tax" className="text-base">
                Annual property tax
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="annual_property_tax"
                  type="number"
                  value={form.annual_property_tax}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("annual_property_tax", Number(e.target.value))
                  }}
                  className="w-24 text-right"
                />
              </div>
            </div>
            <Slider
              value={[form.annual_property_tax]}
              min={0}
              max={10000}
              step={100}
              onValueChange={(value: number[]) => {
                handleFormChange("annual_property_tax", value[0])
              }}
              className="py-4"
            />
          </div>

          {/* Annual Home Insurance */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="annual_home_insurance" className="text-base">
                Annual home insurance
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="annual_home_insurance"
                  type="number"
                  value={form.annual_home_insurance}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("annual_home_insurance", Number(e.target.value))
                  }}
                  className="w-24 text-right"
                />
              </div>
            </div>
            <Slider
              value={[form.annual_home_insurance]}
              min={0}
              max={5000}
              step={100}
              onValueChange={(value: number[]) => {
                handleFormChange("annual_home_insurance", value[0])
              }}
              className="py-4"
            />
          </div>


          {/* Calculate Button */}
          <div className="pt-6">
            <Button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                "Calculate Mortgage"
              )}
            </Button>
          </div>

          {/* Results Display - only show after calculation */}
          {results && (
            <>
              {/* EMI Display */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Total Monthly Payment</h3>
                  <span className="text-xl font-bold text-cyan-500">
                    ${Math.round(results.monthlyPayment).toLocaleString()}
                  </span>
                </div>

                {/* Payment Breakdown - using API response data */}
                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Payment Breakdown:</h4>
                  <div className="flex justify-between text-sm">
                    <span>Principal & Interest</span>
                    <span>${Math.round(results.monthlyPayment - form.monthly_hoa - (form.annual_property_tax / 12) - (form.annual_home_insurance / 12)).toLocaleString()}</span>
                  </div>
                  {form.monthly_hoa > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Monthly HOA</span>
                      <span>${form.monthly_hoa.toLocaleString()}</span>
                    </div>
                  )}
                  {form.annual_property_tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Property Tax (monthly)</span>
                      <span>${Math.round(form.annual_property_tax / 12).toLocaleString()}</span>
                    </div>
                  )}
                  {form.annual_home_insurance > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Home Insurance (monthly)</span>
                      <span>${Math.round(form.annual_home_insurance / 12).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Total Interest Display */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total Interest Over Life of Loan</span>
                    <span className="font-bold text-blue-600">${Math.round(results.totalInterest).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Save result</Button>
                <Button variant="outline" className="flex-1">View report</Button>
              </div>
            </>
          )}          {/* Right Column - Results Visualization */}

        </div>

        {/* Right Column - Results Visualization */}
        <div className="space-y-8">
          {/* Always show chart but with N/A when no results */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="h-[300px] flex flex-col items-center justify-center">
                {results ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-200 mx-auto mb-4"></div>
                    <p className="text-sm">Calculate to see breakdown</p>
                  </div>
                )}
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">Total amount:</p>
                  <p className="text-2xl font-bold">
                    {results ? `$${Math.round(results.totalCost).toLocaleString()}` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <div>
                    <p className="text-sm">Principal amount</p>
                    <p className="font-bold">
                      {results ? `$${form.amount.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <div>
                    <p className="text-sm">Total interest</p>
                    <p className="font-bold">
                      {results ? `$${Math.round(results.totalInterest).toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
