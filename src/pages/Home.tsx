import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useMode } from '../contexts/ModeContext';

const levels = [
  { id: 1, icon: '🎯', title: 'Next-token prediction', sub: '下一個詞元預測' },
  { id: 2, icon: '🧩', title: 'Token', sub: '詞元' },
  { id: 3, icon: '🌡️', title: 'Temperature', sub: '溫度參數' },
  { id: 4, icon: '🔍', title: 'Transformer & Attention', sub: '轉換器與注意力可視化' },
  { id: 5, icon: '🌐', title: 'Multimodal', sub: '多模態能力' },
  { id: 6, icon: '📈', title: 'Model Evolution', sub: '模型演進' },
  { id: 7, icon: '⚖️', title: 'Parameters vs Tokens', sub: '參數量 vs 訓練詞元數' },
  { id: 8, icon: '💰', title: 'Token Pricing', sub: '詞元計價' },
  { id: 9, icon: '⚠️', title: 'Risk', sub: '風險與安全' },
  { id: 10, icon: '🚀', title: 'RAG & Agent', sub: '落地應用' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { completed } = useProgress();
  const { mode, toggleMode, isAcademic } = useMode();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        {/* Hero */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="animate-pulse-slow">✨</span>
            15–25 分鐘完成 · 10 關卡 · 互動學習
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
            LLM 互動<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              闖關教學
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            從 Token、Attention 到 RAG，<br className="hidden sm:block" />
            用互動關卡輕鬆掌握大型語言模型的核心概念。
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex justify-center gap-3 mb-10 animate-fade-in">
          <button
            onClick={() => !isAcademic && toggleMode()}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isAcademic
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🎓 學術模式
          </button>
          <button
            onClick={() => isAcademic && toggleMode()}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              !isAcademic
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🏢 企業模式
          </button>
        </div>

        <div className={`text-sm mb-10 px-4 py-3 rounded-xl max-w-md mx-auto ${
          isAcademic ? 'bg-purple-500/20 text-purple-200' : 'bg-amber-500/20 text-amber-200'
        }`}>
          {isAcademic
            ? '🎓 學術模式：深入原理、技術術語、補充概念'
            : '🏢 企業模式：成本試算、風險管理、白話比喻'}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
          <button
            onClick={() => navigate('/level/1')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
          >
            開始闖關 🚀
          </button>
          <button
            onClick={() => navigate('/map')}
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-2xl text-lg transition-all"
          >
            🗺️ 闖關地圖
          </button>
        </div>

        {/* Level overview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
          {levels.map(lv => (
            <div
              key={lv.id}
              onClick={() => navigate(`/level/${lv.id}`)}
              className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-105 text-left ${
                completed.includes(lv.id)
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-2xl mb-1">{lv.icon}</div>
              <div className="text-white/90 text-xs font-semibold leading-tight">{lv.title}</div>
              <div className="text-white/40 text-xs mt-0.5">{lv.sub}</div>
              {completed.includes(lv.id) && (
                <div className="text-emerald-400 text-xs mt-1 font-medium">✓ 完成</div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-white/30 text-xs mt-12">
          進度自動儲存 · 隨時可繼續 · 切換模式不影響進度
        </p>
      </div>
    </div>
  );
};

export default Home;
