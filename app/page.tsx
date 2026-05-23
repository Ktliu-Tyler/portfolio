'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code2, Zap, Lightbulb, Github, Mail, Linkedin, Twitter } from 'lucide-react'
import dynamic from 'next/dynamic'

const ThreeDBackground = dynamic(() => import('@/components/ThreeDBackground'), {
  ssr: false,
})

const skills = [
  { icon: Code2, label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { icon: Zap, label: 'Backend', items: ['Python', 'Node.js', 'C++', 'CAD'] },
  { icon: Lightbulb, label: 'Tools', items: ['Git', 'Docker', 'Vercel', 'VS Code'] },
]

const socialLinks = [
  { icon: Github, href: 'https://github.com/Ktliu-Tyler', label: 'GitHub' },
  { icon: Mail, href: 'mailto:your.email@example.com', label: 'Email' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* 3D Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-30">
          <ThreeDBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Hi, I&apos;m <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tyler</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants}>
              <p className="text-2xl md:text-3xl text-slate-700 dark:text-slate-300 font-semibold">
                Full-Stack Developer & Problem Solver
              </p>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                我是台灣大學機械工程系學生，專注於軟體開發和創新解決方案。
                熱愛探索新技術，在硬體、軟體和 AI 領域都有實踐經驗。
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/projects"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-semibold"
              >
                查看作品集
              </Link>
              <Link
                href="/blog"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition font-semibold"
              >
                閱讀文章
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 transition transform hover:scale-110"
                  title={social.label}
                >
                  <social.icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-slate-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">技能與專長</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            多年的學習和實踐經驗
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-8 rounded-2xl bg-white dark:bg-slate-800 hover:shadow-xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700"
            >
              <skill.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">{skill.label}</h3>
              <ul className="space-y-2">
                {skill.items.map((item, j) => (
                  <li key={j} className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          className="grid md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { number: '3+', label: '個主要專案', color: 'from-blue-500 to-blue-600' },
            { number: '500+', label: '小時編碼', color: 'from-purple-500 to-purple-600' },
            { number: '10+', label: '個技術棧', color: 'from-pink-500 to-pink-600' },
            { number: '∞', label: '學習熱情', color: 'from-orange-500 to-orange-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`p-6 rounded-xl bg-gradient-to-br ${stat.color} text-white text-center hover:shadow-lg transition`}
            >
              <div className="text-4xl font-bold">{stat.number}</div>
              <div className="mt-2 text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Projects Preview */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">精選專案</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            最近完成的一些有趣項目
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              title: 'CANdecoder',
              description: 'CAN 協議解碼工具，支援 DBC 文件轉換',
              tags: ['Python', 'CAN'],
              image: '🔧',
            },
            {
              title: 'ESPBOT',
              description: '嵌入式機器人項目，探索 IoT 開發',
              tags: ['ESP32', '機器人'],
              image: '🤖',
            },
          ].map((project, i) => (
            <Link
              key={i}
              href="/projects"
              className="p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 transition-all group cursor-pointer hover:shadow-lg"
            >
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{project.image}</div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition">{project.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
                <div className="flex gap-2">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            查看所有專案 →
          </Link>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">準備好合作了嗎？</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            無論你有想法還是專案，歡迎聯絡我一起創造有趣的東西。
          </p>
          <a
            href="mailto:your.email@example.com"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            發送郵件給我
          </a>
        </motion.div>
      </section>
    </main>
  )
}
