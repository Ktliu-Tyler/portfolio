# 網站安全檢查報告

日期：2026-09-07。對象：本機 Next.js 私人管理版本，以及既有正式網站的有限唯讀檢查。

## 結論

本機已修正本次發現的草稿解析、匯出路徑、請求大小與登入競爭問題，並通過權限測試與瀏覽器管理流程驗證。**正式站尚未部署新版，已確認舊獎狀圖片仍公開可取。** 這項問題尚未解決，不能用本機測試結果代表正式站安全。

本次檢查包括原始碼、依賴公告、正式模式 HTTP 整合測試、安全單元測試及隔離資料的真實瀏覽器操作。正式站只做 3 次 HEAD 請求，沒有嘗試猜密碼、寫入內容、產生 AI 請求或建立 GitHub PR。這是針對目前功能的安全檢查，不是全站滲透測試或無漏洞保證。

## 發現與處理

以下等級是依本站資料與使用情境判斷的處理優先度，不是 CVSS 評分。

| 等級 | 發現 | 處理及狀態 |
| --- | --- | --- |
| 高 | 正式站舊獎狀 URL 仍回傳 200、image/jpeg，且為公開快取設定 | **待上線處理。** 本機已移除 public 原檔並改為受權限控制的資料庫媒體。需另檢查正式站、舊部署、Git 歷史與既有快取 |
| 高 | 儲存草稿原先把可控的 MDX 交給 gray-matter；其 JavaScript frontmatter 引擎會執行程式 | **本機已修正。** 不再解析可執行標頭，只移除純文字 frontmatter；語言標頭與未終止標頭拒絕。此入口仍需本人登入，未發現匿名執行路徑 |
| 中 | 草稿及 AI 回傳資料可包含未限制的匯出路徑 | **本機已修正。** slug、資產路徑、對應附件及重複名稱均在任何 GitHub 寫入之前驗證；限制在該文章的圖片目錄 |
| 中 | 非同步驗證舊密碼與同時改密碼之間有競爭空間 | **本機已修正。** 登入與密碼變更使用帳號版本及交易檢查；舊版本 session 無效，並提升 scrypt 工作參數 |
| 中 | 請求與上游回應缺少一致大小限制，附件不能只相信副檔名 | **本機已修正。** 串流實際位元組上限、JSON 格式／類型限制、檔名及檔頭檢查；附件最多 8 件、單件 3 MiB、整份表單 4 MiB |
| 中 | 外部來源與錯誤回傳需要收斂 | **本機已修正。** GitHub 網址格式限制；只允許 HTTPS GitHub／OpenAI API、拒絕重新導向、20 秒逾時、2 MiB 回應上限；不直接把上游錯誤本文回傳給瀏覽器 |
| 中 | 正式站舊 `/admin/publisher` 匿名請求回傳 HTML 200 | **待新版上線。** 這證明舊管理頁仍可見，不能推論其寫入 API 可被匿名使用；本機私人管理頁已要求登入 |
| 加強 | 管理頁防止外站嵌入與未授權腳本 | **已驗證。** nonce CSP、不允許正式模式 unsafe-eval、frame-ancestors none／X-Frame-Options DENY、nosniff、禁止快取；瀏覽器互動正常 |
| 加強 | 私人草稿不應默認送往外部 AI | **本機已修正。** AI 預設關閉；明確勾選才送 OpenAI，設定 store:false，處理結束後嘗試刪除本次上傳的暫存附件；清除失敗會在草稿中提示 |

附件檔頭檢查不是病毒掃描。OpenAI 的 store:false 與暫存檔刪除，也不代表供應商所有系統都零留存；啟用前仍須依實際帳號與供應商政策判斷。外部 AI／GitHub 成功流程本次沒有用真實服務憑證執行。

## 正式站唯讀證據

檢查主機：`portfolio-5wie.vercel.app`。僅列出必要路徑，不在報告中嵌入私人影像。

