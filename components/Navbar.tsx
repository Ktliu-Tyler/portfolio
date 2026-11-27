'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useTranslation } from '@/lib/i18n'

const links = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/projects', labelKey: 'nav.projects' },
  { href: '/experience', labelKey: 'nav.experience' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/#contact', labelKey: 'nav.contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null)
  const mobileOpen = openMenuPath === pathname

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-[var(--glass-border)] bg-[var(--bg-primary)]">
      <nav className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6 md:flex-nowrap">
        <Link href="/" className="py-3 text-base font-semibold" onClick={() => setOpenMenuPath(null)}>Tyler Liu</Link>
        <button
          type="button"
          onClick={() => setOpenMenuPath(mobileOpen ? null : pathname)}
          aria-label={t('nav.toggle_menu')}
          aria-expanded={mobileOpen}
          aria-controls="site-navigation"
          className="site-control md:hidden"
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <div id="site-navigation" className={`${mobileOpen ? 'flex' : 'hidden'} w-full flex-col gap-4 pb-4 md:contents`}>
          <ul className="flex flex-col gap-1 md:flex-row">
            {links.map(({ href, labelKey }) => {
              const active = href === pathname || (href !== '/' && pathname.startsWith(`${href}/`))
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpenMenuPath(null)}
                    className="site-nav-link flex min-h-11 items-center px-3 text-sm font-medium"
                  >
                    {t(labelKey)}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
