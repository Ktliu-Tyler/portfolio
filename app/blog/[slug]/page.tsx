import BlogArticleLayout from '@/components/BlogArticleLayout'
import MarkdownArticleContent from '@/components/MarkdownArticleContent'
import { getArticleBySlug, getGeneratedArticleSlugs } from '@/lib/contentArticles'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getGeneratedArticleSlugs().map((slug) => ({ slug }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const result = getArticleBySlug(slug)

  if (!result) {
    notFound()
  }

  if (result.kind === 'markdown') {
    const { article } = result

    return (
      <main className="min-h-screen">
        <BlogArticleLayout
          title={article.title}
          date={article.date}
          readTime={article.readTime}
          tags={article.tags}
          image={article.image}
          imagePosition={article.imagePosition}
          excerpt={article.excerpt}
        >
          <MarkdownArticleContent content={article.content} />
        </BlogArticleLayout>
      </main>
    )
  }

  const { article } = result

  return (
    <main className="min-h-screen">
      <BlogArticleLayout
        title={article.title}
        date={article.date}
        readTime={article.readTime}
        tags={article.tags}
        image={article.image}
        imagePosition={article.imagePosition}
        excerpt={article.excerpt}
        sourceRepos={article.sourceRepos}
      >
        {article.sections.map((section, index) => (
          <section
            key={section.heading}
            className="border-t border-slate-200 pt-9 first:border-t-0 first:pt-0 dark:border-white/[0.08]"
          >
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-sm text-slate-400 dark:text-slate-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="text-2xl font-medium tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {section.heading}
              </h2>
            </div>

            {section.body && (
              <div className="space-y-5">
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
                    className="flex gap-3 border-l border-slate-200 pl-4 text-base leading-8 text-slate-700 dark:border-white/[0.12] dark:text-slate-300"
                  >
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </BlogArticleLayout>
    </main>
  )
}
