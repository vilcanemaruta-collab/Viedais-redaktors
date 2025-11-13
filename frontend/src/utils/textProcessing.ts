import type { Language } from '../types';

// Sentence delimiters for different languages
const SENTENCE_DELIMITERS: Record<Language, RegExp> = {
  lv: /[.!?]+(?=\s+[A-ZĀČĒĢĪĶĻŅŠŪŽ]|$)/g,
  ru: /[.!?]+(?=\s+[A-ZАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ]|$)/g,
  en: /[.!?]+(?=\s+[A-Z]|$)/g,
};

export function splitIntoSentences(text: string, language: Language = 'lv'): string[] {
  if (!text.trim()) return [];
  
  const delimiter = SENTENCE_DELIMITERS[language];
  const sentences = text
    .split(delimiter)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return sentences;
}

export function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  
  // Remove extra whitespace and count words
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;
}

export function countCharacters(text: string, includeSpaces: boolean = true): number {
  if (includeSpaces) {
    return text.length;
  }
  return text.replace(/\s/g, '').length;
}

export function getAverageWordsPerSentence(text: string, language: Language = 'lv'): number {
  const sentences = splitIntoSentences(text, language);
  if (sentences.length === 0) return 0;
  
  const totalWords = countWords(text);
  return Math.round((totalWords / sentences.length) * 10) / 10;
}

export function getAverageSentenceLength(text: string, language: Language = 'lv'): number {
  const sentences = splitIntoSentences(text, language);
  if (sentences.length === 0) return 0;
  
  const totalChars = sentences.reduce((sum, s) => sum + s.length, 0);
  return Math.round((totalChars / sentences.length) * 10) / 10;
}

export function findComplexSentences(text: string, language: Language = 'lv', threshold: number = 25): string[] {
  const sentences = splitIntoSentences(text, language);
  
  return sentences.filter(sentence => {
    const wordCount = countWords(sentence);
    return wordCount > threshold;
  });
}

export function highlightText(text: string, positions: Array<{ start: number; end: number }>): string {
  if (positions.length === 0) return text;
  
  // Sort positions by start index
  const sorted = [...positions].sort((a, b) => a.start - b.start);
  
  let result = '';
  let lastIndex = 0;
  
  sorted.forEach(({ start, end }) => {
    result += text.substring(lastIndex, start);
    result += `<mark>${text.substring(start, end)}</mark>`;
    lastIndex = end;
  });
  
  result += text.substring(lastIndex);
  return result;
}

export function extractKeywords(text: string, count: number = 10): string[] {
  // Simple keyword extraction based on word frequency
  const words = text
    .toLowerCase()
    .replace(/[^\wāčēģīķļņšūžа-яё\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter out short words
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}

