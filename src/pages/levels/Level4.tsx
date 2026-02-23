import React, { useState, useRef, useLayoutEffect } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

// ---- Data ----
interface WeightEntry { tokenIdx: number; weight: number; reason: string }

const SENTENCES = [
  {
    id: 'A',
    text: '小明拿起蘋果，他咬了一口，因為它很甜。',
    tokens: ['小明', '拿起', '蘋果', '，', '他', '咬了', '一口', '，', '因為', '它', '很', '甜', '。'],
    clickable: [0, 2, 4, 9],
    attentionData: {
      0: [{ tokenIdx: 0, weight: 1.0, reason: '自身' }, { tokenIdx: 1, weight: 0.72, reason: '動作關係' }, { tokenIdx: 4, weight: 0.48, reason: '後文指代' }, { tokenIdx: 2, weight: 0.35, reason: '受詞關係' }, { tokenIdx: 5, weight: 0.25, reason: '間接相關' }],
      2: [{ tokenIdx: 2, weight: 1.0, reason: '自身' }, { tokenIdx: 0, weight: 0.65, reason: '動作主語' }, { tokenIdx: 1, weight: 0.55, reason: '動詞相關' }, { tokenIdx: 9, weight: 0.42, reason: '後文指代' }, { tokenIdx: 11, weight: 0.38, reason: '特性描述' }],
      4: [{ tokenIdx: 4, weight: 1.0, reason: '自身' }, { tokenIdx: 0, weight: 0.87, reason: '指代關係' }, { tokenIdx: 5, weight: 0.52, reason: '動作相關' }, { tokenIdx: 2, weight: 0.21, reason: '上下文' }, { tokenIdx: 6, weight: 0.18, reason: '動作相關' }],
      9: [{ tokenIdx: 9, weight: 1.0, reason: '自身' }, { tokenIdx: 2, weight: 0.82, reason: '指代關係' }, { tokenIdx: 11, weight: 0.45, reason: '語意相關' }, { tokenIdx: 0, weight: 0.12, reason: '上下文' }, { tokenIdx: 4, weight: 0.08, reason: '代詞干擾' }],
    } as Record<number, WeightEntry[]>,
    hint: { 9: '「它」→「蘋果」指代關係', 4: '「他」→「小明」指代關係' } as Record<number, string>,
  },
  {
    id: 'B',
    text: '小華把書放到桌上，然後他離開了教室。',
    tokens: ['小華', '把', '書', '放到', '桌上', '，', '然後', '他', '離開了', '教室', '。'],
    clickable: [0, 2, 7],
    attentionData: {
      0: [{ tokenIdx: 0, weight: 1.0, reason: '自身' }, { tokenIdx: 1, weight: 0.73, reason: '動作標記' }, { tokenIdx: 7, weight: 0.58, reason: '後文指代' }, { tokenIdx: 3, weight: 0.44, reason: '動作相關' }, { tokenIdx: 2, weight: 0.32, reason: '受詞相關' }],
      2: [{ tokenIdx: 2, weight: 1.0, reason: '自身' }, { tokenIdx: 3, weight: 0.68, reason: '動詞相關' }, { tokenIdx: 0, weight: 0.42, reason: '動作主語' }, { tokenIdx: 4, weight: 0.38, reason: '目的地' }, { tokenIdx: 7, weight: 0.15, reason: '上下文' }],
      7: [{ tokenIdx: 7, weight: 1.0, reason: '自身' }, { tokenIdx: 0, weight: 0.91, reason: '指代關係' }, { tokenIdx: 8, weight: 0.63, reason: '動作主語' }, { tokenIdx: 9, weight: 0.22, reason: '場景相關' }, { tokenIdx: 2, weight: 0.15, reason: '上下文' }],
    } as Record<number, WeightEntry[]>,
    hint: { 7: '「他」→「小華」指代關係' } as Record<number, string>,
  },
];

type SvgLine = { x1: number; y1: number; x2: number; y2: number; weight: number };

