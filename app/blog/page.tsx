'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const articles = [
  {
    slug: 'getting-started-with-nextjs',
    title: 'Next.js 入門指南',
    excerpt: '了解如何使用 Next.js 構建現代 React 應用',
    date: '2026-05-24',
    readTime: '5 分鐘',
    tags: ['Next.js', 'React', '教程'],
  },
]

export default function Blog() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">部落格</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          技術文章、心得分享和學習筆記
        </p>
      </motion.div>

      {articles.length > 0 ? (
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {articles.map((article) => (
            <motion.article
              key={article.slug}
              variants={itemVariants}
              className="p-6 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-lg dark:hover:shadow-2xl transition-all hover:border-blue-600 dark:hover:border-blue-500 group"
            >
              <Link href={`/blog/${article.slug}`}>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition cursor-pointer">
                  {article.title}
                </h2>
              </Link>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {article.excerpt}
              </p>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full text-sm text-slate-600 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {article.date} • {article.readTime}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-lg text-slate-600 dark:text-slate-400">
            文章即將推出...
          </p>
        </motion.div>
      )}
    </main>
  )
}
