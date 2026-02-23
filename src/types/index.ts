export type Mode = 'academic' | 'enterprise';

export interface GlossaryTerm {
  id: string;
  english: string;
  fullEnglish?: string;
  chinese: string;
  description: string;
  category: 'core' | 'transformer' | 'multimodal' | 'training' | 'cost' | 'risk' | 'deployment';
}

export interface LevelInfo {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  sticker: string;
}
