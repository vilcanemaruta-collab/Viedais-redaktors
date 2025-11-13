import axios from 'axios';
import type { AnalysisResult, TextSettings } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;

