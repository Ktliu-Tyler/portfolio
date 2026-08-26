import type { Metadata } from 'next'
import ExperienceIndexClient from '@/components/ExperienceIndexClient'

export const metadata: Metadata = {
  title: 'Experience Records | Tyler Liu',
  description:
    'A bilingual record of Tyler Liu\'s research, NTU Racing work, course projects, awards, leadership, and engineering experience.',
}

export default function ExperiencePage() {
  return <ExperienceIndexClient />
}
