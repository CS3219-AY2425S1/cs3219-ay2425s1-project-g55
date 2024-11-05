import { BACKEND_URL_USERS } from "@/lib/common";
import {
  User,
  UsersArraySchema,
  UserUpdateData,
  UserSchema,
} from "@/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/utils";

interface RawUser {
  id: string;
  username?: string;
  email: string;
  admin: boolean;
}

async function fetchUsers(): Promise<User[]> {
  const token = getToken();

  const response = await fetch(`${BACKEND_URL_USERS}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const rawData = await response.json();

  const transformedData = rawData.map((user: RawUser) => ({
    id: String(user.id),
    name: user.username || user.email || "",
    email: user.email,
    isAdmin: Boolean(user.admin),
  }));

  return UsersArraySchema.parse(transformedData);
}

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserUpdateData) => {
      const token = getToken();

      const response = await fetch(`${BACKEND_URL_USERS}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          username: data.name,
          isAdmin: data.isAdmin,
        }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error("Failed to update user - " + errorResponse.message);
      }

      const rawData = await response.json();
      const transformedData = {
        id: String(rawData.id),
        name: rawData.username || rawData.email || "",
        email: rawData.email,
        isAdmin: Boolean(data.isAdmin),
      };

      return UserSchema.parse(transformedData);
    },
    onSuccess: (data) => {
      // Print the cached data for debugging
      console.log(
        "Cached data for 'user':",
        queryClient.getQueryData(["user", data.id])
      );

      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Print the cached data for debugging
      console.log(
        "Cached data for 'user':",
        queryClient.getQueryData(["user", data.id])
      );
    },
  });
}
