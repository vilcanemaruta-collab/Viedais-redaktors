import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Guideline, KnowledgeBaseArticle, SystemPrompt } from '../types';
import { 
  fetchAdminData, 
  addGuideline as apiAddGuideline,
  updateGuideline as apiUpdateGuideline,
  deleteGuideline as apiDeleteGuideline,
  addArticle as apiAddArticle,
  deleteArticle as apiDeleteArticle,
  addPrompt as apiAddPrompt,
  setActivePrompt as apiSetActivePrompt,
} from '../services/api';

interface AdminStore {
  guidelines: Guideline[];
  knowledgeBase: KnowledgeBaseArticle[];
  systemPrompts: SystemPrompt[];
  activePromptId: string | null;
  isLoading: boolean;
  
  loadFromServer: () => Promise<void>;
  addGuideline: (guideline: Guideline) => Promise<void>;
  updateGuideline: (id: string, guideline: Partial<Guideline>) => Promise<void>;
  deleteGuideline: (id: string) => Promise<void>;
  
  addArticle: (article: KnowledgeBaseArticle) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  
  addSystemPrompt: (prompt: SystemPrompt) => Promise<void>;
  setActivePrompt: (id: string) => Promise<void>;
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
      isLoading: false,
      
      loadFromServer: async () => {
        try {
          set({ isLoading: true });
          const data = await fetchAdminData();
          set({
            guidelines: data.guidelines || [],
            knowledgeBase: data.knowledgeBase || [],
            systemPrompts: data.systemPrompts || [DEFAULT_PROMPT],
            activePromptId: data.activePromptId || 'default',
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load admin data from server:', error);
          set({ isLoading: false });
        }
      },
      
      addGuideline: async (guideline) => {
        try {
          await apiAddGuideline(guideline);
          set((state) => ({ guidelines: [...state.guidelines, guideline] }));
        } catch (error) {
          console.error('Failed to add guideline:', error);
          throw error;
        }
      },
      
      updateGuideline: async (id, updates) => {
        try {
          await apiUpdateGuideline(id, updates);
          set((state) => ({
            guidelines: state.guidelines.map((g) =>
              g.id === id ? { ...g, ...updates } : g
            ),
          }));
        } catch (error) {
          console.error('Failed to update guideline:', error);
          throw error;
        }
      },
      
      deleteGuideline: async (id) => {
        try {
          await apiDeleteGuideline(id);
          set((state) => ({
            guidelines: state.guidelines.filter((g) => g.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete guideline:', error);
          throw error;
        }
      },
      
      addArticle: async (article) => {
        try {
          await apiAddArticle(article);
          set((state) => ({ knowledgeBase: [...state.knowledgeBase, article] }));
        } catch (error) {
          console.error('Failed to add article:', error);
          throw error;
        }
      },
      
      deleteArticle: async (id) => {
        try {
          await apiDeleteArticle(id);
          set((state) => ({
            knowledgeBase: state.knowledgeBase.filter((a) => a.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete article:', error);
          throw error;
        }
      },
      
      addSystemPrompt: async (prompt) => {
        try {
          await apiAddPrompt(prompt);
          set((state) => ({ systemPrompts: [...state.systemPrompts, prompt] }));
        } catch (error) {
          console.error('Failed to add prompt:', error);
          throw error;
        }
      },
      
      setActivePrompt: async (id) => {
        try {
          await apiSetActivePrompt(id);
          set({ activePromptId: id });
        } catch (error) {
          console.error('Failed to set active prompt:', error);
          throw error;
        }
      },
      
      getActivePrompt: () => {
        const state = get();
        return state.systemPrompts.find((p) => p.id === state.activePromptId) || null;
      },
    }),
    {
      name: 'text-editor-admin',
      version: 2,
      storage: createJSONStorage<AdminStore>(() => localStorage),
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;

        const persisted = persistedState as AdminStore;

        const mergeById = <T extends { id: string }>(base: T[], incoming?: T[]) => {
          if (!incoming || incoming.length === 0) {
            return base;
          }
          const map = new Map<string, T>();
          base.forEach((item) => map.set(item.id, item));
          incoming.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
          return Array.from(map.values());
        };

        const withCreatedAt = <T extends { id: string; createdAt?: string }>(items: T[]) =>
          items.map((item) => ({
            ...item,
            createdAt: item.createdAt ?? new Date().toISOString(),
          }));

        return {
          ...currentState,
          guidelines: withCreatedAt(mergeById(currentState.guidelines, persisted.guidelines)),
          knowledgeBase: withCreatedAt(
            mergeById(currentState.knowledgeBase, persisted.knowledgeBase)
          ),
          systemPrompts: withCreatedAt(
            mergeById(currentState.systemPrompts, persisted.systemPrompts)
          ),
          activePromptId: persisted.activePromptId ?? currentState.activePromptId,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const active = state.getActivePrompt();
        if (!active) {
          state.setActivePrompt('default');
        }
      },
    }
  )
);

