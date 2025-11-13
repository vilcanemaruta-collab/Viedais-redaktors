export type Language = 'lv' | 'ru' | 'en';
export type Category = 'news' | 'sports' | 'culture' | 'business' | 'opinion';
export type Style = 'formal' | 'informal' | 'neutral';

export interface TextSettings {
  language: Language;
  category: Category;
  style: Style;
}

export interface TextMetrics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  readabilityScore: number;
  complexSentences: number;
  passiveVoiceCount?: number;
  passiveVoicePercentage?: number;
  longSentencesCount?: number;
  longSentencesPercentage?: number;
  avgParagraphLength?: number;
  wordRepetitionScore?: number;
  guidelineCompliance?: {
    sentenceLength: 'excellent' | 'good' | 'fair' | 'poor';
    activeVoice: 'excellent' | 'good' | 'fair' | 'poor';
    clarity: 'excellent' | 'good' | 'fair' | 'poor';
    overall: number;
  };
}

export interface TextIssue {
  type: 'readability' | 'grammar' | 'style' | 'complexity';
  severity: 'low' | 'medium' | 'high';
  sentence: string;
  suggestion: string;
  position: {
    start: number;
    end: number;
  };
}

export interface AnalysisResult {
  metrics: TextMetrics;
  issues: TextIssue[];
  summary: string;
  readabilityScore: number;
  readability_score?: number;
}

export interface Guideline {
  id: string;
  name: string;
  content: string;
  priority: number;
  createdAt: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: Category;
  language: Language;
  createdAt: string;
}

export interface SystemPrompt {
  id: string;
  content: string;
  version: number;
  createdAt: string;
  isActive: boolean;
}

