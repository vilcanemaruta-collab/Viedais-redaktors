import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TextSettings, Language, Category, Style } from '../types';

interface SettingsStore extends TextSettings {
  setLanguage: (language: Language) => void;
  setCategory: (category: Category) => void;
  setStyle: (style: Style) => void;
  reset: () => void;
}

const defaultSettings: TextSettings = {
  language: 'lv',
  category: 'news',
  style: 'neutral',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setLanguage: (language) => set({ language }),
      setCategory: (category) => set({ category }),
      setStyle: (style) => set({ style }),
      reset: () => set(defaultSettings),
    }),
    {
      name: 'text-editor-settings',
    }
  )
);

