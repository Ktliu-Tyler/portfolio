import BlogArticleLayout from '@/components/BlogArticleLayout'
import { getTechnicalArticle, technicalArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return technicalArticles.map((article) => ({ slug: article.slug }))
}

export default async function TechnicalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getTechnicalArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <BlogArticleLayout
        title={article.title}
        date={article.date}
        readTime={article.readTime}
        tags={article.tags}
        image={article.image}
        excerpt={article.excerpt}
        sourceRepos={article.sourceRepos}
      >
        {article.sections.map((section, index) => (
          <section
            key={section.heading}
            className="border-t border-slate-200/80 pt-9 first:border-t-0 first:pt-0 dark:border-white/[0.08]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-2xl font-bold leading-tight text-slate-950 dark:text-white sm:text-3xl">
                  {section.heading}
                </h2>

                {section.body && (
                  <div className="mt-5 space-y-5">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm leading-7 text-slate-700 shadow-sm shadow-slate-900/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 sm:text-base"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        ))}
      </BlogArticleLayout>
    </main>
  )
}
