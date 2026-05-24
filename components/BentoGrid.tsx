'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  BentoGrid – responsive CSS Grid container                         */
/* ------------------------------------------------------------------ */

interface BentoGridProps {
  children: ReactNode
  className?: string
  cols?: number
}

export function BentoGrid({ children, className = '', cols = 4 }: BentoGridProps) {
  const colsClass: Record<number, string> = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }

  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-2 ${colsClass[cols] ?? 'lg:grid-cols-4'}
        gap-4
        ${className}
      `}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BentoItem – individual grid cell with glass card styling          */
/* ------------------------------------------------------------------ */

interface BentoItemProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2
  rowSpan?: 1 | 2
}

const spanCol: Record<1 | 2, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
}

const spanRow: Record<1 | 2, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
}

export function BentoItem({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
}: BentoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`
        ${spanCol[colSpan]} ${spanRow[rowSpan]}
        rounded-2xl border
        bg-white/70 dark:bg-white/[0.05]
        border-black/[0.08] dark:border-white/[0.08]
        backdrop-blur-xl
        shadow-sm dark:shadow-none
        p-6
        transition-colors duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