const Level4: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const done = isCompleted(4);

  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(null);
  const [contextWindow, setContextWindow] = useState(13);
  const [posAnswer, setPosAnswer] = useState<string | null>(null);
  const [clickedTokens, setClickedTokens] = useState<Set<number>>(new Set());
  const [contextAdjusted, setContextAdjusted] = useState(false);
  const [tableUpdates, setTableUpdates] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [svgLines, setSvgLines] = useState<SvgLine[]>([]);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const sentence = SENTENCES[sentenceIdx];

  const resetForSentence = (idx: number) => {
    setSentenceIdx(idx);
    setSelectedTokenIdx(null);
    setSvgLines([]);
    tokenRefs.current = [];
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
      computeLines();
    };
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    update();
    return () => ro.disconnect();
  }, [selectedTokenIdx, sentenceIdx, contextWindow]);

  const computeLines = () => {
    if (selectedTokenIdx === null || !containerRef.current) { setSvgLines([]); return; }
    const weights = sentence.attentionData[selectedTokenIdx];
    if (!weights) { setSvgLines([]); return; }
    const containerRect = containerRef.current.getBoundingClientRect();
    const fromRef = tokenRefs.current[selectedTokenIdx];
    if (!fromRef) return;
    const fromRect = fromRef.getBoundingClientRect();
    const fx = fromRect.left - containerRect.left + fromRect.width / 2;
    const fy = fromRect.top - containerRect.top + fromRect.height / 2;

    const lines: SvgLine[] = [];
    weights.forEach(w => {
      if (w.tokenIdx === selectedTokenIdx) return;
      const toRef = tokenRefs.current[w.tokenIdx];
      if (!toRef) return;
      const toRect = toRef.getBoundingClientRect();
      const tx = toRect.left - containerRect.left + toRect.width / 2;
      const ty = toRect.top - containerRect.top + toRect.height / 2;
      lines.push({ x1: fx, y1: fy, x2: tx, y2: ty, weight: w.weight });
    });
    setSvgLines(lines);
  };

  const handleTokenClick = (idx: number) => {
    if (!sentence.clickable.includes(idx)) return;
    setSelectedTokenIdx(idx);
    const next = new Set(clickedTokens).add(idx);
    setClickedTokens(next);
    setTableUpdates(t => t + 1);
    setTimeout(computeLines, 50);

    // Check completion
    if (next.size >= 2 && tableUpdates + 1 >= 2 && contextAdjusted && posAnswer) {
      markComplete(4);
    }
  };

  const handleContextChange = (val: number) => {
    setContextWindow(val);
    setContextAdjusted(true);
    if (clickedTokens.size >= 2 && tableUpdates >= 2 && posAnswer) {
      markComplete(4);
    }
  };

  const handlePosAnswer = (ans: string) => {
    setPosAnswer(ans);
    if (clickedTokens.size >= 2 && tableUpdates >= 2 && contextAdjusted) {
      markComplete(4);
    }
  };

  const currentWeights = selectedTokenIdx !== null ? (sentence.attentionData[selectedTokenIdx] ?? []) : [];
  const visibleStart = Math.max(0, sentence.tokens.length - contextWindow);

  const progress = [
    clickedTokens.size >= 2,
    tableUpdates >= 2,
    contextAdjusted,
    !!posAnswer,
  ];

  return (
    <LevelLayout
      levelNumber={4}
      title="Transformer & Attention"
      subtitle="轉換器架構與注意力機制可視化"
      icon="🔍"
      sticker="Transformer（轉換器）的關鍵是 Attention（注意力）：每個詞元會回頭看最相關的上下文，透過權重決定「誰對我最重要」。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 核心概念</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <p><Term id="transformer" /> 是現代 LLM 的基礎架構，核心機制是 <Term id="attention" />。</p>
            <p><Term id="self-attention" /> 讓每個 <Term id="token" showChinese={false} /> 能「看向」同句中最相關的其他詞元。</p>
          </div>
          <div className="space-y-2">
            <p><Term id="attention-weights" /> 是每個詞元「注意力分數」的量化，數值 0~1。</p>
            <p><Term id="context-window" /> 是模型能「看到」的最大文字範圍。</p>
          </div>
        </div>
        {isAcademic && (
          <div className="mt-3 bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700">
            <strong>學術補充：</strong> Self-Attention 計算公式：Attention(Q,K,V) = softmax(QK⊤/√d_k)V。
            Query、Key、Value 三個矩陣由輸入線性變換得到，支援多頭並行（Multi-head Attention）。
          </div>
        )}
      </div>

      {/* Progress checklist */}
      <div className="card mb-6">
        <h2 className="font-bold text-base mb-3">✅ 通關條件</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            '點擊至少 2 個詞元看連線',
            '注意力權重表更新 2 次',
            '調整一次 Context window',
            '完成位置編碼小問答',
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${progress[i] ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
              <span>{progress[i] ? '✅' : '⭕'}</span>
              <span className="text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sentence selector */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">🔍 Attention 可視化</h2>
          <div className="flex gap-2">
            {SENTENCES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => resetForSentence(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sentenceIdx === i ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                句子 {s.id}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          點擊 <span className="text-indigo-600 font-medium">藍色底線詞元</span> 查看其注意力連線
          {selectedTokenIdx !== null && sentence.hint?.[selectedTokenIdx] && (
            <span className="text-indigo-600 ml-2">→ {sentence.hint[selectedTokenIdx]}</span>
          )}
        </p>

        {/* Token visualization with SVG overlay */}
        <div
          ref={containerRef}
          className="relative border border-gray-200 rounded-xl p-4 min-h-[80px] overflow-hidden"
          style={{ isolation: 'isolate' }}
        >
          {/* SVG for attention lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%', zIndex: 5 }}
          >
            {svgLines.map((line, i) => (
              <line
                key={i}
                x1={line.x1} y1={line.y1}
                x2={line.x2} y2={line.y2}
                stroke={`rgba(99, 102, 241, ${line.weight})`}
                strokeWidth={line.weight * 4 + 0.5}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Tokens */}
          <div className="flex flex-wrap gap-2 relative" style={{ zIndex: 10 }}>
            {sentence.tokens.map((t, i) => {
              const isClickable = sentence.clickable.includes(i);
              const isSelected = selectedTokenIdx === i;
              const isGrayed = i < visibleStart;
              const relatedWeight = currentWeights.find(w => w.tokenIdx === i);
              const isHighlighted = !!relatedWeight && !isSelected;

              return (
                <button
                  key={i}
                  ref={el => { tokenRefs.current[i] = el; }}
                  onClick={() => handleTokenClick(i)}
                  disabled={!isClickable}
                  className={`px-2.5 py-1.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                    isGrayed
                      ? 'opacity-25 bg-gray-100 border-gray-200 text-gray-400'
                      : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                      : isHighlighted
                      ? `bg-yellow-100 border-yellow-400 text-yellow-800`
                      : isClickable
                      ? 'bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50 cursor-pointer'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                  style={isHighlighted ? { opacity: 0.4 + relatedWeight!.weight * 0.6 } : {}}
                >
                  {t}
                  {isClickable && !isSelected && (
                    <span className="ml-1 text-xs opacity-60">⬆</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Context window slider */}
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              <Term id="context-window" /> 大小
            </label>
            <span className="text-sm font-bold text-indigo-600">最近 {contextWindow} 個詞元</span>
          </div>
          <input
            type="range"
            min="4"
            max={sentence.tokens.length}
            step="1"
            value={contextWindow}
            onChange={e => handleContextChange(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          {contextWindow < sentence.tokens.length && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mt-2">
              ⚠️ 看不到前文時，模型更容易指代錯誤或答非所問。這就是為什麼 context window 越大越好！
            </p>
          )}
        </div>

        {/* Attention weights table */}
        {selectedTokenIdx !== null && currentWeights.length > 0 && (
          <div className="mt-4 animate-fade-in">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">
              📊 <Term id="attention-weights" /> 表格 —— 詞元「{sentence.tokens[selectedTokenIdx]}」的注意力分布
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-indigo-50 text-indigo-700">
                    <th className="text-left p-2 rounded-tl-lg">相關詞元</th>
                    <th className="text-left p-2">Weight（權重）</th>
                    <th className="text-left p-2 rounded-tr-lg">Reason（原因）</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWeights.map((w, i) => (
                    <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="p-2 font-mono font-medium text-gray-800">
                        {sentence.tokens[w.tokenIdx]}
                        {w.tokenIdx === selectedTokenIdx && <span className="text-xs text-gray-400 ml-1">（自身）</span>}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: `${w.weight * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-indigo-700 text-xs">{w.weight.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="p-2 text-gray-600 text-xs">{w.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Positional Encoding quiz */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-2">🔡 <Term id="positional-encoding" /> 小問答</h2>
        <p className="text-gray-600 text-sm mb-4">
          位置編碼讓模型知道詞元的順序。試著比較以下兩句：
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center font-bold text-blue-800 text-lg">
            狗 咬 人
          </div>
          <div className="flex items-center text-gray-400 font-bold">vs</div>
          <div className="flex-1 bg-red-50 rounded-xl p-3 text-center font-bold text-red-800 text-lg">
            人 咬 狗
          </div>
        </div>
        <p className="text-gray-700 text-sm font-medium mb-3">
          這兩句的意思是否相同？
        </p>
        <div className="flex gap-3">
          {['相同', '不相同'].map(opt => (
            <button
              key={opt}
              onClick={() => !posAnswer && handlePosAnswer(opt)}
              disabled={!!posAnswer}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm border-2 transition-all ${
                posAnswer === opt
                  ? opt === '不相同'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-red-400 bg-red-50 text-red-700'
                  : posAnswer && opt === '不相同'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {posAnswer && (
          <div className={`mt-3 p-3 rounded-xl text-sm animate-fade-in ${posAnswer === '不相同' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {posAnswer === '不相同'
              ? '✅ 正確！「狗咬人」與「人咬狗」詞相同，但順序不同，意思完全相反！位置編碼讓 Transformer 理解詞序的重要性。'
              : '📖 再想想！雖然兩句用字相同，但順序不同，「主詞」與「受詞」對調，意思完全相反。這就是為什麼位置編碼至關重要。'}
          </div>
        )}
      </div>

      {done && (
        <div className="card text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700">本關已完成！</h3>
          <p className="text-gray-500 mt-1">你已通過 Attention 可視化所有互動。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level4;
