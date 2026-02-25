import { useState } from 'react'
import { Check, X, Sparkles, Zap, Building2, ArrowRight, Monitor, Smartphone, ShoppingCart, Coins } from 'lucide-react'
import { useUsage, PLANS, CREDIT_PACKAGE } from '../context/UsageContext'
import { useLanguage } from '../context/LanguageContext'

export default function PricingPage() {
  const { subscription, upgradePlan } = useUsage()
  const { t } = useLanguage()
  const [billingCycle, setBillingCycle] = useState('monthly')

  const planOrder = ['free', 'starter', 'pro', 'enterprise']

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sw-blue-100 text-sw-blue-700 mb-4">
            {t('pricing.badge')}
          </span>
          <h1 className="text-4xl font-bold text-sw-dark mb-4">{t('pricing.title')}</h1>
          <p className="text-lg text-sw-gray-600 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
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

        {/* Pricing Cards */}
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

  // Credit options for each plan (multipliers of base credits)
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

      {/* Header - Fixed Height */}
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

      {/* Description - Fixed Height */}
      <div className="h-12 mb-4">
        <p className="text-sm text-sw-gray-600">{t(`pricing.${planId}Desc`)}</p>
      </div>

      {/* Price - Fixed Height */}
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

      {/* Credits Dropdown/Badge - Fixed Height */}
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

      {/* CTA Button - Fixed Position */}
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

      {/* Features - Flex Grow to push data types to bottom */}
      <ul className="mt-6 space-y-3 flex-grow">
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

      {/* Data Types - Always at Bottom */}
      <div className="mt-6 pt-4 border-t border-sw-gray-100">
        <p className="text-xs font-semibold text-sw-gray-500 mb-2">{t('dataAccess.dataTypes')}</p>
        <div className="space-y-1">
          <DataTypeRow 
            icon={<Monitor className="w-3 h-3" />}
            label={t('dataAccess.webData')}
            included={plan.dataAccess.web}
          />
          <DataTypeRow 
            icon={<Smartphone className="w-3 h-3" />}
            label={t('dataAccess.appData')}
            included={plan.dataAccess.app}
          />
          <DataTypeRow 
            icon={<ShoppingCart className="w-3 h-3" />}
            label={t('dataAccess.retailData')}
            included={plan.dataAccess.retail}
          />
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
