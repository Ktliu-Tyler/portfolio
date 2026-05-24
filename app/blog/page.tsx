'use client'

import { articleSummaries } from '@/lib/articles'
import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function BlogPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <AnimatedSection direction="up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              {t('blog.title')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            {t('blog.subtitle')}
          </p>
        </AnimatedSection>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {articleSummaries.map((article) => (
            <motion.div key={article.slug} variants={cardVariants}>
              <Link href={`/blog/${article.slug}`} className="block h-full group">
                <div
                  className="
                    h-full flex flex-col rounded-2xl overflow-hidden
                    bg-white dark:bg-white/[0.05] backdrop-blur-xl
                    border border-slate-200 dark:border-white/10
                    transition-all duration-300
                    hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20
                    hover:border-indigo-500/30 group-hover:-translate-y-1
                  "
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/45 backdrop-blur-sm text-white border border-white/10">
                        <Clock className="w-3 h-3" />
                        {article.readTime} {t('blog.min_read')}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="
                            px-2.5 py-0.5 rounded-full text-xs font-medium
                            bg-indigo-50 text-indigo-700 border border-indigo-200
                            dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/25
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex-1" />

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/70 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 dark:text-indigo-400 group-hover:gap-2 transition-all duration-300">
                        {t('blog.read_more')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
