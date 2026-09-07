import fs from 'node:fs'
import { loadEnvConfig } from '@next/env'
import { readyDatabase } from '../lib/database'
loadEnvConfig(process.cwd())
async function main() {
  const db = await readyDatabase()
  const tx = await db.transaction('read')
  try {
    const content = (await tx.execute('SELECT * FROM content')).rows
    const assets = (await tx.execute('SELECT * FROM assets')).rows.map(row => ({ ...row, bytes: Buffer.from(row.bytes as ArrayBuffer).toString('base64') }))
    const references = (await tx.execute('SELECT * FROM content_assets')).rows
    const history = (await tx.execute('SELECT * FROM audit_log')).rows
    fs.mkdirSync('.private', { recursive: true })
    const filename = `.private/backup-${new Date().toISOString().replace(/[:.]/g,'-')}.json`
    fs.writeFileSync(filename, JSON.stringify({ format: 'portfolio-private-v1', exportedAt: new Date().toISOString(), content, assets, references, history }), { mode: 0o600 })
    console.log(`Private backup saved to ${filename}. ${content.length} records, ${assets.length} assets. No account credentials exported.`)
  } finally { tx.close(); db.close() }
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
