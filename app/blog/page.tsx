import type { Metadata } from 'next'
import BlogIndexClient from '@/components/BlogIndexClient'
import { getAllArticleSummaries } from '@/lib/contentArticles'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Technical Writing',
  description:
    'Technical writing and project notes by Tyler Liu on embedded systems, CAN bus, vehicle telemetry, IoT, data dashboards, and engineering practice.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Technical Writing | Tyler Liu',
    description:
      'Notes on embedded systems, vehicle telemetry, IoT, data tooling, and engineering practice.',
    url: absoluteUrl('/blog'),
    images: [
      {
        url: absoluteUrl('/og.png'),
        width: 1200,
        height: 630,
        alt: 'Tyler Liu technical writing preview',
      },
    ],
  },
}

export default function BlogPage() {
  return <BlogIndexClient articles={getAllArticleSummaries()} />
}
