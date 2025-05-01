'use client';
import { AuthContext } from '@/context/auth';
import { AUTH_ENDPOINT } from '@/lib/constants/endpoints/auth';
import { AUTH_TOKEN_KEY } from '@/lib/constants/token';
import { AuthContextT } from '@/types/auth/context';
import http from '@/utils/http';
import { Prisma } from '@schema/index';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';

type AuthProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};

type UserT = Required<Prisma.UserCreateInput>;
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = React.useState<UserT | null>(null);
  const [cookies] = useCookies([AUTH_TOKEN_KEY]);
  const [isInit, setIsInit] = React.useState(true);

  const { isPending: isLoadingMe, mutate } = useMutation({
    mutationFn: () => http.post<UserT>(AUTH_ENDPOINT.GET_ME),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        return data.data;
      }
      setUser(null);
      return data;
    },
  });

  useEffect(() => {
    if (cookies.AuthToken && isInit) {
      setIsInit(false);
      mutate();
    }
  }, [cookies.AuthToken, isInit, mutate]);

  const value: AuthContextT = {
    user: user,
    isAuthLoading: isLoadingMe,
    refresh: () => mutate(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
