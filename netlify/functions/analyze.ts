import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco';
const genAI = new GoogleGenerativeAI(API_KEY);

interface AnalysisResponse {
  readability_score: number;
  readabilityScore: number;
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
    readabilityScore,
    issues,
    summary,
    metrics,
  };
};

const MODEL_VARIANTS = [
  'gemini-2.5-pro-exp',
  'gemini-2.5-pro',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
];

interface GeminiAttemptLog {
  model: string;
  attempt: number;
  durationMs: number;
  status: 'success' | 'error';
  error?: string;
  responseLength?: number;
}

interface AnalysisDebugMeta {
  debugMode: boolean;
  timestamp: string;
  promptLength: number;
  textLength: number;
  localMetrics: AnalysisResponse['metrics'];
  modelAttempts: GeminiAttemptLog[];
  selectedModel?: string;
  fallbackUsed: boolean;
  environment: {
    node: string;
    netlifyRegion?: string;
    runtime?: string;
    apiKeyPresent: boolean;
  };
  promptSample: string;
  errors: Array<{ model: string; attempt: number; error: string }>;
}

const buildFallbackSummary = (text: string, metrics: AnalysisResponse['metrics']): string => {
  const sentences = text
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]?/g)
    ?.map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0) ?? [];

  const bullets = sentences.slice(0, 3).map((sentence) => {
    const trimmed = sentence.replace(/^[•\-\d\.\s]+/, '');
    return `• ${trimmed}`;
  });

  if (bullets.length > 0) {
    return bullets.join('\n');
  }

  return [
    `• Vārdu skaits: ${metrics.wordCount}`,
    `• Teikumu skaits: ${metrics.sentenceCount}`,
    `• Vidēji vārdi teikumā: ${metrics.avgWordsPerSentence.toFixed(1)}`,
  ].join('\n');
};

const computeLocalMetrics = (text: string): AnalysisResponse['metrics'] => {
  const words = text.trim().length > 0 ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;

  const sentences = text
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]?/g)
    ?.map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0) ?? [];
  const sentenceCount = sentences.length;

  const paragraphCount = text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0).length;

  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;
  const complexSentences = sentences.filter((sentence) => sentence.split(/\s+/).length > 20).length;

  // Simple readability heuristic favouring shorter sentences
  const readabilityScore = clamp(
    Math.round(100 - Math.max(avgWordsPerSentence - 14, 0) * 4),
    5,
    95,
  );

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgWordsPerSentence: Number.isFinite(avgWordsPerSentence) ? Number.parseFloat(avgWordsPerSentence.toFixed(1)) : 0,
    readabilityScore,
    complexSentences,
  };
};

interface GeminiAnalysisOptions {
  prompt: string;
  text: string;
  retries?: number;
  debugMode?: boolean;
}

interface GeminiAnalysisResult {
  analysis: AnalysisResponse;
  debug: AnalysisDebugMeta;
}

