import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

// ---- RAG data ----
const RAG_QUERY = '台灣半導體產業最新發展有哪些？';
const RAG_DOCS = [
  { id: 1, title: '台積電 Q3 財報摘要', source: 'tsmc.com', content: '台積電在 2024 年 Q3 營收達到 7,628 億新台幣，3 奈米製程貢獻 17% 營收，AI 晶片需求強勁。', relevant: true },
  { id: 2, title: '半導體補貼政策報告', source: 'moea.gov.tw', content: '政府宣布《晶片安全法案》修正案，補貼本地晶圓廠建設，預計帶動 5,000 億新台幣投資。', relevant: true },
  { id: 3, title: '2024 台灣旅遊指南', source: 'tourism.tw', content: '台北 101 是台灣最知名的地標，每年吸引超過 300 萬遊客，頂樓觀景台可俯瞰整個台北盆地...', relevant: false },
  { id: 4, title: '先進封裝技術突破', source: 'digitimes.com', content: 'CoWoS 封裝產能翻倍，CoWoS-S 技術應用於 H100/H200 GPU，推動 AI 基礎設施快速成長。', relevant: true },
];

// ---- Agent data ----
const AGENT_TOOLS = [
  { id: 'db', label: 'DB Query（資料庫查詢）', icon: '🗄️', desc: '查詢公司訂單資料庫', result: '最近 30 天訂單：共 1,247 筆，總金額 $4,892,300，最大訂單 $125,000（企業客戶 A），最小訂單 $199（個人訂閱）。' },
  { id: 'erp', label: 'ERP API（企業系統介面）', icon: '🏭', desc: '存取企業資源規劃系統', result: '退款訂單：37 筆，退款金額 $89,400。異常訂單標記：3 筆需人工審查。庫存警示：2 個 SKU 庫存低於安全水位。' },
  { id: 'calc', label: 'Calculator（計算工具）', icon: '🧮', desc: '進行數值計算', result: '平均訂單金額：$4,892,300 ÷ 1,247 = $3,924。日均訂單金額：$4,892,300 ÷ 30 = $163,077。' },
];

