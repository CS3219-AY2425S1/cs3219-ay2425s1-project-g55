import express, { Request, Response } from 'express';
import { IsolatedExecutionService } from './service/execution';

const app = express();
app.use(express.json());

const isolatedExecutionService = new IsolatedExecutionService();

// @ts-expect-error
app.post('/execute', async (req: Request, res: Response) => {
  const { code, timeout, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  if (language && language !== 'javascript' && language !== 'typescript') {
    return res.status(400).json({ error: 'Invalid language' });
  }

  try {
    const result = await isolatedExecutionService.executeCode(
      code,
      timeout,
      language
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Execution failed',
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
