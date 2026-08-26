'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface BlogArticleLayoutProps {
  children: ReactNode
  title?: string
  date?: string
  readTime?: string
  tags?: string[]
  image?: string | null
  imagePosition?: string
  excerpt?: string
  sourceRepos?: Array<{
    name: string
    url: string
  }>
}

export default function BlogArticleLayout({
  children,
  title,
  date,
  readTime,
  tags,
  image,
  imagePosition,
  excerpt,
  sourceRepos,
}: BlogArticleLayoutProps) {
  const { t } = useTranslation()

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      <div className="mx-auto max-w-3xl px-4 pb-4 pt-24 sm:px-6">
        <Link
          href="/blog"
          className="marker-link inline-flex items-center gap-2 text-sm font-medium text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('blog.back')}
        </Link>
      </div>

      <header className="mx-auto max-w-3xl px-4 pb-8 pt-4 sm:px-6">
        {title && (
          <h1 className="text-4xl font-medium leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {title}
          </h1>
        )}

        <div className="editorial-rule mt-6" />

        {excerpt && (
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {excerpt}
          </p>
        )}

        {(date || readTime) && (
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {date}
              </span>
            )}
            {readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readTime} {t('blog.min_read')}
              </span>
            )}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="marker-chip rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {image && (
        <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <div className="marker-card relative h-60 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] sm:h-80 lg:h-[24rem]">
            <Image
              src={image}
              alt={title ?? 'Article banner'}
              fill
              className="object-cover"
              style={{ objectPosition: imagePosition ?? 'center' }}
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-10 px-4 pb-20 sm:px-6">
        {children}

        {sourceRepos && sourceRepos.length > 0 && (
          <section className="marker-section mt-12 border-t border-slate-200 pt-8 dark:border-white/[0.08]">
            <h2 className="editorial-kicker text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Repositories Referenced
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {sourceRepos.map((repo) => (
                <Link
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="marker-chip marker-button-secondary inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950 dark:border-white/[0.08] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
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
