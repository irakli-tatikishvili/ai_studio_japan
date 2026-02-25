import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Download,
  FileText,
  MessageSquare,
  RefreshCw,
  Monitor,
  Plug,
  Code,
  PieChart,
  Globe,
  Smartphone,
  ShoppingCart,
  Check,
  X,
  Coins,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { useUsage, CREDIT_COSTS } from '../context/UsageContext'
import { useLanguage } from '../context/LanguageContext'

export default function DashboardPage() {
  const { subscription, currentPlan, usage, usageHistory, consumptionBySource, changeBillingCycle, getCreditsPercentage, getCreditsRemaining } = useUsage()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sw-dark">{t('dashboard.title')}</h1>
          <p className="text-sw-gray-500 mt-1">{t('dashboard.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-sw-gray-200">
          {['overview', 'consumption', 'billing', 'usage'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-sw-blue-600 text-sw-blue-700'
                  : 'border-transparent text-sw-gray-500 hover:text-sw-gray-700'
              }`}
            >
              {tab === 'consumption' ? t('consumption.breakdown') : t(`dashboard.${tab}`)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <OverviewTab 
            subscription={subscription} 
            currentPlan={currentPlan} 
            usage={usage}
            getCreditsPercentage={getCreditsPercentage}
            getCreditsRemaining={getCreditsRemaining}
          />
        )}
        {activeTab === 'consumption' && (
          <ConsumptionTab consumptionBySource={consumptionBySource} />
        )}
        {activeTab === 'billing' && (
          <BillingTab
            subscription={subscription}
            currentPlan={currentPlan}
            onChangeBillingCycle={changeBillingCycle}
          />
        )}
        {activeTab === 'usage' && (
          <UsageTab usageHistory={usageHistory} />
        )}
      </div>
    </div>
  )
}

function OverviewTab({ subscription, currentPlan, usage, getCreditsPercentage, getCreditsRemaining }) {
  const { t } = useLanguage()
  const creditsPercentage = getCreditsPercentage()
  const creditsRemaining = getCreditsRemaining()

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Current Plan Card */}
      <div className="lg:col-span-2 card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-sw-dark">{t('dashboard.currentPlanTitle')}</h2>
            <p className="text-sw-gray-500 text-sm">{t('dashboard.yourSubscription')}</p>
          </div>
          <Link
            to="/pricing"
            className="text-sw-blue-600 hover:text-sw-blue-700 text-sm font-medium flex items-center gap-1"
          >
            {t('dashboard.changePlan')} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center gap-4 p-4 bg-sw-gray-50 rounded-xl mb-6">
          <div className="w-14 h-14 bg-sw-blue-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-sw-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-sw-dark">{t(`plans.${currentPlan.id}`)}</h3>
            <p className="text-sw-gray-500">
              {currentPlan.price === -1 ? t('common.contactSales') : currentPlan.price === 0 ? t('common.free') : `$${currentPlan.price}/${subscription.billingCycle === 'yearly' ? t('common.year') : t('common.month')}`}
              {subscription.billingCycle === 'yearly' && currentPlan.price > 0 && ` (${t('dashboard.billedAnnually')})`}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-sw-gray-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-sw-gray-400" />
              <span className="text-sm text-sw-gray-500">{t('dashboard.billingCycle')}</span>
            </div>
            <p className="font-semibold text-sw-dark">{t(`common.${subscription.billingCycle}`)}</p>
          </div>
          <div className="p-4 border border-sw-gray-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-sw-gray-400" />
              <span className="text-sm text-sw-gray-500">{t('dashboard.nextBilling')}</span>
            </div>
            <p className="font-semibold text-sw-dark">
              {subscription.nextBillingDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Credits Usage */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('dashboard.creditsUsage')}</h2>
        
        {/* Credits Progress */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-bold text-sw-dark">{usage.creditsUsed}</span>
            <span className="text-sw-gray-500">/ {currentPlan.credits === -1 ? '∞' : currentPlan.credits}</span>
          </div>
          <div className="h-3 bg-sw-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${creditsPercentage >= 90 ? 'bg-red-500' : creditsPercentage >= 70 ? 'bg-amber-500' : 'bg-sw-blue-500'}`}
              style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
            />
          </div>
          <p className="text-sm text-sw-gray-500 mt-2">
            {creditsRemaining === -1 ? t('common.unlimited') : `${creditsRemaining} ${t('dashboard.creditsRemaining')}`}
          </p>
        </div>

        {/* Buy Credits Button */}
        <BuyCreditsButton />

        {/* Usage Breakdown */}
        <div className="space-y-3 pt-4 border-t border-sw-gray-100 mt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sw-gray-400" />
              <span className="text-sw-gray-600">{t('pricing.chatQuery')}</span>
            </div>
            <span className="font-medium text-sw-dark">{usage.chatQueries}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sw-gray-400" />
              <span className="text-sw-gray-600">{t('pricing.dashboardCreation')}</span>
            </div>
            <span className="font-medium text-sw-dark">{usage.dashboardsCreated}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-sw-gray-400" />
              <span className="text-sw-gray-600">{t('pricing.dashboardRefresh')}</span>
            </div>
            <span className="font-medium text-sw-dark">{usage.dashboardRefreshes}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-sw-gray-400" />
              <span className="text-sw-gray-600">{t('pricing.dataExport')}</span>
            </div>
            <span className="font-medium text-sw-dark">{usage.dataExports}</span>
          </div>
        </div>
      </div>

      {/* Data Access Card */}
      <div className="lg:col-span-3 card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-sw-dark">{t('dataAccess.title')}</h2>
            <p className="text-sw-gray-500 text-sm">{t('dashboard.yourDataAccess')}</p>
          </div>
          <Link
            to="/pricing"
            className="text-sw-blue-600 hover:text-sw-blue-700 text-sm font-medium flex items-center gap-1"
          >
            {t('common.upgradePlan')} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Included for All Plans */}
          <div className="p-4 bg-sw-gray-50 rounded-xl">
            <p className="text-sm font-medium text-sw-gray-600 mb-3">{t('dataAccess.includedAllPlans')}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <Calendar className="w-4 h-4 text-sw-gray-400" />
                <span className="text-sw-dark">{t('dataAccess.monthsHistoryPlural', { count: 15 })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <Globe className="w-4 h-4 text-sw-gray-400" />
                <span className="text-sw-dark">{t('dataAccess.perCountry')}</span>
              </div>
            </div>
          </div>

          {/* Data Types */}
          <div className="p-4 border border-sw-gray-100 rounded-xl">
            <p className="text-sm font-medium text-sw-gray-600 mb-3">{t('dataAccess.dataTypes')}</p>
            <div className="space-y-2">
              <DataAccessRow 
                icon={<Monitor className="w-4 h-4" />} 
                label={t('dataAccess.webData')} 
                included={currentPlan.dataAccess.web}
              />
              <DataAccessRow 
                icon={<Smartphone className="w-4 h-4" />} 
                label={t('dataAccess.appData')} 
                included={currentPlan.dataAccess.app}
              />
              <DataAccessRow 
                icon={<ShoppingCart className="w-4 h-4" />} 
                label={t('dataAccess.retailData')} 
                included={currentPlan.dataAccess.retail}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Usage Summary Cards */}
      <div className="lg:col-span-3">
        <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('dashboard.usageOverview')}</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-medium text-sw-dark">{t('pricing.chatQuery')}</span>
            </div>
            <p className="text-2xl font-bold text-sw-dark">{usage.chatQueries}</p>
            <p className="text-xs text-sw-gray-500">{t('dashboard.thisMonth')}</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-medium text-sw-dark">{t('pricing.dashboardCreation')}</span>
            </div>
            <p className="text-2xl font-bold text-sw-dark">{usage.dashboardsCreated}</p>
            <p className="text-xs text-sw-gray-500">{t('dashboard.thisMonth')}</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="font-medium text-sw-dark">{t('pricing.dashboardRefresh')}</span>
            </div>
            <p className="text-2xl font-bold text-sw-dark">{usage.dashboardRefreshes}</p>
            <p className="text-xs text-sw-gray-500">{t('dashboard.thisMonth')}</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Download className="w-5 h-5" />
              </div>
              <span className="font-medium text-sw-dark">{t('pricing.dataExport')}</span>
            </div>
            <p className="text-2xl font-bold text-sw-dark">{usage.dataExports}</p>
            <p className="text-xs text-sw-gray-500">{t('dashboard.thisMonth')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DataAccessRow({ icon, label, included }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={included ? 'text-sw-gray-600' : 'text-sw-gray-300'}>{icon}</span>
        <span className={included ? 'text-sw-gray-600' : 'text-sw-gray-400'}>{label}</span>
      </div>
      {included ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-sw-gray-300" />
      )}
    </div>
  )
}

