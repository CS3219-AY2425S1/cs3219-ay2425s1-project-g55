import { BACKEND_URL_AUTH } from "@/lib/common";
import { getToken } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export class IncorrectOldPasswordError extends Error {}
export class PasswordMismatchError extends Error {}
export class ChangePasswordFailedError extends Error {}

type ChangePasswordData = {
  userId: number;
  oldPassword: string;
  newPassword: string;
};

/**
 * Change the password for a user
 */
export function useChangePassword() {
  const token = getToken();

  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await fetch(`${BACKEND_URL_AUTH}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        if (errorMessage.toLowerCase().includes("incorrect old password")) {
          throw new IncorrectOldPasswordError("The old password is incorrect.");
        }

        throw new ChangePasswordFailedError(
          "Failed to change password. Please try again."
        );
      }

      return response;
    },
  });
}
