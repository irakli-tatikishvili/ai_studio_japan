import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Zap, Check, Lock } from 'lucide-react'
import { useUsage, PLANS } from '../context/UsageContext'
import { useLanguage } from '../context/LanguageContext'

export default function UpgradeModal({ context, onClose }) {
  const { currentPlan, usage, getCreditsPercentage } = useUsage()
  const { t } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const starterPlan = PLANS.starter
  const proPlan = PLANS.pro

  const creditsUsed = usage.creditsUsed
  const creditsLimit = currentPlan.credits

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-sw-dark/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header - Blue gradient */}
        <div className="bg-gradient-to-r from-sw-blue-600 to-indigo-600 px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('modal.limitReached')}</h2>
              <p className="text-blue-100 text-sm">{t('modal.usedAllCredits')}</p>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-100">{t('modal.currentUsage')}</span>
              <span className="font-bold text-sm">{creditsUsed}/{creditsLimit}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all" 
                style={{ width: `${Math.min(getCreditsPercentage(), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-sw-dark mb-1">
            {t('modal.upgradeToProContinue')}
          </h3>
          <p className="text-sw-gray-500 text-sm mb-5">
            {t('modal.getMoreCredits')}
          </p>

          {/* Plan Options */}
          <div className="space-y-3 mb-5">
            {/* Starter Option */}
            <button
              onClick={() => setSelectedPlan('starter')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                selectedPlan === 'starter'
                  ? 'border-sw-blue-500 bg-sw-blue-50'
                  : 'border-sw-gray-200 hover:border-sw-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                selectedPlan === 'starter' ? 'bg-sw-blue-600 text-white' : 'bg-sw-gray-100 text-sw-gray-500'
              }`}>
                {currentPlan.id === 'starter' ? t('modal.now') : ''}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sw-dark">{t('plans.starter')}</p>
                <p className="text-xs text-sw-gray-500">{starterPlan.credits} {t('modal.creditsPerMonth')}</p>
              </div>
              {selectedPlan === 'starter' && (
                <Check className="w-5 h-5 text-sw-blue-600" />
              )}
            </button>

            {/* Pro Option */}
            <button
              onClick={() => setSelectedPlan('pro')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                selectedPlan === 'pro'
                  ? 'border-sw-blue-500 bg-sw-blue-50'
                  : 'border-sw-gray-200 hover:border-sw-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedPlan === 'pro' ? 'bg-sw-blue-600 text-white' : 'bg-sw-gray-100 text-sw-gray-500'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sw-dark">{t('plans.pro')}</p>
                <p className="text-xs text-sw-blue-600">{proPlan.credits} {t('modal.creditsPerMonth')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sw-dark">${proPlan.price}</p>
                <p className="text-xs text-sw-gray-500">/{t('common.month')}</p>
              </div>
            </button>
          </div>

          {/* Features included in Pro */}
          <div className="mb-6">
            <p className="text-sm font-medium text-sw-gray-700 mb-3">
              {t('modal.alsoIncludedInPro')}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sw-blue-600 flex-shrink-0" />
                <span className="text-sm text-sw-gray-600">{t('modal.everythingInStarter')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sw-blue-600 flex-shrink-0" />
                <span className="text-sm text-sw-gray-600">{t('modal.moreCredits')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sw-blue-600 flex-shrink-0" />
                <span className="text-sm text-sw-gray-600">{t('modal.deepResearchReports')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sw-blue-600 flex-shrink-0" />
                <span className="text-sm text-sw-gray-600">{t('modal.advancedTracking')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-sw-gray-200 rounded-xl text-sw-gray-700 font-medium hover:bg-sw-gray-50 transition-colors"
            >
              {t('common.maybeLater')}
            </button>
            <Link
              to="/pricing"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-sw-blue-600 text-white rounded-xl font-medium hover:bg-sw-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {t('common.upgradeNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
