"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Shield,
  UserCheck,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  ChevronLeft,
  Search,
  Plus,
} from "lucide-react";

export default function RosterManagementPage() {
  const { currentUser, meetings, meetingRoles, users, assignRoleDirectly, dropRole } = useTerraStore();
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id || "");

  const activeMeeting = meetings.find((m) => m.id === selectedMeetingId) || (meetings.length > 0 ? meetings[0] : null);
  const roles = activeMeeting ? meetingRoles.filter((r) => r.meetingId === activeMeeting.id) : [];

  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const handleMemberSelect = (roleId: string, userId: string) => {
    if (userId === "unassign") {
      dropRole(roleId);
    } else {
      assignRoleDirectly(roleId, userId);
      setSavedSuccessId(roleId);
      setTimeout(() => setSavedSuccessId(null), 2000);
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">Admin Permission Required</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            Only the System Administrator has permission to override role rosters or force-assign members.
          </p>
          <Link
            href="/portal"
            className="inline-block px-5 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!activeMeeting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">No Meetings to Manage</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            There are currently no meetings scheduled. Create your first meeting session to begin managing roles.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/meetings/builder"
              className="inline-block px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
            >
              + Create Meeting #1
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/meetings/builder"
            className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary hover:text-terra-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Meeting Roster & Role Override Studio
            </h1>
            <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
              Directly assign, replace, lock, and manage member role assignments across sessions.
            </p>
          </div>
        </div>

        {/* Meeting Selector */}
        <select
          value={selectedMeetingId}
          onChange={(e) => setSelectedMeetingId(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold text-terra-text-primary focus:outline-none"
        >
          {meetings.map((m) => (
            <option key={m.id} value={m.id}>
              Meeting #{m.meetingNumber} ({m.meetingDate}) — {m.theme}
            </option>
          ))}
        </select>
      </div>

      {/* Roster Assignment Table */}
      <div className="p-6 rounded-3xl terra-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base tracking-tight">
              Role Roster ({roles.length} Total Slots)
            </h3>
            <p className="text-xs text-terra-text-secondary mt-0.5">
              Select a member from the dropdown to instantly assign or override a role.
            </p>
          </div>
        </div>

        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {roles.map((role) => (
            <div
              key={role.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-tertiary">
                  {role.allocatedMinutes}m
                </span>
                <div>
                  <h4 className="font-bold text-sm">{role.roleName}</h4>
                  {role.speechTitle && (
                    <p className="text-[11px] text-terra-text-secondary italic">
                      "{role.speechTitle}" ({role.speechPathwayProject})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                {/* Member Dropdown Assigner */}
                <select
                  value={role.assignedUserId || "unassign"}
                  onChange={(e) => handleMemberSelect(role.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                    role.assignedUserId
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                      : "bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.08] dark:border-white/[0.08] text-terra-text-secondary"
                  }`}
                >
                  <option value="unassign">— Unassigned (Open Slot) —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.pathwayName} L{u.pathwayLevel})
                    </option>
                  ))}
                </select>

                {savedSuccessId === role.id && (
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Assigned</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
