import { useState } from 'react'
import { Check, X, Sparkles, Zap, Building2, ArrowRight, Globe, BarChart3, Search, Smartphone, Coins, ShoppingCart, TrendingUp, Plus, Gift, DollarSign, Layers, MessageSquare, Brain, CreditCard, Info } from 'lucide-react'
import { useUsage, PLANS, CREDIT_PACKAGE } from '../context/UsageContext'
import { useLanguage } from '../context/LanguageContext'

// Module-based pricing configuration
// Credit costs are normalized: 1 credit ≈ $0.10 (Web as baseline)
const MODULES = {
  web: {
    id: 'web',
    name: 'Web Intelligence',
    description: 'Traffic, engagement, marketing channels',
    icon: Globe,
    color: 'blue',
    accessPrice: 49,
    queryPrice: 0.10,
    creditsPerQuery: 1,      // Base rate: 1 credit = 1 Web query
    hasFreeeTier: true,
    freeQueries: 20,
    features: ['Traffic & Engagement', 'Marketing Channels', 'Audience Demographics', 'Competitor Benchmarks'],
  },
  search: {
    id: 'search',
    name: 'Search Intelligence',
    description: 'SEO, keywords, paid search campaigns',
    icon: Search,
    color: 'green',
    accessPrice: 79,
    queryPrice: 0.15,
    creditsPerQuery: 1.5,    // 1.5x Web cost
    hasFreeeTier: false,
    features: ['Organic Keywords', 'Paid Keywords', 'SERP Analysis', 'Backlink Data'],
  },
  apps: {
    id: 'apps',
    name: 'App Intelligence',
    description: 'Mobile app downloads, usage, rankings',
    icon: Smartphone,
    color: 'purple',
    accessPrice: -1,         // Contact Sales
    queryPrice: -1,
    creditsPerQuery: -1,
    hasFreeeTier: false,
    contactSales: true,
    features: ['App Downloads', 'Usage Metrics', 'Store Rankings', 'Review Analytics'],
  },
  stocks: {
    id: 'stocks',
    name: 'Stocks Intelligence',
    description: 'Company financials, stock performance',
    icon: TrendingUp,
    color: 'amber',
    accessPrice: -1,         // Contact Sales
    queryPrice: -1,
    creditsPerQuery: -1,
    hasFreeeTier: false,
    contactSales: true,
    features: ['Financial Metrics', 'Stock Performance', 'Investor Insights', 'Market Trends'],
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon Intelligence',
    description: 'E-commerce, product analytics, marketplace',
    icon: ShoppingCart,
    color: 'orange',
    accessPrice: -1,         // Contact Sales
    queryPrice: -1,
    creditsPerQuery: -1,
    hasFreeeTier: false,
    contactSales: true,
    features: ['Product Rankings', 'Sales Estimates', 'Category Analysis', 'Seller Insights'],
  },
}

// Trial credits configuration
const TRIAL_CONFIG = {
  credits: 50,
  expiresInDays: 14,
  creditValue: 0.10, // 1 credit = $0.10
}

// Pay-Per-Query pricing configuration (per module)
const PAY_PER_QUERY_CONFIG = {
  trialBalance: 5.00, // $5 free trial balance
  modules: {
    web: {
      regularPrice: 0.10,
      deepPrice: 0.50,
      contactSales: false,
    },
    search: {
      regularPrice: 0.15,
      deepPrice: 0.75,
      contactSales: false,
    },
    apps: {
      regularPrice: -1,
      deepPrice: -1,
      contactSales: true,
    },
    stocks: {
      regularPrice: -1,
      deepPrice: -1,
      contactSales: true,
    },
    amazon: {
      regularPrice: -1,
      deepPrice: -1,
      contactSales: true,
    },
  },
  topUpOptions: [
    { amount: 10, bonus: 0, label: '$10' },
    { amount: 25, bonus: 2.50, label: '$25 + $2.50 bonus' },
    { amount: 50, bonus: 7.50, label: '$50 + $7.50 bonus' },
    { amount: 100, bonus: 20, label: '$100 + $20 bonus' },
  ],
}

// Uniform Credits pricing configuration
// Same credit cost for all modules, different recurring subscription per module
const UNIFORM_CREDITS_CONFIG = {
  creditCost: 0.10, // $0.10 per credit (same for all modules)
  creditsPerQuery: 1, // 1 credit = 1 query (regardless of module)
  trialCredits: 50, // 50 free trial credits
  modules: {
    web: {
      // Access Only pricing
      accessOnlyFee: 29,
      // Credits Included pricing
      creditsIncludedFee: 49,
      creditsIncluded: 100,
      description: 'Traffic, engagement, marketing channels',
      contactSales: false,
    },
    search: {
      accessOnlyFee: 59,
      creditsIncludedFee: 99,
      creditsIncluded: 200,
      description: 'SEO, keywords, paid search campaigns',
      contactSales: false,
    },
    apps: {
      accessOnlyFee: -1,
      creditsIncludedFee: -1,
      creditsIncluded: 0,
      description: 'Mobile app downloads, usage, rankings',
      contactSales: true,
    },
    stocks: {
      accessOnlyFee: -1,
      creditsIncludedFee: -1,
      creditsIncluded: 0,
      description: 'Company financials, stock performance',
      contactSales: true,
    },
    amazon: {
      accessOnlyFee: -1,
      creditsIncludedFee: -1,
      creditsIncluded: 0,
      description: 'E-commerce, product analytics, marketplace',
      contactSales: true,
    },
  },
  creditPackages: [
    { credits: 100, price: 10, label: '100 credits' },
    { credits: 500, price: 45, label: '500 credits', popular: true },
    { credits: 1000, price: 80, label: '1,000 credits' },
    { credits: 5000, price: 350, label: '5,000 credits' },
  ],
}

