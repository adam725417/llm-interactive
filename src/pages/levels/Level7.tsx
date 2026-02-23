import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

const PARAM_LEVELS = [
  { val: 7, label: '7B', desc: '7 億參數', emoji: '🐣', ability: '能對話、寫作，適合一般任務，可在消費級 GPU 運行' },
  { val: 13, label: '13B', desc: '130 億參數', emoji: '🐤', ability: '表現更好，推理更強，需要較高端 GPU' },
  { val: 34, label: '34B', desc: '340 億參數', emoji: '🐔', ability: '接近商業模型水準，多數任務表現優秀' },
  { val: 70, label: '70B', desc: '700 億參數', emoji: '🦅', ability: '頂尖開源模型水準，接近 GPT-4 部分能力' },
  { val: 175, label: '175B', desc: '1750 億參數（GPT-3）', emoji: '🐉', ability: '商業級旗艦模型，成本極高，需要多機多卡' },
];

const TOKEN_LEVELS = [
  { val: 200, label: '200B', desc: '2000 億 tokens', emoji: '📖', note: '約等於讀了 10 萬本書' },
  { val: 500, label: '500B', desc: '5000 億 tokens', emoji: '📚', note: '約等於讀了 25 萬本書' },
  { val: 1000, label: '1T', desc: '1 兆 tokens', emoji: '🏛️', note: '約等於讀了 50 萬本書' },
  { val: 2000, label: '2T', desc: '2 兆 tokens（Llama 3）', emoji: '🌐', note: '約等於讀了 100 萬本書' },
];

const getCombo = (params: number, tokens: number) => {
  if (params <= 13 && tokens <= 500) return { desc: '能力有限，但速度快、成本低', use: '行動端應用、即時聊天' };
  if (params >= 70 && tokens >= 1000) return { desc: '旗艦配置：強大能力、強大訓練', use: '企業核心 AI、複雜任務' };
  if (params >= 70 && tokens < 500) return { desc: '大腦但讀書少：推理能力強但知識有限', use: '需要補充 RAG' };
  if (params < 34 && tokens >= 1000) return { desc: '讀書多但腦容量小：知識豐富但推理深度有限', use: '知識查詢、問答系統' };
  return { desc: '均衡配置：能力與成本的中間路線', use: '通用型 AI 助手' };
};

const quizData = [
  {
    q: '若要部署一個低成本、高回應速度的行動端助手，應優先選擇哪種模型？',
    options: ['參數量大、訓練 token 少的模型', '參數量小、訓練 token 多的精簡模型', '175B 參數的旗艦模型'],
    correct: 1,
    reason: '行動端需要低延遲、低成本。小參數量模型適合邊端部署，搭配豐富訓練資料可維持一定知識廣度。',
  },
];

