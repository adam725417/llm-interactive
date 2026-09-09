# v4 改版重點

## 保留
- v3 日系清新視覺
- 大螢幕投影字級
- 單頁低文字密度
- 生活化案例
- 兩題小測驗
- 鍵盤左右切頁
- localStorage 學習進度

## 加強
每堂課由 5 頁增加為 8 頁：
1. 一句話懂
2. 生活案例
3. 流程
4. 正式原理與名詞
5. 互動實驗
6. 企業工作案例
7. 小測驗 1
8. 小測驗 2

新增或強化的知識：
- Token / Tokenizer / Vocabulary
- Logits / Softmax / Temperature / Sampling / Greedy
- Embedding / Cosine Similarity / Semantic & Hybrid Search
- Transformer / Self-Attention / QKV / Context Window
- Pretraining / SFT / Preference / Alignment / Grounding
- Parameters / Dense / MoE / Latency / Token Cost
- Multimodal
- Prompt / Context Engineering / Structured Output
- RAG / Chunking / Metadata / Hybrid / Reranker / Citation
- Tool Calling / Workflow / Agent
- MCP / Skill / Memory / IAM / Audit
- Evals / Hallucination / Prompt Injection / Guardrails / Governance

## 12 個互動實驗
- 簡化 Tokenizer
- Temperature 機率滑桿與抽樣
- Embedding 相似度排行
- Attention 概念點選
- Training stage 切換
- 模型 / Token / 任務成本取捨
- Multimodal evidence 組合
- Prompt 完整度
- RAG Keyword / Vector / Hybrid / Rerank
- Workflow vs Agent 情境判斷
- MCP / Skill / Memory 能力組裝
- Eval / Release 判斷

## v4.1 — Temperature 飲料互動案例

- 將原本「準時 / 確認 / 留意」Temperature Demo 全面改成飲料案例。
- 低 Temperature 時，機率更集中，畫面上明顯可能出現的飲料較少。
- 高 Temperature 時，原本低機率的飲料更容易出現，選擇更有變化。
- 新增「抽一次下一杯飲料」與最近 8 次抽樣紀錄，方便直接比較低溫與高溫的穩定度。
- 飲料候選：紅茶、奶茶、綠茶、咖啡、果汁、珍珠奶茶。
- 教學文字改成：「低溫比較一致，高溫比較多變」，並保留技術上正確的機率分布說明。


## v4.2 — 課程順序與 Transformer / QKV 重構

- 全站移除每堂課的「約 X 分鐘」顯示。
- Embedding 從第 3 課移到第 8 課，直接放在 RAG 前，學習路徑改為 Prompt / Context → Embedding → RAG。
- Transformer 調整為第 3 課，先建立整體架構，再講 Self-Attention。
- Q / K / V 重寫為「Q 在找什麼、K 提供匹配線索、V 提供真正內容」。
- 新增 Q × K → Softmax → Attention weight → 加權 V 的白話流程。
- 補上 Multi-Head Attention、Feed-Forward、Residual、Normalization，避免把 Transformer 等同於 Attention。
- Attention Demo 改為可點選候選 Token，直接看到 K 的線索、Q×K 匹配程度與 V 會帶回的內容。
