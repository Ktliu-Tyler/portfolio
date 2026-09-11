# Tyler Liu Portfolio

A personal website for presenting engineering projects, articles, and experiences, together with a private workspace for managing the material behind those public pages. It connects a public portfolio with an owner-only editorial workflow, making it possible to keep drafts and personal records separate from published work.

## Main capabilities

- Public pages for projects, blog articles, and experiences.
- Traditional Chinese and English interface support.
- Animated layouts, theme controls, and visual components built with React.
- An authenticated administration area for searching, editing, previewing, and changing content visibility.
- Private draft generation and a publishing workspace.
- Database backups, restoration tools, and public-content snapshot export.

## How the project is organized

The application uses Next.js 15, React 18, TypeScript, and Tailwind CSS. Framer Motion and Three.js support the presentation layer. Content and media access are handled through server-side storage code using the libSQL client; local private data is kept outside the Git repository.

The public pages and administration routes use the same content system with visibility checks. A fresh checkout does not contain the owner's private database or credentials. Hosted deployment requires a persistent remote database rather than relying on a local filesystem database.

## Repository map

| Path | Purpose |
| --- | --- |
| [app](app) | Public routes, administration routes, and API handlers |
| [components](components) | Presentation and administration components |
| [lib](lib) | Content storage, authentication, localization, and publishing logic |
| [scripts](scripts) | Owner setup, backups, restoration, and content exports |
| [tests](tests) | Privacy, security, editorial, and snapshot checks |
| [docs/PRIVATE_ADMIN.md](docs/PRIVATE_ADMIN.md) | Administration and deployment details |
| [.env.local.example](.env.local.example) | Configuration fields without private values |

## Project context

The repository records the development of both the public website and its private content workflow. It emphasizes presenting personal work clearly while controlling what becomes public. The original operating notes below preserve dated local-development and deployment observations; they should not be read as a live status report for the hosted site.

## Original project notes

The original documentation is retained below as a personal development record, including its original language, credits, illustrations, and historical instructions. Dates, paths, and environment details describe the original work.

<details>
<summary>Read the original documentation</summary>

# Tyler Liu Portfolio

Next.js 15 / React 18 / TypeScript / Tailwind CSS，沿用既有 Vercel 網站。

## 本機使用

```powershell
npm install
npm run dev
```

開啟 http://localhost:3000/admin 。已有本機管理帳號；初始密碼存放於 `.private/owner-access.txt`，請存入密碼管理器並在「帳號設定」更換。

登入頁及管理導覽可選擇「繁體中文 / English」，並沿用前台的語言記憶。管理標籤、狀態、提示與預覽介面支援雙語；文章內文及草稿工具的「文章語言」獨立保留。

- `/admin`：搜尋及篩選文章、作品、經歷，切換公開／私密，查看操作紀錄及下載私人備份。
- `/admin/preview/[id]`：本人專用預覽，不會讓私密文章在公開網址出現。
- `/admin/publisher`：從來源產生文章，儲存為私密草稿，之後在內容管理選擇公開。
- `/admin/settings`：更改密碼，立即登出所有裝置。

## 私人資料

所有文章、作品資料、經歷和媒體存於 `.private/portfolio.db`。截至 2026-09-07 本次整理，共有 75 筆內容與 47 份圖片；其中包含新撰寫的 12 篇中文私密文章及 25 張配圖。獎狀／證明共 5 筆，固定私密。

在管理介面選「文章」與「私密」，可閱讀新草稿及配圖。預覽包含來源、相關作品與發布前待確認事項。完整素材盤點及文章索引放在本機 `.private/editorial/README.md`，不隨 Git 或部署上傳。

`.private/` 包含資料庫、原始內容備份、媒體備份和初始密碼，已排除 Git 與 Vercel 上傳。新 checkout 不含個人資料，需由私人備份還原。公開網站只從資料庫取得公開內容，不再讀取 `lib/articles.ts` 或 `content/blog` 的文章資料。

```powershell
npm run db:backup
npm run db:restore -- .private/your-backup.json
npm run admin:setup
```

`db:restore` 僅接受空白內容資料庫，不覆蓋現有內容。`admin:setup` 不覆蓋現有帳號；遺失密碼時執行 `npm run admin:setup -- --reset` 產生新密碼並撤銷所有登入。備份不包含密碼雜湊或登入資訊。

## 驗證

```powershell
npm run lint
npm run build
npm run test:privacy
npm run test:security
```

隱私測試使用 3101 埠和獨立測試資料庫；不修改實際內容。測試涵蓋登入、權限、直接網址、圖片存取、公開／私密切換、私密草稿、操作紀錄、備份和登入失效。

另有安全單元測試，檢查輸入大小、檔案類型、草稿解析、匯出路徑及外部請求限制。實際瀏覽器驗證可先執行 `npx tsx tests/browser-fixture.ts --serve`，在 3102 埠使用只有合成內容的獨立資料庫；測試帳號資訊存於 `.private/browser-audit-access.json`。

本次圖文整理可執行 `npx tsx tests/editorial.integration.ts`，以本機資料庫副本驗證新文章與圖片的權限；不修改實際內容或管理密碼。此測試需要已匯入的本機私人資料，並使用 3103 埠。

## 上線

本次僅完成本機版本，正式網站尚未更新。Vercel 必須使用遠端持久化資料庫，不能使用本機 SQLite 檔案。

完整步驟與日後優化建議：[私人管理與上線指南](docs/PRIVATE_ADMIN.md)。

2026-09-07 唯讀檢查確認正式站的舊獎狀圖片仍可直接取得，待新版上線與舊資產清理後重新驗證。完整結果見 [安全檢查報告](docs/SECURITY_REVIEW.md)；功能、順序與驗收條件見 [逐步優化清單](docs/OPTIMIZATION_ROADMAP.md)。

</details>
