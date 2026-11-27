'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  const applyTheme = (nextDark: boolean) => {
    const root = document.documentElement
    root.classList.toggle('dark', nextDark)
    root.classList.toggle('light', !nextDark)
    root.dataset.theme = nextDark ? 'dark' : 'light'
  }

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextDark = stored === 'dark' || (!stored && prefersDark)
    setDark(nextDark)
    applyTheme(nextDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    applyTheme(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button type="button" onClick={toggle} aria-label={t('nav.toggle_theme')} className="site-control">
      {mounted && (dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />)}
    </button>
  )
}
