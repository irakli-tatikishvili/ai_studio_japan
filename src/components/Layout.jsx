import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Sparkles, LayoutDashboard, CreditCard, MessageSquare, Flag, Gift, ClipboardList, ChevronDown } from 'lucide-react'
import UsageNotificationBar from './UsageNotificationBar'
import LanguageToggle from './LanguageToggle'
import ReferralModal from './ReferralModal'
import { useLanguage } from '../context/LanguageContext'

export default function Layout() {
  const { t } = useLanguage()
  const location = useLocation()
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [pricingMenuOpen, setPricingMenuOpen] = useState(false)
  const pricingNavRef = useRef(null)

  const isPricingSection = location.pathname === '/pricing' || location.pathname === '/'

  const pricingMethodIds = ['tiers', 'uniformCredits', 'payPerQuery', 'credits', 'freeTier']
  const pricingMethodLabelKey = {
    tiers: 'tierBased',
    uniformCredits: 'uniformCredits',
    payPerQuery: 'payPerQuery',
    credits: 'moduleCredits',
    freeTier: 'moduleFreeTier',
  }

  const modelParam = new URLSearchParams(location.search).get('model')
  const activePricingModel = pricingMethodIds.includes(modelParam) ? modelParam : 'tiers'

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setPricingMenuOpen(false)
    }
    const onPointerDown = (e) => {
      if (pricingNavRef.current && !pricingNavRef.current.contains(e.target)) {
        setPricingMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [])

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
              <div className="relative" ref={pricingNavRef}>
                <button
                  type="button"
                  onClick={() => setPricingMenuOpen((open) => !open)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isPricingSection
                      ? 'bg-sw-blue-50 text-sw-blue-700'
                      : 'text-sw-gray-600 hover:bg-sw-gray-100'
                  }`}
                  aria-expanded={pricingMenuOpen}
                  aria-haspopup="true"
                >
                  <CreditCard className="w-4 h-4" />
                  {t('nav.pricing')}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${pricingMenuOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                {pricingMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 min-w-[14rem] max-w-[20rem] rounded-lg border border-sw-gray-200 bg-white py-1 shadow-lg z-50">
                    {pricingMethodIds.map((methodId) => (
                      <NavLink
                        key={methodId}
                        to={`/pricing?model=${methodId}`}
                        onClick={() => setPricingMenuOpen(false)}
                        className={() =>
                          `block px-4 py-2 text-sm font-medium transition-colors ${
                            activePricingModel === methodId
                              ? 'bg-sw-blue-50 text-sw-blue-700'
                              : 'text-sw-gray-700 hover:bg-sw-gray-50'
                          }`
                        }
                      >
                        {t(`pricing.${pricingMethodLabelKey[methodId]}`)}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
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
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-sw-gray-600 hover:bg-sw-gray-100'
                  }`
                }
              >
                <ClipboardList className="w-4 h-4" />
                {t('nav.projectTracker')}
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
