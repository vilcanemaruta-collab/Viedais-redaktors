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

      const analysis: AnalysisResponse = JSON.parse(jsonMatch[0]);
      
      if (!analysis.readability_score || !analysis.issues || !analysis.summary || !analysis.metrics) {
        throw new Error('Invalid response structure');
      }

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

