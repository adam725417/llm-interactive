import React, { createContext, useContext, useState } from 'react';
import { Mode } from '../types';

interface ModeContextValue {
  mode: Mode;
  toggleMode: () => void;
  isAcademic: boolean;
  isEnterprise: boolean;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('academic');

  const toggleMode = () => setMode(prev => prev === 'academic' ? 'enterprise' : 'academic');

  return (
    <ModeContext.Provider value={{
      mode,
      toggleMode,
      isAcademic: mode === 'academic',
      isEnterprise: mode === 'enterprise',
    }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
};
