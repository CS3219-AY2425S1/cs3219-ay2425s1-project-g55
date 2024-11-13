import { BACKEND_URL_USERS } from '@/lib/common';
import { getToken } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

export class DeleteAccountFailedError extends Error {}

type DeleteAccountData = {
  userId: number;
};

/**
 * Delete a user account
 */
export function useDeleteAccount() {
  const token = getToken();

  return useMutation({
    mutationFn: async (data: DeleteAccountData) => {
      const response = await fetch(`${BACKEND_URL_USERS}/${data.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        if (errorMessage.toLowerCase().includes('forbidden')) {
          throw new DeleteAccountFailedError(
            'You are not authorized to delete this account.'
          );
        }

        if (errorMessage.toLowerCase().includes('not found')) {
          throw new DeleteAccountFailedError('User account not found.');
        }

        throw new DeleteAccountFailedError(
          'Failed to delete account. Please try again.'
        );
      }

      return response;
    },
  });
}
