import { Request, Response, NextFunction } from 'express';

export function validateAnalyzeRequest(req: Request, res: Response, next: NextFunction) {
  const { text, settings, prompt } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
  }

  if (text.length > 50000) {
    return res.status(400).json({ error: 'Text is too long (max 50000 characters)' });
  }

  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Settings are required' });
  }

  if (!['lv', 'ru', 'en'].includes(settings.language)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  if (!['news', 'sports', 'culture', 'business', 'opinion'].includes(settings.category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  if (!['formal', 'informal', 'neutral'].includes(settings.style)) {
    return res.status(400).json({ error: 'Invalid style' });
  }

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  next();
}

export function validateSummarizeRequest(req: Request, res: Response, next: NextFunction) {
  const { text, language } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!['lv', 'ru', 'en'].includes(language)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  next();
}

export function validateSuggestionsRequest(req: Request, res: Response, next: NextFunction) {
  const { text, language } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!['lv', 'ru', 'en'].includes(language)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  next();
}


