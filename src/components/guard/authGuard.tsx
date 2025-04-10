"use client";
import { useAuth } from "@/hooks/auth/useAuth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useEffect } from "react";
import { useCookies } from "react-cookie";

type RoleRoute = {
  url: string;
  role?: string[];
  redirect?: string;
  needAuth?: boolean;
};

const routeRoles: RoleRoute[] = [
  {
    url: "/dashboard/*",
    role: ["ADMIN", "SUPERADMIN", "USER"],
    needAuth: true,
  },
  {
    url: "/contact/*",
    role: ["ADMIN", "SUPERADMIN", "USER"],
  },
];

type PropsT = {
  children: React.ReactNode;
};

const pageAccessOnlyIfUnAuthenticated: string[] = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/verify-email",
];

export const AuthGuard = ({ children }: PropsT) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const { user, isAuthLoading } = useAuth();
  const userRoles = useMemo(() => user?.role || "STAFF", [user]); // Get the user's roles
  const [cookies] = useCookies(["AuthToken"]);
  const isAuthenticated = useMemo(
    () => !!cookies.AuthToken && !!user,
    [cookies, user]
  );
  // Show loader during route changes or delays
  useEffect(() => {
    if (isAuthLoading) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 20); // delay in ms
    return () => clearTimeout(timer); // Cleanup the timer
  }, [isAuthLoading, pathName]);

  // Handle authentication and role-based redirects
  useEffect(() => {
    // Wait until authentication loading is complete to proceed
    if (isAuthLoading) return;

    // Step 1: Identify the current route from the `routeRoles` configuration
    const currentRoute = routeRoles.find((route) => {
      if (route.url === pathName) return true; // Direct match for the route
      if (route.url.endsWith("/*")) {
        const basePath = route.url.replace("/*", ""); // Handle wildcard route (e.g., `/dashboard/*`)
        return pathName.startsWith(basePath); // Check if the current path starts with the base path
      }
      return false; // No match found
    });

    // Step 2: Handle authentication-based redirection
    if (currentRoute) {
      // If the route requires authentication and the user is not authenticated
      if (currentRoute.needAuth && !isAuthenticated) {
        // Redirect the user to the signin page and include the current path as a `redirect` query parameter
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathName)}`);
        return; // Exit the logic as redirection is in progress
      }

      // Step 3: Handle role-based access control
      if (isAuthenticated) {
        // Check if the user has at least one of the required roles for the current route
        const hasRequiredRole = currentRoute.role?.includes(userRoles);

        // If the user does not have the required role(s)
        if (!hasRequiredRole) {
          // Redirect the user to a fallback page specified in the route's configuration or to the homepage
          router.replace(currentRoute.redirect || "/");
          return; // Exit the logic as redirection is in progress
        }
      }
    }
  }, [pathName, isAuthenticated, userRoles, router, isAuthLoading]);

  // Prevent authenticated users from accessing unauthenticated-only pages
  useEffect(() => {
    if (isAuthLoading || isLoading) return;
    if (isAuthenticated && pageAccessOnlyIfUnAuthenticated.includes(pathName)) {
      router.push(redirectTo || "/");
    }
  }, [isAuthenticated, pathName, redirectTo, router, isAuthLoading, isLoading]);

  // Display preloader if authentication or loading is in progress
  if (isAuthLoading || isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
