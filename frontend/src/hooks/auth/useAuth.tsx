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

type AuthenticatedUser = {
  role: UserRole;
  logout: () => void;
};

function clearAuthData() {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
}

export function useAuth(): AuthenticatedUser | null {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loginResponse = LoginResponseSchema.safeParse(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '{}')
      );

      if (!loginResponse.success) {
        clearAuthData();
        setUserRole(null);
        return;
      }

      const user = loginResponse.data;

      try {
        const decodedToken = jwtDecode<DecodedToken>(user.token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserRole(user.admin ? USER_ROLES.admin : USER_ROLES.user);
        } else {
          // Token has expired
          clearAuthData();
          setUserRole(null);
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        clearAuthData();
        setUserRole(null);
      }
    };

    checkAuth();
    // You might want to set up a timer to periodically check the token's validity
  }, []);

  return userRole
    ? {
        role: userRole,
        logout: () => {
          clearAuthData();
          setUserRole(null);
          window.location.reload();
        },
      }
    : null;
}
