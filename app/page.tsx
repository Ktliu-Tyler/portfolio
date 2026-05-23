'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-bold">
              Hi, I'm <span className="text-blue-600">Tyler</span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
              開發者 • 創造者 • 終身學習者
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              熱愛探索新技術，喜歡將想法轉化為現實。在這裡你可以找到我的作品、文章和學習心得。
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 pt-4">
            <Link
              href="/projects"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              查看作品集
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition font-medium"
            >
              閱讀文章
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[{ number: '3+', label: '個主要專案' }, { number: '100+', label: '小時編碼' }, { number: '∞', label: '學習熱情' }].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="text-center p-6 rounded-lg bg-slate-50 dark:bg-slate-900"
            >
              <div className="text-4xl font-bold text-blue-600">{stat.number}</div>
              <div className="text-slate-600 dark:text-slate-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold">想要了解更多？</h2>
          <p className="text-slate-600 dark:text-slate-400">
            查看我的作品和文章，或者通過社交媒體聯繫我。
          </p>
        </motion.div>
      </section>
    </main>
  )
}
