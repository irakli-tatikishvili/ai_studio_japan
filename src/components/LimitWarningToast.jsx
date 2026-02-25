import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X, ArrowUpRight } from 'lucide-react'
import { useUsage } from '../context/UsageContext'
import { useLanguage } from '../context/LanguageContext'

export default function LimitWarningToast({ context, onClose }) {
  const { currentPlan, getCreditsPercentage, getCreditsRemaining } = useUsage()
  const { t } = useLanguage()

  const percentage = getCreditsPercentage()
  const remaining = getCreditsRemaining()

  // Auto dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-amber-200 max-w-sm overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-amber-100">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sw-dark">{t('toast.approachingLimit')}</h4>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-sw-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-sw-gray-400" />
                </button>
              </div>
              
              <p className="text-sm text-sw-gray-600 mt-1">
                {t('toast.creditsRemaining', { count: remaining })}
              </p>

              <Link
                to="/pricing"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-sm text-sw-blue-600 hover:text-sw-blue-700 font-medium mt-2"
              >
                {t('toast.upgradeForMore')}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
