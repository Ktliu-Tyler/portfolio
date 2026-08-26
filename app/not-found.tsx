'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-lg border-t border-slate-200 pt-10 text-center dark:border-white/[0.08]"
      >
        <p className="font-mono text-7xl text-slate-950 dark:text-white sm:text-8xl">
          {t('notFound.title')}
        </p>
        <h1 className="mt-6 text-2xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          {t('notFound.subtitle')}
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
          {t('notFound.description')}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Home className="h-4 w-4" />
          {t('notFound.back')}
        </Link>
      </motion.div>
    </main>
  )
}
