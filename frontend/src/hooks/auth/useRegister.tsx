import { BACKEND_URL_USERS } from '@/lib/common';
import { RegisterUser } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

export class RegisterUsernameAlreadyTakenError extends Error {}
export class RegisterEmailAlreadyExistsError extends Error {}

/**
 * Register a new user
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterUser) => {
      const dataForBackend = {
        email: data.email,
        password: data.password,
        username: data.username,
      };

      const response = await fetch(`${BACKEND_URL_USERS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForBackend),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage.toLowerCase().includes('username already exists')) {
          throw new RegisterUsernameAlreadyTakenError();
        }
        if (errorMessage.toLowerCase().includes('email already exists')) {
          throw new RegisterEmailAlreadyExistsError();
        }
        throw new Error('Failed to register user');
      }

      return response.json();
    },
  });
}
