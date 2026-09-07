import ProjectsClient from '@/components/ProjectsClient'
import { publicRecords } from '@/lib/contentStore'
import type { Project, YearSection } from '@/lib/contentTypes'
export const dynamic = 'force-dynamic'
export default async function ProjectsPage() {
  const records = await publicRecords('project')
  const sections = new Map<string, Project[]>()
  for (const record of records) { const { yearKey, ...project } = record.data; sections.set(yearKey, [...(sections.get(yearKey) || []), project as Project]) }
  const projectsByYear: YearSection[] = [...sections].sort(([a],[b]) => b.localeCompare(a)).map(([yearKey, projects]) => ({ yearKey, projects }))
  return <ProjectsClient projectsByYear={projectsByYear} />
}
