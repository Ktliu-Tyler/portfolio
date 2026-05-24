'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        {/* Glass card container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 max-w-lg mx-auto">
          {/* 404 Number */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <h1 className="text-8xl md:text-9xl font-heading font-bold gradient-text mb-4">
              {t('notFound.title')}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-slate-200 mb-4">
            {t('notFound.subtitle')}
          </h2>

          {/* Description */}
          <p className="text-slate-400 text-lg mb-8 max-w-sm mx-auto">
            {t('notFound.description')}
          </p>

          {/* Back home button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            {t('notFound.back')}
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
