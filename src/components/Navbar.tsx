import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMode } from '../contexts/ModeContext';
import { useProgress } from '../contexts/ProgressContext';
import { GlossaryDrawer } from './GlossaryDrawer';
import { TOTAL_LEVELS } from '../contexts/ProgressContext';

export const Navbar: React.FC = () => {
  const { mode, toggleMode, isAcademic } = useMode();
  const { completed } = useProgress();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const progressPct = Math.round((completed.length / TOTAL_LEVELS) * 100);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
            <span className="text-xl">🧠</span>
            <span className="hidden sm:inline text-sm">LLM 闖關教學</span>
          </Link>

          {/* Progress bar */}
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>進度</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-medium text-indigo-600">{completed.length}/{TOTAL_LEVELS}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Map link */}
            <button
              onClick={() => navigate('/map')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              title="闖關地圖"
            >
              🗺️
            </button>

            {/* Glossary */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
            >
              📖 詞彙表
            </button>

            {/* Mode toggle */}
            <button
              onClick={toggleMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isAcademic
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
              title={`切換到${isAcademic ? '企業' : '學術'}模式`}
            >
              {isAcademic ? '🎓 學術' : '🏢 企業'}
            </button>
          </div>
        </div>
      </nav>
      <GlossaryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};
