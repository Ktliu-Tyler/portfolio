'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Github,
  Mail,
  Code2,
  Cpu,
  Monitor,
  Wrench,
  ChevronDown,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import TypewriterEffect from '@/components/TypewriterEffect'
import CountUp from '@/components/CountUp'
import GlassCard from '@/components/GlassCard'
import { BentoGrid, BentoItem } from '@/components/BentoGrid'
import AnimatedSection from '@/components/AnimatedSection'

const ThreeDBackground = dynamic(() => import('@/components/ThreeDBackground'), {
  ssr: false,
})

/* ── Framer Motion Variants ──────────────────────────────────────── */

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ── Skill Data ──────────────────────────────────────────────────── */

interface SkillGroup {
  labelKey: string
  icon: React.ReactNode
  items: string[]
}

const skillGroups: SkillGroup[] = [
  {
    labelKey: 'skills.languages',
    icon: <Code2 className="w-5 h-5" />,
    items: ['Python', 'C++', 'C', 'TypeScript', 'JavaScript'],
  },
  {
    labelKey: 'skills.embedded',
    icon: <Cpu className="w-5 h-5" />,
    items: ['ESP32', 'STM32', 'Zephyr RTOS', 'CAN Bus', 'Modbus RS485'],
  },
  {
    labelKey: 'skills.frontend',
    icon: <Monitor className="w-5 h-5" />,
    items: ['React', 'Next.js', 'Tailwind CSS', 'Three.js'],
  },
  {
    labelKey: 'skills.tools',
    icon: <Wrench className="w-5 h-5" />,
    items: ['Git', 'Docker', 'Raspberry Pi', 'CMake', 'VS Code'],
  },
]

/* ── Journey Year Data ───────────────────────────────────────────── */

const journeyYears = [
  { year: '2021', labelKey: 'journey_preview.y2021' },
  { year: '2022', labelKey: 'journey_preview.y2022' },
  { year: '2024', labelKey: 'journey_preview.y2024' },
  { year: '2025', labelKey: 'journey_preview.y2025' },
  { year: '2026', labelKey: 'journey_preview.y2026' },
]

