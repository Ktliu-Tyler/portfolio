import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { loadEnvConfig } from '@next/env'
import { readyDatabase } from '../lib/database'
import type { ExperienceEntry } from '../lib/experience'

loadEnvConfig(process.cwd())
async function main() {
  const sourcePath = path.resolve('.private/legacy-content.json')
  if (!fs.existsSync(sourcePath)) throw new Error('The private migration source is missing. Restore it from your private backup.')
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
  const db = await readyDatabase()
  const privatePaths = new Set<string>()
  for (const entry of source.experienceEntries as ExperienceEntry[]) {
    for (const asset of [...entry.images, ...entry.evidence]) {
      if (asset.kind === 'certificate' || asset.src.includes('makentu-first-prize')) privatePaths.add(asset.src)
    }
  }
  const media = new Map<string, string>()
  const sourceDirectory = fs.existsSync('public/images/experience') && fs.readdirSync('public/images/experience').length ? 'public/images/experience' : '.private/legacy-media'
  const files = fs.readdirSync(sourceDirectory).filter(name => /\.(jpg|png)$/.test(name))
  for (const name of files) {
    const src = `/images/experience/${name}`
    const id = createHash('sha256').update(src).digest('hex').slice(0, 32)
    media.set(src, `/media/${id}`)
    await db.execute({ sql: 'INSERT OR IGNORE INTO assets(id,name,mime,bytes,private_only) VALUES(?,?,?,?,?)', args: [id, name, name.endsWith('.png') ? 'image/png' : 'image/jpeg', fs.readFileSync(path.join(sourceDirectory, name)), privatePaths.has(src) ? 1 : 0] })
  }
  const replaceMedia = (data: unknown) => {
    let json = JSON.stringify(data)
    for (const [before, after] of media) json = json.split(before).join(after)
    return JSON.parse(json)
  }
  async function insert(kind: string, slug: string, title: string, value: unknown, visibility = 'public') {
    const data = replaceMedia(value)
    const id = `${kind}:${slug}`
    const result = await db.execute({ sql: 'INSERT OR IGNORE INTO content(id,kind,slug,title,data,visibility,updated_at) VALUES(?,?,?,?,?,?,?)', args: [id, kind, slug, title, JSON.stringify(data), visibility, new Date().toISOString()] })
    if (result.rowsAffected) {
      const refs = [...new Set<string>(JSON.stringify(data).match(/\/media\/([a-f0-9]{32})/g) || [])]
      for (const ref of refs) await db.execute({ sql: 'INSERT OR IGNORE INTO content_assets(content_id,asset_id) VALUES(?,?)', args: [id, ref.split('/').pop()!] })
    }
  }
  for (const article of source.technicalArticles) await insert('article', article.slug, article.title, { kind: 'technical', article })
  for (const article of source.markdownArticles) {
    article.content = article.content.replace("The public record currently includes two Dean's List certificates, with personal details redacted.", 'Supporting certificates are retained in my private archive.')
    await insert('article', article.slug, article.title, { kind: 'markdown', article })
  }
  for (const entry of source.experienceEntries as ExperienceEntry[]) {
    for (const asset of [...entry.images, ...entry.evidence].filter(item => privatePaths.has(item.src))) {
      await insert('certificate', path.basename(asset.src).replace(/\.[^.]+$/, ''), asset.alt.zh, { ...asset, experienceTitle: entry.title.zh, period: entry.period }, 'private')
    }
    const safeEntry = { ...entry, images: entry.images.filter(asset => !privatePaths.has(asset.src)), evidence: entry.evidence.filter(asset => !privatePaths.has(asset.src)), privacyNote: undefined }
    await insert('experience', entry.slug, entry.title.zh, safeEntry, entry.category === 'honor' ? 'private' : 'public')
  }
  for (const section of source.projectsByYear) for (const project of section.projects) {
    const labels = { zh: source.projectLabels.zh[project.key], en: source.projectLabels.en[project.key] }
    await insert('project', project.key, labels.zh.title, { ...project, yearKey: section.yearKey, labels })
  }
  // Verify bytes before removing the old public copies. The ignored backup stays outside public/.
  fs.mkdirSync('.private/legacy-media', { recursive: true })
  for (const name of files) {
    const original = path.resolve('public/images/experience', name)
    if (!fs.existsSync(original)) continue
    const id = media.get(`/images/experience/${name}`)!.split('/').pop()!
    const stored = (await db.execute({ sql: 'SELECT bytes FROM assets WHERE id=?', args: [id] })).rows[0].bytes as ArrayBuffer
    if (!Buffer.from(stored).equals(fs.readFileSync(original))) throw new Error('Asset verification failed; original retained.')
    const backup = path.resolve('.private/legacy-media', name)
    if (!backup.startsWith(path.resolve('.private') + path.sep) || !original.startsWith(path.resolve('public/images/experience') + path.sep)) throw new Error('Invalid migration path')
    fs.copyFileSync(original, backup)
    fs.unlinkSync(original)
  }
  console.log('Migrated content and verified media into the private database; public source images removed.')
  console.log((await db.execute('SELECT kind,visibility,COUNT(*) AS count FROM content GROUP BY kind,visibility')).rows)
  db.close()
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
