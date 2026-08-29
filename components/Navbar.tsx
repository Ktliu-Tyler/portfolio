'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useTranslation } from '@/lib/i18n'

interface NavLink {
  href: string
  labelKey: string
}

const links: NavLink[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/projects', labelKey: 'nav.projects' },
  { href: '/experience', labelKey: 'nav.experience' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/#contact', labelKey: 'nav.contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const scrollingDown = currentY > lastScrollYRef.current

      setHasScrolled(currentY > 10)
      setVisible(currentY < 10 || !scrollingDown || currentY <= 80)

      if (scrollingDown && currentY > 80) {
        setMobileOpen(false)
      }

      lastScrollYRef.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href.includes('#')) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed inset-x-0 top-0 z-50 transition-colors duration-300
        ${
          hasScrolled || mobileOpen
            ? 'border-b border-slate-200 bg-white/86 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0f1724]/88'
            : 'bg-transparent'
        }
      `}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex-shrink-0">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-950 dark:text-white">
            Tyler Liu
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${
                    active
                      ? 'text-slate-950 dark:text-white'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                  }
                `}
              >
                {t(link.labelKey)}
                {active && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    className="absolute inset-x-3 -bottom-px h-px bg-[var(--marker-accent)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06] md:hidden"
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
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-slate-200 bg-white/94 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0f1724]/96 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
              {links.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      rounded-md px-4 py-3 text-sm font-medium transition-colors duration-200
                      ${
                        active
                          ? 'marker-filter-active'
                          : 'marker-filter-idle text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]'
                      }
                    `}
                  >
                    {t(link.labelKey)}
                  </Link>
                )
              })}
              <div className="mt-2 flex items-center gap-2 border-t border-slate-200 px-4 pt-3 dark:border-white/[0.08]">
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
