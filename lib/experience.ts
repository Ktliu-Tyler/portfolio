import type { Locale } from '@/lib/translations'

export type ExperienceCategory =
  | 'research'
  | 'racing'
  | 'competition'
  | 'course'
  | 'honor'
  | 'activity'
  | 'software'
  | 'writing'

export type ExperienceType =
  | 'Featured Experience'
  | 'Research'
  | 'Engineering Project'
  | 'Competition'
  | 'Honor'
  | 'Leadership'
  | 'Course Record'
  | 'Writing'

export interface LocalizedText {
  zh: string
  en: string
}

export interface ExperienceImage {
  src: string
  alt: LocalizedText
  caption: LocalizedText
  kind?: 'photo' | 'screenshot' | 'certificate' | 'diagram'
  position?: string
}

export interface ExperienceLink {
  label: LocalizedText
  href: string
}

export interface ExperienceEntry {
  slug: string
  category: ExperienceCategory
  type: ExperienceType
  period: string
  year: string
  featured?: boolean
  title: LocalizedText
  role: LocalizedText
  summary: LocalizedText
  story: LocalizedText[]
  highlights: LocalizedText[]
  skills: string[]
  images: ExperienceImage[]
  evidence: ExperienceImage[]
  links?: ExperienceLink[]
  articleSlug?: string
  privacyNote?: LocalizedText
}

export const categoryLabels: Record<ExperienceCategory, LocalizedText> = {
  research: { zh: '研究', en: 'Research' },
  racing: { zh: '車隊電控', en: 'Racing Team' },
  competition: { zh: '競賽', en: 'Competition' },
  course: { zh: '課程專題', en: 'Course Project' },
  honor: { zh: '獎項', en: 'Honor' },
  activity: { zh: '活動與領導', en: 'Activity' },
  software: { zh: '軟體作品', en: 'Software' },
  writing: { zh: '報告與寫作', en: 'Writing' },
}

export const categoryOrder: ExperienceCategory[] = [
  'research',
  'racing',
  'competition',
  'course',
  'honor',
  'activity',
  'software',
  'writing',
]

export function localized(text: LocalizedText, locale: Locale) {
  return text[locale]
}

export function getEntryDisplayImages(entry: ExperienceEntry) {
  return [...entry.images, ...entry.evidence].filter((image) => image.kind !== 'certificate')
}

export function getEntryCoverImage(entry: ExperienceEntry) {
  return getEntryDisplayImages(entry)[0]
}
