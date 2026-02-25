import { createContext, useContext, useState, useCallback } from 'react'

const UsageContext = createContext(null)

// Credit costs per action
export const CREDIT_COSTS = {
  chatQuery: 25,
  dashboardCreation: 300,
  dashboardRefresh: 50,
  dataExport: 100,
}

// Plan configurations
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    credits: 100,
    limits: {
      chats: 4,
      dashboards: 0,
      deepResearch: false,
    },
    dataAccess: {
      historicalMonths: 12,
      countries: 'japan', // Japan only
      web: true,
      app: false,
      retail: false,
    },
    features: [
      'features.credits100',
      'features.noRollover',
      'features.noDeepResearch',
      'features.japanOnly',
      'features.history12Months',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 119,
    priceYearly: 1190,
    credits: 250,
    limits: {
      chats: 10,
      dashboards: 1,
      deepResearch: false,
    },
    dataAccess: {
      historicalMonths: 12,
      countries: 'japan',
      web: true,
      app: false,
      retail: false,
    },
    features: [
      'features.credits250',
      'features.rollover1Month',
      'features.noDeepResearch',
      'features.japanOnly',
      'features.history12Months',
      'features.emailSupport',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 229,
    priceYearly: 2290,
    credits: 500,
    limits: {
      chats: 20,
      dashboards: -1,
      deepResearch: true,
    },
    dataAccess: {
      historicalMonths: 12,
      countries: 'japan',
      web: true,
      app: true,
      retail: false,
    },
    features: [
      'features.credits500',
      'features.rollover3Months',
      'features.deepResearchIncluded',
      'features.japanOnly',
      'features.history12Months',
      'features.prioritySupport',
    ],
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: -1,
    priceYearly: -1,
    credits: -1,
    limits: {
      chats: -1,
      dashboards: -1,
      deepResearch: true,
    },
    dataAccess: {
      historicalMonths: 36,
      countries: 'all',
      web: true,
      app: true,
      retail: true,
    },
    features: [
      'features.creditsCustom',
      'features.rolloverUnlimited',
      'features.deepResearchUnlimited',
      'features.allCountries',
      'features.history3Years',
      'features.dedicatedCSM',
    ],
  },
}

// Credit package pricing
export const CREDIT_PACKAGE = {
  pricePerCredit: 0.5,
  description: 'Additional credits for power users',
}

export function UsageProvider({ children }) {
  // Simulated user subscription state - FREE TIER
  const [subscription, setSubscription] = useState({
    plan: 'free',
    billingCycle: 'monthly',
    startDate: new Date('2024-01-15'),
    nextBillingDate: new Date('2024-02-15'),
  })

  // Credit-based usage state - Free tier has 100 credits, user has used 97 (only 3 left)
  const [usage, setUsage] = useState({
    creditsUsed: 97, // out of 100 for free tier - only 3 credits left!
    chatQueries: 3,
    dashboardsCreated: 0,
    dashboardRefreshes: 0,
    dataExports: 0,
  })

  // Consumption breakdown by source - Free tier
  const [consumptionBySource, setConsumptionBySource] = useState({
    direct: {
      credits: 50,
      chats: 2,
      dashboards: 0,
      lastMonth: 0,
    },
    mcp: {
      credits: 25,
      chats: 1,
      dashboards: 0,
      lastMonth: 0,
    },
    api: {
      credits: 0,
      chats: 0,
      dashboards: 0,
      lastMonth: 0,
    },
  })

  const [usageHistory, setUsageHistory] = useState([
    { date: '2024-01-01', credits: 0, chats: 0 },
    { date: '2024-01-05', credits: 25, chats: 1 },
    { date: '2024-01-10', credits: 50, chats: 2 },
    { date: '2024-01-15', credits: 75, chats: 3 },
    { date: '2024-01-20', credits: 75, chats: 3 },
  ])

  const currentPlan = PLANS[subscription.plan]

  const getCreditsPercentage = useCallback(() => {
    if (currentPlan.credits === -1) return 0
    return Math.round((usage.creditsUsed / currentPlan.credits) * 100)
  }, [usage.creditsUsed, currentPlan])

  const getCreditsRemaining = useCallback(() => {
    if (currentPlan.credits === -1) return -1
    return currentPlan.credits - usage.creditsUsed
  }, [usage.creditsUsed, currentPlan])

  const isNearCreditLimit = useCallback((threshold = 80) => {
    return getCreditsPercentage() >= threshold
  }, [getCreditsPercentage])

  const isAtCreditLimit = useCallback(() => {
    if (currentPlan.credits === -1) return false
    return usage.creditsUsed >= currentPlan.credits
  }, [usage.creditsUsed, currentPlan])

  const useCredits = useCallback((action) => {
    const cost = CREDIT_COSTS[action]
    if (cost) {
      setUsage(prev => ({
        ...prev,
        creditsUsed: prev.creditsUsed + cost,
        [action === 'chatQuery' ? 'chatQueries' : action === 'dashboardCreation' ? 'dashboardsCreated' : action === 'dashboardRefresh' ? 'dashboardRefreshes' : 'dataExports']: prev[action === 'chatQuery' ? 'chatQueries' : action === 'dashboardCreation' ? 'dashboardsCreated' : action === 'dashboardRefresh' ? 'dashboardRefreshes' : 'dataExports'] + 1,
      }))
    }
  }, [])

  const upgradePlan = useCallback((newPlan) => {
    setSubscription(prev => ({
      ...prev,
      plan: newPlan,
    }))
  }, [])

  const changeBillingCycle = useCallback((cycle) => {
    setSubscription(prev => ({
      ...prev,
      billingCycle: cycle,
    }))
  }, [])

  const value = {
    subscription,
    usage,
    usageHistory,
    consumptionBySource,
    currentPlan,
    plans: PLANS,
    creditCosts: CREDIT_COSTS,
    creditPackage: CREDIT_PACKAGE,
    getCreditsPercentage,
    getCreditsRemaining,
    isNearCreditLimit,
    isAtCreditLimit,
    useCredits,
    upgradePlan,
    changeBillingCycle,
  }

  return (
    <UsageContext.Provider value={value}>
      {children}
    </UsageContext.Provider>
  )
}

export function useUsage() {
  const context = useContext(UsageContext)
  if (!context) {
    throw new Error('useUsage must be used within a UsageProvider')
  }
  return context
}
