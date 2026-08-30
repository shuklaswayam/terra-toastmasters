"use client";

import React from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Trophy,
  Clock,
  Users,
  Radio,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  ChevronRight,
  BookOpen,
  Mic,
  Award,
} from "lucide-react";

export default function RootLandingPage() {
  const { currentUser, meetings, contests, events } = useTerraStore();

  const nextMeeting = meetings[0] || {
    meetingNumber: 519,
    title: "Resilience in Action",
    meetingDate: "2026-09-05",
    startTime: "19:00 IST",
    endTime: "21:00 IST",
    locationName: "Terra Hall & Zoom Live",
    theme: "Resilience in Action",
    slug: "519-resilience-in-action",
    tmodName: "TM Swayam",
  };

  const nextContest = contests[0];

  return (
    <div className="min-h-screen space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-14 text-center overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-terra-amber/15 dark:bg-terra-amber/10 blur-[130px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Club Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terra-amber/10 border border-terra-amber/25 text-terra-amber text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-terra-amber" />
            <span>District 92 • Division • Terra Toastmasters #519</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-terra-text-primary">
            Where Leaders Speak. <br />
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Where Voices Transform.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-terra-text-secondary leading-relaxed font-normal">
            Welcome to <strong className="text-terra-text-primary font-semibold">Terra Toastmasters</strong> — the authenticated club operating system. Experience dynamic hybrid meetings, seamless speech role allocations, speech contests, and Pathways leadership development.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {currentUser ? (
              <>
                <Link
                  href="/portal"
                  className="px-6 py-3 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Go to Member Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/portal/profile"
                  className="px-5 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-terra-text-primary font-semibold text-xs hover:bg-black/[0.08] dark:hover:bg-white/[0.1] active:scale-95 transition-all"
                >
                  My Speeches & Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-6 py-3 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Sign In to Member Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/meetings/${nextMeeting.slug}`}
                  className="px-5 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-terra-text-primary font-semibold text-xs hover:bg-black/[0.08] dark:hover:bg-white/[0.1] active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-terra-amber" />
                  <span>View Meeting #{nextMeeting.meetingNumber} Agenda</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. NEXT MEETING SPOTLIGHT BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-black/[0.02] to-black/[0.04] dark:from-amber-500/15 dark:via-white/[0.02] dark:to-white/[0.04] border border-amber-500/30 dark:border-amber-500/30 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 text-terra-amber animate-pulse" />
                <span>Next Scheduled Session</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-terra-text-primary tracking-tight">
                Meeting #{nextMeeting.meetingNumber}: &ldquo;{nextMeeting.theme}&rdquo;
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-terra-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-terra-amber" />
                  <span>{nextMeeting.meetingDate} ({nextMeeting.startTime} – {nextMeeting.endTime})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-terra-amber" />
                  <span>{nextMeeting.locationName}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-terra-amber" />
                  <span>TMOD: {nextMeeting.tmodName}</span>
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
              <Link
                href={`/meetings/${nextMeeting.slug}`}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-terra-amber text-white font-semibold text-xs hover:bg-terra-amber/90 active:scale-95 transition-all text-center shadow-xs"
              >
                Open Agenda & Roles
              </Link>
              <Link
                href={`/meetings/${nextMeeting.slug}/print`}
                target="_blank"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-terra-text-primary font-medium text-xs hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-all text-center"
              >
                Print Agenda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLUB CAPABILITIES & OS MODULES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-terra-amber">
            Purpose-Built Architecture
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-terra-text-primary">
            Engineered for Modern Toastmasters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Meetings */}
          <Link
            href="/meetings"
            className="p-6 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-card hover:border-terra-amber/40 transition-all group space-y-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-terra-amber flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-terra-text-primary flex items-center justify-between">
                <span>Meeting Engine</span>
                <ChevronRight className="w-4 h-4 text-terra-text-tertiary group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-terra-text-secondary leading-relaxed">
                Live agenda synchronization, speech role taking, functionary tracking, and instant 1-click WhatsApp briefings.
              </p>
            </div>
          </Link>

          {/* Card 2: Contests */}
          <Link
            href="/contests"
            className="p-6 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-card hover:border-terra-amber/40 transition-all group space-y-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-terra-rose flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-terra-text-primary flex items-center justify-between">
                <span>Speech Contests Arena</span>
                <ChevronRight className="w-4 h-4 text-terra-text-tertiary group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-terra-text-secondary leading-relaxed">
                Contest Chair & Chief Judge portals with confidential tiebreaker judge protection and contestant order drawing.
              </p>
            </div>
          </Link>

          {/* Card 3: Live Tools */}
          <Link
            href="/tools/timer"
            className="p-6 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-card hover:border-terra-amber/40 transition-all group space-y-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-terra-text-primary flex items-center justify-between">
                <span>Live Functionary Tools</span>
                <ChevronRight className="w-4 h-4 text-terra-text-tertiary group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-terra-text-secondary leading-relaxed">
                Full-screen visual speech timer card, Ah-Counter word counters, and instant report copy for meeting functionaries.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. CLUB EXCOMM LEADERSHIP */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-terra-text-tertiary">
            Executive Leadership
          </span>
          <h2 className="font-display font-bold text-2xl tracking-tight text-terra-text-primary">
            Terra Executive Committee (ExComm)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "TM Aadhya", role: "Club President", initials: "TM Aadhya" },
            { name: "TM Swayam", role: "VP Education", initials: "TM Swayam" },
            { name: "TM Rohit", role: "Immediate Past President", initials: "TM Rohit" },
            { name: "TM Samarth", role: "VP Membership", initials: "TM Samarth" },
            { name: "TM Sanchana", role: "VP Public Relations", initials: "TM Sanchana" },
            { name: "TM Malavika", role: "Club Secretary", initials: "TM Malavika" },
            { name: "TM Gabria", role: "Club Treasurer", initials: "TM Gabria" },
            { name: "TM Kavya", role: "Sergeant at Arms", initials: "TM Kavya" },
          ].map((ex) => (
            <div
              key={ex.name}
              className="p-4 rounded-2xl bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.06] text-center space-y-2"
            >
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ex.initials)}`}
                alt={ex.name}
                className="w-12 h-12 rounded-full mx-auto object-cover border border-black/10 dark:border-white/10"
              />
              <div>
                <p className="text-xs font-bold text-terra-text-primary">{ex.name}</p>
                <p className="text-[10px] text-terra-amber font-medium">{ex.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GUEST & MEMBER PORTAL BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-[#18181B] dark:bg-white text-white dark:text-black text-center space-y-4">
          <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
            Ready to Speak with Confidence?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-700 max-w-lg mx-auto">
            Join Terra Toastmasters as a guest or access your member credentials to log your speeches, claim agenda roles, and track your Pathways milestones.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/login"
              className="px-6 py-2.5 rounded-xl bg-terra-amber text-white font-semibold text-xs shadow-sm hover:bg-terra-amber/90 active:scale-95 transition-all"
            >
              Access Member Portal
            </Link>
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-xl bg-white/10 dark:bg-black/10 text-white dark:text-black font-semibold text-xs hover:bg-white/20 dark:hover:bg-black/20 active:scale-95 transition-all"
            >
              Upcoming Club Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
