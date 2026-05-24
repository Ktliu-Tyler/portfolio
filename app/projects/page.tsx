'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import GlassCard from '@/components/GlassCard'
import Image from 'next/image'
import { Github, ExternalLink, Lock, GitFork, ArrowUpRight } from 'lucide-react'

/* ─── Data ───────────────────────────────────────────────────────── */

interface Project {
  key: string
  link: string
  image: string | null
  status: 'public' | 'private' | 'contribution'
}

interface YearSection {
  yearKey: string
  projects: Project[]
}

const projectsByYear: YearSection[] = [
  {
    yearKey: 'y2026',
    projects: [
      { key: 'portfolio', link: 'https://github.com/Ktliu-Tyler/portfolio', image: null, status: 'public' as const },
      { key: 'stock', link: 'https://github.com/Ktliu-Tyler/Stock-Analysis-Taiwan', image: '/images/data.png', status: 'public' as const },
      { key: 'motor', link: 'https://github.com/Ktliu-Tyler/Simplexmotion-pymodbusRS485', image: '/images/embedded.png', status: 'public' as const },
      { key: 'make_ntu', link: 'https://github.com/Ktliu-Tyler/MakeNTU_NXP_AVNET', image: '/images/embedded.png', status: 'public' as const },
      { key: 'can', link: 'https://github.com/Ktliu-Tyler/CANdecoder', image: '/images/racing.png', status: 'public' as const },
      { key: 'gps_nturt', link: 'https://github.com/Ktliu-Tyler/GPS_nturt', image: null, status: 'public' as const },
      { key: 'remote_monitor', link: 'https://github.com/Ktliu-Tyler/nturacing_remote_monitor', image: '/images/racing.png', status: 'public' as const },
    ],
  },
  {
    yearKey: 'y2025',
    projects: [
      { key: 'rpi_can', link: 'https://github.com/Ktliu-Tyler/rpi_can_monitor', image: '/images/racing.png', status: 'public' as const },
      { key: 'gps_tracker', link: 'https://github.com/Ktliu-Tyler/GPS_tracker', image: '/images/embedded.png', status: 'public' as const },
      { key: 'hospital', link: 'https://github.com/Ktliu-Tyler/HospitalBED_transportation-system', image: null, status: 'public' as const },
      { key: 'iot_ctrl', link: 'https://github.com/Ktliu-Tyler/IOT_controller', image: '/images/iot.png', status: 'public' as const },
    ],
  },
  {
    yearKey: 'y2024',
    projects: [
      { key: 'sdl', link: 'https://github.com/Ktliu-Tyler/SDL_env_clion', image: null, status: 'public' as const },
      { key: 'goblin', link: 'https://github.com/Ktliu-Tyler/GOBLIN_GAME', image: '/images/game.png', status: 'public' as const },
      { key: 'ir_iot', link: 'https://github.com/Ktliu-Tyler/IRremote_ESP32886_IOT', image: '/images/iot.png', status: 'public' as const },
    ],
  },
  {
    yearKey: 'y2022',
    projects: [
      { key: 'bird', link: 'https://github.com/Ktliu-Tyler/bird_sound_recognized', image: null, status: 'public' as const },
      { key: 'model', link: 'https://github.com/Ktliu-Tyler/Model-Creater', image: null, status: 'public' as const },
      { key: 'music', link: 'https://github.com/Ktliu-Tyler/MusicPlayer', image: null, status: 'public' as const },
    ],
  },
  {
    yearKey: 'y2021',
    projects: [
      { key: 'pixy_car', link: 'https://github.com/Ktliu-Tyler/Pixy-Line-tracking-drifting-car', image: '/images/embedded.png', status: 'public' as const },
      { key: 'space_travel', link: 'https://github.com/Ktliu-Tyler/Space_travel', image: null, status: 'public' as const },
      { key: 'space_fighter', link: 'https://github.com/Ktliu-Tyler/Space-Fighter', image: '/images/game.png', status: 'public' as const },
      { key: 'laser', link: 'https://github.com/Ktliu-Tyler/LaserRecognition', image: null, status: 'public' as const },
    ],
  },
]

/* ─── Colour helpers for project card first-letter placeholder ──── */

const gradients = [
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-fuchsia-600',
]

function pickGradient(index: number) {
  return gradients[index % gradients.length]
}

/* ─── Variants ───────────────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/* ─── Status icon ────────────────────────────────────────────────── */

function StatusIcon({ status }: { status: Project['status'] }) {
  if (status === 'private') return <Lock className="w-3.5 h-3.5" />
  if (status === 'contribution') return <GitFork className="w-3.5 h-3.5" />
  return null
}

