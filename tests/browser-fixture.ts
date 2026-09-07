import fs from 'node:fs'
import { spawn } from 'node:child_process'
import { readyDatabase } from '../lib/database'
import { hashPassword } from '../lib/password'

async function main() {
  const url=`file:.private/browser-audit-${Date.now()}.db`
  process.env.DATABASE_URL=url
  fs.mkdirSync('.private',{recursive:true})
  const db=await readyDatabase()
  // This disposable database has synthetic content only, never the user's data.
  const password='browser-test-not-a-real-account-2026'
  await db.execute({sql:'INSERT INTO owner(id,password_hash) VALUES(1,?)',args:[await hashPassword(password)]})
  const article={kind:'markdown',article:{slug:'security-preview',title:'安全測試文章',excerpt:'這是隔離測試資料。',date:'2026-09-07',readTime:'1',tags:['測試'],image:'/images/data.png',content:'## 私人預覽測試\n\n這份內容用於驗證管理介面，不是真實私人資料。',sources:[]}}
  await db.execute({sql:"INSERT INTO content(id,kind,slug,title,data,visibility,updated_at) VALUES(?,'article',?,?,?,'private',?)",args:['article:security-preview','security-preview','安全測試文章',JSON.stringify(article),new Date().toISOString()]})
  fs.writeFileSync('.private/browser-audit-access.json',JSON.stringify({url,password}),{mode:0o600})
  console.log('Created isolated browser fixture; credentials saved privately.')
  db.close()
  if (process.argv.includes('--serve')) {
    const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3102'],{env:{...process.env,DATABASE_URL:url,ADMIN_ORIGIN:'http://127.0.0.1:3102',NEXT_DIST_DIR:'.next',OPENAI_API_KEY:'',GITHUB_TOKEN:''},stdio:'inherit',windowsHide:true})
    process.on('SIGINT',()=>server.kill())
    server.on('exit',code=>{process.exitCode=code || 0})
  }
}
main().catch(error=>{console.error(error.message);process.exitCode=1})
