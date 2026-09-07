import fs from 'node:fs'
import { randomBytes } from 'node:crypto'
import { loadEnvConfig } from '@next/env'
import { readyDatabase } from '../lib/database'
import { hashPassword } from '../lib/password'

loadEnvConfig(process.cwd())
async function main() {
  const db = await readyDatabase()
  const exists = (await db.execute('SELECT 1 FROM owner')).rows.length > 0
  if (exists && !process.argv.includes('--reset')) throw new Error('Owner already configured. Use --reset only to replace the password and revoke all sessions.')
  const password = process.env.ADMIN_SETUP_PASSWORD || randomBytes(24).toString('base64url')
  if (password.length < 16 || password.length > 256) throw new Error('Use a password between 16 and 256 characters.')
  await db.batch([
    { sql: 'INSERT INTO owner(id,password_hash) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET password_hash=excluded.password_hash,version=owner.version+1', args: [await hashPassword(password)] },
    'DELETE FROM sessions', 'DELETE FROM login_attempts',
  ], 'write')
  fs.mkdirSync('.private', { recursive: true })
  if (!process.env.ADMIN_SETUP_PASSWORD) fs.writeFileSync('.private/owner-access.txt', `管理介面 / Admin: /admin\n登入密碼 / Password: ${password}\n\n請保存到密碼管理器，之後刪除此檔。可在管理介面更改密碼。\n`, { mode: 0o600 })
  console.log('Owner configured. Generated credentials, if any, are saved in .private/owner-access.txt and were not printed.')
  db.close()
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
