import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

const STAGES = [
  {
    id: 'pretraining',
    label: 'Pretraining',
    chinese: '預訓練',
    icon: '📚',
    color: 'blue',
    desc: '在數兆個網路文字 token 上訓練，學習語言的統計規律。',
    academicDesc: '自監督學習（Next-token prediction），無需人工標記資料。模型學到廣泛的語言知識但尚不「聽話」。',
    enterpriseDesc: '這個階段耗資數億美元，只有大型科技公司能承擔。使用者不需關心，只需選擇合適的基礎模型。',
    response: '關於這個問題，根據我在網路上學到的各種資訊，可以從多個角度討論...（可能混雜不同觀點或格式不一致）',
    quality: 'low',
  },
  {
    id: 'sft',
    label: 'SFT',
    fullLabel: 'Supervised Fine-Tuning',
    chinese: '監督式微調',
    icon: '🎯',
    color: 'amber',
    desc: '用人工標記的問答對進行微調，讓模型學會遵循指令。',
    academicDesc: '使用（prompt, response）配對資料，以監督學習的方式微調模型參數。使模型從「文字補全」變成「問答助手」。',
    enterpriseDesc: '企業也可以用自己的業務問答資料進行 SFT，讓模型成為專業客服或知識助手（但需要足夠的資料量）。',
    response: '這個問題有幾個重要的面向需要考量：第一點是...第二點是...（結構更清晰，更有幫助性）',
    quality: 'mid',
  },
  {
    id: 'alignment',
    label: 'Alignment',
    chinese: '對齊訓練',
    icon: '⚖️',
    color: 'green',
    desc: '透過 RLHF 等技術讓模型輸出符合人類價值觀與偏好。',
    academicDesc: '常見方法：RLHF（人類回饋強化學習）、DPO（直接偏好最佳化）。讓模型學會拒絕有害請求、減少幻覺。',
    enterpriseDesc: '對齊後的模型更安全、更可靠，降低品牌風險。GPT-4、Claude 等商業模型都有嚴格的對齊流程。',
    response: '我很樂意幫助你了解這個主題！這裡有幾個關鍵點需要考量。首先...（自然流暢、有幫助，且拒絕有害請求）',
    quality: 'high',
  },
];

const quizData = [
  {
    q: '哪個訓練階段讓模型能夠按照指令格式回答問題？',
    options: ['Pretraining（預訓練）', 'SFT（監督式微調）', 'Alignment（對齊訓練）'],
    correct: 1,
    reason: 'SFT 使用指令-回應配對資料，讓模型從「文字補全」轉變為能理解並執行指令的助手。',
  },
  {
    q: '為什麼「終身學習」在實務中多靠 RAG 而非持續重訓模型？',
    options: ['重訓模型成本極高且費時', '模型無法更新知識', 'RAG 的答案品質更好'],
    correct: 0,
    reason: '從頭重訓或大規模微調成本極高（數百萬美元起跳），而 RAG 只需更新知識庫即可讓模型「知道」最新資訊。',
  },
];

