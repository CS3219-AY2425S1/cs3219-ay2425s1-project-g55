import { z } from 'zod';

export const SubmissionSchema = z.object({
  id: z.number(),
  questionId: z.string(),
  userId: z.string(),
  code: z.string(),
  attemptedAt: z.string(),
});

export type Submission = z.infer<typeof SubmissionSchema>;
