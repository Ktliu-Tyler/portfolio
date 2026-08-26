'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  const toggle = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh')
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className="relative flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur-md transition-colors duration-200 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
    >
      <Globe className="h-3.5 w-3.5" />
      <motion.span
        key={locale}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 6, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {locale === 'zh' ? 'EN' : 'ZH'}
      </motion.span>
    </button>
  )
}