const Level7: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const done = isCompleted(7);
  const [paramIdx, setParamIdx] = useState(1);
  const [tokenIdx, setTokenIdx] = useState(1);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const param = PARAM_LEVELS[paramIdx];
  const token = TOKEN_LEVELS[tokenIdx];
  const combo = getCombo(param.val, token.val);

  const handleQuizSubmit = (ai: number) => {
    if (quizSubmitted) return;
    setQuizAnswer(ai);
    setQuizSubmitted(true);
    if (interacted) markComplete(7);
  };

  const handleSlider = (setter: (v: number) => void, val: number) => {
    setter(val);
    setInteracted(true);
    if (quizSubmitted) markComplete(7);
  };

  return (
    <LevelLayout
      levelNumber={7}
      title="Parameters vs Training Tokens"
      subtitle="參數量 vs 訓練詞元數——模型能力的兩大維度"
      icon="⚖️"
      sticker="Parameters（參數量）= 模型的「腦容量」；Training tokens（訓練詞元數）= 模型「讀過多少書」。兩者相輔相成，才能打造強大的 LLM。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 兩大核心指標</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="font-bold text-purple-800 mb-1"><Term id="parameters" /></h3>
            <p className="text-purple-700 text-sm">模型神經網路中可調整的數值數量。</p>
            <p className="text-purple-600 text-xs mt-2 italic">比喻：腦容量——決定你能同時處理多複雜的問題</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl mb-2">📖</div>
            <h3 className="font-bold text-blue-800 mb-1"><Term id="training-tokens" /></h3>
            <p className="text-blue-700 text-sm">訓練時餵給模型的 token 總數。</p>
            <p className="text-blue-600 text-xs mt-2 italic">比喻：讀過的書——決定你積累了多少知識</p>
          </div>
        </div>
        {isAcademic ? (
          <div className="mt-4 bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700">
            <strong>學術補充：</strong> Chinchilla 論文（Hoffmann et al., 2022）提出「最優縮放定律」：
            給定算力預算，最優配置是 N（參數量）≈ D（訓練 token 數）/ 20。
            例如 70B 模型最優訓練 token 約 1.4T。
          </div>
        ) : (
          <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
            <strong>企業視角：</strong> 選模型不是「越大越好」。小而精（訓練充分）的模型往往比大而未充分訓練的模型更實用，
            且推理成本更低。
          </div>
        )}
      </div>

      {/* Interactive sliders */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-6">🎛️ 互動比較</h2>

        {/* Parameters slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              🧠 <Term id="parameters" />
            </label>
            <div className="text-right">
              <span className="text-2xl font-bold text-purple-700">{param.emoji} {param.label}</span>
              <p className="text-xs text-gray-500">{param.desc}</p>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={PARAM_LEVELS.length - 1}
            step="1"
            value={paramIdx}
            onChange={e => handleSlider(setParamIdx, Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {PARAM_LEVELS.map(p => <span key={p.label}>{p.label}</span>)}
          </div>
          <div className="mt-2 bg-purple-50 rounded-lg p-3 text-sm text-purple-700">
            <strong>能力：</strong> {param.ability}
          </div>
        </div>

        {/* Training tokens slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              📖 <Term id="training-tokens" />
            </label>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-700">{token.emoji} {token.label}</span>
              <p className="text-xs text-gray-500">{token.desc}</p>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={TOKEN_LEVELS.length - 1}
            step="1"
            value={tokenIdx}
            onChange={e => handleSlider(setTokenIdx, Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {TOKEN_LEVELS.map(t => <span key={t.label}>{t.label}</span>)}
          </div>
          <div className="mt-2 bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            {token.note}
          </div>
        </div>

        {/* Combo result */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 border border-indigo-200">
          <h3 className="font-bold text-gray-800 mb-2">組合評估：{param.label} × {token.label}</h3>
          <p className="text-gray-700 text-sm mb-2">{combo.desc}</p>
          <p className="text-gray-500 text-xs">
            <strong>適合場景：</strong> {combo.use}
          </p>
        </div>
      </div>

      {/* Model card section */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <span>📋</span>
          <Term id="model-card" />——如何查找訓練資訊
        </h2>
        <div className="bg-gray-900 rounded-2xl p-5 text-sm font-mono text-green-400 mb-4">
          <p className="text-gray-400 mb-1">{'// 範例 Model Card（Llama-3-70B）'}</p>
          <p><span className="text-yellow-400">Model:</span> Meta-Llama-3-70B-Instruct</p>
          <p><span className="text-yellow-400">Parameters:</span> 70,000,000,000 (70B)</p>
          <p><span className="text-yellow-400">Training tokens:</span> 15T tokens</p>
          <p><span className="text-yellow-400">Architecture:</span> Transformer, decoder-only</p>
          <p><span className="text-yellow-400">Context length:</span> 8,192 tokens</p>
          <p><span className="text-yellow-400">License:</span> Llama 3 Community License</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">📌 <strong>如何找到模型的訓練資訊：</strong></p>
          <div className="flex items-start gap-2 text-gray-600"><span>1.</span><span>查看 Hugging Face 上的 Model Card（模型說明文件）</span></div>
          <div className="flex items-start gap-2 text-gray-600"><span>2.</span><span>閱讀發布的技術報告或論文</span></div>
          <div className="flex items-start gap-2 text-gray-600"><span>3.</span><span>⚠️ 閉源模型（如 GPT-4）可能不揭露或只提供大概區間</span></div>
        </div>
      </div>

      {/* Quiz */}
      {!done && (
        <div className="card">
          <h2 className="font-bold text-lg mb-4">📝 小測</h2>
          {quizData.map((q, qi) => (
            <div key={qi}>
              <p className="font-medium text-gray-800 mb-3">{q.q}</p>
              <div className="space-y-2 mb-3">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => handleQuizSubmit(oi)}
                    disabled={quizSubmitted}
                    className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                      quizAnswer === oi
                        ? quizSubmitted
                          ? oi === q.correct ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-red-400 bg-red-50 text-red-700'
                          : 'border-indigo-400 bg-indigo-50'
                        : quizSubmitted && oi === q.correct
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizSubmitted && (
                <div className={`p-3 rounded-xl text-sm animate-fade-in ${quizAnswer === q.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {quizAnswer === q.correct ? '✅' : '📖'} {q.reason}
                </div>
              )}
            </div>
          ))}
          {!interacted && <p className="text-xs text-amber-600 mt-3 text-center">💡 請先滑動上方兩個 Slider 互動，再完成小測即可通關</p>}
        </div>
      )}

      {done && (
        <div className="card text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700">本關已完成！</h3>
          <p className="text-gray-500 mt-1">你已理解參數量與訓練資料的關係。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level7;