const Level6: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const done = isCompleted(6);
  const [activeStage, setActiveStage] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState([false, false]);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));

  const handleStageClick = (idx: number) => {
    setActiveStage(idx);
    const next = new Set(visited).add(idx);
    setVisited(next);
  };

  const handleQuizAnswer = (qi: number, ai: number) => {
    if (quizSubmitted[qi]) return;
    const na = [...quizAnswers]; na[qi] = ai;
    const ns = [...quizSubmitted]; ns[qi] = true;
    setQuizAnswers(na);
    setQuizSubmitted(ns);
    if (ns.every(Boolean)) markComplete(6);
  };

  const stage = STAGES[activeStage];
  const colorMap = { blue: { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' }, amber: { bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' }, green: { bg: 'bg-green-600', light: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' } };
  const c = colorMap[stage.color as keyof typeof colorMap];

  return (
    <LevelLayout
      levelNumber={6}
      title="Model Evolution"
      subtitle="模型演進：預訓練 → SFT → 對齊 → 落地"
      icon="📈"
      sticker="現代 LLM 歷經三大訓練階段：Pretraining（預訓練）→ SFT（監督式微調）→ Alignment（對齊），每個階段讓模型更加「聰明且可靠」。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 三大訓練階段</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          一個可用的 LLM 不是「訓練一次就完成」，而是歷經多個階段的打磨：
          <Term id="pretraining" />、<Term id="sft" />、<Term id="alignment" />。
        </p>

        {/* Timeline */}
        <div className="flex items-center gap-0 mb-6 overflow-x-auto">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => handleStageClick(i)}
                className={`flex flex-col items-center p-3 rounded-2xl min-w-[100px] transition-all ${
                  activeStage === i
                    ? `${colorMap[s.color as keyof typeof colorMap].light} border-2 ${colorMap[s.color as keyof typeof colorMap].border}`
                    : visited.has(i)
                    ? 'bg-emerald-50 border-2 border-emerald-200'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-1">{s.icon}</span>
                <span className="font-bold text-xs text-gray-800">{s.label}</span>
                <span className="text-xs text-gray-500">{s.chinese}</span>
                {visited.has(i) && i !== activeStage && <span className="text-emerald-500 text-xs">✓</span>}
              </button>
              {i < STAGES.length - 1 && (
                <div className="flex-1 h-1 bg-gradient-to-r from-blue-300 via-amber-300 to-green-300 min-w-[20px]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Stage detail */}
        <div className={`rounded-2xl p-5 ${c.light} border ${c.border} animate-fade-in`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{stage.icon}</span>
            <div>
              <h3 className={`font-bold text-lg ${c.text}`}>
                {stage.fullLabel || stage.label}（{stage.chinese}）
              </h3>
              <p className="text-gray-600 text-sm">{stage.desc}</p>
            </div>
          </div>

          <div className={`bg-white/70 rounded-xl p-3 mb-3 text-sm`}>
            {isAcademic ? stage.academicDesc : stage.enterpriseDesc}
          </div>

          {/* Example response */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-400 mb-2">
              問：「請幫我解釋量子力學的基本概念」→ {stage.label} 階段的模型回答：
            </p>
            <p className={`text-sm leading-relaxed ${stage.quality === 'high' ? 'text-gray-800' : stage.quality === 'mid' ? 'text-gray-700' : 'text-gray-500 italic'}`}>
              {stage.response}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">品質：</span>
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className={`w-3 h-3 rounded-full ${i < (stage.quality === 'high' ? 3 : stage.quality === 'mid' ? 2 : 1) ? c.bg : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lifelong Learning note */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <span>♾️</span>
          <Term id="lifelong-learning" />
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-xl p-4 text-sm">
            <div className="font-bold text-red-700 mb-2">❌ 常見誤解</div>
            <p className="text-red-600">「模型應該每天學習新知識，不斷更新」</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-sm">
            <div className="font-bold text-green-700 mb-2">✅ 實際做法</div>
            <p className="text-green-600">
              重新訓練成本極高，實務上靠 <Term id="rag" showChinese={false} />（检索最新文件）
              或工具呼叫讓模型「知道」最新資訊，不用重訓。
            </p>
          </div>
        </div>
      </div>

      {/* Quiz */}
      {!done && (
        <div className="card">
          <h2 className="font-bold text-lg mb-4">📝 小測</h2>
          <div className="space-y-6">
            {quizData.map((q, qi) => (
              <div key={qi}>
                <p className="font-medium text-gray-800 mb-3">Q{qi + 1}. {q.q}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleQuizAnswer(qi, oi)}
                      disabled={quizSubmitted[qi]}
                      className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                        quizAnswers[qi] === oi
                          ? quizSubmitted[qi]
                            ? oi === q.correct ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-red-400 bg-red-50 text-red-700'
                            : 'border-indigo-400 bg-indigo-50'
                          : quizSubmitted[qi] && oi === q.correct
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-indigo-300'
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
        </div>
      )}

      {done && (
        <div className="card text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700">本關已完成！</h3>
          <p className="text-gray-500 mt-1">你已理解模型訓練的三大階段。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level6;
