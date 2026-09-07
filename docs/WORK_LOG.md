# Work Log

Last updated: 2026-05-24

## 2026-05-24 Project Ordering And Article Polish

- Reordered the Projects page timeline so the page reads from newest work to oldest work.
- Consolidated all blog article routes through `app/blog/[slug]/page.tsx`.
- Removed the three older standalone article pages that had inconsistent layout and encoding noise.
- Rewrote the article data in `lib/articles.ts` with cleaner technical framing, shorter sections, and easier-to-scan bullets.
- Updated `components/BlogArticleLayout.tsx` and the dynamic article renderer for a more readable article page structure.
- Verified the update with lint, production build, route smoke checks, whitespace checks, and sensitive string scanning.

## 2026-05-24 Follow-Up Maintenance

- Removed the NTU Racing lead role from the home-page typewriter rotation.
- Added `docs/CONVERSATION_RECORD.md` to preserve the request timeline, decisions, fixes, and traceability notes from the recovery conversation.
- Linked the conversation record from the README maintenance document list.
- Re-ran integrity checks after the content and documentation update:
  - `npm run lint`
  - `npm run build`
  - production HTTP smoke checks for all primary routes
  - `git diff --check`
  - sensitive string scan excluding `node_modules` and `.next`

## Project Recovery

- Continued the portfolio implementation from `implementation_plan.md`.
- Confirmed the actual Next.js project root is `d:\My web\portfolio`.
- Verified the repository remote is `git@github.com:Ktliu-Tyler/portfolio.git`.
- Recovered the app from an incomplete intermediate state and made it suitable for Vercel deployment.

## Core Site Implementation

- Added bilingual site structure with a client-side language provider.
- Set English as the default language and kept Chinese as an optional language.
- Added a fixed responsive navigation bar, language switcher, theme toggle, and footer.
- Added shared UI components for glass cards, animated sections, count-up stats, typewriter text, bento grids, timelines, and blog article layout.
- Added a Three.js background for the home page and verified that the canvas renders on desktop and mobile.
- Added light/dark theme support with readability fixes for white card backgrounds.
- Updated SEO metadata to position the site as a software and embedded systems portfolio.

## Content Improvements

- Rewrote the public-facing English copy toward a more professional technical portfolio tone.
- Reframed the home page around software, embedded systems, telemetry, IoT, data tooling, and modern web applications.
- Reorganized the Projects page into a more accurate technical timeline based on public GitHub repository records.
- Added project entries for:
  - Pixy Line Tracking Car
  - NTU Racing Remote Monitor
  - MakeNTU NXP AVNET
  - CANdecoder
  - GPS tooling
  - Raspberry Pi CAN monitor
  - IoT controller projects
  - Stock Analysis Taiwan

## Blog And Technical Writing

- Created a shared article data layer in `lib/articles.ts`.
- Updated the blog listing page to render from shared article metadata.
- Added a dynamic article route at `app/blog/[slug]/page.tsx`.
- Added repository references to the blog article layout.
- Added six technical articles based on public GitHub repository records:
  - `vehicle-telemetry-stack`
  - `dbc-can-decoder`
  - `gps-data-acquisition`
  - `hardware-communication-protocols`
  - `iot-control-system`
  - `stock-analysis-dashboard`
- Kept the existing three articles available:
  - `racing-team`
  - `can-protocol`
  - `dev-journey`

## Verification Completed

- `npm run lint` passed.
- `npm run build` passed.
- Static generation confirmed for 15 routes.
- Browser smoke checks confirmed that the following routes render with headings and no runtime error overlay:
  - `/`
  - `/projects`
  - `/blog`
  - `/blog/vehicle-telemetry-stack`
  - `/blog/dbc-can-decoder`
  - `/blog/gps-data-acquisition`
  - `/blog/hardware-communication-protocols`
  - `/blog/iot-control-system`
  - `/blog/stock-analysis-dashboard`
  - `/blog/racing-team`
  - `/blog/can-protocol`
  - `/blog/dev-journey`

## Remaining Editorial Work

- Add real screenshots, architecture diagrams, and sample outputs for the strongest projects.
- Add per-article SEO metadata and Open Graph images.
- Professionalize the Chinese translation content; the current default experience is English.
- Add a resume/CV download and LinkedIn link when the final assets are ready.
- Consider migrating from `next lint` to the ESLint CLI before Next.js 16.


## 2026-09-07 — 私人內容管理（本機）

