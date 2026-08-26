'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
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

  const buttonClass =
    'relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white/70 text-slate-600 backdrop-blur-md transition-colors duration-200 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]'

  if (!mounted) {
    return <button aria-label="Toggle theme" className={buttonClass} />
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" className={buttonClass}>
      <motion.div
        key={dark ? 'dark' : 'light'}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25 }}
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.div>
    </button>
  )
}
