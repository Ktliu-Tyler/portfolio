import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

/* ── Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Tyler Liu | Engineering, Embedded Systems & Experience Records',
  description:
    'Portfolio and experience records of Tyler Liu, a National Taiwan University mechanical engineering student focused on control, embedded systems, vehicle telemetry, haptics, and intelligent mechatronics.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Tyler Liu | Engineering, Embedded Systems & Experience Records',
    description:
      'Research, racing electronics, embedded systems, course projects, honors, and personal records by Tyler Liu.',
    type: 'website',
    locale: 'en_US',
  },
}

/* ── Root Layout ─────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className="dark"
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
