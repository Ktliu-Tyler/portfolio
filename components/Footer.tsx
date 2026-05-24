'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Github, Mail, ArrowUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  Social links                                                       */
/* ------------------------------------------------------------------ */

const socials = [
  {
    href: 'https://github.com/Ktliu-Tyler',
    label: 'GitHub',
    Icon: Github,
  },
  {
    href: 'mailto:ktliu1995@gmail.com',
    label: 'Email',
    Icon: Mail,
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const { t } = useTranslation()

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <footer className="relative mt-32">
      {/* ── Top border gradient ────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      {/* ── Glass card section ─────────────────────────────────── */}
      <div
        className="
          bg-white/50 dark:bg-white/[0.02]
          backdrop-blur-xl
          border-t border-black/[0.04] dark:border-white/[0.04]
        "
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center gap-6">
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {socials.map(({ href, label, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    w-10 h-10 flex items-center justify-center rounded-full
                    border border-black/[0.08] dark:border-white/[0.08]
                    bg-white/60 dark:bg-white/[0.05]
                    text-slate-600 dark:text-slate-300
                    hover:text-indigo-500 dark:hover:text-indigo-400
                    hover:border-indigo-500/30
                    transition-colors duration-200
                  "
                >
                  <Icon className="w-4.5 h-4.5" />
                </motion.a>
              ))}
            </div>

            {/* Built with */}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('footer.built_with')}
            </p>

            {/* Copyright */}
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © 2026 Tyler. {t('footer.rights')}.
            </p>
          </div>
        </div>
      </div>

      {/* ── Scroll-to-top button ───────────────────────────────── */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ y: -3, scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
        className="
          absolute -top-5 right-6 sm:right-10
          w-10 h-10 flex items-center justify-center rounded-full
          bg-gradient-to-br from-indigo-500 to-purple-500
          text-white shadow-lg shadow-indigo-500/25
          hover:shadow-indigo-500/40
          transition-shadow duration-300
        "
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </footer>
  )
}
