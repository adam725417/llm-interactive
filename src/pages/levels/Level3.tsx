import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

const PROMPT = '我今天想喝一杯 ___';

type TempRange = 'low' | 'mid' | 'high';

const RESULTS: Record<TempRange, string[]> = {
  low: ['咖啡', '咖啡', '咖啡'],
  mid: ['咖啡', '奶茶', '果汁'],
  high: ['薰衣草拿鐵', '鳳梨椰子特調', '冰涼的西瓜汁加點薄荷'],
};

const getTempRange = (temp: number): TempRange => {
  if (temp <= 0.4) return 'low';
  if (temp <= 0.9) return 'mid';
  return 'high';
};

const quizQuestions = [
  {
    q: '客服 FAQ 自動回覆系統，應使用哪種 Temperature？',
    options: ['低溫（0~0.3）', '高溫（1.0~1.5）'],
    correct: 0,
    reason: '客服回覆需要準確一致，低溫確保模型給出穩定、可信的標準答案。',
  },
  {
    q: '行銷文案創意生成工具，應使用哪種 Temperature？',
    options: ['低溫（0~0.3）', '高溫（0.9~1.5）'],
    correct: 1,
    reason: '創意文案需要多樣性和驚喜感，高溫讓模型更敢嘗試非典型的表達方式。',
  },
];

const Level3: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const [temperature, setTemperature] = useState(0.7);
  const [results, setResults] = useState<string[] | null>(null);
  const [generated, setGenerated] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState([false, false]);
  const done = isCompleted(3);

  const range = getTempRange(temperature);

  const handleGenerate = () => {
    setResults(null);
    setTimeout(() => {
      setResults(RESULTS[range]);
      setGenerated(true);
    }, 600);
  };

  const handleQuizAnswer = (qi: number, ai: number) => {
    if (quizSubmitted[qi]) return;
    const newAnswers = [...quizAnswers];
    newAnswers[qi] = ai;
    setQuizAnswers(newAnswers);
    const newSubmitted = [...quizSubmitted];
    newSubmitted[qi] = true;
    setQuizSubmitted(newSubmitted);

    if (newSubmitted.every(Boolean) && generated) {
      markComplete(3);
    }
  };

  const tempColor = range === 'low' ? 'text-blue-600' : range === 'mid' ? 'text-amber-600' : 'text-red-600';
  const tempBg = range === 'low' ? 'bg-blue-50 border-blue-200' : range === 'mid' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <LevelLayout
      levelNumber={3}
      title="Temperature"
      subtitle="溫度參數——控制 LLM 輸出的隨機程度"
      icon="🌡️"
      sticker="Temperature（溫度參數）越低，輸出越保守一致；越高，輸出越多元創意。選對溫度，讓 LLM 更適合你的場景。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 什麼是 Temperature？</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          <Term id="temperature" /> 是調節模型「輸出多樣性」的旋鈕。
          它影響模型如何從機率分布中選取下一個 <Term id="token" showChinese={false} />：
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="font-bold text-blue-700 mb-1">❄️ 低溫（0~0.3）</div>
            <p className="text-blue-600">總是選最高機率詞元，回答穩定、可預測</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
            <div className="font-bold text-amber-700 mb-1">🌤 中溫（0.4~0.9）</div>
            <p className="text-amber-600">平衡準確與多樣，適合大多數場景</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 border border-red-100">
            <div className="font-bold text-red-700 mb-1">🔥 高溫（1.0~1.5）</div>
            <p className="text-red-600">選到低機率詞元的機會增加，輸出更有創意</p>
          </div>
        </div>
        {isAcademic && (
          <div className="mt-3 bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700">
            <strong>學術補充：</strong> Temperature T 作用於 logits 除法：scaled_logit = logit / T，
            再過 softmax。T=0 趨近 argmax（greedy），T=1 為原始分布，T&gt;1 使分布更平坦（更均勻）。
          </div>
        )}
      </div>

      {/* Interactive demo */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">🎮 互動體驗</h2>
        <div className="bg-gray-100 rounded-xl p-4 text-center mb-6">
          <p className="text-gray-500 text-sm mb-1">固定 Prompt：</p>
          <p className="text-xl font-semibold text-gray-800">{PROMPT}</p>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-gray-700 text-sm">
              Temperature（溫度參數）
            </label>
            <span className={`text-xl font-bold ${tempColor}`}>{temperature.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={temperature}
            onChange={e => { setTemperature(Number(e.target.value)); setResults(null); setGenerated(false); }}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #f59e0b 50%, #ef4444 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>❄️ 0 穩定</span>
            <span>🌤 0.7 平衡</span>
            <span>🔥 1.5 創意</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border mb-4 text-center ${tempBg}`}>
          <span className={`text-sm font-medium ${tempColor}`}>
            {range === 'low' ? '❄️ 低溫模式：回答保守一致' : range === 'mid' ? '🌤 中溫模式：平衡多樣' : '🔥 高溫模式：高度創意與多樣'}
          </span>
        </div>

        <button
          onClick={handleGenerate}
          className="btn-primary w-full mb-4"
        >
          ⚡ 生成 3 次回答
        </button>

        {results === null && generated === false ? (
          <p className="text-center text-gray-400 text-sm py-4">按下按鈕查看不同溫度下的輸出</p>
        ) : results === null ? (
          <div className="text-center py-6">
            <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            <p className="text-sm text-gray-500 mb-3">生成結果（3 次）：</p>
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
                <span className="text-xs text-gray-400 font-mono w-16 shrink-0">第{i + 1}次</span>
                <span className="text-gray-800 font-medium">{PROMPT.replace('___', r)}</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{r}</span>
              </div>
            ))}
            <div className="p-3 bg-indigo-50 rounded-xl text-sm text-indigo-700 mt-2">
              {range === 'low'
                ? '✅ 低溫：三次都生成相同答案，非常一致。'
                : range === 'mid'
                ? '🔄 中溫：有些變化，但仍在合理範圍。'
                : '🎨 高溫：三次結果差異很大，充滿驚喜與創意！'}
            </div>
          </div>
        )}
      </div>

      {/* Quiz */}
      {!done && (
        <div className="card">
          <h2 className="font-bold text-lg mb-4">📝 應用場景小測</h2>
          <div className="space-y-6">
            {quizQuestions.map((q, qi) => (
              <div key={qi}>
                <p className="font-medium text-gray-800 mb-3">Q{qi + 1}. {q.q}</p>
                <div className="flex gap-3 flex-wrap">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleQuizAnswer(qi, oi)}
                      disabled={quizSubmitted[qi]}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        quizAnswers[qi] === oi
                          ? quizSubmitted[qi]
                            ? oi === q.correct ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-red-400 bg-red-50 text-red-700'
                            : 'border-indigo-400 bg-indigo-50 text-indigo-700'
                          : quizSubmitted[qi] && oi === q.correct
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted[qi] && (
                  <div className={`mt-2 p-3 rounded-xl text-sm animate-fade-in ${quizAnswers[qi] === q.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {quizAnswers[qi] === q.correct ? '✅' : '📖'} {q.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!generated && <p className="text-xs text-amber-600 mt-4 text-center">💡 請先試用上方生成功能，再完成小測即可通關</p>}
        </div>
      )}

      {done && (
        <div className="card text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700">本關已完成！</h3>
          <p className="text-gray-500 mt-1">你已掌握 Temperature 的應用場景。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level3;
