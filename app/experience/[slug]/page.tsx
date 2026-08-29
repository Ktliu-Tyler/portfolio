import type { Metadata } from 'next'
import ExperienceDetailClient from '@/components/ExperienceDetailClient'
import { absoluteUrl } from '@/lib/site'
import { getEntryCoverImage, getExperienceEntry, getExperienceSlugs, localized } from '@/lib/experience'
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

  const image = getEntryCoverImage(entry)
  const images = image
    ? [
        {
          url: absoluteUrl(image.src),
          width: 1200,
          height: 630,
          alt: localized(image.alt, 'en'),
        },
      ]
    : []

  return {
    title: entry.title.en,
    description: entry.summary.en,
    alternates: {
      canonical: `/experience/${slug}`,
    },
    openGraph: {
      title: `${entry.title.en} | Tyler Liu`,
      description: entry.summary.en,
      url: absoluteUrl(`/experience/${slug}`),
      images,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: `${entry.title.en} | Tyler Liu`,
      description: entry.summary.en,
      images: image ? images.map((item) => item.url) : [],
    },
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