- 新增單一擁有者登入、伺服器端 session 與同源寫入檢查；原 publisher 也改用相同登入。
- 63 筆內容與 22 張圖片遷入私人 SQLite/libSQL 資料庫，5 份獎狀／證明固定私密，書卷獎經歷預設私密。
- 移除前端硬編碼的文章、經歷及作品翻譯資料，所有公開頁面與 sitemap 只查詢公開內容；媒體逐次檢查權限且禁止快取。
- 新增搜尋／篩選、公開切換、本人預覽、私密草稿、操作紀錄、下載備份、CLI 還原與更改密碼。
- 依使用者回覆保持本機工作，沒有推送或部署正式站。操作與上線步驟見 PRIVATE_ADMIN.md。
- 驗證：正式建置與 lint 通過；71 項正式模式 HTTP 整合測試通過，含備份還原；npm audit 無已知漏洞。沒有執行瀏覽器視覺測試。

## 2026-09-07 — 安全檢查與分階段優化

- 依新增需求檢查私人管理、草稿來源、匯出流程與有限正式站狀態，保留本機完成／日後上線的範圍。
- 將既有請求、附件與草稿安全驗證 helper 整合到所有相關入口：限制大小、格式與輸出路徑，拒絕可執行 frontmatter，限制外部 API 主機、重新導向、逾時及回應大小。
- 增加帳號版本與交易檢查，防止改密碼和舊密碼登入競爭；scrypt-v2 自動升級舊密碼雜湊，沒有重設使用者密碼。
- AI 草稿改為明確選用；store:false、暫存附件清理及失敗提醒。實際 AI／GitHub 外部寫入沒有執行。
- 檢查並驗證管理頁 nonce CSP、安全標頭與無快取；真實瀏覽器以合成資料走過登入、私人預覽、公開／私密切換與登出，未見 console 錯誤。
- 最新正式建置及 lint 通過；91 項 HTTP 整合檢查、11 項安全單元測試通過；依賴 audit 為 0。
- 正式站僅做 3 個 HEAD 唯讀請求，確認舊獎狀圖片仍公開可取，舊 publisher 頁匿名回傳 200；未推論或測試匿名寫入權限。尚未部署，因此線上問題仍待處理。
- 新增 SECURITY_REVIEW.md、OPTIMIZATION_ROADMAP.md，列出已完成與待辦功能、每步驗收條件及下一步文章編輯／版本復原；同步更新使用及上線指南。

## 2026-09-07 — 本地素材整理與私密圖文文章

- 比對正式站文章／作品／經歷 HTML、本機 63 筆內容、13 份課程 PDF 與 82 張 JPG／PNG 素材，未使用學長參考文件或聯絡資料撰文。
- 新撰 12 篇中文文章（7 個新主題、5 篇中文擴寫），匯入 25 張原始照片、介面截圖或報告頁面；全部以私人文章關聯管理，沒有加入 public 資料夾。
- 匯入在交易內完成並先備份；原有 63 筆內容、版本與公開設定逐筆比對保留。資料庫目前共 75 筆內容、47 份圖片。
- 管理預覽補上摘要、標籤、來源、相關紀錄與僅本人可見的待確認事項，調整內文段落留白及封面重複問題。
- 建置與型別檢查通過；217 項新文章／媒體權限檢查通過；隔離資料庫的桌面和手機瀏覽器預覽無觀察到的 console 錯誤。
- 私人素材盤點、文章索引、來源、備份和匯入結果存於 .private/editorial；正式網站沒有推送或部署，舊部署仍和本機權限不同。

## 2026-09-08 — 私人管理中英文介面

- 新增僅含介面文案的 adminTranslations 與管理語言控制，沿用前台 LanguageProvider／lang 儲存設定；登入頁與管理導覽在桌面和手機都能直接選擇繁體中文或英文。
- 完成登入、搜尋／篩選、公開確認、成功訊息、操作歷史日期、文章草稿、素材分類、私人預覽和密碼設定的雙語顯示；已出現的錯誤及成功訊息會隨語言即時切換。
- 私人預覽保留伺服器身分驗證與 Markdown 渲染，僅把必要的預覽資訊傳給介面元件。文章內容、來源、待確認備註與文章語言選項保留原值。
- 同步翻譯前台共用的管理登入連結、回頂端及導覽按鈕的無障礙標籤，管理頁標題使用中英並列。
- 正式模式建置／lint／型別檢查通過；91 項權限整合檢查、217 項文章／圖片整合檢查、11 項安全單元測試通過。HTTP 測試配合既有預設英文，更新管理介面的文字斷言。
- 使用隔離的合成資料及文章資料庫副本進行 Chrome 實測：登入錯誤、公開／私密切換、操作紀錄、密碼不一致提示、草稿生成及私密儲存、中英切換、重新整理記憶、預覽來源與待確認標籤。390px 手機排版未見橫向溢出，未觀察到 JavaScript 錯誤。
- 實際文章／圖片／管理帳號沒有因介面切換而變更，未推送或部署正式網站。