async function analyzeWithGemini(options: GeminiAnalysisOptions): Promise<GeminiAnalysisResult> {
  const { prompt, text, retries = 2, debugMode = false } = options;

  console.log('🤖 Initializing Gemini model...');

  const localMetrics = computeLocalMetrics(text);
  const fallbackSummary = buildFallbackSummary(text, localMetrics);
  const modelErrors: Array<{ model: string; attempt: number; error: string }> = [];
  const modelAttempts: GeminiAttemptLog[] = [];

  let selectedModel: string | undefined;
  let fallbackUsed = false;

  for (const modelId of MODEL_VARIANTS) {
    console.log(`🧠 Trying Gemini model: ${modelId}`);
    const model = genAI.getGenerativeModel({
      model: modelId,
    });

    for (let attempt = 0; attempt < retries; attempt++) {
      const attemptStart = Date.now();
      try {
        console.log(`🔄 Gemini attempt ${attempt + 1}/${retries} with ${modelId}`);
        console.log('📤 Sending prompt to Gemini (length:', prompt.length, ')');
        
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Gemini request timeout')), 20000)
        );

        const request = model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }]}],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        });
        
        const result = await Promise.race([request, timeoutPromise]);
        const response = await result.response;
        const responseText = response.text();
        
        console.log('📥 Gemini response received (length:', responseText.length, ')');

        modelAttempts.push({
          model: modelId,
          attempt: attempt + 1,
          durationMs: Date.now() - attemptStart,
          status: 'success',
          responseLength: responseText.length,
        });

        let rawAnalysis: RawAnalysis;

        try {
          rawAnalysis = JSON.parse(responseText) as RawAnalysis;
        } catch (parseError) {
          console.warn('⚠️ Direct JSON parse failed, attempting fallback regex extraction');
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No JSON found in response');
          }

          rawAnalysis = JSON.parse(jsonMatch[0]) as RawAnalysis;
        }

        const analysis = normalizeAnalysis(rawAnalysis);
        selectedModel = modelId;

        console.log('✅ Gemini analysis parsed successfully');
        return {
          analysis,
          debug: {
            debugMode,
            timestamp: new Date().toISOString(),
            promptLength: prompt.length,
            textLength: text.length,
            localMetrics,
            modelAttempts,
            selectedModel,
            fallbackUsed,
            environment: {
              node: process.version,
              netlifyRegion: process.env.AWS_REGION,
              runtime: process.env.NETLIFY_RUNTIME,
              apiKeyPresent: Boolean(API_KEY),
            },
            promptSample: prompt.slice(0, 1200),
            errors: modelErrors,
          },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        modelErrors.push({ model: modelId, attempt: attempt + 1, error: message });
        modelAttempts.push({
          model: modelId,
          attempt: attempt + 1,
          durationMs: Date.now() - attemptStart,
          status: 'error',
          error: message,
        });

        console.error(`❌ Gemini API attempt ${attempt + 1} failed for ${modelId}:`, error);
        console.error('❌ Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message,
          stack: error instanceof Error ? error.stack : undefined,
        });
        
        const waitTime = 1500 * (attempt + 1);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error('❌ All Gemini attempts failed across models:', modelErrors);
  fallbackUsed = true;

  return {
    analysis: {
      readability_score: localMetrics.readabilityScore,
      readabilityScore: localMetrics.readabilityScore,
      issues: [],
      summary: `${fallbackSummary}\n• AI analīze pagaidām nav pieejama (Gemini kļūda)`,
      metrics: localMetrics,
    },
    debug: {
      debugMode,
      timestamp: new Date().toISOString(),
      promptLength: prompt.length,
      textLength: text.length,
      localMetrics,
      modelAttempts,
      selectedModel,
      fallbackUsed,
      environment: {
        node: process.version,
        netlifyRegion: process.env.AWS_REGION,
        runtime: process.env.NETLIFY_RUNTIME,
        apiKeyPresent: Boolean(API_KEY),
      },
      promptSample: prompt.slice(0, 1200),
      errors: modelErrors,
    },
  };
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

    const debugHeaderKey = Object.keys(event.headers || {}).find(
      (key) => key.toLowerCase() === 'x-debug-mode'
    );

    const debugMode =
      event.queryStringParameters?.debug === '1' ||
      event.queryStringParameters?.debug === 'true' ||
      (debugHeaderKey ? event.headers[debugHeaderKey] === '1' : false);

    console.log(`✅ Validation passed. Analyzing text (${text.length} chars) in ${settings.language}`);

    const { analysis, debug } = await analyzeWithGemini({ prompt, text, debugMode });
    const responsePayload = debugMode ? { ...analysis, debug } : analysis;
    
    console.log('✅ Analysis complete:', {
      readabilityScore: analysis.readability_score,
      issuesCount: analysis.issues.length,
      summaryLength: analysis.summary.length,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responsePayload),
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

