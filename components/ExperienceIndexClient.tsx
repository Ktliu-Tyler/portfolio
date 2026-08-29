'use client'

import { useMemo, useState, type ComponentType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Filter,
  Image as ImageIcon,
  Search,
  ShieldCheck,
  Star,
  Tags,
  X,
} from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import {
  categoryLabels,
  categoryOrder,
  experienceEntries,
  getEntryCoverImage,
  getEntryDisplayImages,
  localized,
  type ExperienceCategory,
  type ExperienceEntry,
} from '@/lib/experience'
import { useTranslation } from '@/lib/i18n'
import type { Locale } from '@/lib/translations'

type QuickFilter = 'all' | 'featured' | 'media' | 'articles'
type SortMode = 'newest' | 'oldest' | 'media'

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

const quickFilters: Array<{
  value: QuickFilter
  labelKey: string
  icon: ComponentType<{ className?: string }>
}> = [
  { value: 'all', labelKey: 'experience.quick_all', icon: Filter },
  { value: 'featured', labelKey: 'experience.quick_featured', icon: Star },
  { value: 'media', labelKey: 'experience.quick_media', icon: ImageIcon },
  { value: 'articles', labelKey: 'experience.quick_articles', icon: FileText },
]

const sortModes: Array<{ value: SortMode; labelKey: string }> = [
  { value: 'newest', labelKey: 'experience.sort_newest' },
  { value: 'oldest', labelKey: 'experience.sort_oldest' },
  { value: 'media', labelKey: 'experience.sort_media' },
]

function getEntryYears(entry: ExperienceEntry): string[] {
  const years = (entry.year.match(/\d{4}/g) ?? []).map(Number)
  if (years.length === 0) return []

  const start = Math.min(...years)
  const end = Math.max(...years)

  return Array.from({ length: end - start + 1 }, (_, index) => `${start + index}`)
}

function getLatestYear(entry: ExperienceEntry) {
  const years = getEntryYears(entry).map(Number)
  return years.length > 0 ? Math.max(...years) : 0
}

function getEarliestYear(entry: ExperienceEntry) {
  const years = getEntryYears(entry).map(Number)
  return years.length > 0 ? Math.min(...years) : 0
}

function getSearchText(entry: ExperienceEntry, locale: Locale) {
  return [
    localized(entry.title, locale),
    localized(entry.role, locale),
    localized(entry.summary, locale),
    ...entry.story.map((item) => localized(item, locale)),
    ...entry.highlights.map((item) => localized(item, locale)),
    ...entry.skills,
    localized(categoryLabels[entry.category], locale),
    entry.type,
    entry.period,
    entry.year,
  ]
    .join(' ')
    .toLocaleLowerCase()
}

