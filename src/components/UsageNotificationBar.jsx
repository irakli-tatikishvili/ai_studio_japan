import { X, AlertTriangle, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUsageNotifications } from '../hooks/useUsageLimits'
import { useLanguage } from '../context/LanguageContext'

export default function UsageNotificationBar() {
  const { notifications, dismissNotification } = useUsageNotifications()
  const { t } = useLanguage()

  if (notifications.length === 0) return null

  const primaryNotification = notifications[0]

  const getMetricLabel = (metric) => {
    return t(`limits.${metric === 'queries' ? 'aiQueries' : metric}`)
  }

  const getMessage = (notification) => {
    if (notification.type === 'error') {
      return t('notification.reachedLimit', { metric: getMetricLabel(notification.metric) })
    }
    const percentage = notification.message.match(/(\d+)%/)?.[1] || '90'
    return t('notification.atPercent', { 
      percent: percentage, 
      metric: getMetricLabel(notification.metric) 
    })
  }

  return (
    <div
      className={`${
        primaryNotification.type === 'error'
          ? 'bg-gradient-to-r from-red-500 to-orange-500'
          : 'bg-gradient-to-r from-amber-500 to-orange-500'
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {primaryNotification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            <span className="font-medium">{getMessage(primaryNotification)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              {t('common.upgradeNow')}
            </Link>
            <button
              onClick={() => dismissNotification(primaryNotification.id)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
