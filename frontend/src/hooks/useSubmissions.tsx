import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL_HISTORY } from '@/lib/common';
import { Submission, SubmissionsArraySchema, SubmissionSchema } from '@/types/submission';

export const useSubmissions = (userId: number, questionId: number) => {
  return useQuery({
    queryKey: ['submissions', userId, questionId],
    queryFn: () => fetchSubmissions(userId, questionId),
  });
};

async function fetchSubmissions(
  userId: number,
  questionId: number,
): Promise<Submission[]> {
  const response = await fetch(
    `${BACKEND_URL_HISTORY}/users/${userId}/questions/${questionId}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return SubmissionsArraySchema.parse(data);
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Submission) => {
      const response = await fetch(`${BACKEND_URL_HISTORY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create submission');
      }

      const submission = await response.json();
      return SubmissionSchema.parse(submission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}
