"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import { ArrowRight, Lock, User as UserIcon, AlertCircle, Sparkles, Key, CheckCircle2, X } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/portal";

  const { login, resetPassword } = useTerraStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetNewPass, setResetNewPass] = useState("");
  const [resetConfirmPass, setResetConfirmPass] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    if (!resetIdentifier.trim()) {
      setResetError("Please enter your Username or Email.");
      return;
    }

    if (resetNewPass.trim().length < 6) {
      setResetError("Password must be at least 6 characters.");
      return;
    }

    if (resetNewPass.trim() !== resetConfirmPass.trim()) {
      setResetError("Passwords do not match.");
      return;
    }

    setIsResetting(true);
    const result = await resetPassword(resetIdentifier.trim(), resetNewPass.trim());
    setIsResetting(false);

    if (result.success) {
      setResetSuccess("Password reset successfully! Logging you in...");
      setIdentifier(resetIdentifier.trim());
      setPassword(resetNewPass.trim());
      setTimeout(async () => {
        setShowResetModal(false);
        const loginRes = await login(resetIdentifier.trim(), resetNewPass.trim());
        if (loginRes.success) {
          const safeUrl = redirectTarget.startsWith("/") ? redirectTarget : "/portal";
          router.push(safeUrl);
        }
      }, 1000);
    } else {
      setResetError(result.error || "Failed to reset password. Please check your username.");
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
            <button
              type="button"
              onClick={() => {
                setResetError(null);
                setResetSuccess(null);
                setResetIdentifier(identifier);
                setResetNewPass("");
                setResetConfirmPass("");
                setShowResetModal(true);
              }}
              className="text-[11px] text-terra-amber font-semibold hover:underline"
            >
              Reset Password
            </button>
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

      {/* RESET PASSWORD MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-terra-amber/10 text-terra-amber flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Reset Account Password</h3>
                  <p className="text-[11px] text-terra-text-secondary">Set a new password for your Toastmasters account</p>
                </div>
              </div>
              <button onClick={() => setShowResetModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            {resetError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-terra-text-secondary">Username or Email *</label>
                <input
                  type="text"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  placeholder="e.g. swayam or swayam@terra.club"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-terra-text-secondary">New Password *</label>
                <input
                  type="password"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-terra-text-secondary">Confirm New Password *</label>
                <input
                  type="password"
                  value={resetConfirmPass}
                  onChange={(e) => setResetConfirmPass(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-1/2 py-2.5 rounded-xl bg-terra-amber text-white font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isResetting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
