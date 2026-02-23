import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextValue {
  completed: number[];
  markComplete: (level: number) => void;
  isCompleted: (level: number) => boolean;
  isUnlocked: (level: number) => boolean;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const STORAGE_KEY = 'llm-teach-progress';
const TOTAL_LEVELS = 10;

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completed, setCompleted] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const markComplete = (level: number) => {
    setCompleted(prev => prev.includes(level) ? prev : [...prev, level]);
  };

  const isCompleted = (level: number) => completed.includes(level);

  const isUnlocked = (level: number) => {
    if (level === 1) return true;
    return completed.includes(level - 1);
  };

  const resetProgress = () => {
    setCompleted([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProgressContext.Provider value={{ completed, markComplete, isCompleted, isUnlocked, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
};

export { TOTAL_LEVELS };
