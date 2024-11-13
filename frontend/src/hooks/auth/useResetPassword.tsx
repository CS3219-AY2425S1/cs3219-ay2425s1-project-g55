import { BACKEND_URL_AUTH } from "@/lib/common";
import { useMutation } from "@tanstack/react-query";

export class ResetPasswordFailedError extends Error {}
export class InvalidResetCodeError extends Error {}

type ResetPasswordData = {
  email: string;
  resetCode: string;
  newPassword: string;
};

/**
 * Reset the password using the reset code
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await fetch(`${BACKEND_URL_AUTH}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          resetCode: data.resetCode,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        if (errorMessage.toLowerCase().includes("invalid reset code")) {
          throw new InvalidResetCodeError(
            "The reset code is invalid or expired."
          );
        }

        throw new ResetPasswordFailedError(
          "Failed to reset password. Please try again."
        );
      }

      return response;
    },
  });
}
