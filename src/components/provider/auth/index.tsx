'use client';
import { AuthContext } from '@/context/auth';
import { AuthContextT } from '@/types/auth/context';
import { Prisma } from '@schema/index';
import React from 'react';

type AuthProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};

type UserT = Required<Prisma.UserCreateInput>;
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<UserT | null>(null);

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const value: AuthContextT = {
    user: user,
    isAuthLoading: isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
