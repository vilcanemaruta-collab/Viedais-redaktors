import type { Language, TextMetrics } from '../types';
import {
  countWords,
  splitIntoSentences,
  splitIntoParagraphs,
  getAverageWordsPerSentence,
  findComplexSentences,
} from './textProcessing';

// Flesch Reading Ease adapted for different languages
export function calculateReadabilityScore(text: string, language: Language = 'lv'): number {
  const sentences = splitIntoSentences(text, language);
  const words = countWords(text);
  
  if (sentences.length === 0 || words === 0) return 0;
  
  const avgWordsPerSentence = words / sentences.length;
  const avgSyllablesPerWord = estimateSyllables(text, language) / words;
  
  // Adapted Flesch Reading Ease formula
  let score: number;
  
  switch (language) {
    case 'lv':
      // Latvian adaptation
      score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
      break;
    case 'ru':
      // Russian adaptation
      score = 206.835 - (1.3 * avgWordsPerSentence) - (60.1 * avgSyllablesPerWord);
      break;
    case 'en':
    default:
      // Standard English formula
      score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
      break;
  }
  
  // Normalize to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

function estimateSyllables(text: string, language: Language): number {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  let totalSyllables = 0;
  
  words.forEach(word => {
    // Remove punctuation
    const cleanWord = word.replace(/[^\wāčēģīķļņšūžа-яё]/g, '');
    
    if (cleanWord.length === 0) return;
    
    switch (language) {
      case 'lv':
        // Latvian: count vowels (including special characters)
        totalSyllables += (cleanWord.match(/[aāeēiīouū]/g) || []).length;
        break;
      case 'ru':
        // Russian: count vowels
        totalSyllables += (cleanWord.match(/[аеёиоуыэюя]/g) || []).length;
        break;
      case 'en':
      default:
        // English: simple vowel count with adjustments
        let syllables = (cleanWord.match(/[aeiouy]+/g) || []).length;
        if (cleanWord.endsWith('e')) syllables--;
        if (syllables === 0) syllables = 1;
        totalSyllables += syllables;
        break;
    }
  });
  
  return totalSyllables;
}

export function calculateTextMetrics(text: string, language: Language = 'lv'): TextMetrics {
  const wordCount = countWords(text);
  const sentences = splitIntoSentences(text, language);
  const paragraphs = splitIntoParagraphs(text);
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;
  const avgWordsPerSentence = getAverageWordsPerSentence(text, language);
  const readabilityScore = calculateReadabilityScore(text, language);
  const complexSentences = findComplexSentences(text, language).length;
  
  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgWordsPerSentence,
    readabilityScore,
    complexSentences,
  };
}

export function getReadabilityLevel(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score >= 90) {
    return {
      level: 'Ļoti viegli',
      description: 'Teksts ir ļoti viegli lasāms un saprotams',
      color: 'text-green-600',
    };
  } else if (score >= 80) {
    return {
      level: 'Viegli',
      description: 'Teksts ir viegli lasāms',
      color: 'text-green-500',
    };
  } else if (score >= 70) {
    return {
      level: 'Samērā viegli',
      description: 'Teksts ir samērā viegli lasāms',
      color: 'text-yellow-500',
    };
  } else if (score >= 60) {
    return {
      level: 'Standarts',
      description: 'Teksts ir standarta sarežģītības līmenī',
      color: 'text-yellow-600',
    };
  } else if (score >= 50) {
    return {
      level: 'Samērā grūti',
      description: 'Teksts ir samērā grūti lasāms',
      color: 'text-orange-500',
    };
  } else if (score >= 30) {
    return {
      level: 'Grūti',
      description: 'Teksts ir grūti lasāms',
      color: 'text-red-500',
    };
  } else {
    return {
      level: 'Ļoti grūti',
      description: 'Teksts ir ļoti grūti lasāms un saprotams',
      color: 'text-red-600',
    };
  }
}

export function detectPassiveVoice(text: string, language: Language = 'lv'): string[] {
  const sentences = splitIntoSentences(text, language);
  const passiveSentences: string[] = [];
  
  // Simple passive voice detection patterns
  const patterns: Record<Language, RegExp[]> = {
    lv: [
      /\btiek\s+\w+/i,
      /\btika\s+\w+/i,
      /\btiks\s+\w+/i,
    ],
    ru: [
      /\b\w+ся\b/i, // reflexive verbs often indicate passive
    ],
    en: [
      /\b(is|are|was|were|been|being)\s+\w+ed\b/i,
    ],
  };
  
  const languagePatterns = patterns[language] || patterns.en;
  
  sentences.forEach(sentence => {
    if (languagePatterns.some(pattern => pattern.test(sentence))) {
      passiveSentences.push(sentence);
    }
  });
  
  return passiveSentences;
}

