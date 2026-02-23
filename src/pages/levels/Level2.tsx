import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

const TOKEN_COLORS = [
  'bg-red-100 text-red-800 border-red-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-orange-100 text-orange-800 border-orange-200',
];

// Simple tokenizer: split Chinese char-by-char, English by space/word, keep punctuation
function simpleTokenize(text: string): string[] {
  if (!text.trim()) return [];
  const tokens: string[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    // English letters / numbers run
    if (/[a-zA-Z0-9]/.test(ch)) {
      let word = '';
      while (i < text.length && /[a-zA-Z0-9]/.test(text[i])) {
        word += text[i++];
      }
      tokens.push(word);
    } else if (/\s/.test(ch)) {
      i++;
    } else if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(ch)) {
      // CJK character - each is a token
      tokens.push(ch);
      i++;
    } else {
      tokens.push(ch);
      i++;
    }
  }
  return tokens;
}

const quizOptions = [
  { label: '今天天氣真的很好，我想出去走走', lang: 'zh' },
  { label: 'The weather today is really nice, I want to go outside', lang: 'en' },
];

const Level2: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const [inputText, setInputText] = useState('今天天氣很好！');
  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenized, setTokenized] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const done = isCompleted(2);

  const handleTokenize = () => {
    setTokens(simpleTokenize(inputText));
    setTokenized(true);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    setQuizSubmitted(true);
    if (tokenized) {
      markComplete(2);
    }
  };

  const zhTokenCount = simpleTokenize(quizOptions[0].label).length;
  const enTokenCount = simpleTokenize(quizOptions[1].label).length;
  const correctAnswer = zhTokenCount >= enTokenCount ? 0 : 1;

  return (
    <LevelLayout
      levelNumber={2}
      title="Token"
      subtitle="詞元——LLM 計費與處理的最小單位"
      icon="🧩"
      sticker="Token（詞元）是 LLM 讀取和計費的基本單位。不同語言的切分方式不同，中文通常一字一 token，英文按詞切分。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 什麼是 Token？</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          LLM 不是逐字讀文字，而是將文字切分成 <Term id="token" /> 再處理。
          <Term id="tokenization" /> 就是這個切分過程。
          Token 可以是一個中文字、一個英文單詞、一個標點符號，甚至是一個詞的一部分。
        </p>
        {isAcademic ? (
          <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-800">
            <strong>學術補充：</strong> 現代模型多使用 BPE（Byte-Pair Encoding）或 SentencePiece 分詞。
            英文 "unhappiness" 可能被切為 ["un", "happiness"]，
            而中文通常 1 字 ≈ 1–2 tokens（視編碼方式而定）。
          </div>
        ) : (
          <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
            <strong>企業視角：</strong> API 計費以 token 數計算。
            同樣意思的中文描述，token 數往往比英文少，但也視模型而定。
            了解 tokenization 幫助你控制成本。
          </div>
        )}
      </div>

      {/* Tokenizer demo */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">🔬 互動切分 Token</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={inputText}
            onChange={e => { setInputText(e.target.value); setTokenized(false); setTokens([]); }}
            placeholder="輸入任何文字..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
          />
          <button onClick={handleTokenize} className="btn-primary whitespace-nowrap">
            切分 Token →
          </button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            '今天天氣真的很好！',
            'Hello world!',
            'I love AI 技術',
            '大型語言模型 LLM',
          ].map(ex => (
            <button
              key={ex}
              onClick={() => { setInputText(ex); setTokenized(false); setTokens([]); }}
              className="text-xs bg-gray-100 hover:bg-indigo-100 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {tokenized && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700">切分結果：</span>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                共 {tokens.length} 個 Token
              </span>
              {isAcademic && (
                <span className="text-xs text-gray-400">（簡化版分詞，實際模型可能不同）</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tokens.map((t, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-sm font-medium ${TOKEN_COLORS[i % TOKEN_COLORS.length]}`}
                >
                  {t}
                  <span className="text-xs opacity-60 ml-1">#{i + 1}</span>
                </span>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
              <strong>估算成本：</strong> {tokens.length} tokens ×（以 GPT-4 為例 $0.03/1K）≈
              <strong className="text-indigo-700"> ${(tokens.length * 0.03 / 1000).toFixed(6)}</strong>
              （僅供概念理解，各模型實際定價不同）
            </div>
          </div>
        )}
      </div>

      {/* Quiz */}
      {!done && (
        <div className="card">
          <h2 className="font-bold text-lg mb-4">📝 小測：哪句 Token 較多？</h2>
          <p className="text-gray-600 text-sm mb-4">
            以下兩句意思相近，哪一句會消耗較多 Token（成本較高）？
          </p>

          <div className="space-y-3 mb-6">
            {quizOptions.map((opt, idx) => {
              const count = idx === 0 ? zhTokenCount : enTokenCount;
              return (
                <button
                  key={idx}
                  onClick={() => !quizSubmitted && setQuizAnswer(idx)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    quizAnswer === idx
                      ? quizSubmitted
                        ? idx === correctAnswer
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-red-400 bg-red-50'
                        : 'border-indigo-400 bg-indigo-50'
                      : quizSubmitted && idx === correctAnswer
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${opt.lang === 'zh' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {opt.lang === 'zh' ? '中文' : 'English'}
                      </span>
                      <span className="text-sm text-gray-800">{opt.label}</span>
                    </div>
                    {quizSubmitted && (
                      <span className="text-xs font-bold text-gray-600 shrink-0">
                        {count} tokens
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={quizAnswer === null || !tokenized}
              className="btn-primary w-full"
            >
              {!tokenized ? '請先試用上方的 Token 切分工具' : '確認答案'}
            </button>
          ) : (
            <div className={`p-4 rounded-xl animate-fade-in ${quizAnswer === correctAnswer ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`font-medium ${quizAnswer === correctAnswer ? 'text-emerald-700' : 'text-amber-700'}`}>
                {quizAnswer === correctAnswer ? '✅ 正確！' : '📖 再想想～'}
              </p>
              <p className="text-sm mt-1 text-gray-600">
                中文句：<strong>{zhTokenCount}</strong> tokens，英文句：<strong>{enTokenCount}</strong> tokens。
                {zhTokenCount > enTokenCount
                  ? '中文此例 token 數較多，主要因字元較多。'
                  : zhTokenCount === enTokenCount
                  ? '兩句 token 數相近！這個簡化 tokenizer 讓每個字母單詞和漢字都是獨立 token。'
                  : '英文此例 token 數較多。實務上視 tokenizer 不同可能有差異。'}
              </p>
            </div>
          )}
        </div>
      )}

      {done && (
        <div className="card text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700">本關已完成！</h3>
          <p className="text-gray-500 mt-1">你已理解 Token 的切分與計費概念。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level2;
