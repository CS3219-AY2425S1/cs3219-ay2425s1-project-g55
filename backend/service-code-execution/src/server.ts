import cors from 'cors';
import express, { Request, Response } from 'express';
import { z } from 'zod';
import { IsolatedExecutionService } from './service/execution';

const app = express();
app.use(cors());
app.use(express.json());

const isolatedExecutionService = new IsolatedExecutionService();

const supportedLanguages = ['java', 'javascript', 'typescript', 'python'] as const;
const executionSchema = z.object({
  code: z.string(),
  language: z.enum(supportedLanguages),
});

// @ts-expect-error
app.post('/api/code-execution/execute', async (req: Request, res: Response) => {
  const body = executionSchema.safeParse(req.body);
  if (!body.success) {
    console.log(body.error);
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { code, language } = body.data;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const result = await isolatedExecutionService.executeCode(
      code,
      3000,
      language
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Execution failed',
      message: (error as Error).message,
    });
  }
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
});