| HEAD 路徑 | 觀察結果 | 能支持的結論 |
| --- | --- | --- |
| `/` | 200 HTML，HSTS 存在，未收到 CSP | HTTPS 政策存在；不能據此確認所有子頁的腳本安全 |
| `/admin/publisher` | 200 HTML，未收到 CSP | 舊管理頁可匿名取得；未測試正式站 API 寫入 |
| `/images/experience/dean-list-113-2-redacted.jpg` | 200 image/jpeg，Cache-Control: public, max-age=0, must-revalidate | 一份舊獎狀影像仍可直接存取 |

## 已完成的驗證

| 驗證 | 結果與範圍 |
| --- | --- |
| `npm run test:privacy` | 91 項檢查通過：登入限流、同源限制、私密直連／圖片、狀態切換、草稿、備份還原、cookie 撤銷／到期、帳號版本、同時改密碼、輸入限制及 CSP |
| `npm run test:security` | 11 項測試通過：未附 Content-Length 的超限串流、格式錯誤、可執行標頭、路徑越界、GitHub URL、外部請求限制、回應大小、偽裝附件、不安全連結、密碼雜湊 |
| `npm run build` / `npm run lint` | 正式建置、型別與 lint 通過 |
| 瀏覽器操作 | 使用只有假資料的獨立資料庫，實際登入、私人預覽、確認公開、改回私密、登出；登出後開私人預覽轉回登入頁，沒有觀察到 console／頁面錯誤 |
| `npm audit --json` | 當日已安裝依賴回報 0 項已知漏洞（包含開發依賴）；Next.js 15.5.25、PostCSS 8.5.28 |
| 檔案／前端檢查 | `.private` URL 無法讀取；前端建置檔未找到指定獎狀檔名及標記；app/components/lib/scripts 的常見 token 字面值掃描沒有命中。這不是所有機密或 Git 歷史的完整掃描 |

整合測試使用獨立資料庫與測試密碼，不修改使用者內容。瀏覽器測試使用合成文章，沒有讀取或顯示本人的實際登入密碼。AI／GitHub 網路防護以單元測試與被拒絕的請求驗證，沒有送出私人資料至外部服務。

## 尚未涵蓋與下一步

1. **正式部署與舊公開副本：最高優先。** 雲端資料庫準備後依上線指南部署，重新確認舊圖片 URL、私人頁、媒體、sitemap 和舊部署。Git 歷史移除及舊部署刪除需要另行規劃，這次沒有重寫歷史或刪除部署。
2. **帳號復原與第二因素。** 目前只有密碼，尚無 Passkey／雙重驗證。單一擁有者共用每 15 分鐘 10 次登入嘗試額度，可降低猜測速度，但惡意嘗試也可能暫時阻礙本人登入；正式上線可搭配邊緣層限制與告警。
3. **本機檔案與備份。** `.private` 已排除 Git、部署及網頁存取，但 SQLite 與 JSON 備份本身沒有由應用程式加密；作業系統帳號／磁碟權限仍須保護它們。初始密碼檔應在換密碼並妥善保存後移除。自動加密備份、保留期限與復原演練尚未實作。
4. **遠端環境。** 尚未測試真實 Turso、Vercel 環境變數、CDN／舊部署撤除、WAF 或供應商檔案清理。正式上線前仍需依部署後流程驗證。
5. **持續檢查。** 依賴公告會變動；每次登入、內容發布或媒體儲存層變更，都應重跑相關安全測試。效能、完整無障礙與所有公開頁面的跨瀏覽器檢查列入後續優化。

完整待辦與驗收條件見 [逐步優化清單](OPTIMIZATION_ROADMAP.md)。nonce CSP 設計參考 [Next.js CSP 指南](https://nextjs.org/docs/app/guides/content-security-policy)；登入與 session 檢查參考 [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) 及 [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)。