function BuyCreditsButton() {
  const { t } = useLanguage()
  const [showModal, setShowModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(250)

  const packages = [
    { credits: 100, price: 50 },
    { credits: 250, price: 125, popular: true },
    { credits: 500, price: 250 },
    { credits: 1000, price: 500, bestValue: true },
  ]

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <Coins className="w-5 h-5" />
        {t('pricing.buyCredits')}
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-sw-dark">{t('pricing.purchaseCredits')}</h3>
                <p className="text-sm text-sw-gray-500">{t('pricing.purchaseCreditsDesc')}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {packages.map((pkg) => (
                <button
                  key={pkg.credits}
                  onClick={() => setSelectedPackage(pkg.credits)}
                  className={`relative w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                    selectedPackage === pkg.credits 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-sw-gray-200 hover:border-amber-300'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full">
                      {t('pricing.popular')}
                    </span>
                  )}
                  {pkg.bestValue && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full">
                      {t('pricing.bestValue')}
                    </span>
                  )}
                  <div>
                    <p className="text-lg font-bold text-sw-dark">{pkg.credits} {t('pricing.credits')}</p>
                    <p className="text-xs text-sw-gray-500">${(pkg.price / pkg.credits).toFixed(2)} {t('pricing.perCreditLabel')}</p>
                  </div>
                  <p className="text-xl font-bold text-amber-600">${pkg.price}</p>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-sw-gray-200 text-sw-gray-600 font-medium rounded-xl hover:bg-sw-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl">
                {t('pricing.confirmPurchase')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function QuickStatItem({ icon, label, usage }) {
  const { t } = useLanguage()
  const getStatusColor = () => {
    if (usage.isAtLimit) return 'text-red-500'
    if (usage.isNearLimit) return 'text-amber-500'
    return 'text-sw-gray-400'
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={getStatusColor()}>{icon}</div>
        <span className="text-sm text-sw-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-sw-dark">
        {usage.current}/{usage.isUnlimited ? '∞' : usage.limit}
      </span>
    </div>
  )
}

function ConsumptionTab({ consumptionBySource }) {
  const { t } = useLanguage()
  const { usage, currentPlan } = useUsage()

  const sources = [
    {
      id: 'direct',
      icon: <Monitor className="w-6 h-6" />,
      color: 'blue',
      colorClasses: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        bar: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-700',
      },
    },
    {
      id: 'mcp',
      icon: <Plug className="w-6 h-6" />,
      color: 'emerald',
      colorClasses: {
        bg: 'bg-emerald-50',
        icon: 'text-emerald-600',
        bar: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-700',
      },
    },
    {
      id: 'api',
      icon: <Code className="w-6 h-6" />,
      color: 'purple',
      colorClasses: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        bar: 'bg-purple-500',
        badge: 'bg-purple-100 text-purple-700',
      },
    },
  ]

  const totalQueries = usage.chatQueries
  const totalLastMonth = Object.values(consumptionBySource).reduce((sum, s) => sum + s.lastMonth, 0)
  const percentChange = totalLastMonth > 0 
    ? Math.round(((totalQueries - totalLastMonth) / totalLastMonth) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1 card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-sw-blue-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-sw-blue-600" />
            </div>
          </div>
          <p className="text-sm text-sw-gray-500 mb-1">{t('consumption.totalQueries')}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-sw-dark">{totalQueries}</span>
            <span className="text-sw-gray-400">/ {currentPlan.limits.chats === -1 ? '∞' : currentPlan.limits.chats}</span>
          </div>
          <div className={`flex items-center gap-1 mt-2 text-sm ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {percentChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{percentChange >= 0 ? '+' : ''}{percentChange}% {t('consumption.vsLastMonth')}</span>
          </div>
        </div>

        {/* Source Cards */}
        {sources.map((source) => {
          const data = consumptionBySource[source.id]
          const sourceTotal = data.chats
          const percentage = totalQueries > 0 ? Math.round((sourceTotal / totalQueries) * 100) : 0
          const trend = data.lastMonth > 0 
            ? Math.round(((sourceTotal - data.lastMonth) / data.lastMonth) * 100) 
            : 0

          return (
            <div key={source.id} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${source.colorClasses.bg} rounded-lg flex items-center justify-center ${source.colorClasses.icon}`}>
                  {source.icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${source.colorClasses.badge}`}>
                  {percentage}%
                </span>
              </div>
              <p className="text-sm font-medium text-sw-dark">{t(`consumption.${source.id}`)}</p>
              <p className="text-xs text-sw-gray-500 mb-3">{t(`consumption.${source.id}Desc`)}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-sw-dark">{sourceTotal}</span>
                <span className="text-sw-gray-400 text-sm">{t('limits.aiQueries').toLowerCase()}</span>
              </div>
              <div className={`flex items-center gap-1 mt-2 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{trend >= 0 ? '+' : ''}{trend}% {t('consumption.vsLastMonth')}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Breakdown */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-sw-dark mb-2">{t('consumption.bySource')}</h2>
        <p className="text-sm text-sw-gray-500 mb-6">{t('consumption.subtitle')}</p>

        {/* Visual Bar Chart */}
        <div className="space-y-6">
          {sources.map((source) => {
            const data = consumptionBySource[source.id]
            const percentage = totalQueries > 0 ? Math.round((data.chats / totalQueries) * 100) : 0

            return (
              <div key={source.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${source.colorClasses.bg} rounded-lg flex items-center justify-center ${source.colorClasses.icon}`}>
                      {source.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sw-dark">{t(`consumption.${source.id}`)}</p>
                      <p className="text-xs text-sw-gray-500">{t(`consumption.${source.id}Desc`)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sw-dark">{data.chats}</p>
                    <p className="text-xs text-sw-gray-500">{percentage}%</p>
                  </div>
                </div>
                <div className="h-3 bg-sw-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${source.colorClasses.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Stacked Bar Visualization */}
        <div className="mt-8 pt-6 border-t border-sw-gray-100">
          <p className="text-sm font-medium text-sw-gray-700 mb-3">{t('consumption.breakdown')}</p>
          <div className="h-8 bg-sw-gray-100 rounded-full overflow-hidden flex">
            {sources.map((source) => {
              const data = consumptionBySource[source.id]
              const percentage = totalQueries > 0 ? (data.chats / totalQueries) * 100 : 0
              return (
                <div
                  key={source.id}
                  className={`h-full ${source.colorClasses.bar} first:rounded-l-full last:rounded-r-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                  title={`${t(`consumption.${source.id}`)}: ${data.chats} (${Math.round(percentage)}%)`}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${source.colorClasses.bar} rounded-full`} />
                <span className="text-sm text-sw-gray-600">{t(`consumption.${source.id}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-sw-dark mb-4">{t('consumption.title')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sw-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">Source</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('consumption.chats')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('consumption.credits')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('consumption.dashboards')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('consumption.trend')}</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => {
                const data = consumptionBySource[source.id]
                const trend = data.lastMonth > 0 
                  ? Math.round(((data.chats - data.lastMonth) / data.lastMonth) * 100) 
                  : 0

                return (
                  <tr key={source.id} className="border-b border-sw-gray-50 hover:bg-sw-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${source.colorClasses.bg} rounded-lg flex items-center justify-center ${source.colorClasses.icon}`}>
                          {source.icon}
                        </div>
                        <div>
                          <p className="font-medium text-sw-dark">{t(`consumption.${source.id}`)}</p>
                          <p className="text-xs text-sw-gray-500">{t(`consumption.${source.id}Desc`)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-sw-dark">{data.chats}</td>
                    <td className="py-4 px-4 text-sm font-medium text-sw-dark">{data.credits}</td>
                    <td className="py-4 px-4 text-sm font-medium text-sw-dark">{data.dashboards}</td>
                    <td className="py-4 px-4">
                      <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{trend >= 0 ? '+' : ''}{trend}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-sw-gray-50">
                <td className="py-4 px-4 font-semibold text-sw-dark">Total</td>
                <td className="py-4 px-4 font-semibold text-sw-dark">{usage.chatQueries}</td>
                <td className="py-4 px-4 font-semibold text-sw-dark">{usage.creditsUsed}</td>
                <td className="py-4 px-4 font-semibold text-sw-dark">{usage.dashboardsCreated}</td>
                <td className="py-4 px-4">
                  <div className={`flex items-center gap-1 text-sm font-semibold ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {percentChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{percentChange >= 0 ? '+' : ''}{percentChange}%</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

function BillingTab({ subscription, currentPlan, onChangeBillingCycle }) {
  const { t } = useLanguage()
  const invoices = [
    { id: 'INV-001', date: '2024-01-15', amount: currentPlan.price, status: 'paid' },
    { id: 'INV-002', date: '2023-12-15', amount: currentPlan.price, status: 'paid' },
    { id: 'INV-003', date: '2023-11-15', amount: currentPlan.price, status: 'paid' },
  ]

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Billing Settings */}
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('dashboard.billingSettings')}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-sw-gray-100 rounded-xl">
              <div>
                <p className="font-medium text-sw-dark">{t('dashboard.billingCycle')}</p>
                <p className="text-sm text-sw-gray-500">{t(`common.${subscription.billingCycle}`)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onChangeBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    subscription.billingCycle === 'monthly'
                      ? 'bg-sw-blue-100 text-sw-blue-700'
                      : 'bg-sw-gray-100 text-sw-gray-600 hover:bg-sw-gray-200'
                  }`}
                >
                  {t('common.monthly')}
                </button>
                <button
                  onClick={() => onChangeBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    subscription.billingCycle === 'yearly'
                      ? 'bg-sw-blue-100 text-sw-blue-700'
                      : 'bg-sw-gray-100 text-sw-gray-600 hover:bg-sw-gray-200'
                  }`}
                >
                  {t('common.yearly')}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-sw-gray-100 rounded-xl">
              <div>
                <p className="font-medium text-sw-dark">{t('dashboard.paymentMethod')}</p>
                <p className="text-sm text-sw-gray-500">Visa ending in 4242</p>
              </div>
              <button className="text-sw-blue-600 hover:text-sw-blue-700 text-sm font-medium">
                {t('common.update')}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-sw-gray-100 rounded-xl">
              <div>
                <p className="font-medium text-sw-dark">{t('dashboard.billingEmail')}</p>
                <p className="text-sm text-sw-gray-500">irakli@company.com</p>
              </div>
              <button className="text-sw-blue-600 hover:text-sw-blue-700 text-sm font-medium">
                {t('common.change')}
              </button>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('dashboard.invoiceHistory')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sw-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('dashboard.invoice')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('dashboard.date')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('dashboard.amount')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-sw-gray-500">{t('dashboard.status')}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-sw-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-sw-gray-50 hover:bg-sw-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-sw-dark">{invoice.id}</td>
                    <td className="py-3 px-4 text-sm text-sw-gray-600">{invoice.date}</td>
                    <td className="py-3 px-4 text-sm text-sw-gray-600">${invoice.amount}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {t('dashboard.paid')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-sw-blue-600 hover:text-sw-blue-700 text-sm">
                        {t('common.download')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Plan Summary */}
      <div className="card p-6 h-fit">
        <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('dashboard.planSummary')}</h2>
        <div className="p-4 bg-sw-blue-50 rounded-xl mb-4">
          <p className="text-sm text-sw-blue-600 font-medium">{t(`plans.${currentPlan.id}`)}</p>
          <p className="text-2xl font-bold text-sw-dark mt-1">
            ${currentPlan.price}
            <span className="text-sm font-normal text-sw-gray-500">/{t('common.month')}</span>
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-sw-gray-500">{t('consumption.credits')}</span>
            <span className="font-medium text-sw-dark">
              {currentPlan.credits === -1 ? t('common.unlimited') : `${currentPlan.credits}/${t('common.month')}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sw-gray-500">{t('consumption.chats')}</span>
            <span className="font-medium text-sw-dark">
              {currentPlan.limits.chats === -1 ? t('common.unlimited') : currentPlan.limits.chats}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sw-gray-500">{t('consumption.dashboards')}</span>
            <span className="font-medium text-sw-dark">
              {currentPlan.limits.dashboards === -1 ? t('common.unlimited') : currentPlan.limits.dashboards}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-sw-gray-100">
          <Link to="/pricing" className="btn-primary w-full text-center block">
            {t('common.upgradePlan')}
          </Link>
          <button className="w-full mt-2 text-sm text-sw-gray-500 hover:text-red-600 transition-colors">
            {t('dashboard.cancelSubscription')}
          </button>
        </div>
      </div>
    </div>
  )
}

function UsageTab({ usageHistory }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Usage Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-sw-dark">{t('dashboard.usageOverTime')}</h2>
            <p className="text-sm text-sw-gray-500">{t('dashboard.trackConsumption')}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sw-blue-500 rounded-full" />
              <span className="text-sw-gray-600">{t('limits.aiQueries')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-sw-gray-600">{t('limits.deepResearch')}</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageHistory}>
              <defs>
                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResearch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="queries"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorQueries)"
              />
              <Area
                type="monotone"
                dataKey="deepResearch"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResearch)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-sw-dark mb-4">{t('dashboard.topQueryTopics')}</h3>
          <div className="space-y-3">
            {[
              { topic: 'Competitor Analysis', count: 15 },
              { topic: 'Traffic Insights', count: 12 },
              { topic: 'Market Trends', count: 8 },
              { topic: 'Audience Demographics', count: 5 },
              { topic: 'Keyword Research', count: 2 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-sw-gray-600">{item.topic}</span>
                <span className="text-sm font-medium text-sw-dark">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-sw-dark mb-4">{t('dashboard.usageByFeature')}</h3>
          <div className="space-y-4">
            {[
              { feature: t('limits.aiQueries'), used: 42, total: 50, color: 'bg-blue-500' },
              { feature: t('limits.deepResearch'), used: 4, total: 5, color: 'bg-purple-500' },
              { feature: t('limits.exports'), used: 8, total: 10, color: 'bg-green-500' },
              { feature: t('limits.savedReports'), used: 3, total: 5, color: 'bg-orange-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-sw-gray-600">{item.feature}</span>
                  <span className="text-sm font-medium text-sw-dark">
                    {item.used}/{item.total}
                  </span>
                </div>
                <div className="h-2 bg-sw-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.used / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
