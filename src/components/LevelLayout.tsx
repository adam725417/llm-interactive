import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useMode } from '../contexts/ModeContext';

interface LevelLayoutProps {
  levelNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  sticker?: string;
  completed: boolean;
  children: React.ReactNode;
}

export const LevelLayout: React.FC<LevelLayoutProps> = ({
  levelNumber,
  title,
  subtitle,
  icon,
  sticker,
  completed,
  children,
}) => {
  const navigate = useNavigate();
  const { isCompleted } = useProgress();
  const { mode, toggleMode, isAcademic } = useMode();

  const hasPrev = levelNumber > 1;
  const hasNext = levelNumber < 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Level {levelNumber}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              completed
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {completed ? '✓ 已完成' : '進行中'}
            </span>
            {/* Mode indicator */}
            <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer ${
              isAcademic ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
            }`} onClick={toggleMode} title="點擊切換模式">
              {isAcademic ? '🎓 學術模式' : '🏢 企業模式'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            {title}
          </h1>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {children}
        </div>

        {/* Completion Sticker */}
        {completed && sticker && (
          <div className="mt-8 sticker animate-fade-in">
            <div className="text-2xl mb-1">🎉</div>
            <p className="text-sm leading-relaxed">{sticker}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center">
          <button
            onClick={() => navigate(hasPrev ? `/level/${levelNumber - 1}` : '/map')}
            className="btn-secondary flex items-center gap-2"
          >
            <span>←</span> {hasPrev ? `Level ${levelNumber - 1}` : '地圖'}
          </button>

          <button
            onClick={() => navigate('/map')}
            className="btn-secondary text-sm"
          >
            🗺️ 地圖
          </button>

          {hasNext && (
            <button
              onClick={() => {
                if (isCompleted(levelNumber) || completed) {
                  navigate(`/level/${levelNumber + 1}`);
                } else {
                  navigate('/map');
                }
              }}
              disabled={!completed && !isCompleted(levelNumber)}
              className="btn-primary flex items-center gap-2"
            >
              {completed || isCompleted(levelNumber)
                ? `Level ${levelNumber + 1} →`
                : '完成本關解鎖 →'}
            </button>
          )}

          {!hasNext && (
            <button
              onClick={() => navigate('/map')}
              className="btn-primary"
            >
              🎊 回到地圖
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
