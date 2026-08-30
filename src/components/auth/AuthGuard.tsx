"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerraStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoaded } = useTerraStore();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/auth/login";

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!isAuthenticated && !isLoginPage) {
      const redirectUrl = pathname === "/" ? "/auth/login" : `/auth/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    } else if (isAuthenticated && isLoginPage) {
      router.replace("/portal");
    }
  }, [isAuthenticated, isAuthLoaded, isLoginPage, pathname, router]);

  // If loading session state
  if (!isAuthLoaded && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terra-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-terra-amber border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-terra-text-tertiary">Connecting to Terra...</span>
        </div>
      </div>
    );
  }

  // If not authenticated and trying to access any page other than login
  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terra-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-terra-amber border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-terra-text-tertiary">Authenticating...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
