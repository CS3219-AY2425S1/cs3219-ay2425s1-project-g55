import { z } from 'zod';

export const SubmissionSchema = z.object({
  id: z.number(),
  questionId: z.string(),
  userId: z.string(),
  code: z.string(),
  attemptedAt: z.string().transform((str) => {
    return new Date(str).toLocaleString();
  }),
});

export type Submission = z.infer<typeof SubmissionSchema>;

export const SubmissionsArraySchema = z.array(SubmissionSchema);
