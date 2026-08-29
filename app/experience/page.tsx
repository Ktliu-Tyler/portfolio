import type { Metadata } from 'next'
import ExperienceIndexClient from '@/components/ExperienceIndexClient'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Experience Records | Tyler Liu',
  description:
    'A bilingual, searchable record of Tyler Liu\'s research, NTU Racing work, course projects, awards, leadership, and engineering experience.',
  alternates: {
    canonical: '/experience',
  },
  openGraph: {
    title: 'Experience Records | Tyler Liu',
    description:
      'Searchable research, racing electronics, competitions, course projects, awards, and engineering experience records by Tyler Liu.',
    url: absoluteUrl('/experience'),
    images: [
      {
        url: absoluteUrl('/og.png'),
        width: 1200,
        height: 630,
        alt: 'Tyler Liu experience records preview',
      },
    ],
  },
}

export default function ExperiencePage() {
  return <ExperienceIndexClient />
}
