import { BACKEND_URL_USERS } from "@/lib/common";
import { User, UserSchema } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/utils";

async function fetchUser(id: number): Promise<User> {
  const token = getToken();

  const response = await fetch(`${BACKEND_URL_USERS}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const user = await response.json();

  const transformedData = {
    id: String(user.id),
    name: user.username || user.email || "",
    email: user.email,
    isAdmin: Boolean(user.admin),
  };

  return UserSchema.parse(transformedData);
}

export function useUser(id: number, options?: { enabled?: boolean }) {
  return useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: options?.enabled ?? true,
  });
}
