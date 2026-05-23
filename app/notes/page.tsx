'use client'

import { motion } from 'framer-motion'

export default function Notes() {
  const notes = [
    {
      title: '2026 年學習計劃',
      category: '個人',
      date: '2026-05-24',
      content: '今年的學習目標包括深入學習 Next.js、WebAssembly 和雲計算。',
    },
  ]

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
        <h1 className="text-4xl font-bold mb-4">個人紀錄</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          心得筆記、學習記錄和個人反思
        </p>
      </motion.div>

      {notes.length > 0 ? (
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {notes.map((note, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 border-l-4 border-blue-600 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">{note.title}</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {note.date}
                </span>
              </div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full text-sm">
                  {note.category}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{note.content}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-lg text-slate-600 dark:text-slate-400">
            紀錄即將推出...
          </p>
        </motion.div>
      )}
    </main>
  )
}
