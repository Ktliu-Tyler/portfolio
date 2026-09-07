'use client'

import { useTranslation } from '@/lib/i18n'
import { adminText, adminLabel, adminError, type AdminMessage } from '@/lib/adminTranslations'

export function useAdminTranslation() {
  const { locale, setLocale } = useTranslation()
  return {
    locale, setLocale,
    a: (key: AdminMessage, params?: Record<string, string | number>) => adminText(locale, key, params),
    label: (value: string) => adminLabel(locale, value),
    errorText: (value: string) => adminError(locale, value),
  }
}

export default function AdminLanguage() {
  const { locale, setLocale, a } = useAdminTranslation()
  return <div role="group" aria-label={a('介面語言')} className="flex shrink-0 gap-1">
    <button type="button" lang="zh-TW" className={`admin-tab${locale === 'zh' ? ' active' : ''}`} aria-pressed={locale === 'zh'} onClick={() => setLocale('zh')}>繁體中文</button>
    <button type="button" lang="en" className={`admin-tab${locale === 'en' ? ' active' : ''}`} aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>English</button>
  </div>
}
