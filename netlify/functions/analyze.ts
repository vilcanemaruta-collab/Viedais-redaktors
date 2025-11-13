import { Handler } from '@netlify/functions';
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

type RawAnalysis = Partial<AnalysisResponse> & Record<string, unknown>;
type RawIssue = Partial<AnalysisResponse['issues'][number]> & Record<string, unknown>;
type RawMetrics = Partial<AnalysisResponse['metrics']> & Record<string, unknown>;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const sanitizeIssues = (rawIssues: unknown): AnalysisResponse['issues'] => {
  if (!Array.isArray(rawIssues)) {
    return [];
  }

  return rawIssues
    .map<AnalysisResponse['issues'][number] | null>((issue) => {
      if (typeof issue !== 'object' || issue === null) {
        return null;
      }

      const issueObject = issue as RawIssue;

      const type = typeof issueObject.type === 'string' ? issueObject.type : 'style';
      const severity = typeof issueObject.severity === 'string' ? issueObject.severity : 'medium';
      const sentence = typeof issueObject.sentence === 'string' ? issueObject.sentence.trim() : '';
      const suggestion = typeof issueObject.suggestion === 'string' ? issueObject.suggestion.trim() : '';

      if (!sentence || !suggestion) {
        return null;
      }

      let start = 0;
      let end = sentence.length;

      if ('position' in issueObject && typeof issueObject.position === 'object' && issueObject.position !== null) {
        const position = issueObject.position as Record<string, unknown>;
        start = toNumber(position.start) ?? start;
        end = toNumber(position.end) ?? end;
      }

      return {
        type,
        severity,
        sentence,
        suggestion,
        position: {
          start,
          end: Math.max(end, start),
        },
      };
    })
    .filter((issue): issue is AnalysisResponse['issues'][number] => issue !== null);
};

const sanitizeSummary = (rawSummary: unknown): string => {
  if (typeof rawSummary === 'string') {
    const trimmed = rawSummary.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }

  if (Array.isArray(rawSummary)) {
    const bullets = rawSummary
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => {
        const trimmed = item.trim();
        return trimmed.startsWith('•') ? trimmed : `• ${trimmed}`;
      });

    if (bullets.length > 0) {
      return bullets.join('\n');
    }
  }

  return '• Kopsavilkums nav pieejams';
};

const sanitizeMetrics = (rawMetrics: unknown, fallbackReadability: number): AnalysisResponse['metrics'] => {
  const metricsObject = (typeof rawMetrics === 'object' && rawMetrics !== null ? rawMetrics : {}) as RawMetrics;

  const wordCount = toNumber(metricsObject.wordCount) ?? 0;
  const sentenceCount = toNumber(metricsObject.sentenceCount) ?? 0;
  const paragraphCount = toNumber(metricsObject.paragraphCount) ?? 0;
  const avgWordsPerSentence = toNumber(metricsObject.avgWordsPerSentence) ?? 0;
  const readabilityScore = toNumber(metricsObject.readabilityScore) ?? fallbackReadability;
  const complexSentences = toNumber(metricsObject.complexSentences) ?? 0;

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgWordsPerSentence,
    readabilityScore: clamp(readabilityScore, 0, 100),
    complexSentences,
  };
};

const normalizeAnalysis = (raw: RawAnalysis): AnalysisResponse => {
  const readabilityScore = clamp(toNumber(raw.readability_score) ?? 50, 0, 100);
  const issues = sanitizeIssues(raw.issues);
  const summary = sanitizeSummary(raw.summary);
  const metrics = sanitizeMetrics(raw.metrics, readabilityScore);

  return {
    readability_score: readabilityScore,
    issues,
    summary,
    metrics,
  };
};

async function analyzeWithGemini(prompt: string, retries = 2): Promise<AnalysisResponse> {
  console.log('🤖 Initializing Gemini model...');
  // Using Gemini 2.0 Flash (experimental) - fast and reliable
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`🔄 Gemini attempt ${attempt + 1}/${retries}`);
      console.log('📤 Sending prompt to Gemini (length:', prompt.length, ')');
      
      // Set timeout for Gemini request (20 seconds max)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Gemini request timeout')), 20000)
      );
      
      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise
      ]);
      const response = await result.response;
      const text = response.text();
      
      console.log('📥 Gemini response received (length:', text.length, ')');

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const rawAnalysis = JSON.parse(jsonMatch[0]) as RawAnalysis;
      const analysis = normalizeAnalysis(rawAnalysis);

      console.log('✅ Gemini analysis parsed successfully');
      return analysis;
    } catch (error) {
      console.error(`❌ Gemini API attempt ${attempt + 1} failed:`, error);
      console.error('❌ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      if (attempt === retries - 1) {
        console.error('❌ All Gemini attempts failed, returning fallback');
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

      // Wait before retry (exponential backoff)
      const waitTime = 2000 * (attempt + 1);
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // This should never be reached due to the fallback return in the loop
  throw new Error('Failed to analyze text after multiple attempts');
}

export const handler: Handler = async (event) => {
  console.log('🚀 Analyze function called');
  console.log('📍 Method:', event.httpMethod);
  console.log('🔑 API Key exists:', !!API_KEY);
  console.log('🔑 API Key length:', API_KEY?.length);
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ OPTIONS request - returning 204');
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.log('❌ Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📦 Parsing request body...');
    const { text, settings, prompt } = JSON.parse(event.body || '{}');
    console.log('📝 Text length:', text?.length);
    console.log('⚙️ Settings:', settings);

    // Validation
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    if (text.length > 50000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is too long (max 50000 characters)' }),
      };
    }

    if (!settings || !['lv', 'ru', 'en'].includes(settings.language)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid settings' }),
      };
    }

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    console.log(`✅ Validation passed. Analyzing text (${text.length} chars) in ${settings.language}`);

    const result = await analyzeWithGemini(prompt);
    
    console.log('✅ Analysis complete:', {
      readabilityScore: result.readability_score,
      issuesCount: result.issues.length,
      summaryLength: result.summary.length,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('❌ Analyze error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to analyze text',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

