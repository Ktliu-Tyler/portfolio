import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Tyler's Portfolio",
  description: '個人作品集 - 展示專案、文章和紀錄',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <nav className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold">
              Tyler
            </a>
            <div className="flex gap-6">
              <a href="/projects" className="hover:text-blue-600 transition">
                作品集
              </a>
              <a href="/blog" className="hover:text-blue-600 transition">
                部落格
              </a>
              <a href="/notes" className="hover:text-blue-600 transition">
                紀錄
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-8 text-center text-slate-600 dark:text-slate-400">
          <p>© 2026 Tyler. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
