import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }

    // Replace parameters like {name} with actual values
    return value.replace(/\{(\w+)\}/g, (_, param) => params[param] ?? `{${param}}`)
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ja' : 'en')
  }, [])

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    languages: LANGUAGES,
    currentLanguage: LANGUAGES[language],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
