'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

interface TypewriterEffectProps {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  className?: string
}

export default function TypewriterEffect({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className = '',
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentFullText = texts[textIndex] || ''

  const tick = useCallback(() => {
    if (isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
      return
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
        timeoutRef.current = setTimeout(tick, speed)
        return
      }
      setDisplayText((prev) => prev.slice(0, -1))
      timeoutRef.current = setTimeout(tick, deleteSpeed)
    } else {
      if (displayText.length === currentFullText.length) {
        setIsPaused(true)
        timeoutRef.current = setTimeout(tick, 0)
        return
      }
      setDisplayText((prev) => currentFullText.slice(0, prev.length + 1))
      timeoutRef.current = setTimeout(tick, speed)
    }
  }, [displayText, isDeleting, isPaused, currentFullText, texts.length, speed, deleteSpeed, pauseTime])

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, speed)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [tick, speed])

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
          bg-clip-text text-transparent"
      >
        {displayText}
      </span>
      <motion.span
        className="inline-block w-[3px] h-[1em] ml-0.5 rounded-full
          bg-gradient-to-b from-indigo-400 to-purple-500
          self-stretch relative top-[0.1em]"
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
      />
    </span>
  )
}