export default function PricingPage() {
  const { subscription, upgradePlan } = useUsage()
  const { t } = useLanguage()
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [pricingModel, setPricingModel] = useState('tiers') // 'tiers', 'credits', or 'freeTier'
  const [selectedModules, setSelectedModules] = useState([])
  const [uniformCreditsMode, setUniformCreditsMode] = useState('accessOnly') // 'accessOnly' or 'creditsIncluded'
  
  // Simulated user trial state for Credits Pool option
  const [userTrialState, setUserTrialState] = useState({
    isOnTrial: true,
    trialCredits: 50,
    trialCreditsUsed: 12,
    trialExpiresIn: 10, // days
  })

  // Simulated user balance for Pay-Per-Query option
  const [userBalance, setUserBalance] = useState({
    balance: 5.00, // $5 trial balance
    isTrialBalance: true,
    totalSpent: 0,
    queriesUsed: { regular: 0, deep: 0 },
  })

  const planOrder = ['free', 'starter', 'pro', 'enterprise']

  const toggleModule = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const calculateModuleTotal = () => {
    // In freeTier mode, Web module is free if it's the only selected module
    if (pricingModel === 'freeTier') {
      const paidModules = selectedModules.filter(id => {
        if (id === 'web' && MODULES.web.hasFreeeTier && selectedModules.length === 1) {
          return false
        }
        return true
      })
      const accessTotal = paidModules.reduce((sum, id) => sum + MODULES[id].accessPrice, 0)
      return billingCycle === 'yearly' ? Math.round(accessTotal * 0.83) : accessTotal
    }
    // In credits mode, all modules cost money (but you get trial credits)
    const accessTotal = selectedModules.reduce((sum, id) => sum + MODULES[id].accessPrice, 0)
    return billingCycle === 'yearly' ? Math.round(accessTotal * 0.83) : accessTotal
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sw-blue-100 text-sw-blue-700 mb-4">
            {t('pricing.badge')}
          </span>
          <h1 className="text-4xl font-bold text-sw-dark mb-4">{t('pricing.title')}</h1>
          <p className="text-lg text-sw-gray-600 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
        </div>

        {/* Pricing Model Toggle - 5 Options */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="inline-flex bg-sw-gray-100 rounded-xl p-1 flex-wrap justify-center gap-1">
            <div className="relative group">
              <button
                onClick={() => setPricingModel('tiers')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  pricingModel === 'tiers'
                    ? 'bg-white text-sw-dark shadow-sm'
                    : 'text-sw-gray-600 hover:text-sw-dark'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {t('pricing.tierBased') || 'Tier-Based'}
                <Info className="w-3 h-3 opacity-50" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-sw-dark text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 text-center z-50 shadow-lg">
                {t('pricing.tierBasedInfo') || 'Traditional packages: Free, Starter, Pro, Enterprise with fixed features & limits'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sw-dark"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setPricingModel('uniformCredits')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  pricingModel === 'uniformCredits'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                    : 'text-sw-gray-600 hover:text-sw-dark'
                }`}
              >
                <Coins className="w-4 h-4" />
                {t('pricing.uniformCredits') || 'Uniform Credits'}
                <Info className="w-3 h-3 opacity-50" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-sw-dark text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 text-center z-50 shadow-lg">
                {t('pricing.uniformCreditsInfo') || 'Same credit cost for all modules. Pay different subscription fees per data module.'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sw-dark"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setPricingModel('payPerQuery')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  pricingModel === 'payPerQuery'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                    : 'text-sw-gray-600 hover:text-sw-dark'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                {t('pricing.payPerQuery') || 'Pay-Per-Query'}
                <Info className="w-3 h-3 opacity-50" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-sw-dark text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 text-center z-50 shadow-lg">
                {t('pricing.payPerQueryInfo') || 'No subscription. Add balance and pay only per query. Different prices per module.'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sw-dark"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setPricingModel('credits')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  pricingModel === 'credits'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm'
                    : 'text-sw-gray-600 hover:text-sw-dark'
                }`}
              >
                <Gift className="w-4 h-4" />
                {t('pricing.moduleCredits') || 'Module + Credits'}
                <Info className="w-3 h-3 opacity-50" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-sw-dark text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 text-center z-50 shadow-lg">
                {t('pricing.moduleCreditsInfo') || 'Free trial credits pool. Subscribe to modules with different credit costs per query.'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sw-dark"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setPricingModel('freeTier')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  pricingModel === 'freeTier'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
                    : 'text-sw-gray-600 hover:text-sw-dark'
                }`}
              >
                <Globe className="w-4 h-4" />
                {t('pricing.moduleFreeTier') || 'Module + Free Tier'}
                <Info className="w-3 h-3 opacity-50" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-sw-dark text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 text-center z-50 shadow-lg">
                {t('pricing.moduleFreeTierInfo') || 'Free Web module with limited queries. Pay to unlock other modules or unlimited access.'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sw-dark"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-sw-dark' : 'text-sw-gray-400'}`}>
            {t('common.monthly')}
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-sw-blue-600' : 'bg-sw-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-sw-dark' : 'text-sw-gray-400'}`}>
            {t('common.yearly')}
          </span>
          {billingCycle === 'yearly' && (
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {t('pricing.savePercent', { percent: 17 })}
            </span>
          )}
        </div>

        {pricingModel === 'tiers' && (
          <>
            {/* Tier-Based Pricing Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {planOrder.map((planId) => (
                <PricingCard 
                  key={planId} 
                  planId={planId} 
                  billingCycle={billingCycle}
                  isCurrentPlan={subscription.plan === planId}
                  onUpgrade={upgradePlan}
                />
              ))}
            </div>
          </>
        )}

        {pricingModel === 'credits' && (
          <>
            {/* Module-Based with Free Credits Pool */}
            <div className="mb-8">
              {/* Trial Credits Banner */}
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl">{t('pricing.freeCreditsPool') || 'Free Credits Pool'}</span>
                          {userTrialState.isOnTrial && (
                            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                              {t('pricing.onTrial') || 'ON TRIAL'}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mt-1">
                          {t('pricing.creditsPoolDescNew') || '50 credits = ~50 Web queries or ~20 Amazon queries. Query any module!'}
                        </p>
                      </div>
                    </div>
                    {userTrialState.isOnTrial && (
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {userTrialState.trialCredits - userTrialState.trialCreditsUsed}
                          </div>
                          <div className="text-xs text-white/70">{t('pricing.creditsLeft') || 'credits left'}</div>
                        </div>
                        <div className="h-12 w-px bg-white/20" />
                        <div className="text-center">
                          <div className="text-3xl font-bold">{userTrialState.trialExpiresIn}</div>
                          <div className="text-xs text-white/70">{t('pricing.daysRemaining') || 'days remaining'}</div>
                        </div>
                        <div className="w-32">
                          <div className="bg-white/20 rounded-full h-2 mb-1">
                            <div 
                              className="bg-white rounded-full h-2 transition-all" 
                              style={{ width: `${((userTrialState.trialCredits - userTrialState.trialCreditsUsed) / userTrialState.trialCredits) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-white/60 text-center">{userTrialState.trialCreditsUsed}/{userTrialState.trialCredits} used</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {!userTrialState.isOnTrial && (
                    <button className="mt-4 px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                      {t('pricing.claimCredits') || 'Claim 50 Free Credits'}
                    </button>
                  )}
                </div>
              </div>

              {/* How Credits Work */}
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    {t('pricing.howCreditsWork') || 'How Credits Work'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.values(MODULES).map(module => {
                      const Icon = module.icon
                      const queriesFor50 = Math.floor(50 / module.creditsPerQuery)
                      return (
                        <div key={module.id} className="bg-white rounded-lg p-3 text-center">
                          <Icon className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                          <div className="text-xs text-sw-gray-500">{module.name.split(' ')[0]}</div>
                          <div className="font-bold text-purple-700">{module.creditsPerQuery} {module.creditsPerQuery === 1 ? 'credit' : 'credits'}</div>
                          <div className="text-xs text-sw-gray-400">per query</div>
                          <div className="text-xs text-purple-600 mt-1">~{queriesFor50} queries</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-sw-dark mb-2">{t('pricing.selectModules') || 'Select Your Modules'}</h2>
                <p className="text-sw-gray-600">{t('pricing.creditsModuleDescNew') || 'During trial, query any module using credits. Subscribe for unlimited access.'}</p>
              </div>

              {/* Module Cards for Credits Pool */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Object.values(MODULES).map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isSelected={selectedModules.includes(module.id)}
                    onToggle={() => toggleModule(module.id)}
                    billingCycle={billingCycle}
                    isOnTrial={userTrialState.isOnTrial}
                    trialType="credits"
                  />
                ))}
              </div>

              {/* Summary Card for Credits Pool */}
              <div className="max-w-2xl mx-auto">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-sw-dark">{t('pricing.yourPlan') || 'Your Custom Plan'}</h3>
                    {userTrialState.isOnTrial && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        {userTrialState.trialCredits - userTrialState.trialCreditsUsed} {t('pricing.creditsRemaining') || 'credits remaining'}
                      </span>
                    )}
                  </div>
                  
                  {selectedModules.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sw-gray-500 mb-2">{t('pricing.noModulesSelected') || 'Select modules above to build your plan'}</p>
                      <p className="text-sm text-purple-600">
                        {t('pricing.trialHintNew') || '💡 With 50 credits, you can make ~50 Web queries or ~20 Amazon queries!'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {selectedModules.map(id => {
                          const module = MODULES[id]
                          const Icon = module.icon
                          const remainingCredits = userTrialState.trialCredits - userTrialState.trialCreditsUsed
                          const possibleQueries = Math.floor(remainingCredits / module.creditsPerQuery)
                          return (
                            <div key={id} className="flex items-center justify-between py-2 border-b border-sw-gray-100">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-sw-gray-500" />
                                <div>
                                  <span className="font-medium text-sw-dark">{module.name}</span>
                                  <span className="text-xs text-purple-600 block">
                                    {module.creditsPerQuery} {module.creditsPerQuery === 1 ? 'credit' : 'credits'}/query • ~{possibleQueries} queries left
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-sw-dark">
                                  ${billingCycle === 'yearly' ? Math.round(module.accessPrice * 0.83) : module.accessPrice}/mo
                                </span>
                                <span className="text-xs text-sw-gray-500 block">
                                  {t('pricing.afterTrial') || 'after trial'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {userTrialState.isOnTrial && (
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-700 font-medium flex items-center gap-2">
                              <Gift className="w-4 h-4" />
                              {t('pricing.trialCreditsAvailable') || 'Trial credits available'}
                            </span>
                            <span className="font-bold text-purple-700">
                              {userTrialState.trialCredits - userTrialState.trialCreditsUsed} {t('pricing.credits') || 'credits'}
                            </span>
                          </div>
                          <p className="text-xs text-purple-600 mt-1">
                            {t('pricing.creditsApplyToAllNew') || 'Use credits across any module. Different modules cost different credits per query.'}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-sw-gray-200">
                        <div>
                          <span className="text-sw-gray-600">{t('pricing.monthlyAccessAfterTrial') || 'Monthly Access (after trial)'}</span>
                          {billingCycle === 'yearly' && (
                            <span className="text-xs text-green-600 ml-2">17% off</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-sw-dark">${calculateModuleTotal()}</span>
                          <span className="text-sw-gray-500">/{t('common.month')}</span>
                        </div>
                      </div>

                      <button className="w-full mt-4 btn-primary py-3 flex items-center justify-center gap-2">
                        {t('pricing.startTrial') || 'Start Free Trial'}
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <p className="text-xs text-sw-gray-500 text-center mt-3">
                        {t('pricing.trialNote') || 'No credit card required for trial. 50 free credits included.'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Credit Costs Table */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-lg font-bold text-sw-dark text-center mb-6">{t('pricing.creditCostsTable') || 'Credit Costs by Module'}</h3>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-sw-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.module') || 'Module'}</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.creditsPerQuery') || 'Credits/Query'}</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.queriesWith50') || 'Queries with 50 Credits'}</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.subscriptionPrice') || 'Subscription'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sw-gray-100">
                    {Object.values(MODULES).map(module => {
                      const Icon = module.icon
                      const queriesFor50 = Math.floor(50 / module.creditsPerQuery)
                      return (
                        <tr key={module.id} className="hover:bg-sw-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-sw-gray-500" />
                              <div>
                                <span className="font-medium text-sw-dark">{module.name}</span>
                                <span className="text-xs text-sw-gray-500 block">{module.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-purple-600">{module.creditsPerQuery}</span>
                            <span className="text-sm text-sw-gray-500"> credits</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold text-sw-dark">~{queriesFor50}</span>
                            <span className="text-sm text-sw-gray-500"> queries</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold text-sw-dark">${module.accessPrice}/mo</span>
                            <span className="text-xs text-sw-gray-400 block">unlimited queries</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-sw-gray-500 text-center mt-3">
                {t('pricing.creditValueNote') || '1 credit ≈ $0.10 value. Web is the baseline at 1 credit/query.'}
              </p>
            </div>
          </>
        )}

        {pricingModel === 'freeTier' && (
          <>
            {/* Module-Based with Free Module Tier (Web) */}
            <div className="mb-8">
              {/* Free Web Tier Banner */}
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl">{t('pricing.freeWebTier') || 'Free Web Intelligence Tier'}</span>
                          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                            {t('pricing.alwaysFree') || 'ALWAYS FREE'}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm mt-1">
                          {t('pricing.freeWebDescLong') || 'Get 20 free Web queries every month. No credit card required, no expiration.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                        <div className="text-2xl font-bold">20</div>
                        <div className="text-xs text-white/70">{t('pricing.freeQueriesMonth') || 'queries/month'}</div>
                      </div>
                      <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                        {t('pricing.startFree') || 'Start Free'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-sw-dark mb-2">{t('pricing.selectModules') || 'Select Your Modules'}</h2>
                <p className="text-sw-gray-600">{t('pricing.freeTierModuleDesc') || 'Web Intelligence is free forever. Add more modules as you need them.'}</p>
              </div>

              {/* Module Cards for Free Tier */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Object.values(MODULES).map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isSelected={selectedModules.includes(module.id)}
                    onToggle={() => toggleModule(module.id)}
                    billingCycle={billingCycle}
                    isOnTrial={false}
                    trialType="freeTier"
                  />
                ))}
              </div>

              {/* Summary Card for Free Tier */}
              <div className="max-w-2xl mx-auto">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-sw-dark">{t('pricing.yourPlan') || 'Your Custom Plan'}</h3>
                  </div>
                  
                  {selectedModules.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sw-gray-500 mb-2">{t('pricing.noModulesSelected') || 'Select modules above to build your plan'}</p>
                      <p className="text-sm text-blue-600">
                        {t('pricing.freeTierHint') || '💡 Start with free Web Intelligence - 20 queries/month!'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {selectedModules.map(id => {
                          const module = MODULES[id]
                          const Icon = module.icon
                          const isFreeWebOnly = id === 'web' && module.hasFreeeTier && selectedModules.length === 1
                          const isWebWithOthers = id === 'web' && module.hasFreeeTier && selectedModules.length > 1
                          return (
                            <div key={id} className="flex items-center justify-between py-2 border-b border-sw-gray-100">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-sw-gray-500" />
                                <span className="font-medium text-sw-dark">{module.name}</span>
                                {(isFreeWebOnly || isWebWithOthers) && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    {t('pricing.freeTier') || 'Free Tier'}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                {isFreeWebOnly ? (
                                  <>
                                    <span className="font-semibold text-green-600">{t('common.free') || 'Free'}</span>
                                    <span className="text-xs text-sw-gray-500 block">
                                      {module.freeQueries} {t('pricing.freeQueriesMonth') || 'queries/month'}
                                    </span>
                                  </>
                                ) : isWebWithOthers ? (
                                  <>
                                    <span className="font-semibold text-green-600">{t('common.free') || 'Free'}</span>
                                    <span className="text-xs text-sw-gray-500 block">
                                      {module.freeQueries} {t('pricing.freeQueriesMonth') || 'queries/month'}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-semibold text-sw-dark">
                                      ${billingCycle === 'yearly' ? Math.round(module.accessPrice * 0.83) : module.accessPrice}/mo
                                    </span>
                                    <span className="text-xs text-sw-gray-500 block">
                                      ${module.queryPrice}/query
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-sw-gray-200">
                        <div>
                          <span className="text-sw-gray-600">{t('pricing.monthlyAccess') || 'Monthly Access Fee'}</span>
                          {billingCycle === 'yearly' && calculateModuleTotal() > 0 && (
                            <span className="text-xs text-green-600 ml-2">17% off</span>
                          )}
                        </div>
                        <div className="text-right">
                          {calculateModuleTotal() === 0 ? (
                            <span className="text-2xl font-bold text-green-600">{t('common.free') || 'Free'}</span>
                          ) : (
                            <>
                              <span className="text-2xl font-bold text-sw-dark">${calculateModuleTotal()}</span>
                              <span className="text-sw-gray-500">/{t('common.month')}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button className="w-full mt-4 btn-primary py-3 flex items-center justify-center gap-2">
                        {calculateModuleTotal() === 0 
                          ? (t('pricing.startFree') || 'Start Free')
                          : (t('pricing.getStarted') || 'Get Started')
                        }
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {calculateModuleTotal() > 0 && (
                        <p className="text-xs text-sw-gray-500 text-center mt-3">
                          {t('pricing.queryCharges') || 'Query charges are billed separately based on usage'}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Query Pricing Table */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-lg font-bold text-sw-dark text-center mb-6">{t('pricing.queryCosts') || 'Query Costs by Module'}</h3>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-sw-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.module') || 'Module'}</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.accessFee') || 'Access Fee'}</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.perQuery') || 'Per Query'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sw-gray-100">
                    {Object.values(MODULES).map(module => {
                      const Icon = module.icon
                      return (
                        <tr key={module.id} className="hover:bg-sw-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-sw-gray-500" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sw-dark">{module.name}</span>
                                  {module.hasFreeeTier && (
                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                      {t('pricing.hasFreeTier') || 'Free tier'}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-sw-gray-500 block">{module.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {module.hasFreeeTier ? (
                              <div>
                                <span className="font-semibold text-green-600">{t('common.free') || 'Free'}</span>
                                <span className="text-xs text-sw-gray-500 block">{module.freeQueries} queries</span>
                                <span className="text-xs text-sw-gray-400">or ${module.accessPrice}/mo unlimited</span>
                              </div>
                            ) : (
                              <span className="font-semibold text-sw-dark">${module.accessPrice}/mo</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold text-green-600">${module.queryPrice}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {pricingModel === 'payPerQuery' && (
          <>
            {/* Pay-Per-Query Pricing */}
            <div className="mb-8">
              {/* Balance Banner */}
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl">{t('pricing.payPerQueryTitle') || 'Pay-Per-Query'}</span>
                          {userBalance.isTrialBalance && (
                            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                              {t('pricing.trialBalance') || 'TRIAL BALANCE'}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mt-1">
                          {t('pricing.payPerQueryDesc') || 'No subscriptions. Just add balance and query. Pay only for what you use.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">${userBalance.balance.toFixed(2)}</div>
                        <div className="text-xs text-white/70">{t('pricing.currentBalance') || 'current balance'}</div>
                      </div>
                      <button className="px-5 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {t('pricing.addFunds') || 'Add Funds'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module Pricing Table */}
              <div className="max-w-5xl mx-auto mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-sw-dark mb-2">{t('pricing.modulePricing') || 'Pricing by Module'}</h2>
                  <p className="text-sw-gray-600">{t('pricing.modulePricingDesc') || 'Each module has different pricing for regular queries and deep research.'}</p>
                </div>

                {/* Query Type Legend */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-sw-gray-600">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      {t('pricing.regularQuery') || 'Regular Query'} - {t('pricing.regularQueryDesc') || 'Quick answers, data lookups'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-sm text-sw-gray-600">
                      <Brain className="w-4 h-4 inline mr-1" />
                      {t('pricing.deepResearch') || 'Deep Research'} - {t('pricing.deepResearchDesc') || 'Comprehensive analysis'}
                    </span>
                  </div>
                </div>

                {/* Module Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(MODULES).map((module) => {
                    const Icon = module.icon
                    const moduleConfig = PAY_PER_QUERY_CONFIG.modules[module.id]
                    const isContactSales = moduleConfig.contactSales
                    const regularQueriesWithBalance = !isContactSales ? Math.floor(userBalance.balance / moduleConfig.regularPrice) : 0
                    const deepQueriesWithBalance = !isContactSales ? Math.floor(userBalance.balance / moduleConfig.deepPrice) : 0
                    
                    return (
                      <div key={module.id} className={`card p-5 transition-shadow relative ${isContactSales ? 'opacity-90' : 'hover:shadow-md'}`}>
                        {isContactSales && (
                          <div className="absolute -top-2 -right-2">
                            <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full">
                              ENTERPRISE
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            module.color === 'blue' ? 'bg-blue-100' :
                            module.color === 'green' ? 'bg-green-100' :
                            module.color === 'purple' ? 'bg-purple-100' :
                            module.color === 'amber' ? 'bg-amber-100' :
                            'bg-orange-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              module.color === 'blue' ? 'text-blue-600' :
                              module.color === 'green' ? 'text-green-600' :
                              module.color === 'purple' ? 'text-purple-600' :
                              module.color === 'amber' ? 'text-amber-600' :
                              'text-orange-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-sw-dark">{module.name}</h3>
                            <p className="text-xs text-sw-gray-500">{module.description}</p>
                          </div>
                        </div>

                        {isContactSales ? (
                          <div className="space-y-3">
                            <p className="text-sm text-sw-gray-600 text-center py-2">
                              {t('pricing.enterpriseModuleDesc') || 'Enterprise-grade data access with custom pricing'}
                            </p>
                            <button className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                              {t('common.contactSales') || 'Contact Sales'}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Regular Query Price */}
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">{t('pricing.regular') || 'Regular'}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-green-600">${moduleConfig.regularPrice.toFixed(2)}</span>
                                <span className="text-xs text-green-600 block">~{regularQueriesWithBalance} with ${userBalance.balance.toFixed(2)}</span>
                              </div>
                            </div>

                            {/* Deep Research Price */}
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">{t('pricing.deep') || 'Deep Research'}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-purple-600">${moduleConfig.deepPrice.toFixed(2)}</span>
                                <span className="text-xs text-purple-600 block">~{deepQueriesWithBalance} with ${userBalance.balance.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top-Up Options */}
              <div className="max-w-4xl mx-auto mb-8">
                <h3 className="text-lg font-bold text-sw-dark text-center mb-6">{t('pricing.topUpOptions') || 'Add Funds to Your Account'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PAY_PER_QUERY_CONFIG.topUpOptions.map((option, idx) => (
                    <button 
                      key={idx}
                      className={`card p-4 text-center hover:border-green-400 transition-all ${
                        option.bonus > 0 ? 'border-2 border-green-200 bg-green-50' : ''
                      }`}
                    >
                      <div className="text-2xl font-bold text-sw-dark">${option.amount}</div>
                      {option.bonus > 0 && (
                        <div className="text-sm text-green-600 font-medium">+${option.bonus.toFixed(2)} bonus</div>
                      )}
                      <div className="text-xs text-sw-gray-500 mt-1">
                        = {Math.floor((option.amount + option.bonus) / PAY_PER_QUERY_CONFIG.modules.web.regularPrice)} Web queries
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-sw-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-sw-dark text-center mb-6">{t('pricing.howItWorks') || 'How It Works'}</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="font-bold text-green-600">1</span>
                      </div>
                      <p className="text-sm text-sw-gray-600">{t('pricing.step1') || 'Sign up and get $5 free trial balance'}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="font-bold text-green-600">2</span>
                      </div>
                      <p className="text-sm text-sw-gray-600">{t('pricing.step2') || 'Ask any question - we deduct from your balance'}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="font-bold text-green-600">3</span>
                      </div>
                      <p className="text-sm text-sw-gray-600">{t('pricing.step3') || 'Top up anytime - no commitments or subscriptions'}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="font-bold text-green-600">4</span>
                      </div>
                      <p className="text-sm text-sw-gray-600">{t('pricing.step4') || 'Balance never expires - use it whenever you need'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Pricing Table */}
              <div className="max-w-5xl mx-auto mb-16">
                <h3 className="text-lg font-bold text-sw-dark text-center mb-6">{t('pricing.fullPricingTable') || 'Complete Pricing Table'}</h3>
                <div className="card overflow-hidden overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sw-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-sw-gray-700">{t('pricing.module') || 'Module'}</th>
                        <th className="text-center px-4 py-3 text-sm font-semibold text-green-700 bg-green-50">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          {t('pricing.regularQuery') || 'Regular Query'}
                        </th>
                        <th className="text-center px-4 py-3 text-sm font-semibold text-purple-700 bg-purple-50">
                          <Brain className="w-4 h-4 inline mr-1" />
                          {t('pricing.deepResearch') || 'Deep Research'}
                        </th>
                        <th className="text-center px-4 py-3 text-sm font-semibold text-sw-gray-700">
                          {t('pricing.with5Balance') || 'With $5 Balance'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sw-gray-100">
                      {Object.values(MODULES).map(module => {
                        const Icon = module.icon
                        const config = PAY_PER_QUERY_CONFIG.modules[module.id]
                        const isContactSales = config.contactSales
                        return (
                          <tr key={module.id} className="hover:bg-sw-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-sw-gray-500" />
                                <div>
                                  <span className="font-medium text-sw-dark">{module.name}</span>
                                  {isContactSales && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">Enterprise</span>
                                  )}
                                  <span className="text-xs text-sw-gray-500 block">{module.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center bg-green-50/50">
                              {isContactSales ? (
                                <span className="text-sm text-purple-600 font-medium">Contact Sales</span>
                              ) : (
                                <span className="font-bold text-green-600">${config.regularPrice.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center bg-purple-50/50">
                              {isContactSales ? (
                                <span className="text-sm text-purple-600 font-medium">Contact Sales</span>
                              ) : (
                                <span className="font-bold text-purple-600">${config.deepPrice.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isContactSales ? (
                                <span className="text-sm text-purple-600 font-medium">Custom</span>
                              ) : (
                                <>
                                  <span className="text-sm text-green-600">{Math.floor(5 / config.regularPrice)} reg</span>
                                  <span className="text-sw-gray-400 mx-1">or</span>
                                  <span className="text-sm text-purple-600">{Math.floor(5 / config.deepPrice)} deep</span>
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-sw-gray-500 text-center mt-3">
                  {t('pricing.noSubscriptionNote') || 'No subscription required. Pay only for what you use. Balance never expires.'}
                </p>
              </div>
            </div>
          </>
        )}

        {pricingModel === 'uniformCredits' && (
          <>
            {/* Uniform Credits Pricing */}
            <div className="mb-8">
              {/* Explanation Banner */}
              <div className="card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-sw-dark text-lg mb-2">
                      {t('pricing.uniformCreditsTitle') || 'Simple Credit System'}
                    </h3>
                    <p className="text-sw-gray-600 mb-3">
                      {t('pricing.uniformCreditsDesc') || 'All queries cost the same credits regardless of module. Pay different subscription fees for each data module you want access to.'}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Coins className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-amber-700">1 credit = 1 query</span>
                          <span className="text-sw-gray-500 ml-1">(any module)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Gift className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-green-700">{UNIFORM_CREDITS_CONFIG.trialCredits} free trial credits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credits Mode Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="inline-flex bg-sw-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setUniformCreditsMode('accessOnly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      uniformCreditsMode === 'accessOnly'
                        ? 'bg-white text-sw-dark shadow-sm'
                        : 'text-sw-gray-600 hover:text-sw-dark'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    {t('pricing.accessOnly') || 'Access Only'}
                  </button>
                  <button
                    onClick={() => setUniformCreditsMode('creditsIncluded')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      uniformCreditsMode === 'creditsIncluded'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                        : 'text-sw-gray-600 hover:text-sw-dark'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    {t('pricing.creditsIncluded') || 'Credits Included'}
                  </button>
                </div>
              </div>

              {/* Mode Description */}
              <div className={`card p-4 mb-6 ${uniformCreditsMode === 'accessOnly' ? 'bg-sw-gray-50 border-sw-gray-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-3">
                  {uniformCreditsMode === 'accessOnly' ? (
                    <>
                      <Layers className="w-5 h-5 text-sw-gray-600" />
                      <div>
                        <p className="font-medium text-sw-dark">{t('pricing.accessOnlyTitle') || 'Access Only'}</p>
                        <p className="text-sm text-sw-gray-500">{t('pricing.accessOnlyDesc') || 'Pay a lower monthly fee for module access. Buy credit packages separately as needed.'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-sw-dark">{t('pricing.creditsIncludedTitle') || 'Credits Included'}</p>
                        <p className="text-sm text-sw-gray-500">{t('pricing.creditsIncludedDesc') || 'Higher monthly fee but includes credits each month. Best for regular users.'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Module Subscription Cards */}
              <h3 className="text-lg font-semibold text-sw-dark mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                {t('pricing.selectDataModules') || 'Select Data Modules'}
              </h3>
              <p className="text-sm text-sw-gray-500 mb-4">
                {uniformCreditsMode === 'accessOnly' 
                  ? (t('pricing.selectDataModulesDescAccess') || 'Choose modules for access. Credits purchased separately.')
                  : (t('pricing.selectDataModulesDescCredits') || 'Choose modules. Each includes monthly credits.')}
              </p>

              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {Object.values(MODULES).map((module) => {
                  const isSelected = selectedModules.includes(module.id)
                  const Icon = module.icon
                  const config = UNIFORM_CREDITS_CONFIG.modules[module.id]
                  const isContactSales = config.contactSales
                  const baseFee = uniformCreditsMode === 'accessOnly' ? config.accessOnlyFee : config.creditsIncludedFee
                  const displayPrice = !isContactSales && billingCycle === 'yearly' ? Math.round(baseFee * 0.83) : baseFee
                  
                  const colorClasses = {
                    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-500', ring: 'ring-blue-500' },
                    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-500', ring: 'ring-green-500' },
                    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-500', ring: 'ring-purple-500' },
                    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-500', ring: 'ring-amber-500' },
                    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-500', ring: 'ring-orange-500' },
                  }
                  const colors = colorClasses[module.color]

                  return (
                    <div 
                      key={module.id}
                      onClick={() => !isContactSales && toggleModule(module.id)}
                      className={`card p-4 transition-all relative ${
                        isContactSales 
                          ? 'cursor-default opacity-90' 
                          : isSelected 
                            ? `ring-2 ${colors.ring} ${colors.bg} cursor-pointer` 
                            : 'hover:border-sw-gray-300 cursor-pointer'
                      }`}
                    >
                      {isContactSales && (
                        <div className="absolute -top-2 -right-2">
                          <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full">
                            ENTERPRISE
                          </span>
                        </div>
                      )}
                      {!isContactSales && uniformCreditsMode === 'creditsIncluded' && (
                        <div className="absolute -top-2 -right-2">
                          <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                            +{config.creditsIncluded} credits
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        {!isContactSales && (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? `${colors.border} ${colors.bg}` : 'border-sw-gray-300'
                          }`}>
                            {isSelected && <Check className={`w-3 h-3 ${colors.icon}`} />}
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-sw-dark text-sm mb-1">{module.name}</h4>
                      <p className="text-xs text-sw-gray-500 mb-3">{config.description}</p>
                      {isContactSales ? (
                        <button className="w-full py-2 px-3 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                          {t('common.contactSales') || 'Contact Sales'}
                        </button>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-sw-dark">${displayPrice}</span>
                            <span className="text-xs text-sw-gray-500">/mo</span>
                          </div>
                          {uniformCreditsMode === 'creditsIncluded' && (
                            <p className="text-xs text-amber-600 mt-1">
                              Includes {config.creditsIncluded} credits/mo
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Credit Packages */}
              <h3 className="text-lg font-semibold text-sw-dark mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                {t('pricing.creditPackages') || 'Credit Packages'}
              </h3>
              <p className="text-sm text-sw-gray-500 mb-4">
                {t('pricing.creditPackagesDesc') || 'Buy credits to use across all your subscribed modules. 1 credit = 1 query on any module.'}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {UNIFORM_CREDITS_CONFIG.creditPackages.map((pkg) => (
                  <div 
                    key={pkg.credits}
                    className={`card p-4 relative ${pkg.popular ? 'ring-2 ring-amber-500 border-amber-500' : ''}`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                        POPULAR
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <Coins className="w-5 h-5 text-amber-500" />
                      <span className="font-bold text-sw-dark">{pkg.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-bold text-sw-dark">${pkg.price}</span>
                    </div>
                    <p className="text-xs text-sw-gray-500">
                      ${(pkg.price / pkg.credits).toFixed(2)} per credit
                    </p>
                    <button className="w-full mt-3 py-2 px-3 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors">
                      {t('common.buy') || 'Buy'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary Card */}
              <div className="card p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {selectedModules.length > 0 
                        ? t('pricing.yourSelection') || 'Your Selection'
                        : t('pricing.noModulesSelected') || 'No modules selected'}
                    </h3>
                    {selectedModules.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedModules.map(id => {
                          const module = MODULES[id]
                          const config = UNIFORM_CREDITS_CONFIG.modules[id]
                          const Icon = module.icon
                          return (
                            <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-sm">
                              <Icon className="w-3 h-3" />
                              {module.name}
                              {uniformCreditsMode === 'creditsIncluded' && (
                                <span className="text-xs opacity-80">({config.creditsIncluded})</span>
                              )}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-white/80 text-sm">{t('pricing.selectModulesPrompt') || 'Select modules above to build your plan'}</p>
                    )}
                    {selectedModules.length > 0 && uniformCreditsMode === 'creditsIncluded' && (
                      <p className="text-white/90 text-sm mt-1 flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {selectedModules.reduce((sum, id) => sum + UNIFORM_CREDITS_CONFIG.modules[id].creditsIncluded, 0)} credits/month included
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm mb-1">{t('pricing.monthlySubscription') || 'Monthly Subscription'}</p>
                    <p className="text-3xl font-bold">
                      ${selectedModules.reduce((sum, id) => {
                        const config = UNIFORM_CREDITS_CONFIG.modules[id]
                        const fee = uniformCreditsMode === 'accessOnly' ? config.accessOnlyFee : config.creditsIncludedFee
                        return sum + (billingCycle === 'yearly' ? Math.round(fee * 0.83) : fee)
                      }, 0)}
                      <span className="text-lg font-normal">/mo</span>
                    </p>
                    <p className="text-white/80 text-xs">
                      {uniformCreditsMode === 'accessOnly' 
                        ? '+ credits as needed' 
                        : `includes ${selectedModules.reduce((sum, id) => sum + UNIFORM_CREDITS_CONFIG.modules[id].creditsIncluded, 0)} credits`}
                    </p>
                  </div>
                </div>
                {selectedModules.length > 0 && (
                  <button className="w-full mt-4 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-colors">
                    {t('pricing.startTrial') || 'Start with 50 Free Credits'}
                  </button>
                )}
              </div>

              {/* Comparison Note */}
              <div className="mt-6 p-4 bg-sw-gray-50 rounded-xl">
                <h4 className="font-semibold text-sw-dark mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sw-gray-600" />
                  {t('pricing.howItDiffers') || 'How this model works'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-sw-gray-600">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Same credit cost:</strong> 1 credit = 1 query on any module</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Different access fees:</strong> Each module has its own monthly subscription</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Flexible:</strong> Add or remove modules anytime</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Credits never expire:</strong> Use them whenever you need</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-sw-dark text-center mb-8">{t('pricing.faq')}</h2>
          <div className="space-y-4">
            <FAQItem question={t('faq.q1')} answer={t('faq.a1')} />
            <FAQItem question={t('faq.q2')} answer={t('faq.a2')} />
            <FAQItem question={t('faq.q5')} answer={t('faq.a5')} />
            <FAQItem question={t('faq.q6')} answer={t('faq.a6')} />
            <FAQItem question={t('faq.q3')} answer={t('faq.a3')} />
            <FAQItem question={t('faq.q4')} answer={t('faq.a4')} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ModuleCard({ module, isSelected, onToggle, billingCycle, isOnTrial, trialType }) {
  const { t } = useLanguage()
  const Icon = module.icon
  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-500', ring: 'ring-blue-500' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-500', ring: 'ring-green-500' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-500', ring: 'ring-purple-500' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-500', ring: 'ring-amber-500' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-500', ring: 'ring-orange-500' },
  }
  const colors = colorClasses[module.color]

  const displayPrice = billingCycle === 'yearly' 
    ? Math.round(module.accessPrice * 0.83) 
    : module.accessPrice

  const showFreeTierBadge = module.hasFreeeTier && trialType === 'freeTier'
  const showTrialBadge = isOnTrial && trialType === 'credits'

  return (
    <div 
      onClick={onToggle}
      className={`card p-5 cursor-pointer transition-all relative ${
        isSelected ? `ring-2 ${colors.ring} ${colors.bg}` : 'hover:border-sw-gray-300'
      }`}
    >
      {/* Free Tier Badge for Web (only in freeTier mode) */}
      {showFreeTierBadge && (
        <div className="absolute -top-2 -right-2">
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
            {t('pricing.freeTierAvailable') || 'FREE TIER'}
          </span>
        </div>
      )}

      {/* Trial Badge (only in credits mode) */}
      {showTrialBadge && (
        <div className="absolute -top-2 -right-2">
          <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
            <Gift className="w-3 h-3" />
            {t('pricing.tryWithTrial') || 'TRY FREE'}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          isSelected ? `${colors.border} ${colors.bg}` : 'border-sw-gray-300'
        }`}>
          {isSelected && <Check className={`w-4 h-4 ${colors.icon}`} />}
        </div>
      </div>

      <h3 className="font-bold text-sw-dark mb-1">{module.name}</h3>
      <p className="text-sm text-sw-gray-600 mb-4">{module.description}</p>

      <div className="mb-4">
        {trialType === 'credits' ? (
          // Credits mode - show credit cost per query prominently
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-600">{module.creditsPerQuery}</span>
              <span className="text-sm text-sw-gray-500">{module.creditsPerQuery === 1 ? 'credit' : 'credits'}/query</span>
            </div>
            <div className="text-xs text-sw-gray-400 mt-1">
              ${displayPrice}/mo {t('pricing.afterTrialUnlimited') || 'after trial (unlimited)'}
            </div>
          </div>
        ) : showFreeTierBadge ? (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-green-600">{t('common.free') || 'Free'}</span>
              <span className="text-sm text-sw-gray-500">({module.freeQueries} {t('pricing.queriesMonth') || 'queries/mo'})</span>
            </div>
            <div className="text-xs text-sw-gray-400 mt-1">
              {t('pricing.orUnlimited') || 'or'} ${displayPrice}/mo {t('pricing.forUnlimited') || 'for unlimited'}
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-sw-dark">${displayPrice}</span>
            <span className="text-sw-gray-500">/mo</span>
            <span className="text-xs text-sw-gray-400 ml-2">+ ${module.queryPrice}/query</span>
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {module.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-sw-gray-600">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Hint at bottom based on trial type */}
      {trialType === 'credits' && isOnTrial && (
        <div className="mt-4 pt-3 border-t border-sw-gray-100">
          <p className="text-xs text-purple-600 flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {t('pricing.queriesWithCredits', { count: Math.floor(50 / module.creditsPerQuery) }) || `~${Math.floor(50 / module.creditsPerQuery)} queries with 50 credits`}
          </p>
        </div>
      )}
      {trialType === 'freeTier' && showFreeTierBadge && (
        <div className="mt-4 pt-3 border-t border-sw-gray-100">
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Check className="w-3 h-3" />
            {t('pricing.noCardRequired') || 'No credit card required'}
          </p>
        </div>
      )}
    </div>
  )
}

function DataTypeRow({ icon, label, included }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        <span className={included ? 'text-sw-gray-500' : 'text-sw-gray-300'}>{icon}</span>
        <span className={included ? 'text-sw-gray-600' : 'text-sw-gray-400'}>{label}</span>
      </div>
      {included ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <X className="w-3 h-3 text-sw-gray-300" />
      )}
    </div>
  )
}

function PricingCard({ planId, billingCycle, isCurrentPlan, onUpgrade }) {
  const { t } = useLanguage()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCredits, setSelectedCredits] = useState(null)
  
  const plan = PLANS[planId]
  
  const planIcons = {
    free: <Sparkles className="w-6 h-6" />,
    starter: <Zap className="w-6 h-6" />,
    pro: <Zap className="w-6 h-6" />,
    enterprise: <Building2 className="w-6 h-6" />,
  }

  const creditOptions = planId === 'free' ? [] : planId === 'enterprise' ? [] : [
    { credits: plan.credits, price: plan.price, label: `${plan.credits} ${t('pricing.creditsMonth')}` },
    { credits: plan.credits * 2, price: Math.round(plan.price * 1.8), label: `${plan.credits * 2} ${t('pricing.creditsMonth')}` },
    { credits: plan.credits * 4, price: Math.round(plan.price * 3.2), label: `${plan.credits * 4} ${t('pricing.creditsMonth')}` },
    { credits: plan.credits * 8, price: Math.round(plan.price * 5.5), label: `${plan.credits * 8} ${t('pricing.creditsMonth')}` },
  ]

  const currentSelection = selectedCredits 
    ? creditOptions.find(o => o.credits === selectedCredits) 
    : creditOptions[0]

  const displayPrice = currentSelection 
    ? (billingCycle === 'yearly' ? Math.round(currentSelection.price * 0.83) : currentSelection.price)
    : (billingCycle === 'yearly' && plan.priceYearly > 0 ? Math.round(plan.priceYearly / 12) : plan.price)

  return (
    <div className={`card p-6 relative flex flex-col ${plan.popular ? 'ring-2 ring-sw-blue-500 shadow-lg' : ''}`}>
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-sw-blue-600 text-white text-xs font-semibold rounded-full">
          {t('pricing.mostPopular')}
        </span>
      )}

      <div className="h-16 flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          planId === 'free' ? 'bg-gray-100 text-gray-600' :
          planId === 'starter' ? 'bg-green-100 text-green-600' :
          planId === 'pro' ? 'bg-blue-100 text-blue-600' :
          'bg-purple-100 text-purple-600'
        }`}>
          {planIcons[planId]}
        </div>
        <div>
          <h3 className="text-lg font-bold text-sw-dark">{t(`plans.${planId}`)}</h3>
        </div>
      </div>

      <div className="h-12 mb-4">
        <p className="text-sm text-sw-gray-600">{t(`pricing.${planId}Desc`)}</p>
      </div>

      <div className="h-12 mb-4">
        {plan.price === -1 ? (
          <p className="text-2xl font-bold text-sw-dark">{t('common.contactSales')}</p>
        ) : (
          <>
            <span className="text-3xl font-bold text-sw-dark">${displayPrice}</span>
            <span className="text-sw-gray-500">/{t('common.month')}</span>
          </>
        )}
      </div>

      <div className="h-14 mb-4">
        {creditOptions.length > 0 ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 bg-sw-gray-50 border border-sw-gray-200 rounded-xl flex items-center justify-between hover:border-sw-gray-300 transition-colors"
            >
              <span className="text-sm font-medium text-sw-dark">
                {currentSelection?.label || `${plan.credits} ${t('pricing.creditsMonth')}`}
              </span>
              <span className={`text-sw-gray-400 transition-transform text-xs ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sw-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {creditOptions.map((option, idx) => (
                  <button
                    key={option.credits}
                    onClick={() => {
                      setSelectedCredits(option.credits)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full p-3 flex items-center justify-between hover:bg-sw-blue-50 transition-colors text-sm ${
                      (selectedCredits === option.credits || (!selectedCredits && idx === 0)) 
                        ? 'bg-sw-blue-50 text-sw-blue-700' 
                        : ''
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {(selectedCredits === option.credits || (!selectedCredits && idx === 0)) && (
                      <Check className="w-4 h-4 text-sw-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : planId === 'free' ? (
          <div className="p-3 bg-sw-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-sw-dark">{plan.credits} {t('pricing.creditsMonth')}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-purple-700">{t('pricing.customCredits')}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onUpgrade(planId)}
        disabled={isCurrentPlan}
        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          isCurrentPlan
            ? 'bg-sw-gray-100 text-sw-gray-400 cursor-not-allowed'
            : plan.popular
            ? 'btn-primary'
            : plan.price === -1
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-sw-gray-900 text-white hover:bg-sw-gray-800'
        }`}
      >
        {isCurrentPlan ? t('common.currentPlan') : plan.price === -1 ? t('common.contactSales') : t('common.upgrade')}
        {!isCurrentPlan && plan.price !== -1 && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Data Access - Prominent position */}
      <div className="mt-5 pt-4 border-t border-sw-gray-100">
        <p className="text-xs font-semibold text-sw-gray-500 mb-2">{t('dataAccess.dataTypes')}</p>
        <div className="space-y-1.5">
          <DataTypeRow 
            icon={<Globe className="w-3 h-3" />}
            label={t('dataAccess.webBasic')}
            included={plan.dataAccess.webBasic}
          />
          <DataTypeRow 
            icon={<BarChart3 className="w-3 h-3" />}
            label={t('dataAccess.webFull')}
            included={plan.dataAccess.webFull}
          />
          <DataTypeRow 
            icon={<Search className="w-3 h-3" />}
            label={t('dataAccess.seoPaid')}
            included={plan.dataAccess.seoPaid}
          />
          <DataTypeRow 
            icon={<Smartphone className="w-3 h-3" />}
            label={t('dataAccess.appsData')}
            included={plan.dataAccess.apps}
          />
        </div>
      </div>

      {/* Features - Credits & Deep Research */}
      <ul className="mt-4 space-y-2 flex-grow">
        {plan.features.map((featureKey, idx) => {
          const isNegative = featureKey.includes('noRollover') || featureKey.includes('noDeepResearch')
          return (
            <li key={idx} className="flex items-start gap-2 text-sm">
              {isNegative ? (
                <X className="w-4 h-4 text-sw-gray-300 mt-0.5 flex-shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              )}
              <span className={isNegative ? 'text-sw-gray-400' : 'text-sw-gray-600'}>
                {t(featureKey)}
              </span>
            </li>
          )
        })}
      </ul>

      {/* Historical Data & Country Access - Bottom */}
      <div className="mt-4 pt-3 border-t border-sw-gray-100">
        <div className="flex items-center gap-2 text-xs text-sw-gray-500">
          <Check className="w-3 h-3 text-green-500" />
          <span>
            {plan.dataAccess.historicalMonths >= 36 
              ? t('features.history36Months') 
              : t('features.history15Months')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-sw-gray-500 mt-1">
          <Check className="w-3 h-3 text-green-500" />
          <span>{t('features.allCountries')}</span>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="card p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-semibold text-sw-dark">{question}</span>
        <span
          className={`text-sw-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <p className="mt-3 text-sw-gray-600 text-sm">{answer}</p>}
    </div>
  )
}
