# 視差兔兔 - Parallax Rabbit

## 多語言靜態網站架構

此專案已升級為多語言靜態網站架構，支援以下語言：

- 🇹🇼 繁體中文 (zh)
- 🇺🇸 英文 (en)  
- 🇯🇵 日文 (ja)

## 網站結構

```
/                   # 語言檢測和自動跳轉頁面
├── zh/            # 中文版本
│   └── index.html
├── en/            # 英文版本
│   └── index.html
├── ja/            # 日文版本
│   └── index.html
├── images/        # 共用圖片資源
├── js/            # 共用JavaScript檔案
├── lang/          # 語言檔案
│   ├── zh.json
│   ├── en.json
│   └── ja.json
└── vercel.json    # Vercel部署配置
```

## 語言檢測機制

1. **自動檢測**: 首頁會自動檢測瀏覽器語言偏好
2. **記住選擇**: 使用localStorage記住用戶的語言選擇
3. **手動切換**: 提供手動語言選擇選項
4. **SEO友好**: 每個語言版本都有獨立的URL和meta標籤

## 部署到Vercel

1. 推送代碼到GitHub
2. 在Vercel中導入專案
3. Vercel會自動讀取`vercel.json`配置
4. 支援多語言路由和SEO優化

## 本地開發

```bash
# 使用Python啟動本地服務器
python -m http.server 8000

# 或使用Node.js
npx http-server

# 訪問 http://localhost:8000
```

## 語言版本URL

- 中文: `https://your-domain.com/zh/`
- 英文: `https://your-domain.com/en/`
- 日文: `https://your-domain.com/ja/`

## 技術特點

- ✅ 靜態生成，SEO友好
- ✅ 社交媒體預覽支援
- ✅ 自動語言檢測
- ✅ 響應式設計
- ✅ 視差效果和互動體驗
- ✅ 支援桌面和移動設備 