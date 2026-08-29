import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { absoluteUrl, siteDescription, siteTitle, siteUrl } from '@/lib/site'
import './globals.css'

/* ── Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Tyler Liu Portfolio',
  title: {
    default: siteTitle,
    template: '%s | Tyler Liu',
  },
  description: siteDescription,
  authors: [{ name: 'Tyler Liu', url: siteUrl }],
  creator: 'Tyler Liu',
  keywords: [
    'Tyler Liu',
    'embedded systems',
    'vehicle telemetry',
    'haptics',
    'NTU Racing',
    'mechanical engineering',
    'IoT',
  ],
  icons: { icon: '/favicon.ico' },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'Tyler Liu Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: absoluteUrl('/og.png'),
        width: 1200,
        height: 630,
        alt: 'Tyler Liu technical portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [absoluteUrl('/og.png')],
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
