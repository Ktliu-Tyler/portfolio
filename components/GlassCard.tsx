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
        relative rounded-2xl overflow-hidden
        bg-white/80 dark:bg-white/[0.05] backdrop-blur-xl
        border border-black/[0.08] dark:border-white/[0.10]
        text-slate-900 dark:text-slate-100
        ${className}
      `}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.3, ease: 'easeOut' },
            }
          : undefined
      }
      initial={false}
    >
      {/* Glow border effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15), rgba(6,182,212,0.15))',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Glow border ring */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            padding: '1px',
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2), rgba(6,182,212,0.4), rgba(99,102,241,0.4))',
            backgroundSize: '300% 300%',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Hover shimmer effect */}
      {hover && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none
            bg-gradient-to-br from-white/5 via-transparent to-white/5"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
