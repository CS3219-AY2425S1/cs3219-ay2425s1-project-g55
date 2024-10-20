import { z } from 'zod';

export const ExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
});

export const DIFFICULTY_ENUM = ['Easy', 'Medium', 'Hard'] as const;
export const CATEGORY_ENUM = [
  'Strings',
  'Algorithms',
  'Data Structures',
  'Math',
  'Dynamic Programming',
  'Graph Theory',
  'Geometry',
  'Bit Manipulation',
  'Recursion',
  'Backtracking',
] as const;

export const QuestionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  examples: z.array(ExampleSchema),
  constraints: z.array(z.string()),
  categories: z.array(z.string()),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  link: z.string().url(),
});

export const QuestionsArraySchema = z.array(QuestionSchema);

export type Example = z.infer<typeof ExampleSchema>;
export type Question = z.infer<typeof QuestionSchema>;

/**
 * Schema for creating a question
 *
 * Note that the schema is different from the format sent to the backend.
 * This is because react-hook-form has a limitation that array fields have to
 * contain objects.
 */
export const createQuestionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  examples: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      })
    )
    .min(1, 'At least one example is required'),
  constraints: z.array(
    z.object({
      constraint: z.string().min(1),
    })
  ),
  categories: z.array(
    z.object({
      category: z.string().min(1),
    })
  ),

  difficulty: z.enum(DIFFICULTY_ENUM),
  link: z.string().url('Invalid URL'),
});

export type CreateQuestionData = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

export type UpdateQuestionData = z.infer<typeof updateQuestionSchema>;
