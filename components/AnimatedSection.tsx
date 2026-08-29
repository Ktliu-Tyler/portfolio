'use client'

import { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade'

interface AnimatedSectionProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  className?: string
  id?: string
}

const directionVariants: Record<Direction, Variants> = {
  up: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

export default function AnimatedSection({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  id,
}: AnimatedSectionProps) {
  const variants = directionVariants[direction]

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}
