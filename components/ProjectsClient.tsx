'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import Image from 'next/image'
import { Github, ExternalLink, Lock, GitFork, ArrowUpRight } from 'lucide-react'

import type { Project, YearSection } from '@/lib/contentTypes'

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

export default function ProjectsClient({ projectsByYear }: { projectsByYear: YearSection[] }) {
  const { t, locale } = useTranslation()
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
              aria-pressed={activeYear === null}
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
                aria-pressed={activeYear === yk}
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
                    const title = project.labels[locale].title
                    const subtitle = project.labels[locale].subtitle
                    const description = project.labels[locale].description
                    const tagsRaw = project.labels[locale].tags
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
