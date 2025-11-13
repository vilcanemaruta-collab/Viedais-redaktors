import type { TextSettings, Guideline, KnowledgeBaseArticle } from '../types';

interface PromptBuilderOptions {
  text: string;
  settings: TextSettings;
  guidelines: Guideline[];
  knowledgeBase: KnowledgeBaseArticle[];
  promptTemplate: string;
}

export function buildAnalysisPrompt(options: PromptBuilderOptions): string {
  const { text, settings, guidelines, knowledgeBase, promptTemplate } = options;
  
  // Sort guidelines by priority
  const sortedGuidelines = [...guidelines].sort((a, b) => b.priority - a.priority);
  
  // Build guidelines text
  const guidelinesText = sortedGuidelines
    .map((g, index) => `${index + 1}. ${g.name}:\n${g.content}`)
    .join('\n\n');
  
  // Filter knowledge base by language and category
  const relevantArticles = knowledgeBase.filter(
    (article) =>
      article.language === settings.language &&
      article.category === settings.category
  );
  
  // Build knowledge base context
  const knowledgeBaseText = relevantArticles.length > 0
    ? `\n\nLABU RAKSTU PIEMĒRI:\n${relevantArticles
        .map((a) => `- ${a.title}`)
        .join('\n')}`
    : '';
  
  // Language names
  const languageNames = {
    lv: 'latviešu',
    ru: 'krievu',
    en: 'angļu',
  };
  
  // Category names
  const categoryNames = {
    news: 'Ziņas',
    sports: 'Sports',
    culture: 'Kultūra',
    business: 'Bizness',
    opinion: 'Viedoklis',
  };
  
  // Style names
  const styleNames = {
    formal: 'Formāls',
    informal: 'Neformāls',
    neutral: 'Neitrāls',
  };
  
  // Replace placeholders
  let prompt = promptTemplate
    .replace('{language}', languageNames[settings.language])
    .replace('{category}', categoryNames[settings.category])
    .replace('{style}', styleNames[settings.style])
    .replace('{guidelines}', guidelinesText + knowledgeBaseText)
    .replace('{text}', text);
  
  return prompt;
}

export function validatePromptTemplate(template: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const requiredPlaceholders = ['{language}', '{category}', '{style}', '{guidelines}', '{text}'];
  
  requiredPlaceholders.forEach((placeholder) => {
    if (!template.includes(placeholder)) {
      errors.push(`Trūkst obligātā placeholder: ${placeholder}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getDefaultPromptTemplate(): string {
  return `Tu esi profesionāls teksta redaktors {language} valodā.
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
  "issues": [
    {
      "type": "readability|grammar|style|complexity",
      "severity": "low|medium|high",
      "sentence": "problēmatiskais teikums",
      "suggestion": "ieteikums uzlabojumam",
      "position": {"start": 0, "end": 0}
    }
  ],
  "summary": "• Bullet point 1\\n• Bullet point 2\\n• Bullet point 3",
  "metrics": {
    "wordCount": 0,
    "sentenceCount": 0,
    "paragraphCount": 0,
    "avgWordsPerSentence": 0,
    "readabilityScore": 0,
    "complexSentences": 0
  }
}`;
}

