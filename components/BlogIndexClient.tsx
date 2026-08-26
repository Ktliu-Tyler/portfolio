'use client'

import type { ArticleSummary } from '@/lib/articles'
import { useTranslation } from '@/lib/i18n'
import type { PublisherCategory } from '@/lib/publisher'
import { publisherCategoryLabels } from '@/lib/publisher'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

function displayCategory(category?: string) {
  if (!category) {
    return ''
  }

  return publisherCategoryLabels[category as PublisherCategory] ?? category
}

export default function BlogIndexClient({ articles }: { articles: ArticleSummary[] }) {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <AnimatedSection direction="up">
          <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Notes
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            {t('blog.title')}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            {t('blog.subtitle')}
          </p>
        </AnimatedSection>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div
          className="marker-section border-t border-slate-200 dark:border-white/[0.08]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {articles.map((article) => (
            <motion.div key={article.slug} variants={itemVariants}>
              <Link
                href={`/blog/${article.slug}`}
                className="marker-list-row group grid gap-5 border-b border-slate-200 py-7 transition-colors hover:bg-slate-100/50 dark:border-white/[0.08] dark:hover:bg-white/[0.025] md:grid-cols-[12rem_1fr]"
              >
                <div className="marker-card relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] md:aspect-[4/3]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    style={{ objectPosition: article.imagePosition ?? 'center' }}
                  />
                </div>

                <div className="flex min-w-0 flex-col">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {article.category && (
                      <span className="marker-year-label font-medium text-slate-700 dark:text-slate-300">
                        {displayCategory(article.category)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {article.readTime} {t('blog.min_read')}
                    </span>
                  </div>

                  <h2 className="max-w-3xl text-2xl font-medium tracking-tight text-slate-950 transition-colors group-hover:text-slate-700 dark:text-white dark:group-hover:text-slate-300">
                    {article.title}
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {article.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="marker-chip rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="marker-link mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900 underline underline-offset-4 dark:text-white">
                    {t('blog.read_more')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
