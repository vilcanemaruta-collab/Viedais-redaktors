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
    const { text, language } = JSON.parse(event.body || '{}');

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text_response = response.text();
    
    const suggestions = text_response
      .split('\n')
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(s => s.length > 0)
      .slice(0, 5);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ suggestions }),
    };
  } catch (error) {
    console.error('Suggestions error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to get suggestions',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

