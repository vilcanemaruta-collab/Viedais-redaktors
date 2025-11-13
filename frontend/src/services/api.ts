import axios from 'axios';
import type { AnalysisResult, TextSettings, Guideline, KnowledgeBaseArticle, SystemPrompt } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';
const ADMIN_API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/admin` 
  : '/.netlify/functions/admin-data';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AdminData {
  guidelines: Guideline[];
  knowledgeBase: KnowledgeBaseArticle[];
  systemPrompts: SystemPrompt[];
  activePromptId: string | null;
}

export interface AnalyzeRequest {
  text: string;
  settings: TextSettings;
  prompt: string;
}

export interface SummarizeRequest {
  text: string;
  language: string;
}

export async function analyzeText(request: AnalyzeRequest): Promise<AnalysisResult> {
  try {
    console.log('🌐 API Request to /analyze');
    console.log('📍 Full URL:', `${API_BASE_URL}/analyze`);
    console.log('📦 Request payload:', {
      textLength: request.text.length,
      settings: request.settings,
      promptLength: request.prompt.length,
    });
    
    const response = await api.post<AnalysisResult>('/analyze', request);
    
    console.log('✅ API Response status:', response.status);
    console.log('✅ API Response data:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error headers:', error.response?.headers);
    
    throw new Error('Neizdevās analizēt tekstu. Lūdzu, mēģiniet vēlreiz.');
  }
}

export async function summarizeText(request: SummarizeRequest): Promise<string> {
  try {
    const response = await api.post<{ summary: string }>('/summarize', request);
    return response.data.summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw new Error('Neizdevās izveidot kopsavilkumu. Lūdzu, mēģiniet vēlreiz.');
  }
}

export async function getSuggestions(text: string, language: string): Promise<string[]> {
  try {
    const response = await api.post<{ suggestions: string[] }>('/suggestions', {
      text,
      language,
    });
    return response.data.suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw new Error('Neizdevās iegūt ieteikumus. Lūdzu, mēģiniet vēlreiz.');
  }
}

// Admin API functions
const adminApi = axios.create({
  baseURL: ADMIN_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchAdminData(): Promise<AdminData> {
  try {
    const response = await adminApi.get<AdminData>('');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw new Error('Neizdevās ielādēt admin datus.');
  }
}

export async function addGuideline(guideline: Guideline): Promise<void> {
  try {
    await adminApi.post('/guidelines', guideline);
  } catch (error) {
    console.error('Error adding guideline:', error);
    throw new Error('Neizdevās pievienot vadlīniju.');
  }
}

export async function updateGuideline(id: string, updates: Partial<Guideline>): Promise<void> {
  try {
    await adminApi.put(`/guidelines/${id}`, updates);
  } catch (error) {
    console.error('Error updating guideline:', error);
    throw new Error('Neizdevās atjaunot vadlīniju.');
  }
}

export async function deleteGuideline(id: string): Promise<void> {
  try {
    await adminApi.delete(`/guidelines/${id}`);
  } catch (error) {
    console.error('Error deleting guideline:', error);
    throw new Error('Neizdevās dzēst vadlīniju.');
  }
}

export async function addArticle(article: KnowledgeBaseArticle): Promise<void> {
  try {
    await adminApi.post('/knowledge-base', article);
  } catch (error) {
    console.error('Error adding article:', error);
    throw new Error('Neizdevās pievienot rakstu.');
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await adminApi.delete(`/knowledge-base/${id}`);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error('Neizdevās dzēst rakstu.');
  }
}

export async function addPrompt(prompt: SystemPrompt): Promise<void> {
  try {
    await adminApi.post('/prompts', prompt);
  } catch (error) {
    console.error('Error adding prompt:', error);
    throw new Error('Neizdevās pievienot prompt.');
  }
}

export async function setActivePrompt(id: string): Promise<void> {
  try {
    await adminApi.put('/active-prompt', { id });
  } catch (error) {
    console.error('Error setting active prompt:', error);
    throw new Error('Neizdevās iestatīt aktīvo prompt.');
  }
}

export default api;

