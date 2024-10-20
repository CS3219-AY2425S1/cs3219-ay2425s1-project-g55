import {
  CreateQuestionData,
  Question,
  QuestionSchema,
  UpdateQuestionData,
} from '@/types/question';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function fetchQuestion(id: number): Promise<Question> {
  const response = await fetch(`http://localhost:8080/api/question/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  return data;

  return QuestionSchema.parse(data);
}

export function useQuestion(id: number) {
  return useQuery<Question, Error>({
    queryKey: ['question', id],
    queryFn: () => fetchQuestion(id),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuestionData) => {
      const dataForBackend = {
        ...data,
        categories: data.categories.map((category) => category.category),
        constraints: data.constraints.map(
          (constraint) => constraint.constraint
        ),
      } satisfies Omit<Question, 'id'>;

      const response = await fetch('http://localhost:8080/api/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForBackend),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      const question = await response.json();
      return QuestionSchema.parse(question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateQuestionData) => {
      const response = await fetch(
        `http://localhost:8080/api/question/${data.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      const question = await response.json();
      return QuestionSchema.parse(question);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['question', data.id] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:8080/api/question/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', id] });
    },
  });
}
