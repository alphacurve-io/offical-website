# 服務流程圖片目錄

此目錄存放四階段合作流程的圖片。

## 目錄結構

```
src/assets/services/
├── consulting.jpg    # 01 顧問諮詢階段圖片
├── planning.jpg      # 02 系統規劃階段圖片
├── development.jpg   # 03 系統開發與整合階段圖片
└── maintenance.jpg   # 04 長期技術維運階段圖片
```

## 圖片規格建議

- **格式**: JPG 或 PNG
- **尺寸**: 建議 800x600px 或更高解析度
- **檔案大小**: 建議控制在 500KB 以內以確保載入速度

## 使用方式

圖片路徑在 `src/content/service-model-content.js` 中設定：

```javascript
{
  id: "consulting",
  image: "services/consulting.jpg", // 對應 src/assets/services/consulting.jpg
  // ...
}
```

圖片會在卡片 hover 時以折頁動畫效果顯示。