import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '私人管理 / Private workspace',
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
