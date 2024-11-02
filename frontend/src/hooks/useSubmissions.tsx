import { useQuery } from '@tanstack/react-query';
import { HISTORY_API_BASE_URL } from '@/lib/consts';
import { Submission, SubmissionsArraySchema } from '@/types/submission';

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
    `${HISTORY_API_BASE_URL}/users/${userId}/questions/${questionId}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return SubmissionsArraySchema.parse(data);
}

