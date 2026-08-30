"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerraStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoaded } = useTerraStore();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/auth/login";
  const isProtectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname === "/gallery/upload";

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!isAuthenticated && isProtectedPath) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (isAuthenticated && isLoginPage) {
      router.replace("/portal");
    }
  }, [isAuthenticated, isAuthLoaded, isProtectedPath, isLoginPage, pathname, router]);

  // If loading session state and attempting to access a protected path
  if (!isAuthLoaded && isProtectedPath) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-terra-amber border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-terra-text-tertiary">Connecting to Terra...</span>
        </div>
      </div>
    );
  }

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedPath) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-terra-amber border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-terra-text-tertiary">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
