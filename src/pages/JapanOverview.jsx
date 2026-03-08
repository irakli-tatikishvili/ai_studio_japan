import { 
  Users, 
  UserPlus, 
  ShoppingCart, 
  RefreshCw, 
  TrendingUp,
  Target,
  Flag,
  DollarSign,
  CreditCard,
  Repeat,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  BarChart3
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function JapanOverview() {
  const { t } = useLanguage()

  // Self Serve KPIs (goals to track)
  const selfServeKPIs = [
    { id: 'mrr', label: t('business.mrr'), icon: <DollarSign className="w-5 h-5" /> },
    { id: 'collection', label: t('business.collection'), icon: <CreditCard className="w-5 h-5" /> },
    { id: 'ltv', label: t('business.ltv'), icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'arpu', label: t('business.arpu'), icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'churn', label: t('business.churn'), icon: <Repeat className="w-5 h-5" /> },
  ]

  // Touch Pipeline KPIs (goals to track)
  const touchPipelineKPIs = [
    { id: 'mqls', label: t('business.mqls'), icon: <Users className="w-5 h-5" /> },
    { id: 'contactUs', label: t('business.contactUs'), icon: <Mail className="w-5 h-5" /> },
    { id: 'meetings', label: t('business.meetings'), icon: <Calendar className="w-5 h-5" /> },
    { id: 'demos', label: t('business.demos'), icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'opportunities', label: t('business.opportunities'), icon: <Target className="w-5 h-5" /> },
  ]

  const metrics = [
    {
      id: 'registrations',
      label: t('japan.registrations'),
      value: '14,000',
      icon: <UserPlus className="w-6 h-6" />,
      color: 'blue',
      colorClasses: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      },
    },
    {
      id: 'trials',
      label: t('japan.trials'),
      value: '4,000',
      icon: <Users className="w-6 h-6" />,
      color: 'emerald',
      colorClasses: {
        bg: 'bg-emerald-50',
        icon: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
      },
    },
    {
      id: 'purchases',
      label: t('japan.ntPurchases'),
      value: '140',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'purple',
      colorClasses: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700',
      },
    },
    {
      id: 'retention',
      label: t('japan.retentionRate'),
      value: '50%',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'orange',
      colorClasses: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700',
      },
    },
    {
      id: 'nt2t',
      label: t('japan.nt2t'),
      value: '1.5',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'pink',
      colorClasses: {
        bg: 'bg-pink-50',
        icon: 'text-pink-600',
        badge: 'bg-pink-100 text-pink-700',
      },
    },
  ]

  const conversionRate = ((140 / 4000) * 100).toFixed(1)
  const trialRate = ((4000 / 14000) * 100).toFixed(1)

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-sw-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-sw-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-sw-dark">{t('business.title')}</h1>
              <p className="text-sw-gray-500">{t('business.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* ==================== SECTION A: Goals & KPIs ==================== */}
        <div className="mb-10 p-6 bg-gradient-to-r from-sw-blue-50 to-purple-50 rounded-2xl border border-sw-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-sw-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-sw-dark">{t('business.sectionA')}</h2>
              <p className="text-sm text-sw-gray-500">{t('business.sectionADesc')}</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Self Serve $ */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-sw-dark">{t('business.selfServe')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selfServeKPIs.map((kpi) => (
                  <div key={kpi.id} className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-600">{kpi.icon}</span>
                    <span className="text-sm font-medium text-green-800">{kpi.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Touch Pipeline */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sw-dark">{t('business.touchPipeline')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {touchPipelineKPIs.map((kpi) => (
                  <div key={kpi.id} className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="text-orange-600">{kpi.icon}</span>
                    <span className="text-sm font-medium text-orange-800">{kpi.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== SECTION B: Japan Overview ==================== */}
        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-sw-dark">{t('business.sectionB')}</h2>
              <p className="text-sm text-sw-gray-500">{t('business.sectionBDesc')}</p>
            </div>
            <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
              Q4 2025
            </span>
          </div>

          {/* Main Metrics Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.colorClasses.bg} rounded-xl flex items-center justify-center ${metric.colorClasses.icon}`}>
                  {metric.icon}
                </div>
              </div>
              <p className="text-sm text-sw-gray-500 mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-sw-dark">{metric.value}</p>
            </div>
          ))}
        </div>

          {/* Funnel Analysis */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('japan.funnelAnalysis')}</h2>
            
            {/* Funnel Visualization */}
            <div className="space-y-4">
              {/* Registrations */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-sw-gray-600">{t('japan.registrations')}</span>
                  <span className="text-sm font-semibold text-sw-dark">14,000</span>
                </div>
                <div className="h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">100%</span>
                </div>
              </div>

              {/* Trials */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-sw-gray-600">{t('japan.trials')}</span>
                  <span className="text-sm font-semibold text-sw-dark">4,000</span>
                </div>
                <div className="h-8 bg-sw-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-lg flex items-center justify-center"
                    style={{ width: `${trialRate}%` }}
                  >
                    <span className="text-white text-sm font-medium">{trialRate}%</span>
                  </div>
                </div>
              </div>

              {/* Purchases */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-sw-gray-600">{t('japan.ntPurchases')}</span>
                  <span className="text-sm font-semibold text-sw-dark">140</span>
                </div>
                <div className="h-8 bg-sw-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-lg flex items-center px-2"
                    style={{ width: `${(140/14000)*100}%`, minWidth: '60px' }}
                  >
                    <span className="text-white text-sm font-medium">1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Rates */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('japan.keyRates')}</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-sw-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-sw-gray-600">{t('japan.regToTrial')}</span>
                  <span className="text-2xl font-bold text-emerald-600">{trialRate}%</span>
                </div>
                <div className="h-2 bg-sw-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${trialRate}%` }} />
                </div>
              </div>

              <div className="p-4 bg-sw-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-sw-gray-600">{t('japan.trialToPurchase')}</span>
                  <span className="text-2xl font-bold text-purple-600">{conversionRate}%</span>
                </div>
                <div className="h-2 bg-sw-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${conversionRate}%` }} />
                </div>
              </div>

              <div className="p-4 bg-sw-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-sw-gray-600">{t('japan.retentionRate')}</span>
                  <span className="text-2xl font-bold text-orange-600">50%</span>
                </div>
                <div className="h-2 bg-sw-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              <div className="p-4 bg-sw-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sw-gray-600">{t('japan.nt2t')}</span>
                  <span className="text-2xl font-bold text-pink-600">1.5</span>
                </div>
                <p className="text-xs text-sw-gray-500 mt-1">{t('japan.nt2tDesc')}</p>
              </div>
            </div>
          </div>
        </div>

          {/* Summary Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-sw-dark mb-4">{t('japan.summary')}</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">14K</p>
                <p className="text-sm text-sw-gray-600">{t('japan.totalRegistrations')}</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">{trialRate}%</p>
                <p className="text-sm text-sw-gray-600">{t('japan.trialConversion')}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600">{conversionRate}%</p>
                <p className="text-sm text-sw-gray-600">{t('japan.purchaseConversion')}</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <p className="text-3xl font-bold text-orange-600">50%</p>
                <p className="text-sm text-sw-gray-600">{t('japan.retention')}</p>
              </div>
            </div>
          </div>
        </div>
        {/* End Section B */}

      </div>
    </div>
  )
}
