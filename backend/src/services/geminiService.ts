import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco';

const genAI = new GoogleGenerativeAI(API_KEY);

interface AnalysisResponse {
  readability_score: number;
  issues: Array<{
    type: string;
    severity: string;
    sentence: string;
    suggestion: string;
    position: { start: number; end: number };
  }>;
  summary: string;
  metrics: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordsPerSentence: number;
    readabilityScore: number;
    complexSentences: number;
  };
}

export async function analyzeWithGemini(prompt: string, retries = 3): Promise<AnalysisResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const analysis: AnalysisResponse = JSON.parse(jsonMatch[0]);
      
      // Validate response structure
      if (!analysis.readability_score || !analysis.issues || !analysis.summary || !analysis.metrics) {
        throw new Error('Invalid response structure');
      }

      return analysis;
    } catch (error) {
      console.error(`Gemini API attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retries - 1) {
        // Return fallback response on final failure
        return {
          readability_score: 50,
          issues: [],
          summary: 'Kopsavilkums nav pieejams (API kļūda)',
          metrics: {
            wordCount: 0,
            sentenceCount: 0,
            paragraphCount: 0,
            avgWordsPerSentence: 0,
            readabilityScore: 50,
            complexSentences: 0,
          },
        };
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw new Error('Failed to analyze text after multiple attempts');
}

export async function summarizeWithGemini(text: string, language: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const languageNames: Record<string, string> = {
    lv: 'latviešu',
    ru: 'krievu',
    en: 'angļu',
  };

  const prompt = `Izveido īsu, strukturētu kopsavilkumu ${languageNames[language] || 'latviešu'} valodā šim tekstam. 
Izmanto bullet points formātu.

TEKSTS:
${text}

Atbildi tikai ar kopsavilkumu, bez papildu komentāriem.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini summarize error:', error);
    return 'Kopsavilkums nav pieejams';
  }
}

export async function getSuggestionsWithGemini(text: string, language: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const languageNames: Record<string, string> = {
    lv: 'latviešu',
    ru: 'krievu',
    en: 'angļu',
  };

  const prompt = `Sniedz 5 konkrētus ieteikumus, kā uzlabot šo tekstu ${languageNames[language] || 'latviešu'} valodā.
Koncentrējies uz lasāmību, skaidrību un stilu.

TEKSTS:
${text}

Atbildi ar numurētu sarakstu, katrs ieteikums jaunā rindā.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse numbered list
    const suggestions = text
      .split('\n')
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(s => s.length > 0);

    return suggestions.slice(0, 5);
  } catch (error) {
    console.error('Gemini suggestions error:', error);
    return [];
  }
}


