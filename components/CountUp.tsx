'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

function formatNumber(num: number): string {
  return Math.round(num).toLocaleString('en-US')
}

// Ease-out cubic for a smooth deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export default function CountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const rafRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    if (hasAnimated) return

    const startTime = performance.now()

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const currentValue = easedProgress * end

      setCount(currentValue)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setCount(end)
        setHasAnimated(true)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [end, duration, hasAnimated])

  useEffect(() => {
    if (isInView && !hasAnimated) {
      animate()
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isInView, animate, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
