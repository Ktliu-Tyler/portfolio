'use client'

import { useCallback } from 'react'
import { Github, Mail, ArrowUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

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

export default function Footer() {
  const { t } = useTranslation()

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <footer className="marker-section mt-24 border-t border-slate-200 dark:border-white/[0.08]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-950 dark:text-white">Tyler Liu</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('footer.built_with')}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Copyright 2026 Tyler. {t('footer.rights')}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              aria-label={label}
              className="marker-icon-button inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-950 dark:border-white/[0.08] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="marker-icon-button inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-950 dark:border-white/[0.08] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
