import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const DATA_FILE = join(DATA_DIR, 'admin-data.json');

export interface Guideline {
  id: string;
  name: string;
  content: string;
  priority: number;
  createdAt: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  createdAt: string;
}

export interface SystemPrompt {
  id: string;
  content: string;
  version: number;
  createdAt: string;
  isActive: boolean;
}

export interface AdminData {
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

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

export async function readAdminData(): Promise<AdminData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Ja fails neeksistē, atgriež default datus
    console.log('No admin data file found, using defaults');
    await writeAdminData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
}

export async function writeAdminData(data: AdminData): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Admin data saved successfully');
  } catch (error) {
    console.error('Error writing admin data:', error);
    throw error;
  }
}

