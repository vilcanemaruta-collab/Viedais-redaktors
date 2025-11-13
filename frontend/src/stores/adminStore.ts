import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Guideline, KnowledgeBaseArticle, SystemPrompt } from '../types';

interface AdminStore {
  guidelines: Guideline[];
  knowledgeBase: KnowledgeBaseArticle[];
  systemPrompts: SystemPrompt[];
  activePromptId: string | null;
  
  addGuideline: (guideline: Guideline) => void;
  updateGuideline: (id: string, guideline: Partial<Guideline>) => void;
  deleteGuideline: (id: string) => void;
  
  addArticle: (article: KnowledgeBaseArticle) => void;
  deleteArticle: (id: string) => void;
  
  addSystemPrompt: (prompt: SystemPrompt) => void;
  setActivePrompt: (id: string) => void;
  getActivePrompt: () => SystemPrompt | null;
}

const DEFAULT_PROMPT: SystemPrompt = {
  id: 'default',
  content: `Tu esi profesionāls teksta redaktors {language} valodā.
Analizē šo tekstu pēc šādiem kritērijiem:

VADLĪNIJAS:
{guidelines}

KATEGORIJA: {category}
STILS: {style}

TEKSTS:
{text}

Atgriezies JSON formātā ar šādu struktūru:
{
  "readability_score": 0-100,
  "issues": [{"type": "string", "severity": "low|medium|high", "sentence": "string", "suggestion": "string", "position": {"start": 0, "end": 0}}],
  "summary": "bullet points kopsavilkums",
  "metrics": {"wordCount": 0, "sentenceCount": 0, "paragraphCount": 0, "avgWordsPerSentence": 0, "readabilityScore": 0, "complexSentences": 0}
}`,
  version: 1,
  createdAt: new Date().toISOString(),
  isActive: true,
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      guidelines: [],
      knowledgeBase: [],
      systemPrompts: [DEFAULT_PROMPT],
      activePromptId: 'default',
      
      addGuideline: (guideline) =>
        set((state) => ({ guidelines: [...state.guidelines, guideline] })),
      
      updateGuideline: (id, updates) =>
        set((state) => ({
          guidelines: state.guidelines.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),
      
      deleteGuideline: (id) =>
        set((state) => ({
          guidelines: state.guidelines.filter((g) => g.id !== id),
        })),
      
      addArticle: (article) =>
        set((state) => ({ knowledgeBase: [...state.knowledgeBase, article] })),
      
      deleteArticle: (id) =>
        set((state) => ({
          knowledgeBase: state.knowledgeBase.filter((a) => a.id !== id),
        })),
      
      addSystemPrompt: (prompt) =>
        set((state) => ({ systemPrompts: [...state.systemPrompts, prompt] })),
      
      setActivePrompt: (id) => set({ activePromptId: id }),
      
      getActivePrompt: () => {
        const state = get();
        return state.systemPrompts.find((p) => p.id === state.activePromptId) || null;
      },
    }),
    {
      name: 'text-editor-admin',
    }
  )
);

