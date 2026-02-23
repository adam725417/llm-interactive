import React, { useState } from 'react';
import { LevelLayout } from '../../components/LevelLayout';
import { Term } from '../../components/Tooltip';
import { useProgress } from '../../contexts/ProgressContext';
import { useMode } from '../../contexts/ModeContext';

type TabType = 'text' | 'image' | 'audio';

interface VisualWeight { token: string; weight: number; hint: string }

const CROSS_ATTENTION_DATA: Record<string, VisualWeight[]> = {
  '做什麼': [
    { token: '在追', weight: 0.85, hint: '動作詞彙' },
    { token: '一個球', weight: 0.62, hint: '目標物件' },
    { token: '一隻狗', weight: 0.45, hint: '動作主語' },
    { token: '快速跑', weight: 0.38, hint: '動作狀態' },
  ],
  '狗': [
    { token: '一隻狗', weight: 0.92, hint: '直接指代' },
    { token: '快速跑', weight: 0.55, hint: '行為描述' },
    { token: '在追', weight: 0.48, hint: '動作主語' },
    { token: '草地上', weight: 0.21, hint: '場景背景' },
  ],
  '追': [
    { token: '在追', weight: 0.95, hint: '直接對應' },
    { token: '一個球', weight: 0.72, hint: '追逐目標' },
    { token: '一隻狗', weight: 0.50, hint: '動作執行者' },
    { token: '快速跑', weight: 0.33, hint: '伴隨動作' },
  ],
};

const VISUAL_TOKENS = ['一隻狗', '在追', '一個球', '草地上', '快速跑'];

