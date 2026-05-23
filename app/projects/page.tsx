'use client'

import { motion } from 'framer-motion'

const projects = [
  {
    title: 'CANdecoder',
    description: '用於解碼 CAN 協議並將數據輸出為 CSV 的工具',
    tags: ['Python', 'CAN', '工具'],
    link: 'https://github.com/Ktliu-Tyler/CANdecoder',
    updated: 'Mar 25, 2026',
  },
  {
    title: 'ESPBOT',
    description: 'ESP 機器人項目，探索嵌入式系統開發',
    tags: ['ESP32', '嵌入式', '機器人'],
    link: 'https://github.com/Ktliu-Tyler/ESPBOT',
    updated: 'Feb 24, 2026',
  },
]

export default function Projects() {
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
        <h1 className="text-4xl font-bold mb-4">作品集</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          這些是我最近的一些項目和學習成果
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project, index) => (
          <motion.a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            className="p-6 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-lg dark:hover:shadow-2xl transition-all hover:border-blue-600 dark:hover:border-blue-500 group"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-bold group-hover:text-blue-600 transition">
                {project.title}
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {project.updated}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full text-sm text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 p-8 bg-blue-50 dark:bg-blue-950 rounded-lg text-center"
      >
        <h3 className="text-2xl font-bold mb-2">更多項目</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          訪問我的 GitHub 查看所有項目和貢獻
        </p>
        <a
          href="https://github.com/Ktliu-Tyler"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          前往 GitHub →
        </a>
      </motion.div>
    </main>
  )
}
