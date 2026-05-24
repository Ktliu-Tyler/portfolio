'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BlogArticleLayoutProps {
  children: ReactNode
  title?: string
  date?: string
  readTime?: string
  tags?: string[]
  image?: string | null
  sourceRepos?: Array<{
    name: string
    url: string
  }>
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BlogArticleLayout({
  children,
  title,
  date,
  readTime,
  tags,
  image,
  sourceRepos,
}: BlogArticleLayoutProps) {
  const { t } = useTranslation()

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {/* ── Back link ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-4">
        <Link
          href="/blog"
          className="
            inline-flex items-center gap-1.5 text-sm font-medium
            text-slate-500 dark:text-slate-400
            hover:text-indigo-500 dark:hover:text-indigo-400
            transition-colors
          "
        >
          <ArrowLeft className="w-4 h-4" />
          {t('blog.back')}
        </Link>
      </div>

      {/* ── Banner image ───────────────────────────────────────── */}
      {image && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] relative h-64 sm:h-80">
            <Image
              src={image}
              alt={title ?? 'Article banner'}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="max-w-3xl mx-auto px-4 mb-10">
        {title && (
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
        )}

        {/* Meta row */}
        {(date || readTime) && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {date}
              </span>
            )}
            {readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime} {t('blog.min_read')}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="
                  text-xs font-medium px-2.5 py-1 rounded-full
                  bg-indigo-500/10 text-indigo-500 dark:text-indigo-400
                  border border-indigo-500/15
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" />
      </header>

      {/* ── Article body (prose) ────────────────────────────────── */}
      <div
        className="
          max-w-3xl mx-auto px-4 pb-20
          prose prose-slate dark:prose-invert
          prose-headings:font-heading prose-headings:font-bold
          prose-a:text-indigo-500 dark:prose-a:text-indigo-400
          prose-code:font-mono prose-code:text-sm
          prose-code:bg-slate-100 dark:prose-code:bg-white/[0.06]
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-900 dark:prose-pre:bg-white/[0.04]
          prose-pre:border prose-pre:border-black/[0.08] dark:prose-pre:border-white/[0.08]
          prose-img:rounded-xl
        "
        style={{ maxWidth: '720px' }}
      >
        {children}

        {sourceRepos && sourceRepos.length > 0 && (
          <section className="not-prose mt-12 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Repositories Referenced
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {sourceRepos.map((repo) => (
                <Link
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                >
                  {repo.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.article>
  )
}
