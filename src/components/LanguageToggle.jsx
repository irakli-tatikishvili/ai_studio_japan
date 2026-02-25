import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguage, LANGUAGES } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage, currentLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-sw-gray-600 hover:bg-sw-gray-100 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-sw-gray-100 py-2 z-50">
          {Object.values(LANGUAGES).map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                language === lang.code
                  ? 'bg-sw-blue-50 text-sw-blue-700'
                  : 'text-sw-gray-700 hover:bg-sw-gray-50'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.name}</span>
              {language === lang.code && (
                <Check className="w-4 h-4 text-sw-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
