"use client";

import React from "react";
import { useTerraStore } from "@/lib/store";
import {
  TrendingUp,
  Award,
  Users,
  Calendar,
  BookOpen,
  Trophy,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ClubAnalyticsPage() {
  const { users, meetings, contests, speechRecords } = useTerraStore();

  const totalSpeechesInClub = users.reduce((acc, u) => acc + u.speechesDelivered, 0);
  const totalRolesInClub = users.reduce((acc, u) => acc + u.rolesCompleted, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Club Performance & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            Member progression, pathway completions, and Toastmasters leadership milestones.
          </p>
        </div>
      </div>

      {/* Aggregate Club Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl terra-glass-card space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary">
            Active Members
          </span>
          <div className="font-display text-3xl font-bold">{users.length}</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Good Standing</span>
          </span>
        </div>

        <div className="p-6 rounded-3xl terra-glass-card space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary">
            Speeches Delivered
          </span>
          <div className="font-display text-3xl font-bold">{totalSpeechesInClub}</div>
          <span className="text-xs text-terra-amber font-semibold">
            Across 142 Sessions
          </span>
        </div>

        <div className="p-6 rounded-3xl terra-glass-card space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary">
            Roles Fulfilled
          </span>
          <div className="font-display text-3xl font-bold">{totalRolesInClub}</div>
          <span className="text-xs text-terra-blue font-semibold">
            Leadership In Action
          </span>
        </div>

        <div className="p-6 rounded-3xl terra-glass-card space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary">
            Pathways Levels
          </span>
          <div className="font-display text-3xl font-bold text-terra-emerald">22 Complete</div>
          <span className="text-xs text-terra-text-secondary">
            DCP Goals: 8/10 Reached
          </span>
        </div>
      </div>

      {/* Leaderboard & Pathway Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Contributors Leaderboard (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl terra-glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base tracking-tight flex items-center gap-2">
              <Trophy className="w-4 h-4 text-terra-amber" />
              <span>Top Club Contributors (2026 Term)</span>
            </h3>
            <span className="text-xs text-terra-text-tertiary font-mono">Ranked by Speeches</span>
          </div>

          <div className="space-y-3">
            {users
              .slice()
              .sort((a, b) => b.speechesDelivered - a.speechesDelivered)
              .map((member, idx) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary font-mono font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover border border-black/10"
                    />
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <span className="text-[11px] text-terra-text-tertiary">{member.pathwayName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 font-semibold">
                      🎤 {member.speechesDelivered} speeches
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-terra-amber/10 text-terra-amber font-semibold">
                      ⏱️ {member.rolesCompleted} roles
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Pathway Breakdown (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl terra-glass-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-terra-emerald" />
              <span>Pathways Enrollment Distribution</span>
            </h3>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Dynamic Leadership</span>
                  <span className="font-mono text-terra-emerald">3 Members (38%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[38%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Presentation Mastery</span>
                  <span className="font-mono text-terra-amber">2 Members (25%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                  <div className="h-full bg-terra-amber rounded-full w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Effective Coaching</span>
                  <span className="font-mono text-terra-blue">2 Members (25%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                  <div className="h-full bg-terra-blue rounded-full w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Visionary Communication</span>
                  <span className="font-mono text-indigo-500">1 Member (12%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-[12%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-xs text-terra-text-secondary">
            <span className="font-bold text-terra-text-primary block mb-0.5">Distinguished Club Program (DCP)</span>
            Terra is currently on track for <strong>President's Distinguished Club</strong> status with 8 completed education goals.
          </div>
        </div>
      </div>
    </div>
  );
}
