import BlogIndexClient from '@/components/BlogIndexClient'
import { getAllArticleSummaries } from '@/lib/contentArticles'

export default function BlogPage() {
  return <BlogIndexClient articles={getAllArticleSummaries()} />
}
