# Tyler's Portfolio Website

個人作品集網站，展示專案、文章和紀錄。

## 技術棧

- **Next.js 15** - React 框架
- **TypeScript** - 型別安全
- **Tailwind CSS** - 樣式設計
- **Framer Motion** - 動畫效果
- **Gray Matter** - Markdown 支持

## 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000) 查看網站。

### 構建和部署
```bash
npm run build
npm start
```

## 項目結構

```
portfolio/
├── app/
│   ├── layout.tsx        # 主佈局
│   ├── page.tsx          # 首頁
│   ├── projects/         # 作品集
│   ├── blog/             # 部落格
│   └── notes/            # 紀錄
├── components/           # React 組件
├── content/
│   ├── blog/             # Markdown 文章
│   └── notes/            # 個人紀錄
├── public/               # 靜態資源
└── styles/               # 全域樣式
```

## 部署到 Vercel

1. 推送到 GitHub
2. 訪問 [Vercel](https://vercel.com)
3. 導入 GitHub repo
4. 自動部署完成！

## 作者

**Tyler** - [GitHub](https://github.com/Ktliu-Tyler)
