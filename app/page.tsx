'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  CalendarDays,
  Code2,
  Cpu,
  Gauge,
  Github,
  GraduationCap,
  Mail,
  MapPin,
  Monitor,
  Wrench,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import TypewriterEffect from '@/components/TypewriterEffect'
import CountUp from '@/components/CountUp'
import GlassCard from '@/components/GlassCard'
import { BentoGrid, BentoItem } from '@/components/BentoGrid'
import AnimatedSection from '@/components/AnimatedSection'
import { getEntryCoverImage, getFeaturedExperienceEntries, localized } from '@/lib/experience'

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

interface SkillGroup {
  labelKey: string
  icon: ReactNode
  items: string[]
}

const skillGroups: SkillGroup[] = [
  {
    labelKey: 'skills.languages',
    icon: <Code2 className="h-4 w-4" />,
    items: ['C/C++', 'Python', 'JavaScript', 'TypeScript', 'MATLAB'],
  },
  {
    labelKey: 'skills.embedded',
    icon: <Cpu className="h-4 w-4" />,
    items: ['STM32', 'Zephyr RTOS', 'ESP32', 'CAN Bus', 'FreeRTOS'],
  },
  {
    labelKey: 'skills.frontend',
    icon: <Monitor className="h-4 w-4" />,
    items: ['OpenGL', 'React', 'Next.js', 'LVGL', 'Dashboards'],
  },
  {
    labelKey: 'skills.tools',
    icon: <Wrench className="h-4 w-4" />,
    items: ['KiCad', 'Raspberry Pi', 'CMake', 'SolidWorks', 'ANSYS'],
  },
]

const journeyYears = [
  { year: '2026', labelKey: 'journey_preview.y2026' },
  { year: '2025', labelKey: 'journey_preview.y2025' },
  { year: '2024', labelKey: 'journey_preview.y2024' },
  { year: '2023', labelKey: 'journey_preview.y2023' },
  { year: '2022', labelKey: 'journey_preview.y2022' },
]

const heroImages = [
  {
    src: '/images/experience/makentu-booth-jarvis.jpg',
    alt: 'MakeNTU Jarvis prototype booth',
    position: '48% 56%',
    zoom: 1.035,
  },
  {
    src: '/images/experience/ntu-racing-driver-car.jpg',
    alt: 'Tyler seated in the NTU Racing race car',
    position: '50% 62%',
  },
  {
    src: '/images/experience/ntu-racing-sunset-car.jpg',
    alt: 'NTU Racing race car at sunset',
    position: '64% 82%',
  },
]

const profileItems = [
  {
    icon: <GraduationCap className="h-4 w-4" />,
    titleKey: 'about.school',
    detailKey: 'about.school_dept',
  },
  {
    icon: <Gauge className="h-4 w-4" />,
    titleKey: 'about.team',
    detailKey: 'about.team_role',
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    titleKey: 'about.location',
  },
  {
    icon: <CalendarDays className="h-4 w-4" />,
    titleKey: 'about.experience',
    detailKey: 'about.since',
  },
  {
    icon: <Award className="h-4 w-4" />,
    titleKey: 'about.honors',
    detailKey: 'about.honors_detail',
  },
]

