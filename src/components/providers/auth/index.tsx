'use client';
import { AuthContext } from '@/context/auth/authContext';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useMutation } from '@tanstack/react-query';
import http from '@/utils/http';
import { AuthContextT } from '@/types/auth/context';
import { AUTH_TOKEN_KEY } from '@/lib/constants/token';
import { AUTH_ENDPOINT } from '@/lib/constants/endpoints/auth';
import { Prisma } from '@schema/index';

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = React.useState<Prisma.UserCreateInput | null>(null);
  const [isInit, setIsInit] = React.useState<boolean>(true);
  const [cookies] = useCookies([AUTH_TOKEN_KEY]);

  const { mutate: verifyUser, isPending } = useMutation({
    mutationKey: ['user'],
    mutationFn: () => http.get<Prisma.UserCreateInput>(AUTH_ENDPOINT.GET_ME),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        return data.data;
      }
      return null;
    },
  });

  useEffect(() => {
    if (cookies.AuthToken && !user && !isPending) {
      if (isInit) {
        verifyUser();
        setIsInit(false);
      }
    }
  }, [cookies.AuthToken, isInit, verifyUser, user, isPending]);

  const value = {
    user,
    isAuthLoading: isPending,
  } as AuthContextT;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
