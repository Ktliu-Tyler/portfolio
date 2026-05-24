'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useTranslation } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  Nav link data                                                      */
/* ------------------------------------------------------------------ */

interface NavLink {
  href: string
  labelKey: string
}

const links: NavLink[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/projects', labelKey: 'nav.projects' },
  { href: '/blog', labelKey: 'nav.blog' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  /* Hide on scroll down, show on scroll up ───────────────────── */
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY

    setHasScrolled(currentY > 10)

    if (currentY < 10) {
      setVisible(true)
    } else if (currentY > lastScrollY && currentY > 80) {
      setVisible(false) // scrolling down
      setMobileOpen(false)
    } else {
      setVisible(true) // scrolling up
    }

    setLastScrollY(currentY)
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* Determine active link ────────────────────────────────────── */
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed top-0 inset-x-0 z-50
        transition-colors duration-300
        ${
          hasScrolled
            ? 'bg-white/70 dark:bg-[#0C1120]/70 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] shadow-sm dark:shadow-none'
            : 'bg-transparent'
        }
      `}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* ── Logo ───────────────────────────────────────────── */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-xl font-bold font-heading bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Tyler.
          </span>
        </Link>

        {/* ── Desktop nav links ──────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                {t(link.labelKey)}
                {active && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* ── Right side controls ────────────────────────────── */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="
              md:hidden w-9 h-9 flex items-center justify-center rounded-lg
              text-slate-600 dark:text-slate-300
              hover:bg-black/5 dark:hover:bg-white/[0.06]
              transition-colors
            "
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ── Mobile menu panel ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="
              md:hidden overflow-hidden
              bg-white/80 dark:bg-[#0C1120]/90
              backdrop-blur-xl
              border-b border-black/[0.06] dark:border-white/[0.08]
            "
          >
            <div className="px-4 pt-2 pb-4 flex flex-col gap-1">
              {links.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${
                        active
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/[0.06]'
                      }
                    `}
                  >
                    {t(link.labelKey)}
                  </Link>
                )
              })}
              <div className="flex items-center gap-2 px-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] mt-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
