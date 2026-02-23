import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

interface Question {
  sentence: string;
  blank: string;
  candidates: { token: string; prob: number }[];
  top1: string;
}

const questions: Question[] = [
  {
    sentence: '今天天氣很',
    blank: '___',
    candidates: [
      { token: '好', prob: 60 },
      { token: '差', prob: 25 },
      { token: '熱', prob: 10 },
      { token: '冷', prob: 5 },
    ],
    top1: '好',
  },
  {
    sentence: '我的名字叫',
    blank: '___',
    candidates: [
      { token: '小明', prob: 45 },
      { token: '陳大文', prob: 30 },
      { token: '王小姐', prob: 15 },
      { token: '黃先生', prob: 10 },
    ],
    top1: '小明',
  },
  {
    sentence: '人工智慧能夠',
    blank: '___',
    candidates: [
      { token: '學習', prob: 50 },
      { token: '理解', prob: 30 },
      { token: '創作', prob: 15 },
      { token: '感受', prob: 5 },
    ],
    top1: '學習',
  },
];

const Level1: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const done = isCompleted(1);

  const q = questions[currentQ];

  const getTokenRank = (token: string): 'top1' | 'top2' | 'other' => {
    const sorted = [...q.candidates].sort((a, b) => b.prob - a.prob);
    const idx = sorted.findIndex(c => c.token === token);
    if (idx === 0) return 'top1';
    if (idx === 1) return 'top2';
    return 'other';
  };

  const handleSelect = (token: string) => {
    if (selected) return;
    setSelected(token);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentQ + 1 >= questions.length) {
      markComplete(1);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const rank = selected ? getTokenRank(selected) : null;

  const feedbackConfig = {
    top1: { color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: '🎯', msg: '選到最高機率詞元！這是 LLM 在低溫模式下最常選擇的答案。' },
    top2: { color: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: '👍', msg: '選到第二高機率詞元！LLM 有時也會選這個，尤其在溫度稍高時。' },
    other: { color: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: '🤔', msg: '選到低機率詞元！LLM 偶爾也會有驚喜選擇，這就是創意的來源。' },
  };

  return (
    <LevelLayout
      levelNumber={1}
      title="Next-token prediction"
      subtitle="下一個詞元預測"
      icon="🎯"
      sticker="LLM（大型語言模型）用 Next-token prediction（下一個詞元預測）逐詞生成文字——每一步都在猜「接下來最可能是什麼」。"
      completed={done}
    >
      {/* Concept intro */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <span>💡</span> 核心概念
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          <Term id="llm" /> 生成文字的方式，就是不斷預測「下一個最可能的詞元」。
          給定前面的文字，模型會為所有候選詞元計算出機率分布——這個過程就叫做
          <Term id="next-token-prediction" />。
        </p>
        {isAcademic ? (
          <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-800">
            <strong>學術補充：</strong> 模型輸出的是一個 softmax 後的機率向量（logits），
            每個位置對應詞彙表中的一個 <Term id="token" showChinese={false} />。
            採樣策略（greedy / top-k / nucleus）決定最終選哪個詞元。
          </div>
        ) : (
          <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
            <strong>企業視角：</strong> 這個機制讓 LLM 能快速生成回應，
            但也意味著輸出是「統計上合理」，不代表「事實正確」——這是
            <Term id="hallucination" showChinese={false} /> 風險的根源之一。
          </div>
        )}
      </div>

      {/* Quiz */}
      {!done ? (
        <div className="card">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">互動練習</h2>
            <div className="flex gap-2">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < answers.length ? 'bg-emerald-500' : i === currentQ ? 'bg-indigo-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sentence */}
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm mb-2">模型看到這段句子：</p>
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-6 py-3 text-xl font-semibold">
              <span>{q.sentence}</span>
              <span className="w-16 h-8 bg-indigo-200 rounded animate-pulse-slow inline-flex items-center justify-center text-indigo-600 text-sm">
                ___?
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2">你認為下一個詞元最可能是？</p>
          </div>

          {/* Candidates */}
          <div className="space-y-3">
            {q.candidates.map(c => (
              <button
                key={c.token}
                onClick={() => handleSelect(c.token)}
                disabled={!!selected}
                className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                  selected === c.token
                    ? getTokenRank(c.token) === 'top1'
                      ? 'border-emerald-400 bg-emerald-50'
                      : getTokenRank(c.token) === 'top2'
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-amber-400 bg-amber-50'
                    : selected
                    ? 'border-gray-100 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <span className="font-bold text-lg w-12 text-center bg-white rounded-lg py-1 border border-gray-200">
                  {c.token}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">機率</span>
                    <span className="text-sm font-bold text-gray-800">
                      {selected ? `${c.prob}%` : '?'}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        selected
                          ? c.prob >= 45 ? 'bg-emerald-500' : c.prob >= 25 ? 'bg-blue-500' : 'bg-gray-400'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: selected ? `${c.prob}%` : '0%' }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && rank && (
            <div className={`mt-4 p-4 rounded-xl border ${feedbackConfig[rank].color} animate-fade-in`}>
              <p className={`font-medium ${feedbackConfig[rank].text}`}>
                {feedbackConfig[rank].icon} {feedbackConfig[rank].msg}
              </p>
            </div>
          )}

          {/* Next button */}
          {showFeedback && (
            <button onClick={handleNext} className="btn-primary w-full mt-4 animate-fade-in">
              {currentQ + 1 >= questions.length ? '完成本關 🎉' : '下一題 →'}
            </button>
          )}
        </div>
      ) : (
        <div className="card text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700 mb-2">本關已完成！</h3>
          <p className="text-gray-600">你已理解 Next-token prediction 的基本原理。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level1;
