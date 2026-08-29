import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Selected Projects',
  description:
    'A chronological portfolio of Tyler Liu projects across embedded systems, vehicle telemetry, IoT, data tooling, C++ applications, and engineering workflows.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Selected Projects | Tyler Liu',
    description:
      'Embedded systems, vehicle telemetry, IoT, data tooling, and engineering projects by Tyler Liu.',
    url: absoluteUrl('/projects'),
    images: [
      {
        url: absoluteUrl('/og.png'),
        width: 1200,
        height: 630,
        alt: 'Tyler Liu selected projects preview',
      },
    ],
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
