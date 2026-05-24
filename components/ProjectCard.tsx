'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Lock, GitPullRequest } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ProjectStatus = 'public' | 'private' | 'contribution'

interface ProjectCardProps {
  title: string
  subtitle: string
  description: string
  tags: string[]
  link: string | null
  image: string | null
  status: ProjectStatus
  year: string
  index: number
}

/* ------------------------------------------------------------------ */
/*  Status badge config                                                */
/* ------------------------------------------------------------------ */

const statusConfig: Record<
  ProjectStatus,
  { label: string; labelEn: string; color: string; Icon: typeof Lock }
> = {
  public: {
    label: '公開',
    labelEn: 'Public',
    color:
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    Icon: ExternalLink,
  },
  private: {
    label: '私有',
    labelEn: 'Private',
    color:
      'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    Icon: Lock,
  },
  contribution: {
    label: '貢獻',
    labelEn: 'Contrib',
    color:
      'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    Icon: GitPullRequest,
  },
}

/* ------------------------------------------------------------------ */
/*  Tag colour palette (cycles through)                                */
/* ------------------------------------------------------------------ */

const tagColors = [
  'bg-indigo-500/10 text-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300',
  'bg-purple-500/10 text-purple-400 dark:bg-purple-500/10 dark:text-purple-300',
  'bg-cyan-500/10 text-cyan-400 dark:bg-cyan-500/10 dark:text-cyan-300',
  'bg-pink-500/10 text-pink-400 dark:bg-pink-500/10 dark:text-pink-300',
  'bg-emerald-500/10 text-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300',
  'bg-amber-500/10 text-amber-400 dark:bg-amber-500/10 dark:text-amber-300',
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProjectCard({
  title,
  subtitle,
  description,
  tags,
  link,
  image,
  status,
  index,
}: ProjectCardProps) {
  const { t, locale } = useTranslation()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  /* 3‑D tilt on hover ‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑ */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5 // –0.5 … 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: y * -10, y: x * 10 }) // max ≈ 5 deg (half of 10)
    },
    [],
  )

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), [])

  const { Icon, color: badgeColor } = statusConfig[status]
  const badgeLabel =
    locale === 'en' ? statusConfig[status].labelEn : statusConfig[status].label

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 800,
      }}
      className="group"
    >
      <div
        className="
          h-full rounded-2xl overflow-hidden border
          bg-white/70 dark:bg-white/[0.05]
          border-black/[0.08] dark:border-white/[0.08]
          backdrop-blur-xl
          shadow-sm hover:shadow-lg dark:shadow-none
          transition-all duration-300
          hover:-translate-y-1
        "
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* ── Banner image / gradient placeholder ──────────────── */}
        <div className="relative h-40 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 dark:from-indigo-500/30 dark:via-purple-500/30 dark:to-cyan-500/30 flex items-center justify-center">
              <span className="text-4xl font-bold font-heading text-indigo-400/40 dark:text-indigo-300/30 select-none">
                {title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Status badge */}
          <span
            className={`absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-md ${badgeColor}`}
          >
            <Icon className="w-3 h-3" />
            {badgeLabel}
          </span>
        </div>

        {/* ── Content ──────────────────────────────────────────── */}
        <div className="p-5 flex flex-col gap-3">
          {/* Title + subtitle */}
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[i % tagColors.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View Source button */}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-2 inline-flex items-center gap-1.5 text-sm font-medium
                text-indigo-500 dark:text-indigo-400
                hover:text-indigo-600 dark:hover:text-indigo-300
                transition-colors
              "
            >
              <ExternalLink className="w-4 h-4" />
              {t('projects.view_source')}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
