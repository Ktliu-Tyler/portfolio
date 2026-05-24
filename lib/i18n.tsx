'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, type Locale, type TranslationKey } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Locale
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('lang', newLocale)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-TW' : 'en'
  }, [locale])

  const t = useCallback((key: TranslationKey): string => {
    const keys = key.split('.')
    let value: string | Record<string, unknown> = translations[locale]
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k] as string | Record<string, unknown>
      } else {
        return key
      }
    }
    return (typeof value === 'string' ? value : key)
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

export type { Locale, TranslationKey }
