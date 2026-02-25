import { useState } from 'react'
import { X, Share2, MessageSquare, Sparkles, Copy, Check, Gift } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function ReferralModal({ onClose }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  
  const referralLink = 'https://aistudio.similarweb.com/invite/USER123ABC'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{t('referral.title')}</h2>
              <p className="text-white/90 mt-1">{t('referral.subtitle')}</p>
            </div>
            <div className="ml-auto">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* How it works */}
          <h3 className="font-semibold text-sw-dark mb-4">{t('referral.howItWorks')}</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Share2 className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm text-sw-gray-600 pt-1">{t('referral.step1')}</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-pink-600" />
              </div>
              <p className="text-sm text-sw-gray-600 pt-1">
                {t('referral.step2')} <span className="font-semibold text-sw-dark">{t('referral.credits50')}</span>
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-sm text-sw-gray-600 pt-1">
                {t('referral.step3')} <span className="font-semibold text-sw-dark">{t('referral.credits100')}</span>
              </p>
            </div>
          </div>

          {/* Invite Link */}
          <div className="border-t border-sw-gray-100 pt-6">
            <h3 className="font-semibold text-sw-dark mb-2">{t('referral.yourLink')}</h3>
            <p className="text-xs text-sw-gray-500 mb-3">{t('referral.linkNote')}</p>
            
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-sw-gray-50 rounded-xl border border-sw-gray-200 text-sm text-sw-gray-600 truncate">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    {t('referral.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {t('referral.copy')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terms link */}
          <div className="mt-6 text-center">
            <button className="text-sm text-sw-gray-500 hover:text-sw-gray-700 underline">
              {t('referral.terms')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
