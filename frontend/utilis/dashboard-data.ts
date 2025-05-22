// Utility functions to calculate dashboard metrics from user data

export interface DashboardMetrics {
  totalNetPosition: {
    amount: number
    trend: string
    trendValue: string
  }
  availableCredit: {
    amount: number
    trend: string
    trendValue: string
  }
  lastInflow: {
    amount: number
    daysAgo: number
    description: string
  }
  digitalServices: {
    status: string
    description: string
    activeServices: string[]
    totalServices: number
    activeCount: number
  }
  spendingData: Array<{
    name: string
    value: number
    color: string
  }>
  loanInfo: {
    hasLoans: boolean
    preApproved: boolean
    preApprovedAmount: number
    totalRequests: number
    rejectedRequests: number
  }
  cardInfo: {
    hasDebitCard: boolean
    hasCreditCard: boolean
    debitBalance: number
    creditBalance: number
    creditLimit: number
  }
}

export function calculateDashboardMetrics(userData: any): DashboardMetrics {
  // Calculate Total Net Position
  const cecBalance = parseFloat(userData.CEC_TOTAL_BALANCE_AMT || 0)
  const depBalance = parseFloat(userData.DEP_TOTAL_BALANCE_AMT || 0)
  const savBalance = parseFloat(userData.SAV_TOTAL_BALANCE_AMT || 0)
  const crtBalance = parseFloat(userData.CRT_TOTAL_BALANCE_AMT || 0)
  const cloBalance = parseFloat(userData.CLO_TOTAL_BALANCE_AMT || 0)
  const ovdBalance = parseFloat(userData.OVD_TOTAL_BALANCE_AMT || 0)
  
  // Sum positive balances (assets) and subtract negative balances (liabilities)
  const assets = Math.max(0, cecBalance) + Math.max(0, depBalance) + Math.max(0, savBalance)
  const liabilities = Math.abs(Math.min(0, cloBalance)) + Math.abs(Math.min(0, crtBalance)) + Math.abs(Math.min(0, ovdBalance))
  const totalNetPosition = assets - liabilities
  
  // Calculate Available Credit
  const ovdRemaining = parseFloat(userData.OVD_REMAINING_LIMIT_AMT || 0)
  const iccRemaining = parseFloat(userData.ICC_REMAINING_LIMIT_AMT || 0)
  const availableCredit = ovdRemaining + iccRemaining
  
  // Calculate Last Inflow
  const lastSalaryDays = parseInt(userData.GPI_LST_SALARY_ND || 0)
  const inflowAmount = parseFloat(userData.TRX_IN_ALL_AMT || 0)
  
  // Digital Services Status
  const georgePay = parseInt(userData.GEORGE_PAY_FLAG || 0)
  const applePay = parseInt(userData.APPLE_PAY_FLAG || 0)
  const googlePay = parseInt(userData.GOOGLE_PAY_FLAG || 0)
  const wallet = parseInt(userData.WALLET_FLAG || 0)
  const internetBanking = userData.PTS_IB_FLAG === 'Y' ? 1 : 0
  
  const activeServices = []
  if (internetBanking) activeServices.push('Internet Banking')
  if (georgePay) activeServices.push('George Pay')
  if (applePay) activeServices.push('Apple Pay')
  if (googlePay) activeServices.push('Google Pay')
  if (wallet) activeServices.push('Digital Wallet')
  
  // Spending Categories (MCC data)
  const spendingCategories = [
    { name: 'Food', field: 'MCC_FOOD_AMT', color: '#0088FE' },
    { name: 'Transportation', field: 'MCC_TRANSPORTATION_AMT', color: '#00C49F' },
    { name: 'Shopping', field: 'MCC_RETAIL_OUTLET_SERV_AMT', color: '#FF8042' },
    { name: 'Entertainment', field: 'MCC_LEISURE_AMT', color: '#FFBB28' },
    { name: 'Other', field: 'MCC_MISCELLANEOUS_STORES_AMT', color: '#A569BD' }
  ]
  
  const spendingData = spendingCategories.map(category => ({
    name: category.name,
    value: Math.abs(parseFloat(userData[category.field] || 0)),
    color: category.color
  })).filter(item => item.value > 0)
  
  // If no spending data, create mock data for visualization
  if (spendingData.length === 0) {
    spendingData.push(
      { name: 'Food', value: 500, color: '#0088FE' },
      { name: 'Transportation', value: 300, color: '#00C49F' },
      { name: 'Shopping', value: 400, color: '#FF8042' },
      { name: 'Entertainment', value: 200, color: '#FFBB28' },
      { name: 'Other', value: 150, color: '#A569BD' }
    )
  }
  
  // Loan Information
  const totalLoanRequests = parseInt(userData.PTS_TOTAL_LOANS_REQ_CNT || 0)
  const rejectedRequests = parseInt(userData.PTS_REJECTED_LOANS_REQ_CNT || 0)
  const hasActiveLoans = parseInt(userData.LOA_ALL_ACTIVE_CNT || 0) > 0
  
  // Card Information
  const hasDebitCard = parseInt(userData.CEC_ALL_ACTIVE_CNT || 0) > 0
  const hasCreditCard = parseInt(userData.CRT_ALL_ACTIVE_CNT || 0) > 0
  const creditLimit = parseFloat(userData.ICC_APPROVED_LIMIT || 0)
  
  return {
    totalNetPosition: {
      amount: totalNetPosition,
      trend: totalNetPosition >= 0 ? 'up' : 'down',
      trendValue: '2.5%' // Mock trend for now
    },
    availableCredit: {
      amount: availableCredit,
      trend: 'neutral',
      trendValue: '0%'
    },
    lastInflow: {
      amount: inflowAmount,
      daysAgo: lastSalaryDays,
      description: lastSalaryDays === 0 ? 'Recent income' : `${lastSalaryDays} days ago`
    },
    digitalServices: {
      status: activeServices.length >= 3 ? 'Active' : 'Partial',
      description: activeServices.length >= 3 ? 'All services enabled' : `${activeServices.length} services active`,
      activeServices,
      totalServices: 5,
      activeCount: activeServices.length
    },
    spendingData,
    loanInfo: {
      hasLoans: hasActiveLoans,
      preApproved: rejectedRequests === 0 && totalLoanRequests < 3,
      preApprovedAmount: rejectedRequests === 0 ? 15000 : 0,
      totalRequests: totalLoanRequests,
      rejectedRequests
    },
    cardInfo: {
      hasDebitCard,
      hasCreditCard,
      debitBalance: cecBalance,
      creditBalance: Math.abs(crtBalance),
      creditLimit
    }
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}