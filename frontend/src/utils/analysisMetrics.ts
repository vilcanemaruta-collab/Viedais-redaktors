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
  
  // Advanced metrics
  const passiveVoiceSentences = detectPassiveVoice(text, language);
  const passiveVoiceCount = passiveVoiceSentences.length;
  const passiveVoicePercentage = sentenceCount > 0 ? Math.round((passiveVoiceCount / sentenceCount) * 100) : 0;
  
  const longSentences = findLongSentences(text, language);
  const longSentencesCount = longSentences.length;
  const longSentencesPercentage = sentenceCount > 0 ? Math.round((longSentencesCount / sentenceCount) * 100) : 0;
  
  const avgParagraphLength = paragraphCount > 0 ? Math.round(sentenceCount / paragraphCount * 10) / 10 : 0;
  
  const wordRepetitionScore = calculateWordRepetitionScore(text);
  
  const guidelineCompliance = assessGuidelineCompliance(
    avgWordsPerSentence,
    passiveVoicePercentage,
    readabilityScore,
    longSentencesPercentage
  );
  
  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgWordsPerSentence,
    readabilityScore,
    complexSentences,
    passiveVoiceCount,
    passiveVoicePercentage,
    longSentencesCount,
    longSentencesPercentage,
    avgParagraphLength,
    wordRepetitionScore,
    guidelineCompliance,
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
      level: 'Vidējs',
      description: 'Teksts ir vidēja sarežģītības līmenī',
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
  
  // Enhanced passive voice detection patterns
  const patterns: Record<Language, RegExp[]> = {
    lv: [
      /\btiek\s+\w+/i,
      /\btika\s+\w+/i,
      /\btiks\s+\w+/i,
      /\btop\s+\w+/i,
      /\btika\s+\w+(t[sa]|t[īi]|šan[as])/i,
      /\btiek\s+\w+(t[sa]|t[īi]|šan[as])/i,
    ],
    ru: [
      /\b\w+(ся|сь)\b/i, // reflexive verbs
      /\b(был|была|было|были|будет|будут)\s+\w+(н|т|м)\w*\b/i,
    ],
    en: [
      /\b(is|are|was|were|been|being)\s+\w+ed\b/i,
      /\b(is|are|was|were|been|being)\s+(being\s+)?\w+en\b/i,
      /\bget[s]?\s+\w+ed\b/i,
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

// Find sentences longer than recommended (>25 words per guidelines)
export function findLongSentences(text: string, language: Language = 'lv', threshold: number = 25): string[] {
  const sentences = splitIntoSentences(text, language);
  
  return sentences.filter(sentence => {
    const wordCount = countWords(sentence);
    return wordCount > threshold;
  });
}

// Calculate word repetition score (lower is better)
export function calculateWordRepetitionScore(text: string): number {
  const words = text
    .toLowerCase()
    .replace(/[^\wāčēģīķļņšūžа-яё\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4); // Only count words longer than 4 chars
  
  if (words.length === 0) return 100;
  
  const uniqueWords = new Set(words).size;
  const repetitionRatio = uniqueWords / words.length;
  
  return Math.round(repetitionRatio * 100);
}

// Assess guideline compliance
export function assessGuidelineCompliance(
  avgWordsPerSentence: number,
  passiveVoicePercentage: number,
  readabilityScore: number,
  longSentencesPercentage: number
): {
  sentenceLength: 'excellent' | 'good' | 'fair' | 'poor';
  activeVoice: 'excellent' | 'good' | 'fair' | 'poor';
  clarity: 'excellent' | 'good' | 'fair' | 'poor';
  overall: number;
} {
  // Sentence length assessment (ideal: 15-20 words)
  let sentenceLengthScore = 0;
  let sentenceLength: 'excellent' | 'good' | 'fair' | 'poor';
  
  if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
    sentenceLength = 'excellent';
    sentenceLengthScore = 100;
  } else if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 25) {
    sentenceLength = 'good';
    sentenceLengthScore = 80;
  } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 30) {
    sentenceLength = 'fair';
    sentenceLengthScore = 60;
  } else {
    sentenceLength = 'poor';
    sentenceLengthScore = 40;
  }
  
  // Penalize if too many long sentences
  if (longSentencesPercentage > 30) {
    sentenceLengthScore = Math.max(40, sentenceLengthScore - 20);
    if (sentenceLengthScore <= 50) {
      sentenceLength = 'poor';
    }
  }
  
  // Active voice assessment (passive voice should be < 10%)
  let activeVoiceScore = 0;
  let activeVoice: 'excellent' | 'good' | 'fair' | 'poor';
  
  if (passiveVoicePercentage <= 5) {
    activeVoice = 'excellent';
    activeVoiceScore = 100;
  } else if (passiveVoicePercentage <= 15) {
    activeVoice = 'good';
    activeVoiceScore = 80;
  } else if (passiveVoicePercentage <= 30) {
    activeVoice = 'fair';
    activeVoiceScore = 60;
  } else {
    activeVoice = 'poor';
    activeVoiceScore = 40;
  }
  
  // Clarity assessment (based on readability score)
  let clarity: 'excellent' | 'good' | 'fair' | 'poor';
  
  if (readabilityScore >= 70) {
    clarity = 'excellent';
  } else if (readabilityScore >= 60) {
    clarity = 'good';
  } else if (readabilityScore >= 50) {
    clarity = 'fair';
  } else {
    clarity = 'poor';
  }
  
  // Overall compliance score
  const overall = Math.round(
    (sentenceLengthScore * 0.3 + activeVoiceScore * 0.3 + readabilityScore * 0.4)
  );
  
  return {
    sentenceLength,
    activeVoice,
    clarity,
    overall,
  };
}

// Detect vague or weak words that should be avoided
export function detectVagueWords(text: string, language: Language = 'lv'): string[] {
  const vaguePatterns: Record<Language, RegExp[]> = {
    lv: [
      /\b(daudz|daži|vairāki|zināmā mērā|savā ziņā|varētu būt|iespējams|šķiet)\b/gi,
      /\b(lieta|lietas|process|procesi|jautājums|jautājumi)\b/gi,
    ],
    ru: [
      /\b(много|несколько|некоторые|возможно|вероятно|кажется|может быть)\b/gi,
      /\b(вещь|вещи|процесс|процессы|вопрос|вопросы)\b/gi,
    ],
    en: [
      /\b(very|really|quite|some|many|few|thing|things|stuff|probably|maybe)\b/gi,
    ],
  };
  
  const patterns = vaguePatterns[language] || vaguePatterns.en;
  const matches: string[] = [];
  
  patterns.forEach(pattern => {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  });
  
  return [...new Set(matches)]; // Remove duplicates
}

