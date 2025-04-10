"use client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider as ProviderQuery,
} from "@tanstack/react-query";
import React from "react";
import { CookiesProvider } from "react-cookie";

export const QueryProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const client = new QueryClient({
    mutationCache: new MutationCache(),
    queryCache: new QueryCache(),
    defaultOptions: {
      queries: {
        networkMode: "offlineFirst",
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: { retry: false },
    },
  });

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ProviderQuery client={client}>{children}</ProviderQuery>
    </CookiesProvider>
  );
};
