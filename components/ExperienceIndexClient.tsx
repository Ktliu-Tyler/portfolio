'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Filter, Image as ImageIcon, ShieldCheck } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import {
  categoryLabels,
  categoryOrder,
  experienceEntries,
  getEntryCoverImage,
  getEntryDisplayImages,
  localized,
  type ExperienceCategory,
} from '@/lib/experience'
import { useTranslation } from '@/lib/i18n'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function ExperienceIndexClient() {
  const { locale, t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory | 'all'>('all')

  const filteredEntries = useMemo(() => {
    if (activeCategory === 'all') {
      return experienceEntries
    }

    return experienceEntries.filter((entry) => entry.category === activeCategory)
  }, [activeCategory])

  const featured = experienceEntries.filter((entry) => entry.featured).slice(0, 5)
  const mediaCount = experienceEntries.reduce(
    (total, entry) => total + getEntryDisplayImages(entry).length,
    0,
  )

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
        <AnimatedSection direction="up">
          <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Experience records
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            {t('experience.title')}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            {t('experience.subtitle')}
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.1}>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              {
                icon: <CalendarDays className="h-4 w-4" />,
                value: `${experienceEntries.length}`,
                label: t('experience.stats.records'),
              },
              {
                icon: <ImageIcon className="h-4 w-4" />,
                value: `${mediaCount}`,
                label: t('experience.stats.media'),
              },
              {
                icon: <ShieldCheck className="h-4 w-4" />,
                value: t('experience.stats.redacted_value'),
                label: t('experience.stats.redacted'),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="marker-card rounded-lg border border-slate-200 bg-white/70 p-5 dark:border-white/[0.08] dark:bg-white/[0.035]"
              >
                <span className="marker-icon-box inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 dark:border-white/[0.08]">
                  {item.icon}
                </span>
                <p className="mt-5 font-mono text-3xl text-slate-950 dark:text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-16 dark:border-white/[0.08] sm:px-6">
        <div className="mb-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
          <div>
            <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Featured
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {t('experience.featured_title')}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((entry) => {
              const image = getEntryCoverImage(entry)

              return (
                <Link
                  key={entry.slug}
                  href={`/experience/${entry.slug}`}
                  className="marker-card group grid gap-4 rounded-lg border border-slate-200 bg-white/70 p-4 transition-colors hover:border-[var(--marker-accent-line)] dark:border-white/[0.08] dark:bg-white/[0.035]"
                >
                  {image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <Image
                        src={image.src}
                        alt={localized(image.alt, locale)}
                        fill
                        className="object-cover"
                        style={{ objectPosition: image.position ?? 'center' }}
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {localized(categoryLabels[entry.category], locale)} / {entry.period}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-tight text-slate-950 dark:text-white">
                      {localized(entry.title, locale)}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {localized(entry.summary, locale)}
                    </p>
                    <span className="marker-link mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
                      {t('experience.view_record')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-16 dark:border-white/[0.08] sm:px-6 sm:pb-24">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Records
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {t('experience.archive_title')}
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="hidden h-4 w-4 text-slate-400 md:block" />
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'marker-filter-active'
                  : 'marker-filter-idle border-slate-200 text-slate-600 dark:border-white/[0.08] dark:text-slate-300'
              }`}
            >
              {t('experience.filter_all')}
            </button>
            {categoryOrder.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'marker-filter-active'
                    : 'marker-filter-idle border-slate-200 text-slate-600 dark:border-white/[0.08] dark:text-slate-300'
                }`}
              >
                {localized(categoryLabels[category], locale)}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {filteredEntries.map((entry) => {
            const image = getEntryCoverImage(entry)

            return (
              <motion.article
                key={entry.slug}
                variants={itemVariants}
                className={`marker-card grid gap-5 rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.035] ${
                  image ? 'md:grid-cols-[12rem_1fr]' : ''
                }`}
              >
                {image && (
                  <Link
                    href={`/experience/${entry.slug}`}
                    className="relative aspect-[16/10] overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] md:aspect-square"
                  >
                    <Image
                      src={image.src}
                      alt={localized(image.alt, locale)}
                      fill
                      className="object-cover"
                      style={{ objectPosition: image.position ?? 'center' }}
                    />
                  </Link>
                )}

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="marker-chip rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                      {localized(categoryLabels[entry.category], locale)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{entry.period}</span>
                  </div>

                  <h3 className="text-xl font-medium tracking-tight text-slate-950 dark:text-white">
                    <Link href={`/experience/${entry.slug}`}>{localized(entry.title, locale)}</Link>
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {localized(entry.role, locale)}
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {localized(entry.summary, locale)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="marker-chip rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/experience/${entry.slug}`}
                    className="marker-link mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
                  >
                    {t('experience.view_record')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </section>
    </main>
  )
}
