import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

interface Strategy {
  id: string;
  label: string;
  desc: string;
  inputReduction: number; // fraction 0-1
  outputReduction: number;
}

const STRATEGIES: Strategy[] = [
  {
    id: 'limit-output',
    label: '限制回覆長度',
    desc: '設定 max_tokens，避免模型生成過長的回應',
    inputReduction: 0,
    outputReduction: 0.3,
  },
  {
    id: 'rag-chunk',
    label: 'RAG chunk（只放相關片段）',
    desc: '用 RAG 只取最相關的 3~5 段文件，而非整份文件',
    inputReduction: 0.4,
    outputReduction: 0,
  },
  {
    id: 'small-model',
    label: '低風險改用小模型',
    desc: '簡單任務換用便宜小模型（如 GPT-4o mini），成本降 60–90%',
    inputReduction: 0.5,
    outputReduction: 0.6,
  },
];

const Level8: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const done = isCompleted(8);

  const [users, setUsers] = useState(100);
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(200);
  const [inputPrice, setInputPrice] = useState(0.005); // $/1K
  const [outputPrice, setOutputPrice] = useState(0.015); // $/1K
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [calculated, setCalculated] = useState(false);

  const toggleStrategy = (id: string) => {
    const next = new Set(selectedStrategies);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedStrategies(next);
  };

  // Compute effective tokens with strategies applied
  const effectiveInput = (() => {
    let t = inputTokens;
    STRATEGIES.filter(s => selectedStrategies.has(s.id)).forEach(s => {
      t = t * (1 - s.inputReduction);
    });
    return Math.round(t);
  })();

  const effectiveOutput = (() => {
    let t = outputTokens;
    STRATEGIES.filter(s => selectedStrategies.has(s.id)).forEach(s => {
      t = t * (1 - s.outputReduction);
    });
    return Math.round(t);
  })();

  const baseDailyCost = users * ((inputTokens * inputPrice / 1000) + (outputTokens * outputPrice / 1000));
  const effectiveDailyCost = users * ((effectiveInput * inputPrice / 1000) + (effectiveOutput * outputPrice / 1000));
  const baseMonthly = baseDailyCost * 30;
  const effectiveMonthly = effectiveDailyCost * 30;
  const savings = baseMonthly - effectiveMonthly;
  const savingsPct = baseMonthly > 0 ? Math.round((savings / baseMonthly) * 100) : 0;

  const handleCalculate = () => {
    setCalculated(true);
    if (selectedStrategies.size >= 2) {
      markComplete(8);
    }
  };

  return (
    <LevelLayout
      levelNumber={8}
      title="Token Pricing"
      subtitle="詞元計價——LLM 的成本計算與優化"
      icon="💰"
      sticker="LLM 成本 = Input tokens（輸入詞元）× 單價 + Output tokens（輸出詞元）× 單價。掌握計算方式，才能做出好的採購決策。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 Token 計價原則</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          API 費用以 <Term id="token-pricing" /> 計算，分為：
          <Term id="input-tokens" />（你傳入的 prompt）和
          <Term id="output-tokens" />（模型生成的回應）。
          通常輸出 token 比輸入貴 2~4 倍。
        </p>
        {isAcademic ? (
          <div className="bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700">
            <strong>學術補充：</strong> 計費公式：Cost = (N_input × P_in + N_output × P_out) / 1000。
            其中 P_in、P_out 為每千 token 單價（$/1K tokens）。
            不同模型價差可達 100x，需根據任務精度需求選擇。
          </div>
        ) : (
          <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
            <strong>企業視角：</strong> 一個日活萬人的應用每月可能花費數千至數萬美元。
            正確的 token 預算規劃是 AI 產品商業化的關鍵。
          </div>
        )}

        {/* Pricing reference */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left p-2 rounded-tl-lg">模型</th>
                <th className="text-right p-2">Input ($/1M)</th>
                <th className="text-right p-2 rounded-tr-lg">Output ($/1M)</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                { model: 'GPT-4o', inp: '$5', out: '$15' },
                { model: 'GPT-4o mini', inp: '$0.15', out: '$0.60' },
                { model: 'Claude 3.5 Sonnet', inp: '$3', out: '$15' },
                { model: 'Claude 3 Haiku', inp: '$0.25', out: '$1.25' },
                { model: 'Gemini 1.5 Flash', inp: '$0.075', out: '$0.30' },
              ].map((r, i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-2 font-medium text-gray-800">{r.model}</td>
                  <td className="p-2 text-right text-green-700">{r.inp}</td>
                  <td className="p-2 text-right text-orange-700">{r.out}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-1">* 僅供參考，實際價格請查閱各廠商官網</p>
        </div>
      </div>

      {/* Cost calculator */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-5">🧮 成本計算器</h2>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {/* Daily users */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每日使用者人數
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min="10" max="10000" step="10" value={users}
                onChange={e => setUsers(Number(e.target.value))}
                className="flex-1" />
              <span className="w-20 text-right font-bold text-indigo-700">{users.toLocaleString()}</span>
            </div>
          </div>

          {/* Input tokens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每次 Input tokens（輸入詞元）
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min="100" max="4000" step="100" value={inputTokens}
                onChange={e => setInputTokens(Number(e.target.value))}
                className="flex-1" />
              <span className="w-20 text-right font-bold text-green-700">{inputTokens}</span>
            </div>
          </div>

          {/* Output tokens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每次 Output tokens（輸出詞元）
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min="50" max="2000" step="50" value={outputTokens}
                onChange={e => setOutputTokens(Number(e.target.value))}
                className="flex-1" />
              <span className="w-20 text-right font-bold text-orange-700">{outputTokens}</span>
            </div>
          </div>

          {/* Prices */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              模型選擇（影響單價）
            </label>
            <select
              onChange={e => {
                const val = e.target.value;
                if (val === 'premium') { setInputPrice(0.005); setOutputPrice(0.015); }
                else if (val === 'standard') { setInputPrice(0.001); setOutputPrice(0.003); }
                else { setInputPrice(0.0001); setOutputPrice(0.0004); }
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            >
              <option value="premium">旗艦模型（$5/$15 per 1M）</option>
              <option value="standard">標準模型（$1/$3 per 1M）</option>
              <option value="mini">精簡模型（$0.1/$0.4 per 1M）</option>
            </select>
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary w-full mb-6">
          💰 計算每日/每月費用
        </button>

        {calculated && (
          <div className="animate-fade-in space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-200">
                <p className="text-xs text-orange-500 mb-1">每日費用（基準）</p>
                <p className="text-3xl font-bold text-orange-700">${baseDailyCost.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-200">
                <p className="text-xs text-red-500 mb-1">每月費用（基準）</p>
                <p className="text-3xl font-bold text-red-700">${baseMonthly.toFixed(0)}</p>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400">
              計算公式：{users.toLocaleString()} 人 × ({inputTokens} input + {outputTokens} output) tokens ÷ 1000 × 單價
            </p>
          </div>
        )}
      </div>

      {/* Strategies */}
      {calculated && (
        <div className="card mb-6 animate-fade-in">
          <h2 className="font-bold text-lg mb-2">💡 省錢策略（請選至少 2 項）</h2>
          <p className="text-sm text-gray-500 mb-4">勾選策略後，觀察成本如何下降：</p>

          <div className="space-y-3 mb-6">
            {STRATEGIES.map(s => (
              <button
                key={s.id}
                onClick={() => toggleStrategy(s.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedStrategies.has(s.id)
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0 ${selectedStrategies.has(s.id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                    {selectedStrategies.has(s.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{s.label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                    {selectedStrategies.has(s.id) && (
                      <p className="text-xs text-emerald-600 mt-1">
                        {s.inputReduction > 0 && `Input -${s.inputReduction * 100}% `}
                        {s.outputReduction > 0 && `Output -${s.outputReduction * 100}%`}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedStrategies.size > 0 && (
            <div className="animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200">
                  <p className="text-xs text-emerald-500 mb-1">優化後每日費用</p>
                  <p className="text-3xl font-bold text-emerald-700">${effectiveDailyCost.toFixed(2)}</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200">
                  <p className="text-xs text-emerald-500 mb-1">優化後每月費用</p>
                  <p className="text-3xl font-bold text-emerald-700">${effectiveMonthly.toFixed(0)}</p>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-indigo-700 font-bold">
                  🎉 每月節省 ${savings.toFixed(0)} — 省了 <span className="text-2xl">{savingsPct}%</span>！
                </p>
              </div>
            </div>
          )}

          {selectedStrategies.size < 2 && (
            <p className="text-center text-amber-600 text-sm">請再選 {2 - selectedStrategies.size} 個策略以完成本關</p>
          )}
          {selectedStrategies.size >= 2 && !done && (
            <button onClick={() => markComplete(8)} className="btn-primary w-full mt-4">
              完成本關 🎉
            </button>
          )}
        </div>
      )}

      {done && (
        <div className="card text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700">本關已完成！</h3>
          <p className="text-gray-500 mt-1">你已掌握 Token 計價與成本優化策略。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level8;
