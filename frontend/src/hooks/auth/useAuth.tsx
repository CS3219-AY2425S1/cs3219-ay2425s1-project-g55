import { BACKEND_URL_AUTH } from '@/lib/common';
import {
  LOCAL_STORAGE_KEYS,
  LoginResponseSchema,
  VerifyTokenResponseSchema,
} from '@/types/auth';
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
  refreshAuth: () => Promise<void>;
};

export type AuthUser = {
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
  const [isLoading, setIsLoading] = useState(true);
  const [authHelper, setAuthHelper] = useState<AuthHelper | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };

    checkAuth();
    // You might want to set up a timer to periodically check the token's validity
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setAuthHelper(null);
      return;
    }

    const refreshAuth = async () => {
      const loginResponse = LoginResponseSchema.safeParse(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '{}')
      );

      if (!loginResponse.success) {
        clearAuthData();
        setUser(null);
        return;
      }

      const response = await fetch(`${BACKEND_URL_AUTH}/verify-token`, {
        headers: {
          Authorization: `Bearer ${loginResponse.data.token}`,
        },
      });

      if (!response.ok) {
        clearAuthData();
        setUser(null);
      }

      const data = await response.json();
      const user = VerifyTokenResponseSchema.parse(data);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER,
        JSON.stringify({
          id: user.id,
          token: loginResponse.data.token,
          email: user.email,
          username: user.username,
          admin: user.admin,
        })
      );
      console.log('About to update user status');
      setUser({
        role: user.admin ? USER_ROLES.admin : USER_ROLES.user,
        userId: user.id,
        userName: user.username,
        email: user.email,
      });
      console.log('User state updated');
    };

    setAuthHelper({
      user,
      logout: () => {
        clearAuthData();
        setUser(null);
        window.location.reload();
      },
      refreshAuth,
    });
  }, [user, isLoading]);

  return authHelper;
}
