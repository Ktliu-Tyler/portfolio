import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personal Publishing | Tyler Liu',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
