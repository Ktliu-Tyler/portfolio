import HomeClient from '@/components/HomeClient'
import { publicExperiences } from '@/lib/contentStore'
export const dynamic = 'force-dynamic'
export default async function HomePage() { return <HomeClient entries={await publicExperiences()} /> }
