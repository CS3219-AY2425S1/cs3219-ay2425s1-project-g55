import { useQuery } from '@tanstack/react-query';
import { HISTORY_API_BASE_URL } from '@/lib/consts';
import { Submission } from '@/types/submission';

export const useSubmissions = (userId: number, questionId: number) => {
  return useQuery({
    queryKey: ['submissions', userId, questionId],
    queryFn: async () => {
        if (!userId) {
            return [];
        }
        return fetchSubmissions(userId, questionId);
    },
    enabled: !!userId,
  });
};

async function fetchSubmissions(
  userId: number,
  questionId: number,
): Promise<Submission[]> {
  const response = await fetch(
    `${HISTORY_API_BASE_URL}/users/${userId}/questions/${questionId}`,
  );
  return response.json();
}

