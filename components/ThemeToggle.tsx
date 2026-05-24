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

  /* Sync with system / stored preference on mount */
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

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="w-9 h-9 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.05] backdrop-blur-md"
      />
    )
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="
        relative w-9 h-9 flex items-center justify-center rounded-full
        border border-black/[0.08] dark:border-white/[0.08]
        bg-white/60 dark:bg-white/[0.05]
        backdrop-blur-md
        text-slate-600 dark:text-slate-300
        hover:bg-white/80 dark:hover:bg-white/[0.1]
        transition-colors duration-200
      "
    >
      <motion.div
        key={dark ? 'dark' : 'light'}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25 }}
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.div>
    </button>
  )
}
