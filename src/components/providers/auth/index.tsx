"use client";
import { AuthContext } from "@/context/auth/authContext";
import React, { useEffect } from "react";
import { Prisma } from "../../../../prisma/generated/client";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { AuthContextT } from "@/types/auth/context";
import { AUTH_TOKEN_KEY } from "@/lib/constants/token";

export const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = React.useState<Prisma.UserCreateInput | null>(null);
  const [isInit, setIsInit] = React.useState<boolean>(true);
  const [cookies] = useCookies([AUTH_TOKEN_KEY]);

  const { mutate: verifyUser, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: () => http.get<Prisma.UserCreateInput>("/auth"),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        return data.data;
      }
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
