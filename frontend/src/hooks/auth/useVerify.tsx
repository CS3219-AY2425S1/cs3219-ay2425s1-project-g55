import { BACKEND_URL_AUTH } from '@/lib/common';
import { VerifyUser } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

export class VerificationCodeInvalidError extends Error {}
export class VerificationCodeExpiredError extends Error {}

export function useVerifySignup() {
  return useMutation({
    mutationFn: async (data: VerifyUser) => {
      const response = await fetch(`${BACKEND_URL_AUTH}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage.toLowerCase().includes('invalid verification code')) {
          throw new VerificationCodeInvalidError();
        } else if (errorMessage.toLowerCase().includes('code has expired')) {
          throw new VerificationCodeExpiredError();
        }
        throw new Error('Failed to verify user');
      }

      return;
    },
  });
}

export function useResendVerificationCode() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(
        `${BACKEND_URL_AUTH}/resend-verification?email=${email}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to resend verification code');
      }

      return;
    },
  });
}
