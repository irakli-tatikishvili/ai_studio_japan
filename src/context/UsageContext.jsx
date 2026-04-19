import { createContext, useContext, useState, useCallback } from 'react'

const UsageContext = createContext(null)

// Credit costs per action
export const CREDIT_COSTS = {
  chatQuery: 25,
  dashboardCreation: 300,
  dashboardRefresh: 50,
  dataExport: 100,
}

// Plan configurations — Explorer (free), Strategist ($199), Leader ($400); x = 50 base unit
export const PLANS = {
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    price: 0,
    priceYearly: 0,
    credits: 500,
    dailyCredits: 50,
    monthlyCreditMult: '10×',
    dailyCreditMult: 'x',
    creditsAddOn: false,
    seatUsers: 1,
    limits: {
      chats: 2,
      dashboards: 0,
      deepResearch: false,
    },
    dataAccess: {
      historicalMonths: 15,
      countries: 'all',
      webBasic: true,
      webFull: false,
      seoPaid: false,
      apps: false,
      websiteTechnologies: false,
      web: true,
      app: false,
      retail: false,
    },
    features: [
      'features.trafficEngagement',
      'features.monthlyCredits500',
      'features.countryAllHistory15',
      'features.creditsAddOnNo',
      'features.excludedWebsiteTechnologies',
    ],
  },
  strategist: {
    id: 'strategist',
    name: 'Strategist',
    price: 199,
    priceYearly: 1990,
    credits: 2500,
    dailyCredits: 250,
    monthlyCreditMult: '50×',
    dailyCreditMult: '5×',
    creditsAddOn: true,
    seatUsers: 1,
    limits: {
      chats: 12,
      dashboards: 2,
      deepResearch: false,
    },
    dataAccess: {
      historicalMonths: 15,
      countries: 'all',
      webBasic: true,
      webFull: true,
      seoPaid: false,
      apps: false,
      websiteTechnologies: false,
      web: true,
      app: false,
      retail: false,
    },
    features: [
      'features.everythingInExplorer',
      'features.strategistWebSuite',
      'features.monthlyCredits2500',
      'features.creditsAddOnYes',
      'features.excludedWebsiteTechnologies',
    ],
    popular: true,
  },
  leader: {
    id: 'leader',
    name: 'Leader',
    price: 400,
    priceYearly: 4000,
    credits: 5000,
    dailyCredits: 500,
    monthlyCreditMult: '100×',
    dailyCreditMult: '10×',
    creditsAddOn: true,
    seatUsers: 1,
    limits: {
      chats: 30,
      dashboards: -1,
      deepResearch: true,
    },
    dataAccess: {
      historicalMonths: 15,
      countries: 'all',
      webBasic: true,
      webFull: true,
      seoPaid: true,
      apps: false,
      websiteTechnologies: false,
      web: true,
      app: false,
      retail: false,
    },
    features: [
      'features.everythingInStrategist',
      'features.leaderSeoPpcSuite',
      'features.monthlyCredits5000',
      'features.creditsAddOnYes',
      'features.excludedWebsiteTechnologies',
    ],
  },
  custom: {
    id: 'custom',
    name: 'Talk to us',
    price: -1,
    priceYearly: -1,
    credits: -1,
    dailyCredits: -1,
    monthlyCreditMult: '',
    dailyCreditMult: '',
    creditsAddOn: true,
    seatUsers: 'custom',
    limits: {
      chats: -1,
      dashboards: -1,
      deepResearch: true,
    },
    dataAccess: {
      historicalMonths: 37,
      countries: 'all',
      webBasic: true,
      webFull: true,
      seoPaid: true,
      apps: true,
      websiteTechnologies: false,
      web: true,
      app: true,
      retail: true,
    },
    features: [
      'features.tier.customIntro',
      'features.tier.customBullets',
    ],
  },
}

// Credit package pricing
export const CREDIT_PACKAGE = {
  pricePerCredit: 0.5,
  description: 'Additional credits for power users',
}

export function UsageProvider({ children }) {
  const [subscription, setSubscription] = useState({
    plan: 'explorer',
    billingCycle: 'monthly',
    startDate: new Date('2024-01-15'),
    nextBillingDate: new Date('2024-02-15'),
  })

  const [usage, setUsage] = useState({
    creditsUsed: 420,
    chatQueries: 2,
    dashboardsCreated: 0,
    dashboardRefreshes: 0,
    dataExports: 0,
  })

  const [consumptionBySource, setConsumptionBySource] = useState({
    direct: {
      credits: 250,
      chats: 1,
      dashboards: 0,
      lastMonth: 0,
    },
    mcp: {
      credits: 120,
      chats: 1,
      dashboards: 0,
      lastMonth: 0,
    },
    api: {
      credits: 50,
      chats: 0,
      dashboards: 0,
      lastMonth: 0,
    },
  })

  const [usageHistory, setUsageHistory] = useState([
    { date: '2024-01-01', credits: 0, chats: 0 },
    { date: '2024-01-05', credits: 150, chats: 1 },
    { date: '2024-01-10', credits: 300, chats: 1 },
    { date: '2024-01-15', credits: 420, chats: 2 },
    { date: '2024-01-20', credits: 420, chats: 2 },
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
