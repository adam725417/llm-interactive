import React, { useState } from 'react';
import { glossary } from '../data/glossary';

const CATEGORY_LABELS: Record<string, string> = {
  core: '核心概念',
  transformer: 'Transformer 架構',
  multimodal: '多模態',
  training: '訓練與演進',
  cost: '成本',
  risk: '風險',
  deployment: '落地應用',
};

interface GlossaryDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({ open, onClose }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = glossary.filter(t => {
    const matchSearch =
      !search ||
      t.english.toLowerCase().includes(search.toLowerCase()) ||
      t.chinese.includes(search) ||
      t.description.includes(search);
    const matchCat = activeCategory === 'all' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  const categories = ['all', ...Array.from(new Set(glossary.map(t => t.category)))];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-indigo-50">
          <div>
            <h2 className="font-bold text-lg text-indigo-900">詞彙表 Glossary</h2>
            <p className="text-xs text-indigo-500">共 {glossary.length} 個關鍵名詞</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-indigo-100 transition-colors"
            aria-label="關閉"
          >
            <svg className="w-5 h-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜尋名詞..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 px-4 py-2 border-b overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat === 'all' ? '全部' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Term list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8">找不到符合的名詞</p>
          ) : (
            filtered.map(term => (
              <div key={term.id} className="bg-gray-50 rounded-xl p-3 hover:bg-indigo-50 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold text-indigo-700 text-sm">
                    {term.fullEnglish || term.english}
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full ml-2 shrink-0">
                    {CATEGORY_LABELS[term.category]}
                  </span>
                </div>
                <p className="text-gray-700 text-sm font-medium mb-1">{term.chinese}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{term.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