/* ================================================================ */
/*  HomePage                                                         */
/* ================================================================ */

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━  HERO  ━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <ThreeDBackground />
        </div>

        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float delay-300" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-float delay-600" />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-4 py-24 text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting + Name */}
          <motion.h1
            variants={fadeUpItem}
            className="text-5xl sm:text-6xl md:text-8xl font-heading font-bold tracking-tight leading-tight"
          >
            <span className="text-slate-200 dark:text-slate-200 light:text-slate-800">
              {t('hero.greeting')}{' '}
            </span>
            <span className="gradient-text animate-gradient-shift">Tyler</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            variants={fadeUpItem}
            className="mt-6 text-xl sm:text-2xl md:text-3xl font-heading font-medium"
          >
            <TypewriterEffect
              texts={[
                t('hero.roles.r1'),
                t('hero.roles.r2'),
                t('hero.roles.r4'),
              ]}
              speed={80}
              deleteSpeed={40}
              pauseTime={2500}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUpItem}
            className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-slate-400 dark:text-slate-400 leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpItem}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/projects"
              className="
                group relative inline-flex items-center gap-2 px-8 py-3.5
                rounded-xl font-medium text-white
                bg-gradient-to-r from-indigo-500 to-purple-500
                shadow-lg shadow-indigo-500/25
                hover:shadow-indigo-500/40 hover:scale-[1.02]
                transition-all duration-300
              "
            >
              <span>{t('hero.cta_projects')}</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="/blog"
              className="
                inline-flex items-center gap-2 px-8 py-3.5
                rounded-xl font-medium
                text-slate-300 dark:text-slate-300
                border border-white/[0.12] dark:border-white/[0.12]
                bg-white/[0.04] dark:bg-white/[0.04]
                backdrop-blur-sm
                hover:bg-white/[0.08] hover:border-white/[0.2]
                hover:scale-[1.02]
                transition-all duration-300
              "
            >
              <span>{t('hero.cta_blog')}</span>
            </Link>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            variants={fadeUpItem}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <motion.a
              href="https://github.com/Ktliu-Tyler"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ y: -3, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="
                w-11 h-11 flex items-center justify-center rounded-full
                border border-white/[0.1] bg-white/[0.05]
                text-slate-400 hover:text-indigo-400
                hover:border-indigo-500/40 hover:bg-indigo-500/10
                transition-colors duration-200
              "
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="mailto:ktliu1995@gmail.com"
              aria-label="Email"
              whileHover={{ y: -3, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="
                w-11 h-11 flex items-center justify-center rounded-full
                border border-white/[0.1] bg-white/[0.05]
                text-slate-400 hover:text-purple-400
                hover:border-purple-500/40 hover:bg-purple-500/10
                transition-colors duration-200
              "
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={fadeUpItem}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-slate-500 tracking-wider uppercase">
              {t('hero.scroll_hint')}
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-5 h-5 text-slate-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━  ABOUT (BENTO)  ━━━━━━━━━━━━━━━━ */}
      <AnimatedSection className="max-w-6xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold">
            <span className="gradient-text">{t('about.title')}</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <BentoGrid cols={4}>
          {/* Intro — spans 2 cols × 2 rows */}
          <BentoItem colSpan={2} rowSpan={2} className="flex items-center">
            <div>
              <p className="text-slate-300 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {t('about.intro')}
              </p>
            </div>
          </BentoItem>

          {/* School */}
          <BentoItem className="flex flex-col items-center justify-center text-center gap-2">
            <span className="text-3xl" role="img" aria-label="school">
              🎓
            </span>
            <span className="font-heading font-semibold text-sm text-slate-200">
              {t('about.school')}
            </span>
            <span className="text-xs text-slate-400">{t('about.school_dept')}</span>
          </BentoItem>

          {/* Racing Team */}
          <BentoItem className="flex flex-col items-center justify-center text-center gap-2">
            <span className="text-3xl" role="img" aria-label="racing">
              🏎️
            </span>
            <span className="font-heading font-semibold text-sm text-slate-200">
              {t('about.team')}
            </span>
            <span className="text-xs text-slate-400">{t('about.team_role')}</span>
          </BentoItem>

          {/* Location */}
          <BentoItem className="flex flex-col items-center justify-center text-center gap-2">
            <span className="text-3xl" role="img" aria-label="location">
              📍
            </span>
            <span className="font-heading font-semibold text-sm text-slate-200">
              {t('about.location')}
            </span>
          </BentoItem>

          {/* Experience */}
          <BentoItem className="flex flex-col items-center justify-center text-center gap-2">
            <span className="text-3xl" role="img" aria-label="calendar">
              📅
            </span>
            <span className="font-heading font-semibold text-sm text-slate-200">
              {t('about.experience')}
            </span>
            <span className="text-xs text-slate-400">{t('about.since')}</span>
          </BentoItem>
        </BentoGrid>
      </AnimatedSection>

      {/* ━━━━━━━━━━━━━━━━  SKILLS  ━━━━━━━━━━━━━━━━ */}
      <AnimatedSection className="max-w-6xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold">
            <span className="gradient-text">{t('skills.title')}</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400">
                    {group.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-slate-200">
                    {t(group.labelKey)}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="
                        px-3 py-1.5 text-xs font-medium rounded-full
                        bg-white/[0.06] dark:bg-white/[0.06]
                        border border-white/[0.08] dark:border-white/[0.08]
                        text-slate-300 dark:text-slate-300
                        hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:text-indigo-300
                        transition-all duration-200
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ━━━━━━━━━━━━━━━━  JOURNEY PREVIEW  ━━━━━━━━━━━━━━━━ */}
      <AnimatedSection className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold">
            <span className="gradient-text">{t('journey_preview.title')}</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            {t('journey_preview.subtitle')}
          </p>
        </div>

        {/* Horizontal timeline */}
        <div className="relative flex items-center justify-between px-4 sm:px-8">
          {/* Connecting gradient line */}
          <div className="absolute left-8 right-8 sm:left-12 sm:right-12 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full opacity-50" />

          {journeyYears.map((item, i) => (
            <motion.div
              key={item.year}
              className="relative flex flex-col items-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Dot */}
              <motion.div
                className="
                  w-4 h-4 rounded-full
                  bg-gradient-to-br from-indigo-500 to-purple-500
                  shadow-lg shadow-indigo-500/40
                  ring-4 ring-navy-950
                "
                whileHover={{ scale: 1.4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              />

              {/* Year label */}
              <span className="mt-3 text-xs sm:text-sm font-heading font-bold text-indigo-400">
                {item.year}
              </span>

              {/* Phase label */}
              <span className="mt-1 text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">
                {t(item.labelKey)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="
              inline-flex items-center gap-2
              text-indigo-400 hover:text-indigo-300
              font-medium text-sm
              transition-colors duration-200
              group
            "
          >
            <span>{t('journey_preview.cta')}</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </AnimatedSection>

      {/* ━━━━━━━━━━━━━━━━  STATS  ━━━━━━━━━━━━━━━━ */}
      <AnimatedSection className="max-w-6xl mx-auto px-4 py-24 sm:py-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Projects */}
          <GlassCard className="p-8 text-center" glow>
            <div className="text-4xl sm:text-5xl font-heading font-bold gradient-text">
              <CountUp end={18} />
            </div>
            <p className="mt-3 text-sm text-slate-400">{t('stats.projects')}</p>
          </GlassCard>

          {/* Hours */}
          <GlassCard className="p-8 text-center" glow>
            <div className="text-4xl sm:text-5xl font-heading font-bold gradient-text">
              <CountUp end={500} suffix="+" />
            </div>
            <p className="mt-3 text-sm text-slate-400">{t('stats.hours')}</p>
          </GlassCard>

          {/* Tech stacks */}
          <GlassCard className="p-8 text-center" glow>
            <div className="text-4xl sm:text-5xl font-heading font-bold gradient-text">
              <CountUp end={10} suffix="+" />
            </div>
            <p className="mt-3 text-sm text-slate-400">{t('stats.techs')}</p>
          </GlassCard>

          {/* Focus areas */}
          <GlassCard className="p-8 text-center" glow>
            <div className="text-4xl sm:text-5xl font-heading font-bold gradient-text">
              <CountUp end={4} />
            </div>
            <p className="mt-3 text-sm text-slate-400">{t('stats.passion')}</p>
          </GlassCard>
        </div>
      </AnimatedSection>

      {/* ━━━━━━━━━━━━━━━━  CTA  ━━━━━━━━━━━━━━━━ */}
      <AnimatedSection className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
        <GlassCard className="p-10 sm:p-16 text-center" glow hover={false}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">
            <span className="gradient-text">{t('cta.title')}</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto leading-relaxed">
            {t('cta.description')}
          </p>
          <div className="mt-8">
            <motion.a
              href="mailto:ktliu1995@gmail.com"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="
                inline-flex items-center gap-2.5 px-8 py-3.5
                rounded-xl font-medium text-white
                bg-gradient-to-r from-indigo-500 to-purple-500
                shadow-lg shadow-indigo-500/25
                hover:shadow-indigo-500/40
                transition-shadow duration-300
              "
            >
              <Mail className="w-4.5 h-4.5" />
              <span>{t('cta.button')}</span>
            </motion.a>
          </div>
        </GlassCard>
      </AnimatedSection>
    </>
  )
}
