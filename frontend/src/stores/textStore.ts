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
  toggleIssueAcceptance: (issueIndex: number) => void;
  acceptAllIssues: () => void;
  rejectAllIssues: () => void;
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
      toggleIssueAcceptance: (issueIndex) => set((state) => {
        if (!state.analysisResult) return state;
        const issues = [...state.analysisResult.issues];
        issues[issueIndex] = {
          ...issues[issueIndex],
          accepted: !issues[issueIndex].accepted
        };
        return {
          analysisResult: {
            ...state.analysisResult,
            issues
          }
        };
      }),
      acceptAllIssues: () => set((state) => {
        if (!state.analysisResult) return state;
        return {
          analysisResult: {
            ...state.analysisResult,
            issues: state.analysisResult.issues.map(issue => ({ ...issue, accepted: true }))
          }
        };
      }),
      rejectAllIssues: () => set((state) => {
        if (!state.analysisResult) return state;
        return {
          analysisResult: {
            ...state.analysisResult,
            issues: state.analysisResult.issues.map(issue => ({ ...issue, accepted: false }))
          }
        };
      }),
    }),
    {
      name: 'text-editor-text',
      partialize: (state) => ({ text: state.text }), // Only persist text, not analysis
    }
  )
);

