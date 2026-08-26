'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import Image from 'next/image'
import { Github, ExternalLink, Lock, GitFork, ArrowUpRight } from 'lucide-react'

interface Project {
  key: string
  link: string
  image: string | null
  imagePosition?: string
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
      { key: 'make_ntu', link: 'https://github.com/Ktliu-Tyler/MakeNTU_NXP_AVNET', image: '/images/experience/makentu-booth-jarvis.jpg', imagePosition: '48% 56%', status: 'public' as const },
      { key: 'can', link: 'https://github.com/Ktliu-Tyler/CANdecoder', image: '/images/experience/ntu-racing-sunset-car.jpg', imagePosition: '64% 82%', status: 'public' as const },
      { key: 'gps_nturt', link: 'https://github.com/Ktliu-Tyler/GPS_nturt', image: '/images/experience/ntu-racing-rtk-gps.jpg', status: 'public' as const },
      { key: 'remote_monitor', link: 'https://github.com/Ktliu-Tyler/nturacing_remote_monitor', image: '/images/experience/ntu-racing-dashboard.jpg', status: 'public' as const },
    ],
  },
  {
    yearKey: 'y2025',
    projects: [
      { key: 'rpi_can', link: 'https://github.com/Ktliu-Tyler/rpi_can_monitor', image: '/images/experience/ntu-racing-dashboard.jpg', status: 'public' as const },
      { key: 'gps_tracker', link: 'https://github.com/Ktliu-Tyler/GPS_tracker', image: '/images/embedded.png', status: 'public' as const },
      { key: 'hospital', link: 'https://github.com/Ktliu-Tyler/HospitalBED_transportation-system', image: null, status: 'public' as const },
      { key: 'iot_ctrl', link: 'https://github.com/Ktliu-Tyler/IOT_controller', image: '/images/experience/bouteleur-ui.jpg', status: 'public' as const },
    ],
  },
  {
    yearKey: 'y2024',
    projects: [
      { key: 'sdl', link: 'https://github.com/Ktliu-Tyler/SDL_env_clion', image: null, status: 'public' as const },
      { key: 'goblin', link: 'https://github.com/Ktliu-Tyler/GOBLIN_GAME', image: '/images/experience/goblin-menu.jpg', status: 'public' as const },
      { key: 'ir_iot', link: 'https://github.com/Ktliu-Tyler/IRremote_ESP32886_IOT', image: '/images/experience/bouteleur-device.jpg', status: 'public' as const },
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

function StatusIcon({ status }: { status: Project['status'] }) {
  if (status === 'private') return <Lock className="h-3.5 w-3.5" />
  if (status === 'contribution') return <GitFork className="h-3.5 w-3.5" />
  return null
}

function StatusBadge({ status, t }: { status: Project['status']; t: (key: string) => string }) {
  const map = {
    public: {
      label: 'Public',
    },
    private: {
      label: t('projects.private_repo'),
    },
    contribution: {
      label: t('projects.contribution'),
    },
  }

  const cfg = map[status]
  return (
    <span className="marker-chip inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
      <StatusIcon status={status} />
      {cfg.label}
    </span>
  )
}

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [activeYear, setActiveYear] = useState<string | null>(null)

  const allYearKeys = projectsByYear.map((s) => s.yearKey)
  const filteredSections = activeYear
    ? projectsByYear.filter((s) => s.yearKey === activeYear)
    : projectsByYear

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <AnimatedSection direction="up">
          <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Selected work
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            {t('projects.title')}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            {t('projects.subtitle')}
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.12}>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveYear(null)}
              className={`
                flex-shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
                  activeYear === null
                    ? 'marker-filter-active'
                    : 'marker-filter-idle border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-950 dark:border-white/[0.08] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white'
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
                  flex-shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${
                    activeYear === yk
                      ? 'marker-filter-active'
                      : 'marker-filter-idle border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-950 dark:border-white/[0.08] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white'
                  }
                `}
              >
                {t(`projects.year_sections.${yk}.year`)}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear ?? 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-16"
          >
            {filteredSections.map((section) => (
              <section
                key={section.yearKey}
                className="marker-section grid gap-7 border-t border-slate-200 pt-8 dark:border-white/[0.08] lg:grid-cols-[14rem_1fr]"
              >
                <AnimatedSection direction="up">
                  <div className="lg:sticky lg:top-24">
                    <p className="marker-year-label font-mono text-3xl text-slate-950 dark:text-white">
                      {t(`projects.year_sections.${section.yearKey}.year`)}
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t(`projects.year_sections.${section.yearKey}.label`)}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {t(`projects.year_sections.${section.yearKey}.description`)}
                    </p>
                  </div>
                </AnimatedSection>

                <motion.div
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                >
                  {section.projects.map((project) => {
                    const title = t(`projects.items.${project.key}.title`)
                    const subtitle = t(`projects.items.${project.key}.subtitle`)
                    const description = t(`projects.items.${project.key}.description`)
                    const tagsRaw = t(`projects.items.${project.key}.tags`)
                    const tags = tagsRaw !== `projects.items.${project.key}.tags` ? tagsRaw.split(',') : []

                    return (
                      <motion.article
                        key={project.key}
                        variants={cardVariants}
                        className={`marker-card grid gap-5 overflow-hidden rounded-lg border border-slate-200 bg-white/72 p-4 transition-colors hover:border-[var(--marker-accent-line)] dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:border-[var(--marker-accent-line)] ${
                          project.image ? 'md:grid-cols-[11rem_1fr]' : ''
                        }`}
                      >
                        {project.image && (
                          <div className="marker-card relative aspect-[16/10] overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] md:aspect-square">
                            <Image
                              src={project.image}
                              alt={title}
                              fill
                              className="object-cover"
                              style={{ objectPosition: project.imagePosition ?? 'center' }}
                            />
                          </div>
                        )}

                        <div className="flex min-w-0 flex-col">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <StatusBadge status={project.status} t={t} />
                            {tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="marker-chip rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>

                          <h2 className="text-xl font-medium tracking-tight text-slate-950 dark:text-white">
                            {title}
                          </h2>
                          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {subtitle}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {description}
                          </p>

                          <div className="mt-5">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="marker-link inline-flex items-center gap-2 text-sm font-medium text-slate-900 underline underline-offset-4 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300"
                            >
                              <Github className="h-4 w-4" />
                              {t('projects.view_source')}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </motion.div>
              </section>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatedSection direction="up" delay={0.2}>
          <div className="mt-20 border-t border-slate-200 pt-10 dark:border-white/[0.08]">
            <a
              href="https://github.com/Ktliu-Tyler"
              target="_blank"
              rel="noopener noreferrer"
              className="marker-button-primary inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {t('projects.view_all_github')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