function StatusBadge({ status, t }: { status: Project['status']; t: (key: string) => string }) {
  const map = {
    public: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
      label: 'Public',
    },
    private: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
      label: t('projects.private_repo'),
    },
    contribution: {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30',
      label: t('projects.contribution'),
    },
  }

  const cfg = map[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg}`}>
      <StatusIcon status={status} />
      {cfg.label}
    </span>
  )
}

/* ─── Page ────────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [activeYear, setActiveYear] = useState<string | null>(null)

  const allYearKeys = projectsByYear.map((s) => s.yearKey)
  const filteredSections = activeYear
    ? projectsByYear.filter((s) => s.yearKey === activeYear)
    : projectsByYear

  return (
    <main className="min-h-screen">
      {/* ── Hero header ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <AnimatedSection direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              {t('projects.title')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            {t('projects.subtitle')}
          </p>
        </AnimatedSection>

        {/* ── Year filter pills ─────────────────────────────────── */}
        <AnimatedSection direction="up" delay={0.15}>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveYear(null)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300 border
                ${
                  activeYear === null
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/25'
                    : 'bg-white/5 dark:bg-white/5 bg-slate-100 text-slate-600 dark:text-slate-300 border-white/10 dark:border-white/10 border-slate-200 hover:border-indigo-500/40 hover:text-indigo-400'
                }
              `}
            >
              {t('projects.filter_all')}
            </button>
            {allYearKeys.map((yk) => (
              <button
                key={yk}
                onClick={() => setActiveYear(yk === activeYear ? null : yk)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-300 border
                  ${
                    activeYear === yk
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 dark:bg-white/5 bg-slate-100 text-slate-600 dark:text-slate-300 border-white/10 dark:border-white/10 border-slate-200 hover:border-indigo-500/40 hover:text-indigo-400'
                  }
                `}
              >
                {t(`projects.year_sections.${yk}.year`)}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="relative">
          {/* Vertical gradient line */}
          <div
            className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 hidden sm:block"
            style={{
              background: 'linear-gradient(to bottom, #6366f1, #8b5cf6, #06b6d4, #6366f1)',
            }}
          />

          {/* Glow on the line */}
          <div
            className="absolute left-3 sm:left-7 top-0 bottom-0 w-2 hidden sm:block blur-sm opacity-30"
            style={{
              background: 'linear-gradient(to bottom, #6366f1, #8b5cf6, #06b6d4, #6366f1)',
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeYear ?? 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredSections.map((section, sIdx) => (
                <div key={section.yearKey} className="relative mb-16 last:mb-0">
                  {/* ── Year node ──────────────────────────────── */}
                  <AnimatedSection direction="left" delay={sIdx * 0.1}>
                    <div className="flex items-center gap-4 mb-8 pl-0 sm:pl-16">
                      {/* Glowing dot on timeline */}
                      <div className="hidden sm:flex absolute left-2.5 sm:left-6 items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50" />
                        <div className="absolute w-8 h-8 rounded-full bg-indigo-500/20 animate-ping" />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-3xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {t(`projects.year_sections.${section.yearKey}.year`)}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/25">
                            {t(`projects.year_sections.${section.yearKey}.label`)}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                          {t(`projects.year_sections.${section.yearKey}.description`)}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* ── Project cards grid ─────────────────────── */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-0 sm:pl-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                  >
                    {section.projects.map((project, pIdx) => {
                      const title = t(`projects.items.${project.key}.title`)
                      const subtitle = t(`projects.items.${project.key}.subtitle`)
                      const description = t(`projects.items.${project.key}.description`)
                      const tagsRaw = t(`projects.items.${project.key}.tags`)
                      const tags = tagsRaw !== `projects.items.${project.key}.tags` ? tagsRaw.split(',') : []

                      return (
                        <motion.div key={project.key} variants={cardVariants}>
                          <GlassCard className="h-full group" hover>
                            {/* Image / Placeholder */}
                            {project.image ? (
                              <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                                <Image
                                  src={project.image}
                                  alt={title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {/* Status badge overlayed */}
                                <div className="absolute top-3 right-3">
                                  <StatusBadge status={project.status} t={t} />
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`relative aspect-video overflow-hidden rounded-t-2xl bg-gradient-to-br ${pickGradient(
                                  sIdx * 7 + pIdx
                                )} flex items-center justify-center`}
                              >
                                <span className="text-5xl sm:text-6xl font-heading font-bold text-white/30 select-none">
                                  {title.charAt(0).toUpperCase()}
                                </span>
                                {/* Grid pattern overlay */}
                                <div
                                  className="absolute inset-0 opacity-10"
                                  style={{
                                    backgroundImage:
                                      'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                  }}
                                />
                                {/* Status badge overlayed */}
                                <div className="absolute top-3 right-3">
                                  <StatusBadge status={project.status} t={t} />
                                </div>
                              </div>
                            )}

                            {/* Content */}
                            <div className="p-5 sm:p-6 flex flex-col flex-1">
                              <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-indigo-400 transition-colors duration-300">
                                {title}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                                {subtitle}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                                {description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5 mb-5">
                                {tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-0.5 rounded-full text-xs font-medium
                                      bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300
                                      border border-indigo-500/20 dark:border-indigo-500/25"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>

                              {/* Spacer */}
                              <div className="flex-1" />

                              {/* Action button */}
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                  inline-flex items-center gap-2 w-fit
                                  px-4 py-2 rounded-xl text-sm font-medium
                                  bg-white/5 dark:bg-white/5 bg-slate-100
                                  border border-white/10 dark:border-white/10 border-slate-200
                                  text-slate-700 dark:text-slate-300
                                  hover:bg-indigo-500/15 hover:text-indigo-400 hover:border-indigo-500/30
                                  transition-all duration-300 group/btn
                                "
                              >
                                <Github className="w-4 h-4" />
                                {t('projects.view_source')}
                                <ExternalLink className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                              </a>
                            </div>
                          </GlassCard>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── GitHub CTA ──────────────────────────────────────── */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
            <div
              className="
                relative rounded-3xl overflow-hidden
                bg-white/5 dark:bg-white/5 bg-white backdrop-blur-xl
                border border-white/10 dark:border-white/10 border-slate-200
                p-8 sm:p-12 text-center
              "
            >
              {/* Decorative grid */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(99,102,241,0.5) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/30">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                  {t('projects.view_all_github')}
                </h3>
                <a
                  href="https://github.com/Ktliu-Tyler"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2
                    px-8 py-3.5 rounded-2xl text-base font-semibold
                    bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                    shadow-lg shadow-indigo-500/30
                    hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105
                    transition-all duration-300
                  "
                >
                  GitHub
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
