import { LOCAL_STORAGE_KEYS } from '@/types/auth';
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
  localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ID);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.EXPIRES_IN);
}

export function useAuth(): AuthenticatedUser | null {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      if (!token) {
        clearAuthData();
        setUserRole(null);
        return;
      }

      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserRole(USER_ROLES.user);
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
