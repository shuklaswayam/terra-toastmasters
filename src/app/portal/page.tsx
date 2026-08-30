"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Trophy,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Plus,
  BookOpen,
  ShieldAlert,
} from "lucide-react";

function MemberDashboardContent() {
  const {
    currentUser,
    meetings,
    meetingRoles,
    contests,
    mediaAlbums,
    claimRole,
  } = useTerraStore();

  const searchParams = useSearchParams();
  const isUnauthorized = searchParams.get("unauthorized");

  if (!currentUser) return null;

  const nextMeeting = meetings[0];
  const rolesForNextMeeting = nextMeeting
    ? meetingRoles.filter((r) => r.meetingId === nextMeeting.id)
    : [];
  const openRoles = rolesForNextMeeting.filter((r) => !r.assignedUserId);
  const userAssignedRole = rolesForNextMeeting.find(
    (r) => r.assignedUserId === currentUser.id
  );

  const activeContest = contests.find((c) => c.status !== "completed") || contests[0];
  const recentAlbum = mediaAlbums[0];

  const [claimSuccessRoleId, setClaimSuccessRoleId] = useState<string | null>(null);

  const handleQuickClaim = (roleId: string) => {
    const success = claimRole(roleId);
    if (success) {
      setClaimSuccessRoleId(roleId);
      setTimeout(() => setClaimSuccessRoleId(null), 3000);
    }
  };

  // Apple Calendar (.ics) Generator
  const downloadCalendarEvent = () => {
    if (!nextMeeting) return;
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Terra Toastmasters//Club Operating System//EN
BEGIN:VEVENT
SUMMARY:${nextMeeting.title}
DESCRIPTION:Theme: ${nextMeeting.theme} - Toastmaster: ${nextMeeting.tmodName}
LOCATION:${nextMeeting.locationName}
DTSTART:20260818T133000Z
DTEND:20260818T153000Z
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${nextMeeting.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {isUnauthorized && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>Access Restricted: You need Club Administrator privileges to enter the Admin Command console.</span>
        </div>
      )}

      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            {currentUser.executiveTitle
              ? `${currentUser.executiveTitle} • Terra Executive Command`
              : currentUser.pathwayName
              ? `${currentUser.pathwayName} (Level ${currentUser.pathwayLevel || 1})`
              : "Active Club Member"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {nextMeeting ? (
            <div className="px-3.5 py-1.5 rounded-full bg-terra-amber/10 border border-terra-amber/20 text-terra-amber text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terra-amber animate-pulse" />
              <span>Next Meeting: {nextMeeting.meetingDate}</span>
            </div>
          ) : (
            <Link
              href="/admin/meetings/builder"
              className="px-3.5 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule First Meeting</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bento Grid Architecture */}
      <div className="grid grid-cols-12 gap-5">
        {/* Module 1: Next Meeting Command Card (2/3 Hero Slot) */}
        <div className="col-span-12 lg:col-span-8 p-6 rounded-3xl terra-glass-card space-y-5 relative overflow-hidden flex flex-col justify-between">
          {nextMeeting ? (
            <>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-tertiary text-xs font-mono">
                  MEETING #{nextMeeting.meetingNumber}
                </span>
                <span className="text-xs text-terra-emerald font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-terra-emerald animate-pulse" />
                  <span>Published & Live</span>
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {nextMeeting.theme}
                </h2>
                <p className="text-xs text-terra-text-secondary">
                  TMOD: <span className="font-semibold text-terra-text-primary">{nextMeeting.tmodName}</span> • Word of the Day: <span className="font-semibold text-terra-amber font-display">"{nextMeeting.wordOfTheDay.word}"</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-terra-text-secondary">
                  <Calendar className="w-4 h-4 text-terra-amber flex-shrink-0" />
                  <span>{nextMeeting.meetingDate}</span>
                </div>
                <div className="flex items-center gap-2.5 text-terra-text-secondary">
                  <Clock className="w-4 h-4 text-terra-amber flex-shrink-0" />
                  <span>{nextMeeting.startTime} - {nextMeeting.endTime} IST</span>
                </div>
                <div className="flex items-center gap-2.5 text-terra-text-secondary">
                  <MapPin className="w-4 h-4 text-terra-amber flex-shrink-0" />
                  <span className="truncate">{nextMeeting.locationName}</span>
                </div>
                {nextMeeting.zoomUrl && (
                  <div className="flex items-center gap-2.5 text-terra-blue">
                    <Video className="w-4 h-4 flex-shrink-0" />
                    <a href={nextMeeting.zoomUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      Hybrid Zoom Link Active
                    </a>
                  </div>
                )}
              </div>

              {/* User's Role Status in this Meeting */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
                {userAssignedRole ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-terra-text-tertiary tracking-wider block">
                        Your Assigned Role
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-sm text-terra-emerald">
                          🎤 {userAssignedRole.roleName}
                        </span>
                        {userAssignedRole.speechTitle && (
                          <span className="text-xs text-terra-text-secondary">
                            ("{userAssignedRole.speechTitle}")
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                      Confirmed
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold">No role assigned for this session</p>
                      <p className="text-[11px] text-terra-text-secondary">
                        {openRoles.length} roles currently open for volunteering.
                      </p>
                    </div>
                    <Link
                      href={`/meetings/${nextMeeting.slug}`}
                      className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all"
                    >
                      Browse Roles
                    </Link>
                  </div>
                )}
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={`/meetings/${nextMeeting.slug}`}
                  className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <span>View Roster & Agenda</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={downloadCalendarEvent}
                  className="px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.08] active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-terra-amber" />
                  <span>Add to Apple Calendar</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-terra-amber/10 text-terra-amber flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl">No Meetings Scheduled Yet</h3>
                <p className="text-xs text-terra-text-secondary max-w-sm">
                  The schedule is clean and ready. Create your first club session with auto-generated roles and agenda timeline.
                </p>
              </div>
              <Link
                href="/admin/meetings/builder"
                className="px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Build Meeting #1</span>
              </Link>
            </div>
          )}
        </div>

        {/* Module 2: Quick Role Claiming Widget (1/3 Slot) */}
        <div className="col-span-12 lg:col-span-4 p-6 rounded-3xl terra-glass-card space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terra-amber" />
                <span>Open Roles</span>
              </h3>
              <span className="text-xs text-terra-text-tertiary font-mono">
                {openRoles.length} Available
              </span>
            </div>

            <div className="space-y-2.5">
              {openRoles.slice(0, 3).map((role) => (
                <div
                  key={role.id}
                  className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between text-xs transition-all hover:border-black/[0.1] dark:hover:border-white/[0.1]"
                >
                  <div>
                    <span className="font-semibold block">{role.roleName}</span>
                    <span className="text-[10px] text-terra-text-tertiary">
                      Time: {role.allocatedMinutes} mins
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickClaim(role.id)}
                    className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Claim</span>
                  </button>
                </div>
              ))}

              {openRoles.length === 0 && (
                <p className="text-center py-8 text-xs text-terra-text-tertiary">
                  {nextMeeting ? "🎉 All meeting roles are filled for this session!" : "No active session roles to claim."}
                </p>
              )}
            </div>
          </div>

          {nextMeeting ? (
            <Link
              href={`/meetings/${nextMeeting.slug}`}
              className="w-full py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:text-terra-text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors block text-center"
            >
              <span>View Complete Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/meetings"
              className="w-full py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:text-terra-text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors block text-center"
            >
              <span>Explore Meetings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Module 3: Active Contest Hub Card (1/3 Slot) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 p-5 rounded-3xl terra-glass-card space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-terra-rose uppercase tracking-wider">
                Club Contest Hub
              </span>
              <Trophy className="w-4 h-4 text-terra-amber" />
            </div>

            {activeContest ? (
              <>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight">
                    {activeContest.title}
                  </h4>
                  <p className="text-xs text-terra-text-secondary mt-0.5">
                    {activeContest.participants.length}/{activeContest.maxContestants} Slots Claimed
                  </p>
                </div>

                <Link
                  href={`/contests/${activeContest.id}`}
                  className="w-full py-2 rounded-xl bg-terra-amber/10 border border-terra-amber/20 text-terra-amber hover:bg-terra-amber/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 block text-center mt-2"
                >
                  <span>Register as Contestant</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <div className="py-4 space-y-2">
                <p className="text-xs text-terra-text-secondary">
                  No active speech contests currently open.
                </p>
                <Link
                  href="/contests"
                  className="w-full py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.06] transition-all flex items-center justify-center gap-1.5 block text-center"
                >
                  <span>View Contest Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Module 4: Recent Memories Card (1/3 Slot) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 p-5 rounded-3xl terra-glass-card space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-terra-blue uppercase tracking-wider">
                Recent Memories
              </span>
              <ImageIcon className="w-4 h-4 text-terra-blue" />
            </div>

            {recentAlbum ? (
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={recentAlbum.coverImageUrl}
                    alt="Album Cover"
                    className="w-14 h-14 rounded-2xl object-cover border border-black/[0.08] dark:border-white/[0.08]"
                  />
                  <div>
                    <h4 className="font-display font-bold text-xs truncate max-w-[160px]">
                      {recentAlbum.title}
                    </h4>
                    <p className="text-[11px] text-terra-text-secondary">
                      {recentAlbum.photoCount} high-res photos
                    </p>
                  </div>
                </div>

                <Link
                  href={`/gallery/${recentAlbum.year}/${recentAlbum.id}`}
                  className="w-full py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.06] transition-all flex items-center justify-center gap-1.5 block text-center"
                >
                  <span>Open Photo Album</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <div className="py-4 space-y-2">
                <p className="text-xs text-terra-text-secondary">
                  No photo albums uploaded yet.
                </p>
                <Link
                  href="/gallery/upload"
                  className="w-full py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.06] transition-all flex items-center justify-center gap-1.5 block text-center"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  <span>Ingest Photos</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Module 5: My Journey Card (1/3 Slot) */}
        <div className="col-span-12 lg:col-span-4 p-5 rounded-3xl terra-glass-card space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-terra-emerald uppercase tracking-wider">
                My Toastmasters Journey
              </span>
              <BookOpen className="w-4 h-4 text-terra-emerald" />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>{currentUser.pathwayName || "Toastmasters Educational Journey"}</span>
                <span className="text-terra-emerald font-mono">
                  {currentUser.pathwayLevel ? `Level ${currentUser.pathwayLevel}` : "Active Track"}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[10%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04]">
                <span className="block font-bold text-sm font-display">{currentUser.speechesDelivered}</span>
                <span className="text-[10px] text-terra-text-tertiary">Speeches Given</span>
              </div>
              <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04]">
                <span className="block font-bold text-sm font-display">{currentUser.rolesCompleted}</span>
                <span className="text-[10px] text-terra-text-tertiary">Roles Fulfilled</span>
              </div>
            </div>
          </div>

          <Link
            href="/portal/profile"
            className="w-full py-1.5 text-center text-xs text-terra-emerald font-semibold hover:underline block"
          >
            View Complete Speech History →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MemberDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-terra-text-secondary">Loading dashboard...</div>}>
      <MemberDashboardContent />
    </Suspense>
  );
}
