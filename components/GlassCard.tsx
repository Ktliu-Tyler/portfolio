'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        marker-card relative overflow-hidden rounded-lg
        border border-slate-200 bg-white/80 text-slate-900
        backdrop-blur-md transition-colors duration-200
        dark:border-white/[0.09] dark:bg-white/[0.035] dark:text-slate-100
        ${className}
      `}
      whileHover={
        hover
          ? {
              y: -2,
              transition: { duration: 0.25, ease: 'easeOut' },
            }
          : undefined
      }
      initial={false}
    >
      {glow && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--marker-accent)]" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
