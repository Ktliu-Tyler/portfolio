'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Github, Mail } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getEntryCoverImage, type ExperienceEntry, localized } from '@/lib/experience'
import './home.css'

const racingPhoto = '/media/b81104457e73838418d9f57c1b52cb33'

const skills = [
  { label: 'languages', items: ['C/C++', 'Python', 'JavaScript', 'TypeScript', 'MATLAB'] },
  { label: 'embedded', items: ['STM32', 'Zephyr RTOS', 'ESP32', 'CAN Bus', 'FreeRTOS'] },
  { label: 'frontend', items: ['OpenGL', 'React', 'Next.js', 'LVGL', 'Dashboards'] },
  { label: 'tools', items: ['KiCad', 'Raspberry Pi', 'CMake', 'SolidWorks', 'ANSYS'] },
]

const profile = [
  { title: 'school', detail: 'school_dept' },
  { title: 'team', detail: 'team_role' },
  { title: 'location' },
  { title: 'experience', detail: 'since' },
]

const highlights = [
  { name: 'MakeNTU 1st', key: 'makentu' },
  { name: 'NTU Racing', key: 'racing' },
  { name: 'ICROSS Lab', key: 'research' },
]

export default function HomeClient({ entries }: { entries: ExperienceEntry[] }) {
  const { locale, t } = useTranslation()
  const featured = entries.filter((entry) => entry.featured).slice(0, 4)
  // Only show media exposed by the current public experience records.
  const showRacingPhoto = entries.some((entry) =>
    [...entry.images, ...entry.evidence].some((image) => image.src === racingPhoto),
  )
  const areas = locale === 'zh'
    ? ['力回饋與人機互動', '車輛電控與遙測', '嵌入式 AI 系統', '機電整合與控制']
    : ['Haptics and HMI', 'Vehicle electronics and telemetry', 'Embedded AI systems', 'Mechatronics and control']

  return (
    <div className="portfolio-home">
      <section className="home-wrap home-hero" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="home-kicker">{t('hero.kicker')}</p>
          <h1 id="home-title">Tyler Liu</h1>
          <p className="home-role">
            {t('hero.focus')}
          </p>
          <p className="home-description">{t('hero.description')}</p>
          <div className="home-actions">
            <Link href="/projects" className="home-primary">
              {t('hero.cta_projects')} <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link href="/experience" className="home-secondary">{t('hero.cta_experience')}</Link>
          </div>
        </div>

        <div className="home-visual">
          {showRacingPhoto && (
            <figure>
              <div className="home-photo">
                <Image
                  src={racingPhoto}
                  alt={locale === 'zh' ? '夕陽下的台大賽車隊賽車' : 'The NTU Racing race car at sunset'}
                  fill
                  priority
                  sizes="(min-width: 1200px) 550px, (min-width: 900px) 48vw, 100vw"
                  className="object-cover object-[64%_82%]"
                />
              </div>
              <figcaption>NTU Racing Team</figcaption>
            </figure>
          )}
          <div className="home-areas">
            <h2>{t('hero.selected_areas')}</h2>
            <ul>{areas.map((area) => <li key={area}>{area}</li>)}</ul>
          </div>
        </div>

        <dl className="home-highlights">
          {highlights.map(({ name, key }) => (
            <div key={key}>
              <dt>{name}</dt>
              <dd>{t(`hero.signals.${key}`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="home-wrap home-section home-split" aria-labelledby="home-profile">
        <div>
          <h2 id="home-profile">{t('about.title')}</h2>
          <p className="home-description">{t('about.intro')}</p>
        </div>
        <dl className="home-profile">
          {profile.map(({ title, detail }) => (
            <div key={title}>
              <dt>{t(`about.${title}`)}</dt>
              {detail && <dd>{t(`about.${detail}`)}</dd>}
            </div>
          ))}
        </dl>
      </section>

      <section className="home-wrap home-section" aria-labelledby="home-experience">
        <div className="home-section-heading">
          <div>
            <h2 id="home-experience">{t('home_experience.title')}</h2>
            <p className="home-description">{t('home_experience.subtitle')}</p>
          </div>
          <Link href="/experience" className="home-text-link">
            {t('home_experience.cta')} <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        {featured.length > 0 && (
          <div className="home-experiences">
            {featured.map((entry) => {
              const image = getEntryCoverImage(entry)
              return (
                <Link key={entry.slug} href={`/experience/${entry.slug}`} className="home-experience">
                  {image && (
                    <div className="home-experience-photo">
                      <Image
                        src={image.src}
                        alt={localized(image.alt, locale)}
                        fill
                        sizes="(min-width: 1200px) 550px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: image.position ?? 'center' }}
                      />
                    </div>
                  )}
                  <p className="home-date">{entry.period}</p>
                  <h3>{localized(entry.title, locale)}</h3>
                  <p>{localized(entry.summary, locale)}</p>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="home-wrap home-section" aria-labelledby="home-skills">
        <h2 id="home-skills">{t('skills.title')}</h2>
        <div className="home-skills">
          {skills.map(({ label, items }) => (
            <div key={label}>
              <h3>{t(`skills.${label}`)}</h3>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="home-wrap home-section home-split" aria-labelledby="home-timeline">
        <div>
          <h2 id="home-timeline">{t('journey_preview.title')}</h2>
          <p className="home-description">{t('journey_preview.subtitle')}</p>
          <Link href="/projects" className="home-text-link mt-4">
            {t('journey_preview.cta')} <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <ol className="home-timeline">
          {[2026, 2025, 2024, 2023, 2022].map((year) => (
            <li key={year}>
              <time className="home-date" dateTime={String(year)}>{year}</time>
              <span>{t(`journey_preview.y${year}`)}</span>
            </li>
          ))}
        </ol>
      </section>

      <dl className="home-wrap home-section home-stats">
        {[
          { value: '30', key: 'projects' },
          { value: '500+', key: 'hours' },
          { value: '10+', key: 'techs' },
          { value: '4', key: 'passion' },
        ].map(({ value, key }) => (
          <div key={key}>
            <dt>{t(`stats.${key}`)}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section id="contact" className="home-wrap home-section" aria-labelledby="home-contact">
        <h2 id="home-contact">{t('nav.contact')}</h2>
        <p className="home-description">{t('cta.description')}</p>
        <div className="home-actions">
          <a className="home-primary" href="mailto:ktliu1995@gmail.com">
            <Mail aria-hidden="true" size={16} /> {t('cta.button')}
          </a>
          <a className="home-secondary" href="https://github.com/Ktliu-Tyler" target="_blank" rel="noopener noreferrer">
            <Github aria-hidden="true" size={16} /> GitHub
          </a>
        </div>
      </section>
    </div>
  )
}
