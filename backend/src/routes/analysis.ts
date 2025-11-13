import { Router } from 'express';
import { analyzeWithGemini, summarizeWithGemini, getSuggestionsWithGemini } from '../services/geminiService.js';
import { validateAnalyzeRequest, validateSummarizeRequest, validateSuggestionsRequest } from '../middleware/validation.js';
import { rateLimit } from '../utils/rateLimit.js';

const router = Router();

// Apply rate limiting to all routes
router.use(rateLimit(20, 60000)); // 20 requests per minute

// POST /api/analyze
router.post('/analyze', validateAnalyzeRequest, async (req, res) => {
  try {
    const { text, settings, prompt } = req.body;

    console.log(`Analyzing text (${text.length} chars) in ${settings.language}`);

    const result = await analyzeWithGemini(prompt);

    res.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({
      error: 'Failed to analyze text',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/summarize
router.post('/summarize', validateSummarizeRequest, async (req, res) => {
  try {
    const { text, language } = req.body;

    console.log(`Summarizing text (${text.length} chars) in ${language}`);

    const summary = await summarizeWithGemini(text, language);

    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({
      error: 'Failed to summarize text',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/suggestions
router.post('/suggestions', validateSuggestionsRequest, async (req, res) => {
  try {
    const { text, language } = req.body;

    console.log(`Getting suggestions for text (${text.length} chars) in ${language}`);

    const suggestions = await getSuggestionsWithGemini(text, language);

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;


