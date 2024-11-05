import { LOCAL_STORAGE_KEYS, LoginResponseSchema } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

interface DecodedToken {
  exp: number;
}

type UserRole = 'user' | 'admin';
const USER_ROLES = {
  user: 'user',
  admin: 'admin',
} as const;

type AuthHelper = {
  user: AuthUser;
  logout: () => void;
};

type AuthUser = {
  role: UserRole;
  userId: number;
  userName: string;
  email: string;
};

function clearAuthData() {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
}

export function useAuth(): AuthHelper | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loginResponse = LoginResponseSchema.safeParse(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '{}')
      );

      if (!loginResponse.success) {
        clearAuthData();
        setUser(null);
        return;
      }

      const user = loginResponse.data;

      try {
        const decodedToken = jwtDecode<DecodedToken>(user.token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            role: user.admin ? USER_ROLES.admin : USER_ROLES.user,
            userId: user.id,
            userName: user.username,
            email: user.email,
          });
        } else {
          // Token has expired
          clearAuthData();
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        clearAuthData();
        setUser(null);
      }
    };

    checkAuth();
    // You might want to set up a timer to periodically check the token's validity
  }, []);

  return user
    ? {
        user,
        logout: () => {
          clearAuthData();
          setUser(null);
          window.location.reload();
        },
      }
    : null;
}
