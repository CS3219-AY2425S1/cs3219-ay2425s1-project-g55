import { z } from 'zod';

export const SubmissionSchema = z.object({
  id: z.number(),
  questionId: z.string(),
  userId: z.string(),
  attemptedCode: z.string(),
  attemptedDateTime: z.string(),
});

export type Submission = z.infer<typeof SubmissionSchema>;
