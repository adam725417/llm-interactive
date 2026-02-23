import React, { useState, useRef } from 'react';
import { GlossaryTerm } from '../types';
import { getTermById } from '../data/glossary';

interface TooltipProps {
  english: string;
  chinese: string;
  description: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({
  english, chinese, description, children, placement = 'top'
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    clearTimeout(timerRef.current);
    setVisible(true);
  };

  const hide = () => {
    timerRef.current = setTimeout(() => setVisible(false), 150);
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 ${placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-64 bg-gray-900 text-white rounded-xl p-3 shadow-2xl text-sm pointer-events-none animate-fade-in`}
          role="tooltip"
        >
          <p className="font-bold text-indigo-300 text-xs mb-1">
            {english}（{chinese}）
          </p>
          <p className="text-gray-300 text-xs leading-relaxed">{description}</p>
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${placement === 'top' ? 'top-full border-t-gray-900 border-t-4 border-x-4 border-x-transparent border-b-0' : 'bottom-full border-b-gray-900 border-b-4 border-x-4 border-x-transparent border-t-0'}`}
          />
        </div>
      )}
    </span>
  );
};

// Convenient inline term component
interface TermProps {
  id: string;
  showChinese?: boolean;
  placement?: 'top' | 'bottom';
}

export const Term: React.FC<TermProps> = ({ id, showChinese = true, placement }) => {
  const term = getTermById(id);
  if (!term) return <span>{id}</span>;

  return (
    <Tooltip
      english={term.fullEnglish || term.english}
      chinese={term.chinese}
      description={term.description}
      placement={placement}
    >
      <span className="term-highlight">
        {term.fullEnglish || term.english}
        {showChinese && `（${term.chinese}）`}
      </span>
    </Tooltip>
  );
};

// Tooltip for custom text
export const TermCustom: React.FC<{
  term: GlossaryTerm;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
}> = ({ term, children, placement }) => (
  <Tooltip
    english={term.fullEnglish || term.english}
    chinese={term.chinese}
    description={term.description}
    placement={placement}
  >
    <span className="term-highlight">{children}</span>
  </Tooltip>
);
