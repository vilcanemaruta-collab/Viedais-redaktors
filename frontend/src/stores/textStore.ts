import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult } from '../types';

interface TextStore {
  text: string;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  setText: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  clearText: () => void;
}

export const useTextStore = create<TextStore>()(
  persist(
    (set) => ({
      text: '',
      analysisResult: null,
      isAnalyzing: false,
      setText: (text) => set({ text }),
      setAnalysisResult: (analysisResult) => set({ analysisResult }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      clearText: () => set({ text: '', analysisResult: null }),
    }),
    {
      name: 'text-editor-text',
      partialize: (state) => ({ text: state.text }), // Only persist text, not analysis
    }
  )
);

