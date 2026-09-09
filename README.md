# LLM 學習站 v4.2｜日系清新 × 完整內容版

這版保留大螢幕投影風格與低文字密度，但重新調整知識順序，讓概念更符合學習邏輯。

## 課程結構

12 堂課，每堂拆成 8 個短畫面：
1. 一句話懂
2. 生活案例
3. 四步驟流程
4. 再多懂一點（正式技術名詞）
5. 動手試試（互動 Demo）
6. 工作現場（企業案例）
7. 小測驗 1
8. 小測驗 2

> 已移除每堂課的「約 X 分鐘」顯示，讓老師可依現場節奏自由教學。

## 12 堂課（v4.2 新順序）

1. Token / Tokenizer / Next-token Prediction
2. Logits / Softmax / Temperature / Sampling
3. **Transformer / Self-Attention / QKV / Multi-Head Attention / Context**
4. Pretraining / SFT / Preference / Alignment
5. Parameters / Dense / MoE / Latency / Cost
6. Multimodal AI
7. Prompt / Context Engineering / Structured Output
8. **Embedding / Vector / Semantic Search / Hybrid Search**
9. **RAG / Chunking / Retrieval / Hybrid / Reranker / Citation**
10. Tool Calling / Workflow / Agent
11. MCP / Skill / Memory / IAM / Audit
12. Evals / Hallucination / Prompt Injection / Guardrails / Governance

### 為什麼把 Embedding 移到 RAG 前？

先理解「文字怎麼變向量、怎麼算語意相似」，再進 RAG 的 Retrieve / Vector Search，學生會比較容易把整個流程接起來，而不會太早碰到向量後面卻隔很多課才看到用途。

### Transformer / QKV 這課現在怎麼教？

先講 Transformer 是整體架構，再進 Self-Attention。Q / K / V 用一條清楚的白話邏輯帶：

- Q：我現在想找什麼？
- K：我有哪些線索可以跟你配對？
- V：如果你注意到我，我真正提供什麼內容？
- Q × K → 分數 → Softmax → 權重 → 加權 V

並補上 Multi-Head Attention、Feed-Forward、Residual、Normalization，避免學生把 Transformer 誤解成「只有 Attention」。

## 執行

這是純靜態網站，可直接開 `index.html`，或用簡單 HTTP server：

```bash
python -m http.server 8080
```

然後開啟 `http://localhost:8080`。

## GitHub Pages

直接把整個資料夾內容放到 GitHub Pages 專案根目錄即可，不需要 npm build。

## v4.1 → v4.2

- 保留 Temperature 飲料互動案例。
- 移除所有「約 X 分鐘」。
- Embedding 從第 3 課移到第 8 課，緊接在 RAG 前。
- Transformer 提前為第 3 課，Q / K / V 與 Self-Attention 重寫並新增更清楚的互動示意。
