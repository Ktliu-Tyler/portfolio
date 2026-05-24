import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

/* ── Font Setup ──────────────────────────────────────────────────── */

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

/* ── Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Tyler Liu | Software & Embedded Systems Portfolio',
  description:
    'Portfolio of Tyler Liu, a National Taiwan University mechanical engineering student focused on software engineering, embedded systems, vehicle telemetry, and IoT applications.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Tyler Liu | Software & Embedded Systems Portfolio',
    description:
      'Selected software, embedded systems, vehicle telemetry, and IoT projects by Tyler Liu.',
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