export default function HomePage() {
  const { locale, t } = useTranslation()
  const featuredExperiences = getFeaturedExperienceEntries().slice(0, 4)
  const selectedAreas =
    locale === 'zh'
      ? ['力回饋與人機互動', '車輛電控與遙測', '嵌入式 AI 系統', '機電整合與控制']
      : ['Haptics and HMI', 'Vehicle electronics and telemetry', 'Embedded AI systems', 'Mechatronics and control']

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/[0.08]">
        <motion.div
          className="mx-auto grid min-h-[88vh] max-w-6xl grid-cols-1 items-end gap-12 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:pb-24"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div>
            <motion.p
              variants={fadeUpItem}
              className="editorial-kicker mb-5 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
            >
              Mechanical Engineering / Control / Embedded Systems
            </motion.p>

            <motion.h1
              variants={fadeUpItem}
              className="max-w-4xl text-5xl font-medium leading-[1.03] tracking-tight text-slate-950 dark:text-white sm:text-6xl md:text-7xl"
            >
              {t('hero.greeting')} Tyler Liu.
            </motion.h1>

            <motion.div
              variants={fadeUpItem}
              className="mt-6 min-h-9 text-xl font-medium text-slate-700 dark:text-slate-200 sm:text-2xl"
            >
              <TypewriterEffect
                texts={[
                  t('hero.roles.r1'),
                  t('hero.roles.r2'),
                  t('hero.roles.r3'),
                  t('hero.roles.r4'),
                ]}
                speed={80}
                deleteSpeed={40}
                pauseTime={2500}
              />
            </motion.div>

            <motion.p
              variants={fadeUpItem}
              className="mt-7 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              variants={fadeUpItem}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/projects"
                className="marker-button-primary inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {t('hero.cta_projects')}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/experience"
                className="marker-button-secondary inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-transparent px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:border-slate-500 dark:border-white/[0.14] dark:text-slate-200 dark:hover:border-white/30"
              >
                {t('hero.cta_experience')}
              </Link>
            </motion.div>
          </div>

          <motion.aside
            variants={fadeUpItem}
            className="lg:mb-2"
          >
            <div className="grid grid-cols-2 gap-3">
              {heroImages.map((image, index) => (
                <div
                  key={image.src}
                  className={`marker-card relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] ${
                    index === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    style={{
                      objectPosition: image.position,
                      transform: image.zoom ? `scale(${image.zoom})` : undefined,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 border-l border-[var(--marker-accent-line)] pl-5">
              <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                {t('hero.selected_areas')}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-300">
                {selectedAreas.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="marker-line h-px w-8" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com/Ktliu-Tyler"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="marker-icon-button inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-950 dark:border-white/[0.14] dark:text-slate-300 dark:hover:border-white/30 dark:hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:ktliu1995@gmail.com"
                aria-label="Email"
                className="marker-icon-button inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-950 dark:border-white/[0.14] dark:text-slate-300 dark:hover:border-white/30 dark:hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </motion.aside>
        </motion.div>
      </section>

      <AnimatedSection className="marker-section mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mb-10 max-w-2xl">
          <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Profile
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {t('about.title')}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            {t('about.subtitle')}
          </p>
        </div>

        <BentoGrid cols={4} className="gap-3">
          <BentoItem colSpan={2} rowSpan={2} className="flex items-center">
            <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
              {t('about.intro')}
            </p>
          </BentoItem>

          {profileItems.map((item) => (
            <BentoItem key={item.titleKey} className="flex flex-col justify-between gap-6">
              <span className="marker-icon-box flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                {item.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-950 dark:text-white">
                  {t(item.titleKey)}
                </p>
                {item.detailKey && (
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {t(item.detailKey)}
                  </p>
                )}
              </div>
            </BentoItem>
          ))}
        </BentoGrid>
      </AnimatedSection>

      <AnimatedSection className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-20 dark:border-white/[0.08] sm:px-6 sm:py-28">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Experience
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {t('home_experience.title')}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              {t('home_experience.subtitle')}
            </p>
            <Link
              href="/experience"
              className="marker-link mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-900 underline underline-offset-4 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300"
            >
              {t('home_experience.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredExperiences.map((entry) => {
              const image = getEntryCoverImage(entry)

              return (
                <Link
                  key={entry.slug}
                  href={`/experience/${entry.slug}`}
                  className="marker-card group overflow-hidden rounded-lg border border-slate-200 bg-white/70 transition-colors hover:border-[var(--marker-accent-line)] dark:border-white/[0.08] dark:bg-white/[0.035]"
                >
                  {image && (
                    <div className="relative aspect-[16/10] bg-slate-100 dark:bg-white/[0.03]">
                      <Image
                        src={image.src}
                        alt={localized(image.alt, locale)}
                        fill
                        className="object-cover"
                        style={{ objectPosition: image.position ?? 'center' }}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {entry.period}
                    </p>
                    <h3 className="mt-2 text-lg font-medium tracking-tight text-slate-950 dark:text-white">
                      {localized(entry.title, locale)}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {localized(entry.summary, locale)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-20 dark:border-white/[0.08] sm:px-6 sm:py-28">
        <div className="mb-10 max-w-2xl">
          <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Focus
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {t('skills.title')}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            {t('skills.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.labelKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="h-full p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="marker-icon-box flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                    {group.icon}
                  </span>
                  <h3 className="text-sm font-medium text-slate-950 dark:text-white">
                    {t(group.labelKey)}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="marker-chip rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 dark:border-white/[0.08] dark:text-slate-400"
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

      <AnimatedSection className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-20 dark:border-white/[0.08] sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Timeline
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {t('journey_preview.title')}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              {t('journey_preview.subtitle')}
            </p>
            <Link
              href="/experience"
              className="marker-link mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-900 underline underline-offset-4 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300"
            >
              {t('journey_preview.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-0 border-t border-slate-200 dark:border-white/[0.08]">
            {journeyYears.map((item) => (
              <div
                key={item.year}
                className="grid grid-cols-[5rem_1fr] gap-5 border-b border-slate-200 py-5 dark:border-white/[0.08]"
              >
                <span className="marker-year-label font-mono text-sm text-slate-500 dark:text-slate-400">
                  {item.year}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {t(item.labelKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-20 dark:border-white/[0.08] sm:px-6 sm:py-28">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-white/[0.08] dark:bg-white/[0.08] lg:grid-cols-4">
          {[
            { value: <CountUp end={18} />, label: t('stats.projects') },
            { value: <CountUp end={500} suffix="+" />, label: t('stats.hours') },
            { value: <CountUp end={10} suffix="+" />, label: t('stats.techs') },
            { value: <CountUp end={4} />, label: t('stats.passion') },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 dark:bg-[#101624] sm:p-8">
              <div className="font-mono text-3xl text-slate-950 dark:text-white sm:text-4xl">
                {stat.value}
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="marker-section mx-auto max-w-6xl border-t border-slate-200/80 px-4 py-20 dark:border-white/[0.08] sm:px-6 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="editorial-kicker text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Contact
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              {t('cta.description')}
            </p>
          </div>
          <a
            href="mailto:ktliu1995@gmail.com"
            className="marker-button-primary inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Mail className="h-4 w-4" />
            {t('cta.button')}
          </a>
        </div>
      </AnimatedSection>
    </>
  )
}
