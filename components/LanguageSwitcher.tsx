'use client'

import { Globe } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      aria-label={t('nav.toggle_language')}
      className="site-control"
    >
      <Globe size={16} aria-hidden="true" />
      <span lang={locale === 'zh' ? 'en' : 'zh-TW'}>{locale === 'zh' ? 'EN' : '中文'}</span>
    </button>
  )
}
