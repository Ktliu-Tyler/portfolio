# Conversation Record

Last updated: 2026-05-24

This document summarizes the recovery and hardening work requested during the portfolio completion process. It is intended to make future debugging, content review, and deployment follow-up easier.

## Request Timeline

1. The project was identified as the `Ktliu-Tyler/portfolio` repository, intended for Vercel deployment on a custom domain.
2. The initial implementation had stopped mid-progress, so the recovery work continued from `implementation_plan.md`.
3. A local preview was requested so the current state could be inspected in the browser.
4. Broken blog and project/development-history pages were reported, including a runtime error from the typewriter cursor animation.
5. Light theme contrast issues were reported where white text appeared on white or very light backgrounds.
6. A site-wide professional review was requested, with English as the default language and more mature technical wording.
7. Blog and development-history articles were requested based on public GitHub repository records.
8. Implementation, documentation, workflow notes, error records, verification, commit, and GitHub push were requested.
9. A later correction requested removing the NTU Racing lead role from the home-page typewriter rotation.
10. A follow-up requested newest-to-oldest project ordering and cleaner, more professional article layout and wording.

## Completed Recovery Decisions

- English is the default user-facing experience.
- Chinese remains available as an optional locale.
- The homepage positions the site as a software, embedded systems, vehicle telemetry, IoT, and data tooling portfolio.
- Projects are organized as a chronological technical timeline rather than a casual project gallery.
- Blog content is stored through a shared article metadata layer and rendered through both listing and dynamic article routes.
- Technical writing focuses on repository-backed work to avoid unsupported claims.
- Maintenance records are kept under `docs/` so future errors can be traced without relying on chat history.

## Key Fixes Already Applied

- Removed an unused import that caused a Vercel/TypeScript build failure.
- Fixed a Three.js background ref-shadowing issue.
- Replaced an invalid Framer Motion easing value that caused a runtime overlay.
- Reworked light/dark theme handling and card text colors for contrast.
- Added dynamic blog article routing and regenerated blog listing content from shared metadata.
- Added technical articles for vehicle telemetry, CAN decoding, GPS acquisition, hardware protocols, IoT control, and stock analysis tooling.
- Added work log, development workflow, and error log documentation.
- Removed the NTU Racing lead role from the homepage typewriter rotation while leaving the role represented in the profile section.
- Reordered the project timeline from newest to oldest and consolidated article pages into one structured dynamic renderer.

## Traceability Notes

- If a future build fails on Windows with `.next/trace` permission errors, stop any running Next.js server before rebuilding.
- If Git reports dubious repository ownership inside a sandboxed environment, use a command-scoped safe directory flag:

```bash
git -c safe.directory='D:/My web/portfolio' status --short --branch
```

- If runtime overlays reappear, first check animated components and third-party animation easing values.
- If white-on-white text reappears, inspect both the Tailwind light-mode classes and the `light` or `data-theme` attributes applied by the theme provider.

## Current Expected Verification Flow

```bash
npm run lint
npm run build
```

Then verify the primary routes:

```text
/
/projects
/blog
/blog/vehicle-telemetry-stack
/blog/dbc-can-decoder
/blog/gps-data-acquisition
/blog/hardware-communication-protocols
/blog/iot-control-system
/blog/stock-analysis-dashboard
/blog/racing-team
/blog/can-protocol
/blog/dev-journey
```


## 2026-09-07 — 私人管理需求

使用者要求只有本人可登入的管理介面、逐篇文章與作品公開／私密控制，並將之前的獎狀紀錄搬入私人資料庫，另提供優化功能建議。後續明確選擇「尚未有雲端資料庫，先完成本機版本與上線說明」。本次完成本機實作與測試，保留現有 Vercel 架構，不推送或部署；下一階段建議文章版本復原、自動備份、Passkey／雙重驗證、作品關聯管理及私人附件庫。

## 2026-09-07 — 逐步提升與安全性檢查

使用者進一步要求列出可做到的優化功能清單，逐步提升並檢查安全性。本輪完成第一階段的本機安全修正與驗證，建立包含功能順序及驗收條件的 OPTIMIZATION_ROADMAP.md，以及區分本機／正式站狀態的 SECURITY_REVIEW.md。下一步建議從既有內容編輯與版本復原開始。依先前選擇，沒有建立雲端資料庫、推送或部署；正式站仍能取得舊獎狀圖片，已明確記錄為待處理項目。

## 2026-09-07 — 補齊本地素材文章

使用者要求查看網站介面與本地資料庫尚未更新的內容，撰寫文章、搭配圖片並先設為不公開。已根據本地課程報告、現有紀錄與圖片整理 12 篇中文私密文章和 25 張配圖，原有內容及公開狀態保留。後台預覽可查看來源與待確認事項；詳細私人盤點在 .private/editorial/README.md。保持本機版本，未部署正式站。
