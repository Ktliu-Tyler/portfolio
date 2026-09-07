export interface ArticleSection {
  heading: string
  body?: string[]
  bullets?: string[]
}

export interface ArticleSummary {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  image: string
  imagePosition?: string
  category?: string
  sourceType?: string
  sourceRepos?: Array<{
    name: string
    url: string
  }>
}

export interface TechnicalArticle extends ArticleSummary {
  sections: ArticleSection[]
}
