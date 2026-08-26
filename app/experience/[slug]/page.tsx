import type { Metadata } from 'next'
import ExperienceDetailClient from '@/components/ExperienceDetailClient'
import { getExperienceEntry, getExperienceSlugs } from '@/lib/experience'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getExperienceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getExperienceEntry(slug)

  if (!entry) {
    return {}
  }

  return {
    title: `${entry.title.en} | Tyler Liu`,
    description: entry.summary.en,
  }
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getExperienceEntry(slug)

  if (!entry) {
    notFound()
  }

  return <ExperienceDetailClient entry={entry} />
}

