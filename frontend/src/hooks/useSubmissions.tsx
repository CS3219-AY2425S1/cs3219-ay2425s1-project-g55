import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL_HISTORY } from '@/lib/common';
import {
  Submission,
  SubmissionsArraySchema,
  SubmissionSchema,
  CreateSubmissionData,
} from '@/types/submission';
import { getToken } from '@/lib/utils';

export const useAllSubmissions = (userId: number) => {
  return useQuery({
    queryKey: ['allSubmissions', userId],
    queryFn: () => fetchAllSubmissions(userId),
  });
};

async function fetchAllSubmissions(userId: number): Promise<Submission[]> {
  try {
    const token = getToken();
    const response = await fetch(
      `${BACKEND_URL_HISTORY}/users/${userId}/attempts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch submissions');
    }

    const data = await response.json();
    return SubmissionsArraySchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch submissions: ${error.message}`);
    }
    throw new Error('Failed to fetch submissions');
  }
}

export const useSubmissions = (userId: number, questionId: number) => {
  return useQuery({
    queryKey: ['submissions', userId, questionId],
    queryFn: () => fetchSubmissions(userId, questionId),
  });
};

async function fetchSubmissions(
  userId: number,
  questionId: number
): Promise<Submission[]> {
  try {
    const token = getToken();
    const response = await fetch(
      `${BACKEND_URL_HISTORY}/users/${userId}/questions/${questionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch submissions');
    }

    const data = await response.json();
    return SubmissionsArraySchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch submissions: ${error.message}`);
    }
    throw new Error('Failed to fetch submissions');
  }
}

export function useCreateSubmission({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubmissionData) => {
      try {
        const token = getToken();
        const response = await fetch(`${BACKEND_URL_HISTORY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to create submission');
        }

        const submission = await response.json();
        return SubmissionSchema.parse(submission);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to create submission: ${error.message}`);
        }
        throw new Error('Failed to create submission');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['submissions', data.userId, data.questionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['allSubmissions', data.userId],
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
