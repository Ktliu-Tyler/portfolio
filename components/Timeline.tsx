'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ================================================================== */
/*  TimelineConnector – vertical gradient line with glowing nodes      */
/* ================================================================== */

export function TimelineConnector() {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="
        absolute left-6 md:left-8 top-0 bottom-0 w-px origin-top
        bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500
      "
      style={{
        boxShadow: '0 0 8px rgba(99,102,241,0.4), 0 0 20px rgba(99,102,241,0.15)',
      }}
    />
  )
}

/* ================================================================== */
/*  TimelineSection – year group                                       */
/* ================================================================== */

interface TimelineSectionProps {
  year: string
  label: string
  description: string
  children: ReactNode
  index: number
}

export function TimelineSection({
  year,
  label,
  description,
  children,
  index,
}: TimelineSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative pl-16 md:pl-24 pb-16 last:pb-0"
    >
      {/* ── Glowing year node ──────────────────────────────────── */}
      <div className="absolute left-3.5 md:left-5.5 top-0 z-10 flex items-center justify-center">
        {/* outer glow */}
        <span
          className="absolute w-7 h-7 rounded-full bg-indigo-500/20 dark:bg-indigo-500/30 animate-ping"
          style={{ animationDuration: '3s' }}
        />
        {/* visible dot */}
        <span
          className="
            relative w-5 h-5 rounded-full
            bg-gradient-to-br from-indigo-500 to-purple-500
            border-[3px] border-white dark:border-[#0C1120]
            shadow-[0_0_10px_rgba(99,102,241,0.6)]
          "
        />
      </div>

      {/* ── Year badge ─────────────────────────────────────────── */}
      <div className="mb-4">
        <span
          className="
            inline-block text-xs font-mono font-semibold tracking-wider uppercase
            px-3 py-1 rounded-full
            bg-indigo-500/10 text-indigo-500 dark:text-indigo-400
            border border-indigo-500/20
          "
        >
          {year}
        </span>
        <h3 className="mt-2 text-xl font-bold font-heading text-slate-900 dark:text-white">
          {label}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {description}
        </p>
      </div>

      {/* ── Project cards grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </motion.div>
  )
}

/* ================================================================== */
/*  Timeline – wrapper that holds the connector line                   */
/* ================================================================== */

interface TimelineProps {
  children: ReactNode
}

export function Timeline({ children }: TimelineProps) {
  return (
    <div className="relative">
      <TimelineConnector />
      {children}
    </div>
  )
}
