"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function MeetingsListPage() {
  const { meetings, meetingRoles, currentUser } = useTerraStore();
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const filteredMeetings = meetings.filter((m) => {
    if (filter === "upcoming") return m.status !== "completed";
    return m.status === "completed";
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Meeting Schedule & Rosters
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            View upcoming club sessions, volunteer for roles, and explore session agendas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role === "admin" && (
            <Link
              href="/admin/meetings/builder"
              className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Meeting</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="inline-flex p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-full border border-black/[0.04] dark:border-white/[0.06]">
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "upcoming"
              ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
              : "text-terra-text-secondary hover:text-terra-text-primary"
          }`}
        >
          Upcoming Meetings
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "past"
              ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
              : "text-terra-text-secondary hover:text-terra-text-primary"
          }`}
        >
          Past Sessions Archive
        </button>
      </div>

      {/* Meetings Grid */}
      {filteredMeetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMeetings.map((meeting) => {
            const roles = meetingRoles.filter((r) => r.meetingId === meeting.id);
            const openRoles = roles.filter((r) => !r.assignedUserId);

            return (
              <div
                key={meeting.id}
                className="p-6 rounded-3xl terra-glass-card space-y-4 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-xs font-mono">
                      MEETING #{meeting.meetingNumber}
                    </span>
                    {meeting.status === "completed" ? (
                      <span className="text-xs text-terra-text-tertiary">Completed</span>
                    ) : (
                      <span className="text-xs text-terra-emerald font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-terra-emerald" />
                        <span>{openRoles.length} Open Roles</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl tracking-tight">
                      {meeting.theme}
                    </h3>
                    <p className="text-xs text-terra-text-secondary mt-0.5">
                      TMOD: <span className="font-semibold text-terra-text-primary">{meeting.tmodName}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-terra-text-secondary pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-terra-amber" />
                      <span>{meeting.meetingDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-terra-amber" />
                      <span>{meeting.startTime} - {meeting.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-terra-amber" />
                      <span className="truncate">{meeting.locationName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
                  <div className="text-[11px] text-terra-text-tertiary">
                    Word: <strong className="text-terra-amber">"{meeting.wordOfTheDay?.word || "Eloquent"}"</strong>
                  </div>

                  <Link
                    href={`/meetings/${meeting.slug}`}
                    className="px-4 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.08] active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>Open Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl">
              {filter === "upcoming" ? "No Upcoming Meetings Scheduled" : "No Past Meetings in Archive"}
            </h3>
            <p className="text-xs text-terra-text-secondary leading-relaxed">
              {filter === "upcoming"
                ? "Start clean by crafting a new meeting agenda with customized roles and timing."
                : "Completed meetings will appear in this archive once sessions conclude."}
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Link
              href="/admin/meetings/builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Meeting #1</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
