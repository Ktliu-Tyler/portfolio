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
      className="
        relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        border border-black/[0.08] dark:border-white/[0.08]
        bg-white/60 dark:bg-white/[0.05]
        backdrop-blur-md
        text-slate-600 dark:text-slate-300
        hover:bg-white/80 dark:hover:bg-white/[0.1]
        transition-colors duration-200
      "
    >
      <Globe className="w-3.5 h-3.5" />
      <motion.span
        key={locale}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 6, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {locale === 'zh' ? 'EN' : '中'}
      </motion.span>
    </button>
  )
}
