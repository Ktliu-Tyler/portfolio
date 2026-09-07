# Error Log

Last updated: 2026-05-24

## 1. Vercel Build Type Error: Unused Import

- Location: `app/projects/page.tsx`
- Symptom: `Type error: 'Link' is declared but its value is never read.`
- Cause: `Link` was imported but not used.
- Fix: Removed the unused import.
- Verification: `npm run build` passed afterward.

## 2. Three.js Background Ref Error

- Location: `components/ThreeDBackground.tsx`
- Symptom: `Block-scoped variable 'container' used before its declaration.`
- Cause: A local variable shadowed the container ref.
- Fix: Replaced the invalid reference with `const container = containerRef.current`.
- Verification: `npm run build` passed and browser canvas checks confirmed rendering.

## 3. Framer Motion Easing Runtime Error

- Location: `components/TypewriterEffect.tsx`
- Symptom: Next.js runtime overlay showed `Invalid easing type 'steps(2)'`.
- Cause: Framer Motion did not accept CSS-style `steps(2)` as an easing value.
- Fix: Changed the cursor animation easing to `linear`.
- Verification: `/projects`, `/blog`, and article pages rendered without runtime overlays.

## 4. Light Theme Contrast Problems

- Locations:
  - `components/GlassCard.tsx`
  - `app/globals.css`
  - `app/projects/page.tsx`
  - article tag styles
- Symptom: White or very light text appeared on white card backgrounds.
- Cause: Some components used dark-mode-oriented text colors while the theme switch only removed `dark` without consistently applying a `light` state.
- Fix:
  - Synchronized `dark`, `light`, and `data-theme`.
  - Added light-theme readability fallbacks.
  - Adjusted badge and tag colors for light/dark mode separately.
- Verification: Browser contrast checks passed for key pages in both themes.

## 5. Build Failure While Dev Server Was Running

- Location: `.next/trace`
- Symptom: `EPERM: operation not permitted, open 'D:\My web\portfolio\.next\trace'`
- Cause: Windows file lock from an active Next.js dev server.
- Fix: Stopped the dev server before running `npm run build`.
- Verification: Production build passed after stopping the server.

## 6. Terminal Encoding Noise

- Location: PowerShell output for Chinese text files.
- Symptom: Some terminal output appeared as mojibake.
- Cause: Console decoding/display issue, not necessarily file corruption.
- Fix: Used targeted file reads and browser rendering checks instead of trusting noisy terminal display.
- Verification: The app rendered English defaults correctly in browser checks.

## 7. WebGL Pixel Read False Negative

- Location: Three.js canvas verification.
- Symptom: Direct pixel reads from the WebGL canvas returned blank samples.
- Cause: Transparent WebGL buffer behavior can make direct `readPixels` or copied canvas sampling unreliable.
- Fix: Used visual screenshot differencing by comparing canvas-visible and canvas-hidden screenshots.
- Verification: Desktop and mobile screenshots showed measurable visual differences.

## 8. Dev Server Browser Navigation Timeout

- Location: Playwright smoke test against `next dev`.
- Symptom: Waiting for `networkidle` or `domcontentloaded` sometimes timed out during dev mode.
- Cause: Next.js dev server and HMR can keep connections active or delay navigation readiness.
- Fix: Used HTTP checks and Playwright `commit` navigation plus heading assertions.
- Verification: All key routes returned HTTP 200 and rendered headings without runtime error overlays.

## 9. Git Dubious Ownership Warning In Sandboxed Environment

- Location: local repository access from the sandboxed shell.
- Symptom: `fatal: detected dubious ownership in repository at 'D:/My web/portfolio'`.
- Cause: The repository is owned by the normal Windows user, while the shell command was executed as a sandbox user.
- Fix: Used a command-scoped Git safe directory option instead of changing global Git configuration.
- Verification: `git -c safe.directory='D:/My web/portfolio' status --short --branch` returned the expected branch state.

## 10. Home Page Role Label Review

- Location: `app/page.tsx`
- Symptom: The home-page typewriter rotation included a role label related to NTU Racing lead work.
- Cause: The typewriter used every role key from the hero translation group.
- Fix: Removed the third role from the home-page typewriter list so the cover no longer cycles through that label.
- Verification: The remaining typewriter list contains software development, embedded systems, and IoT systems roles.


## 2026-09-07 — 管理登入與私人預覽驗證

- Next.js 本機 request.url 的 localhost 正規化，會與瀏覽器使用的 127.0.0.1 Origin 不同。僅對明確 loopback Host 做本機來源比對，正式部署使用 ADMIN_ORIGIN，跨來源請求仍拒絕。
- 預覽頁的 RSC 動態參數保留百分比編碼，造成 article%3A... 無法查到資料。先解碼並驗證 kind:slug 格式後再查詢，私人文章與獎狀預覽均已通過 HTTP 測試。
- 更新 Next.js 至 15.5.25，並使用 PostCSS 8.5.28 排除既有依賴公告；以 npm 修正過時的巢狀 lock entry 後 audit 為零。

## 2026-09-07 — 安全邊界修正

- 草稿儲存原本使用 gray-matter 解析可控標頭；其可選 JavaScript 引擎能執行程式。改為非執行式標頭移除，拒絕語言標頭與不完整標頭，並加入回歸測試。
- 非同步密碼驗證可能在密碼已變更後才完成。改以帳號版本與寫入交易重查，session 綁定版本；同時改密碼只有一個請求能成功。
- 匯出路徑及附件驗證現在於任何 GitHub 寫入前完成；路徑越界、檔案偽裝、過大或格式錯誤的請求由安全錯誤回應拒絕。
- 安全單元測試初次建置的 headers 參數推導過窄；補上 Record<string,string>，後續正式建置與 11 項測試通過。
- 正式站舊獎狀公開問題尚未解決：本機移除 public 資產無法改變已部署版本，需按 SECURITY_REVIEW.md 的上線檢查處理。

## 2026-09-07 — 私人圖文整理

- PDF 抽取的主控台 CP950 無法輸出個別字元，改以 UTF-8 輸出；文件內容存於私人工作目錄。
- 管理預覽的來源 name 是選填欄位，初次建置產生型別錯誤；增加 url/type 備援名稱，後續建置及型別檢查通過。
- 原報告印刷頁碼與 PDF 頁序相差一頁，已核對並修正新草稿的成績來源頁碼，保留兩種頁碼供審閱。
