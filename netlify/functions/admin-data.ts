import { Handler, HandlerEvent } from '@netlify/functions';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_DIR = '/tmp';
const DATA_FILE = join(DATA_DIR, 'admin-data.json');

interface Guideline {
  id: string;
  name: string;
  content: string;
  priority: number;
  createdAt: string;
}

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  createdAt: string;
}

interface SystemPrompt {
  id: string;
  content: string;
  version: number;
  createdAt: string;
  isActive: boolean;
}

interface AdminData {
  guidelines: Guideline[];
  knowledgeBase: KnowledgeBaseArticle[];
  systemPrompts: SystemPrompt[];
  activePromptId: string | null;
}

const DEFAULT_PROMPT: SystemPrompt = {
  id: 'default',
  content: `Tu esi profesionāls teksta redaktors {language} valodā.
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
  "issues": [{"type": "string", "severity": "low|medium|high", "sentence": "string", "suggestion": "string", "position": {"start": 0, "end": 0}}],
  "summary": "bullet points kopsavilkums",
  "metrics": {"wordCount": 0, "sentenceCount": 0, "paragraphCount": 0, "avgWordsPerSentence": 0, "readabilityScore": 0, "complexSentences": 0}
}`,
  version: 1,
  createdAt: new Date().toISOString(),
  isActive: true,
};

const DEFAULT_DATA: AdminData = {
  guidelines: [],
  knowledgeBase: [],
  systemPrompts: [DEFAULT_PROMPT],
  activePromptId: 'default',
};

async function readAdminData(): Promise<AdminData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_DATA;
  }
}

async function writeAdminData(data: AdminData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/admin-data', '');
    const method = event.httpMethod;

    if (method === 'GET' && path === '') {
      const data = await readAdminData();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }

    if (method === 'POST' && path === '/guidelines') {
      const guideline = JSON.parse(event.body || '{}');
      const data = await readAdminData();
      data.guidelines.push(guideline);
      await writeAdminData(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, guideline }),
      };
    }

    if (method === 'PUT' && path.startsWith('/guidelines/')) {
      const id = path.split('/')[2];
      const updates = JSON.parse(event.body || '{}');
      const data = await readAdminData();
      const index = data.guidelines.findIndex((g) => g.id === id);
      if (index === -1) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      }
      data.guidelines[index] = { ...data.guidelines[index], ...updates };
      await writeAdminData(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, guideline: data.guidelines[index] }),
      };
    }

    if (method === 'DELETE' && path.startsWith('/guidelines/')) {
      const id = path.split('/')[2];
      const data = await readAdminData();
      data.guidelines = data.guidelines.filter((g) => g.id !== id);
      await writeAdminData(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    if (method === 'POST' && path === '/knowledge-base') {
      const article = JSON.parse(event.body || '{}');
      const data = await readAdminData();
      data.knowledgeBase.push(article);
      await writeAdminData(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, article }),
      };
    }

    if (method === 'DELETE' && path.startsWith('/knowledge-base/')) {
      const id = path.split('/')[2];
      const data = await readAdminData();
      data.knowledgeBase = data.knowledgeBase.filter((a) => a.id !== id);
      await writeAdminData(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    if (method === 'POST' && path === '/prompts') {
      const prompt = JSON.parse(event.body || '{}');
      const data = await readAdminData();
      data.systemPrompts.push(prompt);
      await writeAdminData(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, prompt }),
      };
    }

    if (method === 'PUT' && path === '/active-prompt') {
      const { id } = JSON.parse(event.body || '{}');
      const data = await readAdminData();
      data.activePromptId = id;
      await writeAdminData(data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, activePromptId: id }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Admin data error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

