import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco';
const genAI = new GoogleGenerativeAI(API_KEY);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📋 Summarize function called');
    const { text, language } = JSON.parse(event.body || '{}');
    console.log('📝 Text length:', text?.length, 'Language:', language);

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    if (!['lv', 'ru', 'en'].includes(language)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid language' }),
      };
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

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

    console.log('📤 Sending to Gemini...');
    // Add timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Gemini request timeout')), 20000)
    );
    
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;
    const summary = response.text();
    console.log('✅ Summary generated (length:', summary.length, ')');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ summary }),
    };
  } catch (error) {
    console.error('Summarize error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to summarize text',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

