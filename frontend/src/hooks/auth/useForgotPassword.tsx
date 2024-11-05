import { BACKEND_URL_AUTH } from "@/lib/common";
import { useMutation } from "@tanstack/react-query";

export class ForgotPasswordFailedError extends Error {}

type ForgotPasswordData = {
  email: string;
};

/**
 * Send a password reset code to the user's email
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await fetch(`${BACKEND_URL_AUTH}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new ForgotPasswordFailedError(
          errorMessage || "Failed to send reset code."
        );
      }

      return response;
    },
  });
}
