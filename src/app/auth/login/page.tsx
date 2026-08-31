"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import { ArrowRight, Lock, User as UserIcon, AlertCircle, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/portal";

  const { login } = useTerraStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(identifier, password);
      if (result.success) {
        // Safe internal redirect
        const safeUrl = redirectTarget.startsWith("/") ? redirectTarget : "/portal";
        router.push(safeUrl);
      } else {
        setError(result.error || "Invalid username or password.");
        setIsLoading(false);
      }
    } catch {
      setError("Unable to connect to authentication server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-float space-y-6">
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-terra-text-secondary">
            Username or Email
          </label>
          <div className="relative flex items-center">
            <UserIcon className="w-4 h-4 text-terra-text-tertiary absolute left-3" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. swayam or swayam@terra.club"
              required
              autoFocus
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-terra-text-secondary">
              Password
            </label>
            <span className="text-[11px] text-terra-text-tertiary">
              Contact Admin if forgotten
            </span>
          </div>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-terra-text-tertiary absolute left-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 transition-all font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Member Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Quick onboarding helper hint */}
      <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.04] text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-terra-text-tertiary bg-black/[0.02] dark:bg-white/[0.03] px-3 py-1.5 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
          <Sparkles className="w-3 h-3 text-terra-amber" />
          <span>Initial default password: <strong className="font-mono text-terra-text-primary">terra@2026</strong></span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
            <span>Terra</span>
            <span className="w-3 h-3 rounded-full bg-terra-amber animate-pulse" />
          </div>
          <p className="text-xs text-terra-text-secondary">
            Authenticated Club Operating System for Terra Toastmasters
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-terra-text-secondary">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
