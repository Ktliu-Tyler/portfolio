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
        sourceRepos={article.sourceRepos}
      >
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </BlogArticleLayout>
    </main>
  )
}