const Level10: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const done = isCompleted(10);
  const [tab, setTab] = useState<'rag' | 'agent'>('rag');

  // RAG state
  const [selectedDocs, setSelectedDocs] = useState<Set<number>>(new Set());
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [ragGenerating, setRagGenerating] = useState(false);

  // Agent state
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [toolResults, setToolResults] = useState<Record<string, string>>({});
  const [agentAnswer, setAgentAnswer] = useState<string | null>(null);
  const [agentRunning, setAgentRunning] = useState<string | null>(null);

  const [ragDone, setRagDone] = useState(false);
  const [agentDone, setAgentDone] = useState(false);

  const toggleDoc = (id: number) => {
    const next = new Set(selectedDocs);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedDocs(next);
  };

  const generateRagAnswer = () => {
    const relevant = RAG_DOCS.filter(d => selectedDocs.has(d.id) && d.relevant);
    if (selectedDocs.size === 0) return;
    setRagGenerating(true);
    setRagAnswer(null);
    setTimeout(() => {
      if (relevant.length === 0) {
        setRagAnswer('根據您提供的文件，找不到與半導體相關的資訊。（提示：請選擇相關文件！）');
      } else {
        setRagAnswer(`根據最新資料，台灣半導體產業有以下重要發展：

1. **台積電財務表現強勁**：Q3 營收達 7,628 億新台幣，3 奈米製程佔比 17%，AI 晶片需求持續成長。

2. **政府政策大力支持**：《晶片安全法案》補貼政策預計帶動 5,000 億新台幣投資，鞏固台灣半導體戰略地位。

3. **封裝技術突破**：CoWoS 先進封裝產能翻倍，支持 AI 基礎設施快速擴張需求。

資料來源：${relevant.map(d => d.source).join('、')}`);
      }
      setRagGenerating(false);
      setRagDone(true);
      if (agentDone) markComplete(10);
    }, 1500);
  };

  const runTool = async (toolId: string) => {
    const tool = AGENT_TOOLS.find(t => t.id === toolId);
    if (!tool || toolResults[toolId]) return;
    setAgentRunning(toolId);
    await new Promise(r => setTimeout(r, 800));
    setToolResults(prev => ({ ...prev, [toolId]: tool.result }));
    setAgentRunning(null);
  };

  const toggleTool = (id: string) => {
    const next = new Set(selectedTools);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedTools(next);
  };

  const generateAgentAnswer = () => {
    if (selectedTools.size === 0) return;
    setAgentAnswer(null);
    setTimeout(() => {
      const hasDb = selectedTools.has('db');
      const hasCalc = selectedTools.has('calc');
      setAgentAnswer(`📊 **30 天訂單分析報告**

${hasDb ? '• 訂單總量：1,247 筆\n• 訂單總金額：$4,892,300\n• 退款：37 筆，$89,400' : '• （請先執行 DB Query 取得訂單資料）'}

${hasCalc && hasDb ? '• 平均訂單金額：$3,924\n• 日均成交：$163,077\n• 退款率：2.97%' : ''}

${selectedTools.has('erp') ? '• ERP 警示：3 筆異常訂單需人工審查\n• 庫存警示：2 個 SKU 需補貨' : ''}

整體來看，本月業績表現${hasDb ? '穩健，AI 相關產品訂單較上月成長 23%。' : '需要更多資料來分析。'}`);
      setAgentDone(true);
      if (ragDone) markComplete(10);
    }, 1200);
  };

  return (
    <LevelLayout
      levelNumber={10}
      title="RAG & Agent"
      subtitle="落地應用——LLM 如何解決真實問題"
      icon="🚀"
      sticker="RAG（Retrieval-Augmented Generation, 檢索增強生成）解決知識可信度；Agent（代理系統）解決行動與流程自動化——兩者都是 LLM 落地的關鍵技術。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 落地兩大核心</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-bold text-blue-800 mb-1"><Term id="rag" /></h3>
            <p className="text-blue-700 text-sm">先從知識庫檢索相關文件，再讓模型根據文件生成有依據的答案，大幅減少幻覺。</p>
            {isAcademic && <p className="text-blue-500 text-xs mt-2">核心：Embedding → Vector Search → Re-rank → Prompt stuffing</p>}
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-bold text-purple-800 mb-1"><Term id="agent" /></h3>
            <p className="text-purple-700 text-sm">讓 LLM 自主規劃步驟、呼叫外部工具（API/資料庫），完成複雜的多步驟任務。</p>
            {isAcademic && <p className="text-purple-500 text-xs mt-2">核心：ReAct / Plan-and-Execute / Tool calling</p>}
          </div>
        </div>
        {!isAcademic && (
          <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
            <strong>企業視角：</strong> RAG 適合知識問答、文件搜索；
            Agent 適合自動化工作流程（如：自動生成週報、跨系統資料整合）。
            大多數企業 AI 應用同時用到這兩種技術。
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'rag' as const, label: 'RAG 檢索增強', icon: '🔍', done: ragDone },
          { id: 'agent' as const, label: 'Agent 代理系統', icon: '🤖', done: agentDone },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border-2 transition-all ${
              tab === t.id ? 'bg-indigo-600 text-white border-indigo-600' :
              t.done ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
              'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            {t.done && tab !== t.id && <span className="text-xs">✓</span>}
          </button>
        ))}
      </div>

      {/* RAG tab */}
      {tab === 'rag' && (
        <div className="animate-fade-in space-y-4">
          {/* Query */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">📝 用戶問題</h3>
            <div className="bg-gray-100 rounded-xl px-4 py-3 font-medium text-gray-800">
              {RAG_QUERY}
            </div>
          </div>

          {/* Retrieved docs */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-1">📂 Step 1：檢索到 {RAG_DOCS.length} 段文件</h3>
            <p className="text-sm text-gray-500 mb-4">選擇你認為相關的文件（提示：並非全部都有用）</p>
            <div className="space-y-3">
              {RAG_DOCS.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedDocs.has(doc.id)
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${selectedDocs.has(doc.id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                      {selectedDocs.has(doc.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{doc.title}</span>
                    <span className="text-xs text-gray-400 ml-auto">{doc.source}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed ml-6">{doc.content}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">✨ Step 2：根據選定文件生成答案</h3>
            <button
              onClick={generateRagAnswer}
              disabled={selectedDocs.size === 0 || ragGenerating}
              className="btn-primary w-full mb-4"
            >
              {ragGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  生成中...
                </span>
              ) : `根據 ${selectedDocs.size} 份文件生成答案 →`}
            </button>

            {ragAnswer && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line animate-fade-in">
                {ragAnswer}
              </div>
            )}
            {selectedDocs.size === 0 && (
              <p className="text-center text-gray-400 text-xs">請先選擇至少一份文件</p>
            )}
          </div>
        </div>
      )}

      {/* Agent tab */}
      {tab === 'agent' && (
        <div className="animate-fade-in space-y-4">
          {/* Task */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">📋 用戶任務</h3>
            <div className="bg-gray-100 rounded-xl px-4 py-3 font-medium text-gray-800">
              「查詢最近 30 天的訂單總額，計算平均訂單金額，並生成分析報告。」
            </div>
          </div>

          {/* Tool selection */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-1">🔧 Step 1：Agent 選擇工具</h3>
            <p className="text-sm text-gray-500 mb-4">選擇需要呼叫的工具，再執行</p>
            <div className="space-y-3">
              {AGENT_TOOLS.map(tool => (
                <div key={tool.id} className={`rounded-xl border-2 transition-all ${selectedTools.has(tool.id) ? 'border-indigo-400' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 p-3">
                    <button
                      onClick={() => toggleTool(tool.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selectedTools.has(tool.id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-300'}`}
                    >
                      {selectedTools.has(tool.id) && <span className="text-white text-xs">✓</span>}
                    </button>
                    <span className="text-xl">{tool.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{tool.label}</p>
                      <p className="text-xs text-gray-500">{tool.desc}</p>
                    </div>
                    {selectedTools.has(tool.id) && (
                      <button
                        onClick={() => runTool(tool.id)}
                        disabled={!!toolResults[tool.id] || agentRunning === tool.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          toolResults[tool.id]
                            ? 'bg-emerald-100 text-emerald-700'
                            : agentRunning === tool.id
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {toolResults[tool.id] ? '✓ 已執行' : agentRunning === tool.id ? '執行中...' : '▶ 執行'}
                      </button>
                    )}
                  </div>
                  {toolResults[tool.id] && (
                    <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-xl">
                      <p className="text-xs text-gray-500 mb-1">回傳結果：</p>
                      <p className="text-xs text-gray-700 font-mono leading-relaxed">{toolResults[tool.id]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generate answer */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">✨ Step 2：整合工具結果，生成報告</h3>
            <button
              onClick={generateAgentAnswer}
              disabled={selectedTools.size === 0}
              className="btn-primary w-full mb-4"
            >
              根據工具結果生成分析報告 →
            </button>

            {agentAnswer && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line animate-fade-in">
                {agentAnswer}
              </div>
            )}
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-2">
              💡 <Term id="tool-calling" /> 如何運作
            </h3>
            <p className="text-purple-700 text-sm leading-relaxed">
              Agent 根據任務自主決定呼叫哪些工具 →
              執行工具並取得結果 →
              將結果整合進 context →
              生成最終回答。
              這個循環可以重複多次，直到任務完成。
            </p>
          </div>
        </div>
      )}

      {/* Completion */}
      <div className="card mt-6">
        <h2 className="font-bold text-base mb-3">✅ 通關條件</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: '完成 RAG 檢索示範', done: ragDone },
            { label: '完成 Agent 工具呼叫示範', done: agentDone },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${item.done ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
              <span>{item.done ? '✅' : '⭕'}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {done && (
        <div className="card text-center mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="text-5xl mb-3">🎊</div>
          <h3 className="text-2xl font-bold text-indigo-700 mb-2">恭喜完成全部關卡！</h3>
          <p className="text-gray-600 mb-4">
            你已掌握 LLM 的核心概念——從 Token 到 Transformer、
            從多模態到 RAG/Agent。歡迎繼續深入探索！
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs text-gray-500">
            <div className="bg-white rounded-xl p-3">✅ LLM 原理</div>
            <div className="bg-white rounded-xl p-3">✅ Transformer</div>
            <div className="bg-white rounded-xl p-3">✅ 多模態</div>
            <div className="bg-white rounded-xl p-3">✅ 模型演進</div>
            <div className="bg-white rounded-xl p-3">✅ 成本控制</div>
            <div className="bg-white rounded-xl p-3">✅ 風險管理</div>
          </div>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level10;
