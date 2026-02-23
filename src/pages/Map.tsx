import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';

const levels = [
  { id: 1, icon: '🎯', title: 'Next-token prediction', sub: '下一個詞元預測', time: '2 min' },
  { id: 2, icon: '🧩', title: 'Token', sub: '詞元', time: '2 min' },
  { id: 3, icon: '🌡️', title: 'Temperature', sub: '溫度參數', time: '2 min' },
  { id: 4, icon: '🔍', title: 'Transformer & Attention', sub: '轉換器與注意力可視化', time: '4 min' },
  { id: 5, icon: '🌐', title: 'Multimodal', sub: '多模態能力', time: '3 min' },
  { id: 6, icon: '📈', title: 'Model Evolution', sub: '模型演進', time: '2 min' },
  { id: 7, icon: '⚖️', title: 'Parameters vs Tokens', sub: '參數量 vs 訓練詞元數', time: '2 min' },
  { id: 8, icon: '💰', title: 'Token Pricing', sub: '詞元計價', time: '2 min' },
  { id: 9, icon: '⚠️', title: 'Risk', sub: '風險與安全', time: '2 min' },
  { id: 10, icon: '🚀', title: 'RAG & Agent', sub: '落地應用', time: '3 min' },
];

const Map: React.FC = () => {
  const navigate = useNavigate();
  const { completed, isCompleted, isUnlocked, resetProgress } = useProgress();

  const totalTime = '~24 min';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🗺️ 闖關地圖</h1>
          <p className="text-gray-500">共 10 關 · 預計 {totalTime} · 完成 {completed.length}/10</p>

          {/* Overall progress */}
          <div className="max-w-md mx-auto mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>整體進度</span>
              <span>{Math.round((completed.length / 10) * 100)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${(completed.length / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Level cards grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {levels.map((lv, idx) => {
            const done = isCompleted(lv.id);
            const unlocked = isUnlocked(lv.id);

            return (
              <div
                key={lv.id}
                onClick={() => unlocked && navigate(`/level/${lv.id}`)}
                className={`card flex items-center gap-4 transition-all duration-200 animate-fade-in ${
                  unlocked
                    ? done
                      ? 'border-emerald-200 bg-emerald-50/50 cursor-pointer hover:shadow-md hover:border-emerald-300'
                      : 'cursor-pointer hover:shadow-md hover:border-indigo-200'
                    : 'opacity-50 cursor-not-allowed bg-gray-50'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  done
                    ? 'bg-emerald-100'
                    : unlocked
                    ? 'bg-indigo-100'
                    : 'bg-gray-100'
                }`}>
                  {done ? '✅' : unlocked ? lv.icon : '🔒'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-gray-400">Level {lv.id}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{lv.time}</span>
                    {done && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium ml-auto">
                        完成
                      </span>
                    )}
                    {unlocked && !done && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium ml-auto">
                        進行
                      </span>
                    )}
                    {!unlocked && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-auto">
                        鎖定
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{lv.title}</h3>
                  <p className="text-gray-500 text-sm truncate">{lv.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset button */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              if (window.confirm('確定要重置所有進度嗎？')) {
                resetProgress();
              }
            }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
          >
            重置進度
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
