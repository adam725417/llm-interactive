# 手動更新 GitHub Pages

這份資料夾就是網站原始檔，不需要 npm / build。

## 建議做法
1. 先備份 `adam725417/llm-interactive` 現有內容。
2. 將 repository 內舊版網站檔案刪除或覆蓋。
3. 把本資料夾「內容」上傳到 repository 根目錄（不要再多包一層資料夾）。
4. 根目錄必須看得到：
   - `index.html`
   - `src/`
   - `assets/`
   - `.nojekyll`
   - `.github/workflows/deploy.yml`
5. Commit 到 `main`。
6. 到 GitHub → Actions 確認 Pages workflow 完成。
7. 開啟：`https://adam725417.github.io/llm-interactive/`

## 重要
不要上傳 `payload/`、`boot.js`、`recovery-index.html` 或任何 gzip/base64 loader。這些不是原始網站需要的檔案。