const PipelineStep: React.FC<{ step: number; label: string; desc: string; active?: boolean }> = ({ step, label, desc, active }) => (
  <div className={`flex items-start gap-3 p-3 rounded-xl transition-all ${active ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
      {step}
    </div>
    <div>
      <p className="font-semibold text-sm text-gray-800">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

const Level5: React.FC = () => {
  const { markComplete, isCompleted } = useProgress();
  const { isAcademic } = useMode();
  const done = isCompleted(5);

  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(new Set(['text']));
  const [clickedWord, setClickedWord] = useState<string | null>(null);
  const [crossAttentionDone, setCrossAttentionDone] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const next = new Set(visitedTabs).add(tab);
    setVisitedTabs(next);
  };

  const handleWordClick = (word: string) => {
    setClickedWord(word);
    setCrossAttentionDone(true);
    if (visitedTabs.size >= 2) {
      markComplete(5);
    }
  };

  const currentWeights = clickedWord ? CROSS_ATTENTION_DATA[clickedWord] ?? [] : [];

  const tabs: { id: TabType; label: string; icon: string; sub: string }[] = [
    { id: 'text', label: 'Text（文字）', icon: '📝', sub: 'Tokenization → Text tokens' },
    { id: 'image', label: 'Image（圖像）', icon: '🖼️', sub: 'Image encoder → Visual tokens' },
    { id: 'audio', label: 'Audio（音訊）', icon: '🎵', sub: 'Audio encoder → Audio tokens' },
  ];

  return (
    <LevelLayout
      levelNumber={5}
      title="Multimodal"
      subtitle="多模態能力——大語言模型如何看圖聽音"
      icon="🌐"
      sticker="多模態（Multimodal）= 把圖片/聲音也變成詞元，讓 Transformer 用注意力把它和文字對起來，就像你同時用眼睛看圖、用腦子理解文字。"
      completed={done}
    >
      {/* Concept */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-3">💡 多模態如何運作？</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          <Term id="multimodal" /> 模型能同時處理多種 <Term id="modality" />（模態）。
          每種模態先被各自的「編碼器」轉換成 <Term id="token" showChinese={false} /> 向量，
          再透過 <Term id="cross-attention" /> 讓文字 token 與視覺/音訊 token「對話」。
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-medium">🖼️ 圖片</span>
            <span className="text-gray-400">→</span>
            <span className="bg-blue-200 text-blue-900 px-3 py-1.5 rounded-lg font-medium">Image encoder</span>
            <span className="text-gray-400">→</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg font-medium">視覺 tokens</span>
            <span className="text-gray-400">→</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg font-medium">Transformer</span>
          </div>
        </div>
        {isAcademic ? (
          <div className="mt-3 bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700">
            <strong>學術補充：</strong> 常見架構如 CLIP（對比學習對齊文字與圖像）、
            LLaVA（視覺 token 直接投影到語言模型空間）、GPT-4V（多模態 Transformer）。
            Cross-attention 中文字 token 作為 Query，視覺 token 作為 Key 和 Value。
          </div>
        ) : (
          <div className="mt-3 bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
            <strong>企業視角：</strong> 多模態 AI 能自動分析商品圖片、發票掃描件、語音留言，
            大幅降低人工處理成本。目前主流 API（GPT-4o、Claude 3）都支援圖文輸入。
          </div>
        )}
      </div>

      {/* Tab selector */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">🔄 轉換流程</h2>
          <span className="text-xs text-gray-500">已切換：{visitedTabs.size}/3 個模態</span>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : visitedTabs.has(t.id)
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {visitedTabs.has(t.id) && activeTab !== t.id && <span className="text-xs">✓</span>}
            </button>
          ))}
        </div>

        {/* Text tab */}
        {activeTab === 'text' && (
          <div className="animate-fade-in space-y-3">
            <PipelineStep step={1} label="原始文字輸入" desc="「一隻狗在追一個球」" active />
            <div className="flex justify-center"><span className="text-2xl">↓</span></div>
            <PipelineStep step={2} label="Tokenization（詞元化）" desc="將文字切分為最小單位" active />
            <div className="flex justify-center"><span className="text-2xl">↓</span></div>
            <PipelineStep step={3} label="Text tokens（文字詞元）" desc="每個詞元對應一個數字 ID，送入模型" active />
            <div className="flex flex-wrap gap-2 mt-3">
              {['[一隻]', '[狗]', '[在]', '[追]', '[一個]', '[球]'].map((t, i) => (
                <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-sm font-mono font-medium border border-indigo-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Image tab */}
        {activeTab === 'image' && (
          <div className="animate-fade-in space-y-3">
            <PipelineStep step={1} label="圖片輸入（如：一隻狗在追球的照片）" desc="原始像素資料" active />
            <div className="flex justify-center"><span className="text-2xl">↓</span></div>
            <PipelineStep step={2} label={`Image encoder（影像編碼器）`} desc="將圖片切成 patch，提取視覺特徵" active />
            <div className="flex justify-center"><span className="text-2xl">↓</span></div>
            <PipelineStep step={3} label="Visual tokens（視覺詞元）" desc="每個圖像區塊對應一個特徵向量" active />
            <div className="mt-3 bg-amber-50 rounded-xl p-4">
              <p className="text-sm font-medium text-amber-800 mb-3">視覺 tokens（代表圖像不同區塊）：</p>
              <div className="grid grid-cols-5 gap-2">
                {VISUAL_TOKENS.map((t, i) => (
                  <div key={i} className="bg-amber-100 rounded-lg p-2 text-center text-xs font-medium text-amber-800 border border-amber-200">
                    <div className="text-lg mb-1">
                      {i === 0 ? '🐕' : i === 1 ? '💨' : i === 2 ? '⚽' : i === 3 ? '🌿' : '🏃'}
                    </div>
                    {t}
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-600 mt-2">圖像被切成多個小區塊（patches），每塊都變成一個 visual token</p>
            </div>
          </div>
        )}

        {/* Audio tab */}
        {activeTab === 'audio' && (
          <div className="animate-fade-in space-y-3">
            <PipelineStep step={1} label="音訊輸入（如：語音說話/背景聲）" desc="連續的聲音波形訊號" active />
            <div className="flex justify-center"><span className="text-2xl">↓</span></div>
            <PipelineStep step={2} label={`Audio encoder（音訊編碼器）`} desc="將波形轉換為頻譜特徵（如 Mel spectrogram）" active />
            <div className="flex justify-center"><span className="text-2xl">↓</span></div>
            <PipelineStep step={3} label="Audio tokens（音訊詞元）" desc="代表聲學特徵的向量序列，送入 Transformer" active />
            <div className="mt-3 flex flex-wrap gap-2">
              {['[靜音]', '[狗吠]', '[腳步]', '[碰撞]', '[喘息]'].map((t, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm font-mono border border-green-200">
                  {t}
                </span>
              ))}
            </div>
            {isAcademic && (
              <div className="bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700">
                <strong>學術補充：</strong> Whisper、SeamlessM4T 等模型使用 Encoder-Decoder 架構，
                將音訊 mel-spectrogram 通過 Conv+Transformer 提取特徵，再解碼成文字或翻譯。
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cross-attention demo */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-2">🔗 <Term id="cross-attention" /> 互動示意</h2>
        <p className="text-gray-600 text-sm mb-4">
          圖像描述：<strong>一隻狗在追球</strong><br />
          問題：點擊問題中的關鍵詞，看它透過 Cross-attention 連到哪個視覺 token。
        </p>

        {/* Question with clickable words */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <p className="text-gray-500 text-xs mb-2">問題（點擊藍色詞）：</p>
          <p className="text-lg font-semibold text-gray-800">
            {['狗', '在', '做什麼', '？', '它在', '追', '球嗎'].map((word, i) => {
              const isClickable = word in CROSS_ATTENTION_DATA;
              return (
                <span key={i}>
                  <span
                    onClick={() => isClickable && handleWordClick(word)}
                    className={`${isClickable ? 'cursor-pointer text-indigo-700 border-b-2 border-indigo-400 hover:bg-indigo-50 rounded px-0.5' : ''} ${clickedWord === word ? 'bg-indigo-100' : ''}`}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </p>
        </div>

        {/* Visual tokens with highlights */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs mb-2">圖像 Visual tokens：</p>
          <div className="flex flex-wrap gap-2">
            {VISUAL_TOKENS.map((t, i) => {
              const w = currentWeights.find(cw => cw.token === t);
              return (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    w
                      ? 'border-amber-400 bg-amber-50 text-amber-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                  style={w ? { opacity: 0.3 + w.weight * 0.7 } : {}}
                >
                  <div className="text-center text-xs mb-0.5">
                    {w && <span className="font-bold text-amber-700">{(w.weight * 100).toFixed(0)}%</span>}
                  </div>
                  {t}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cross-attention weight table */}
        {crossAttentionDone && clickedWord && currentWeights.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              跨模態注意力表格 —— 文字「{clickedWord}」看向哪些視覺 token
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-amber-50 text-amber-700">
                  <th className="text-left p-2 rounded-tl-lg">Visual token（視覺詞元）</th>
                  <th className="text-left p-2">Weight（權重）</th>
                  <th className="text-left p-2 rounded-tr-lg">Hint（提示）</th>
                </tr>
              </thead>
              <tbody>
                {currentWeights.map((w, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-2 font-medium text-gray-800">{w.token}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${w.weight * 100}%` }} />
                        </div>
                        <span className="font-bold text-amber-700 text-xs">{w.weight.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="p-2 text-gray-500 text-xs">{w.hint}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 p-3 bg-indigo-50 rounded-xl text-xs text-indigo-700">
              💡 Cross-attention 讓文字 token 「問」視覺 token「你和我有多相關？」，
              然後加權合併得到跨模態的理解結果。
            </div>
          </div>
        )}

        {!clickedWord && (
          <p className="text-center text-gray-400 text-sm py-4">
            點擊上方問題中的藍色詞彙，觀察 Cross-attention 如何連接文字與視覺 token
          </p>
        )}
      </div>

      {/* Completion check */}
      <div className="card mb-4">
        <h2 className="font-bold text-base mb-3">✅ 通關條件</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: '至少切換 2 個模態 Tab', done: visitedTabs.size >= 2 },
            { label: '完成 Cross-attention 對齊互動', done: crossAttentionDone },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${item.done ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
              <span>{item.done ? '✅' : '⭕'}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {done && (
        <div className="card text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-emerald-700">本關已完成！</h3>
          <p className="text-gray-500 mt-1">你已理解多模態 AI 的核心機制。</p>
        </div>
      )}
    </LevelLayout>
  );
};

export default Level5;
