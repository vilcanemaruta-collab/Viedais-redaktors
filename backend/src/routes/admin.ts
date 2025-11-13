import { Router } from 'express';
import { readAdminData, writeAdminData, type AdminData } from '../services/adminStorage.js';
import type { Request, Response } from 'express';

const router = Router();

// GET /api/admin/data - Iegūt visus admin datus
router.get('/data', async (req: Request, res: Response) => {
  try {
    const data = await readAdminData();
    res.json(data);
  } catch (error) {
    console.error('Error reading admin data:', error);
    res.status(500).json({ error: 'Failed to read admin data' });
  }
});

// POST /api/admin/guidelines - Pievienot vadlīniju
router.post('/guidelines', async (req: Request, res: Response) => {
  try {
    const guideline = req.body;
    const data = await readAdminData();
    data.guidelines.push(guideline);
    await writeAdminData(data);
    res.json({ success: true, guideline });
  } catch (error) {
    console.error('Error adding guideline:', error);
    res.status(500).json({ error: 'Failed to add guideline' });
  }
});

// PUT /api/admin/guidelines/:id - Atjaunot vadlīniju
router.put('/guidelines/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const data = await readAdminData();
    const index = data.guidelines.findIndex((g) => g.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Guideline not found' });
    }
    
    data.guidelines[index] = { ...data.guidelines[index], ...updates };
    await writeAdminData(data);
    res.json({ success: true, guideline: data.guidelines[index] });
  } catch (error) {
    console.error('Error updating guideline:', error);
    res.status(500).json({ error: 'Failed to update guideline' });
  }
});

// DELETE /api/admin/guidelines/:id - Dzēst vadlīniju
router.delete('/guidelines/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readAdminData();
    data.guidelines = data.guidelines.filter((g) => g.id !== id);
    await writeAdminData(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting guideline:', error);
    res.status(500).json({ error: 'Failed to delete guideline' });
  }
});

// POST /api/admin/knowledge-base - Pievienot rakstu
router.post('/knowledge-base', async (req: Request, res: Response) => {
  try {
    const article = req.body;
    const data = await readAdminData();
    data.knowledgeBase.push(article);
    await writeAdminData(data);
    res.json({ success: true, article });
  } catch (error) {
    console.error('Error adding article:', error);
    res.status(500).json({ error: 'Failed to add article' });
  }
});

// DELETE /api/admin/knowledge-base/:id - Dzēst rakstu
router.delete('/knowledge-base/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readAdminData();
    data.knowledgeBase = data.knowledgeBase.filter((a) => a.id !== id);
    await writeAdminData(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// POST /api/admin/prompts - Pievienot prompt
router.post('/prompts', async (req: Request, res: Response) => {
  try {
    const prompt = req.body;
    const data = await readAdminData();
    data.systemPrompts.push(prompt);
    await writeAdminData(data);
    res.json({ success: true, prompt });
  } catch (error) {
    console.error('Error adding prompt:', error);
    res.status(500).json({ error: 'Failed to add prompt' });
  }
});

// PUT /api/admin/active-prompt - Iestatīt aktīvo prompt
router.put('/active-prompt', async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const data = await readAdminData();
    data.activePromptId = id;
    await writeAdminData(data);
    res.json({ success: true, activePromptId: id });
  } catch (error) {
    console.error('Error setting active prompt:', error);
    res.status(500).json({ error: 'Failed to set active prompt' });
  }
});

export default router;

