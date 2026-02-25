import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Sparkles, LayoutDashboard, CreditCard, MessageSquare, Flag, Gift } from 'lucide-react'
import UsageNotificationBar from './UsageNotificationBar'
import LanguageToggle from './LanguageToggle'
import ReferralModal from './ReferralModal'
import { useLanguage } from '../context/LanguageContext'

export default function Layout() {
  const { t } = useLanguage()
  const [showReferralModal, setShowReferralModal] = useState(false)

  return (
    <div className="min-h-screen bg-sw-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-sw-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sw-blue-500 to-sw-blue-700 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-sw-dark">AI Studio</span>
                <span className="text-xs text-sw-gray-400 block -mt-1">by Similarweb</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <NavLink
                to="/studio"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sw-blue-50 text-sw-blue-700'
                      : 'text-sw-gray-600 hover:bg-sw-gray-100'
                  }`
                }
              >
                <MessageSquare className="w-4 h-4" />
                {t('nav.aiStudio')}
              </NavLink>
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sw-blue-50 text-sw-blue-700'
                      : 'text-sw-gray-600 hover:bg-sw-gray-100'
                  }`
                }
              >
                <CreditCard className="w-4 h-4" />
                {t('nav.pricing')}
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sw-blue-50 text-sw-blue-700'
                      : 'text-sw-gray-600 hover:bg-sw-gray-100'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('nav.myAccount')}
              </NavLink>
              <NavLink
                to="/japan"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700'
                      : 'text-sw-gray-600 hover:bg-sw-gray-100'
                  }`
                }
              >
                <Flag className="w-4 h-4" />
                {t('nav.japanOverview')}
              </NavLink>
            </nav>

            {/* Referral, Language Toggle & User Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReferralModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">{t('referral.earnCredits')}</span>
              </button>
              <LanguageToggle />
              <div className="w-9 h-9 bg-sw-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-sw-blue-700">IT</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Usage Notification Bar */}
      <UsageNotificationBar />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal onClose={() => setShowReferralModal(false)} />
      )}
    </div>
  )
}
