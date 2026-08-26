'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  ShieldCheck,
  Tags,
} from 'lucide-react'
import {
  categoryLabels,
  experienceEntries,
  getEntryDisplayImages,
  localized,
  type ExperienceEntry,
} from '@/lib/experience'
import { useTranslation } from '@/lib/i18n'

export default function ExperienceDetailClient({ entry }: { entry: ExperienceEntry }) {
  const { locale, t } = useTranslation()
  const gallery = getEntryDisplayImages(entry)
  const heroImage = gallery[0]
  const related = experienceEntries
    .filter((candidate) => candidate.slug !== entry.slug && candidate.category === entry.category)
    .slice(0, 3)

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-24 sm:px-6">
        <Link
          href="/experience"
          className="marker-link inline-flex items-center gap-2 text-sm font-medium text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('experience.back')}
        </Link>
      </div>

      <header className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:items-end">
        <div>
          <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {localized(categoryLabels[entry.category], locale)} / {entry.year}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            {localized(entry.title, locale)}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {localized(entry.summary, locale)}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="marker-card rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.035]">
              <CalendarDays className="marker-icon-box h-4 w-4" />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t('experience.period')}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-950 dark:text-white">
                {entry.period}
              </p>
            </div>
            <div className="marker-card rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.035]">
              <Tags className="marker-icon-box h-4 w-4" />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t('experience.role')}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-950 dark:text-white">
                {localized(entry.role, locale)}
              </p>
            </div>
          </div>
        </div>

        {heroImage && (
          <div className="marker-card relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <Image
              src={heroImage.src}
              alt={localized(heroImage.alt, locale)}
              fill
              className="object-cover"
              style={{ objectPosition: heroImage.position ?? 'center' }}
              priority
            />
          </div>
        )}
      </header>

      <section className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-14 dark:border-white/[0.08] sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          <div>
            <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Story
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-950 dark:text-white">
              {t('experience.detail_story')}
            </h2>
          </div>
          <div className="space-y-5">
            {entry.story.map((paragraph) => (
              <p
                key={localized(paragraph, locale)}
                className="text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg"
              >
                {localized(paragraph, locale)}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-14 dark:border-white/[0.08] sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          <div>
            <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Outcomes
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-950 dark:text-white">
              {t('experience.detail_highlights')}
            </h2>
          </div>
          <div>
            <ul className="space-y-3">
              {entry.highlights.map((highlight) => (
                <li
                  key={localized(highlight, locale)}
                  className="marker-list-item flex gap-3 border-l border-slate-200 pl-4 text-base leading-8 text-slate-700 dark:border-white/[0.12] dark:text-slate-300"
                >
                  <span className="marker-bullet mt-3 h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span>{localized(highlight, locale)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              {entry.skills.map((skill) => (
                <span
                  key={skill}
                  className="marker-chip rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-14 dark:border-white/[0.08] sm:px-6">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Records
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-950 dark:text-white">
                {t('experience.detail_gallery')}
              </h2>
            </div>
            {entry.privacyNote && (
              <p className="inline-flex max-w-md items-center gap-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--marker-accent)]" />
                {localized(entry.privacyNote, locale)}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {gallery.map((image) => (
              <figure key={`${image.src}-${localized(image.caption, locale)}`} className="space-y-3">
                <div className="marker-card relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <Image
                    src={image.src}
                    alt={localized(image.alt, locale)}
                    fill
                    className="object-cover"
                    style={{ objectPosition: image.position ?? 'center' }}
                  />
                </div>
                <figcaption className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {localized(image.caption, locale)}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {(entry.links || entry.articleSlug || related.length > 0) && (
        <section className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-14 dark:border-white/[0.08] sm:px-6 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            <div>
              <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Next
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-950 dark:text-white">
                {t('experience.detail_links')}
              </h2>
            </div>
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                {entry.articleSlug && (
                  <Link
                    href={`/blog/${entry.articleSlug}`}
                    className="marker-button-primary inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-slate-950"
                  >
                    {t('experience.read_article')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {entry.links?.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="marker-button-secondary inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-white/[0.08] dark:text-slate-300"
                  >
                    {localized(link.label, locale)}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                ))}
              </div>

              {related.length > 0 && (
                <div className="grid gap-3 md:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/experience/${item.slug}`}
                      className="marker-card rounded-lg border border-slate-200 bg-white/70 p-4 transition-colors hover:border-[var(--marker-accent-line)] dark:border-white/[0.08] dark:bg-white/[0.035]"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.period}</p>
                      <h3 className="mt-2 text-sm font-medium leading-6 text-slate-950 dark:text-white">
                        {localized(item.title, locale)}
                      </h3>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </motion.main>
  )
}
