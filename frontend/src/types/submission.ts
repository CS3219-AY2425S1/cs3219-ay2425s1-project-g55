import { z } from 'zod';

// Schema for the full submission model (including ID)
export const SubmissionSchema = z.object({
  id: z.number(),
  questionId: z.number(),
  questionTitle: z.string(),
  userId: z.number(),
  code: z.string(),
  attemptedAt: z.string().transform((str) => {
    return new Date(str).toLocaleString();
  }),
});

// New schema for creating a submission (without ID)
export const CreateSubmissionSchema = SubmissionSchema.omit({ id: true });

export type Submission = z.infer<typeof SubmissionSchema>;
export type CreateSubmissionData = z.infer<typeof CreateSubmissionSchema>;

export const SubmissionsArraySchema = z.array(SubmissionSchema);
