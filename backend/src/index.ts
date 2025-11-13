import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysis.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', analysisRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Viedais Teksta Redaktors API',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/analyze',
      summarize: 'POST /api/summarize',
      suggestions: 'POST /api/suggestions',
      health: 'GET /api/health',
      adminData: 'GET /api/admin/data',
      guidelines: 'POST/PUT/DELETE /api/admin/guidelines',
      knowledgeBase: 'POST/DELETE /api/admin/knowledge-base',
      prompts: 'POST /api/admin/prompts',
    },
  });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API documentation available at http://localhost:${PORT}`);
  console.log(`🌍 CORS enabled for: ${CORS_ORIGIN}`);
});

export default app;


