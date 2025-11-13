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
  
  // Build knowledge base context with content excerpts
  const knowledgeBaseText = relevantArticles.length > 0
    ? `\n\nLABU RAKSTU PIEMĒRI (analizē un salīdzini tekstu ar šiem piemēriem):\n${relevantArticles
        .map((a) => {
          const excerpt = a.content.length > 300 
            ? a.content.substring(0, 300) + '...'
            : a.content;
          return `### ${a.title}\n${excerpt}`;
        })
        .join('\n\n')}`
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

Analizē tekstu pēc šādiem kritērijiem, īpaši pievēršot uzmanību vadlīnijām un labajiem piemēriem:

═══════════════════════════════════════════════════
VADLĪNIJAS UN LABĀS PRAKSES:
═══════════════════════════════════════════════════
{guidelines}

═══════════════════════════════════════════════════
TEKSTA PARAMETRI:
═══════════════════════════════════════════════════
KATEGORIJA: {category}
STILS: {style}

═══════════════════════════════════════════════════
ANALIZĒJAMAIS TEKSTS:
═══════════════════════════════════════════════════
{text}

═══════════════════════════════════════════════════
ANALĪZES UZDEVUMI:
═══════════════════════════════════════════════════

1. TEIKUMU GARUMS:
   - Pārbaudi, vai vidējais teikuma garums ir 15-20 vārdi (ideāls)
   - Atzīmē teikumus, kas garāki par 25 vārdiem
   - Iesaki, kā sadalīt garos teikumus

2. AKTĪVĀ/PASĪVĀ BALSS:
   - Identificē visas pasīvās balss konstrukcijas
   - Iesaki pārveidot pasīvo balsi aktīvajā
   - Piemēri vadlīnijās rāda pareizo pieeju

3. SKAIDRĪBA UN KONKRĒTĪBA:
   - Atrod neskaidrus vai vispārīgus formulējumus
   - Identificē žargonu vai sarežģītus terminus
   - Iesaki konkrētākus formulējumus

4. RINDKOPU STRUKTŪRA:
   - Pārbaudi rindkopu garumu (ideāls: 3-4 teikumi)
   - Novērtē informācijas loģisko plūsmu
   - Iesaki uzlabojumus struktūrā

5. VĀRDU DAUDZVEIDĪBA:
   - Atrod bieži atkārtojošos vārdus
   - Iesaki sinonīmus un alternatīvas
   
6. ATBILSTĪBA LABAJIEM PIEMĒRIEM:
   - Salīdzini tekstu ar pievienotajiem labajiem piemēriem
   - Atzīmē, kur teksts atšķiras no labās prakses
   - Iesaki, kā pietuvoties piemēru kvalitātei

═══════════════════════════════════════════════════
ATBILDE JSON FORMĀTĀ:
═══════════════════════════════════════════════════
{
  "readability_score": 0-100,
  "issues": [
    {
      "type": "readability|grammar|style|complexity",
      "severity": "low|medium|high",
      "sentence": "problēmatiskais teikums",
      "suggestion": "konkrēts ieteikums uzlabojumam (ņemot vērā vadlīnijas)",
      "position": {"start": 0, "end": 0}
    }
  ],
  "summary": "• Galvenie atrādījumi\\n• Stiprās puses\\n• Uzlabojumu jomas\\n• Rekomendācijas atbilstoši vadlīnijām",
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