export default function ExperienceIndexClient() {
  const { locale, t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory | 'all'>('all')
  const [activeSkill, setActiveSkill] = useState<string | 'all'>('all')
  const [activeYear, setActiveYear] = useState<string | 'all'>('all')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [query, setQuery] = useState('')

  const availableYears = useMemo(() => {
    const years = experienceEntries.flatMap(getEntryYears)
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
  }, [])

  const skillCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const entry of experienceEntries) {
      for (const skill of entry.skills) {
        counts.set(skill, (counts.get(skill) ?? 0) + 1)
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 18)
  }, [])

  const normalizedQuery = query.trim().toLocaleLowerCase()

  const filteredEntries = useMemo(() => {
    return experienceEntries
      .filter((entry) => {
        const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
        const matchesSkill = activeSkill === 'all' || entry.skills.includes(activeSkill)
        const matchesYear = activeYear === 'all' || getEntryYears(entry).includes(activeYear)
        const matchesQuickFilter =
          quickFilter === 'all' ||
          (quickFilter === 'featured' && entry.featured) ||
          (quickFilter === 'media' && getEntryDisplayImages(entry).length > 0) ||
          (quickFilter === 'articles' && Boolean(entry.articleSlug))
        const matchesQuery =
          normalizedQuery.length === 0 || getSearchText(entry, locale).includes(normalizedQuery)

        return matchesCategory && matchesSkill && matchesYear && matchesQuickFilter && matchesQuery
      })
      .sort((a, b) => {
        if (sortMode === 'media') {
          const mediaDelta = getEntryDisplayImages(b).length - getEntryDisplayImages(a).length
          return mediaDelta || getLatestYear(b) - getLatestYear(a)
        }

        if (sortMode === 'oldest') {
          return getEarliestYear(a) - getEarliestYear(b)
        }

        return getLatestYear(b) - getLatestYear(a)
      })
  }, [activeCategory, activeSkill, activeYear, locale, normalizedQuery, quickFilter, sortMode])

  const totalMediaCount = experienceEntries.reduce(
    (total, entry) => total + getEntryDisplayImages(entry).length,
    0,
  )

  const visibleMediaCount = filteredEntries.reduce(
    (total, entry) => total + getEntryDisplayImages(entry).length,
    0,
  )

  const visibleSkillCount = new Set(filteredEntries.flatMap((entry) => entry.skills)).size
  const activeFilterCount = [
    activeCategory !== 'all',
    activeSkill !== 'all',
    activeYear !== 'all',
    quickFilter !== 'all',
    normalizedQuery.length > 0,
  ].filter(Boolean).length

  const categoryBreakdown = categoryOrder
    .map((category) => ({
      category,
      count: filteredEntries.filter((entry) => entry.category === category).length,
    }))
    .filter((item) => item.count > 0)

  const maxCategoryCount = Math.max(1, ...categoryBreakdown.map((item) => item.count))
  const featured = experienceEntries.filter((entry) => entry.featured).slice(0, 5)
  const spotlightEntry = filteredEntries.find((entry) => entry.featured) ?? filteredEntries[0]
  const spotlightImage = spotlightEntry ? getEntryCoverImage(spotlightEntry) : undefined

  const filterSummary = [
    normalizedQuery ? `${t('experience.path_query')}: "${query.trim()}"` : null,
    activeCategory !== 'all' ? localized(categoryLabels[activeCategory], locale) : null,
    activeSkill !== 'all' ? activeSkill : null,
    activeYear !== 'all' ? activeYear : null,
    quickFilter !== 'all' ? t(`experience.quick_${quickFilter}`) : null,
  ].filter((item): item is string => Boolean(item))

  const resetFilters = () => {
    setActiveCategory('all')
    setActiveSkill('all')
    setActiveYear('all')
    setQuickFilter('all')
    setSortMode('newest')
    setQuery('')
  }

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
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <CalendarDays className="h-4 w-4" />,
                value: `${experienceEntries.length}`,
                label: t('experience.stats.records'),
              },
              {
                icon: <ImageIcon className="h-4 w-4" />,
                value: `${totalMediaCount}`,
                label: t('experience.stats.media'),
              },
              {
                icon: <Tags className="h-4 w-4" />,
                value: `${categoryOrder.length}`,
                label: t('experience.stats.categories'),
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
        <div className="mb-8 max-w-3xl">
          <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {t('experience.explorer_kicker')}
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {t('experience.explorer_title')}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            {t('experience.explorer_subtitle')}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
          <div className="marker-card rounded-lg border border-slate-200 bg-white/72 p-5 dark:border-white/[0.08] dark:bg-white/[0.035]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('experience.search_placeholder')}
                className="h-11 w-full rounded-md border border-slate-200 bg-white/80 pl-10 pr-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--marker-accent)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={t('experience.clear_search')}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-6">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-slate-950 dark:text-white">
                    {t('experience.filters_category')}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activeFilterCount > 0
                      ? `${activeFilterCount} ${t('experience.active_filters')}`
                      : t('experience.active_filters_empty')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveCategory('all')}
                    aria-pressed={activeCategory === 'all'}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
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
                      aria-pressed={activeCategory === category}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
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

              <div>
                <h3 className="mb-3 text-sm font-medium text-slate-950 dark:text-white">
                  {t('experience.filters_skill')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveSkill('all')}
                    aria-pressed={activeSkill === 'all'}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      activeSkill === 'all'
                        ? 'marker-filter-active'
                        : 'marker-filter-idle border-slate-200 text-slate-600 dark:border-white/[0.08] dark:text-slate-300'
                    }`}
                  >
                    {t('experience.filter_all')}
                  </button>
                  {skillCounts.map(([skill, count]) => (
                    <button
                      key={skill}
                      onClick={() => setActiveSkill(activeSkill === skill ? 'all' : skill)}
                      aria-pressed={activeSkill === skill}
                      className={`max-w-full rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        activeSkill === skill
                          ? 'marker-filter-active'
                          : 'marker-filter-idle border-slate-200 text-slate-600 dark:border-white/[0.08] dark:text-slate-300'
                      }`}
                    >
                      <span className="inline-flex max-w-full items-center gap-2">
                        <span className="truncate">{skill}</span>
                        <span className="font-mono text-[11px] text-slate-400">{count}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-slate-950 dark:text-white">
                    {t('experience.filters_year')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveYear('all')}
                      aria-pressed={activeYear === 'all'}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        activeYear === 'all'
                          ? 'marker-filter-active'
                          : 'marker-filter-idle border-slate-200 text-slate-600 dark:border-white/[0.08] dark:text-slate-300'
                      }`}
                    >
                      {t('experience.filter_all')}
                    </button>
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => setActiveYear(activeYear === year ? 'all' : year)}
                        aria-pressed={activeYear === year}
                        className={`rounded-md border px-3 py-2 font-mono text-sm transition-colors ${
                          activeYear === year
                            ? 'marker-filter-active'
                            : 'marker-filter-idle border-slate-200 text-slate-600 dark:border-white/[0.08] dark:text-slate-300'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-slate-950 dark:text-white">
                    {t('experience.filters_evidence')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-2">
                    {quickFilters.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.value}
                          onClick={() => setQuickFilter(item.value)}
                          aria-pressed={quickFilter === item.value}
                          className={`flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            quickFilter === item.value
                              ? 'marker-filter-active'
                              : 'marker-filter-idle border-slate-200 text-slate-600 dark:border-white/[0.08] dark:text-slate-300'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{t(item.labelKey)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {t('experience.sort_label')}
                  </p>
                  <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08]">
                    {sortModes.map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setSortMode(mode.value)}
                        aria-pressed={sortMode === mode.value}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          sortMode === mode.value
                            ? 'bg-[var(--marker-accent-soft)] text-slate-950 dark:text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        {t(mode.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="marker-button-secondary inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors dark:border-white/[0.08] dark:text-slate-300"
                >
                  <X className="h-4 w-4" />
                  {t('experience.reset_filters')}
                </button>
              </div>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="marker-card rounded-lg border border-slate-200 bg-white/72 p-5 dark:border-white/[0.08] dark:bg-white/[0.035]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t('experience.path_title')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {filterSummary.length > 0 ? (
                  filterSummary.map((item) => (
                    <span
                      key={item}
                      className="marker-chip rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 dark:border-white/[0.08] dark:text-slate-300"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {t('experience.path_default')}
                  </span>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { value: filteredEntries.length, label: t('experience.visible_records') },
                  { value: visibleMediaCount, label: t('experience.matching_media') },
                  { value: visibleSkillCount, label: t('experience.matching_skills') },
                ].map((item) => (
                  <div key={item.label} className="border-l border-[var(--marker-accent-line)] pl-3">
                    <p className="font-mono text-2xl text-slate-950 dark:text-white">{item.value}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="marker-card rounded-lg border border-slate-200 bg-white/72 p-5 dark:border-white/[0.08] dark:bg-white/[0.035]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t('experience.spotlight_title')}
              </p>
              {spotlightEntry ? (
                <Link href={`/experience/${spotlightEntry.slug}`} className="group mt-4 block">
                  {spotlightImage && (
                    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <Image
                        src={spotlightImage.src}
                        alt={localized(spotlightImage.alt, locale)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ objectPosition: spotlightImage.position ?? 'center' }}
                      />
                    </div>
                  )}
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {localized(categoryLabels[spotlightEntry.category], locale)} / {spotlightEntry.period}
                  </p>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-slate-950 dark:text-white">
                    {localized(spotlightEntry.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {localized(spotlightEntry.summary, locale)}
                  </p>
                  <span className="marker-link mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
                    {t('experience.view_record')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {t('experience.spotlight_empty')}
                </p>
              )}
            </div>

            {categoryBreakdown.length > 0 && (
              <div className="marker-card rounded-lg border border-slate-200 bg-white/72 p-5 dark:border-white/[0.08] dark:bg-white/[0.035]">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {t('experience.category_mix')}
                </p>
                <div className="mt-4 space-y-4">
                  {categoryBreakdown.map((item) => (
                    <button
                      key={item.category}
                      onClick={() => setActiveCategory(item.category)}
                      className="block w-full text-left"
                    >
                      <span className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {localized(categoryLabels[item.category], locale)}
                        </span>
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                          {item.count}
                        </span>
                      </span>
                      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
                        <span
                          className="block h-full rounded-full bg-[var(--marker-accent)]"
                          style={{ width: `${Math.max(12, (item.count / maxCategoryCount) * 100)}%` }}
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
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

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('experience.results_count').replace('{count}', `${filteredEntries.length}`)}
          </p>
        </div>

        {filteredEntries.length > 0 ? (
          <motion.div
            key={`${activeCategory}-${activeSkill}-${activeYear}-${quickFilter}-${sortMode}-${query}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            {filteredEntries.map((entry) => {
              const image = getEntryCoverImage(entry)
              const hasMedia = getEntryDisplayImages(entry).length > 0

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
                      {entry.featured && (
                        <span className="marker-chip inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                          <Star className="h-3 w-3" />
                          {t('experience.featured_badge')}
                        </span>
                      )}
                      {hasMedia && (
                        <span className="marker-chip inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                          <ImageIcon className="h-3 w-3" />
                          {t('experience.has_media')}
                        </span>
                      )}
                      {entry.articleSlug && (
                        <span className="marker-chip inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                          <FileText className="h-3 w-3" />
                          {t('experience.has_article')}
                        </span>
                      )}
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
                      {entry.skills.slice(0, 6).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setActiveSkill(skill)}
                          className="marker-chip rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 transition-colors hover:border-[var(--marker-accent)] hover:text-[var(--marker-accent)] dark:border-white/[0.08] dark:text-slate-400"
                        >
                          {skill}
                        </button>
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
        ) : (
          <div className="marker-card rounded-lg border border-slate-200 bg-white/70 p-8 text-center dark:border-white/[0.08] dark:bg-white/[0.035]">
            <p className="text-xl font-medium text-slate-950 dark:text-white">
              {t('experience.no_results')}
            </p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500 dark:text-slate-400">
              {t('experience.no_results_hint')}
            </p>
            <button
              onClick={resetFilters}
              className="marker-button-primary mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
              {t('experience.reset_filters')}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
