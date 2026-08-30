"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import {
  Home,
  Calendar,
  Trophy,
  Image as ImageIcon,
  User,
  Radio,
  Wrench,
  Shield,
  Clock,
  Volume2,
  Users,
  Megaphone,
  X,
  Printer,
  Sparkles,
} from "lucide-react";
import { InMeetingAssistant } from "../in-meeting/InMeetingAssistant";

export function MobileNav() {
  const pathname = usePathname();
  const { currentUser } = useTerraStore();
  const [showAssistant, setShowAssistant] = useState(false);
  const [showToolsSheet, setShowToolsSheet] = useState(false);

  if (pathname === "/auth/login") return null;

  const isExCommOrAdmin = currentUser?.role === "admin" || currentUser?.role === "officer";

  const tabs = [
    { name: currentUser ? "Dashboard" : "Home", href: currentUser ? "/portal" : "/", icon: Home },
    { name: "Meetings", href: "/meetings", icon: Calendar },
    { name: "Tools", href: "#tools", icon: Wrench, isAction: true },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: currentUser ? "Profile" : "Sign In", href: currentUser ? "/portal/profile" : "/auth/login", icon: User },
  ];

  return (
    <>
      {/* Floating In-Meeting Quick Action Pill on Mobile */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setShowAssistant(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-terra-amber text-white shadow-float active:scale-95 transition-all text-xs font-semibold"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Live Stage</span>
        </button>
      </div>

      {/* Fixed Bottom Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 terra-glass border-t border-black/[0.08] dark:border-white/[0.08] px-2 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.isAction
                ? showToolsSheet
                : pathname === tab.href ||
                  (tab.href !== "/portal" && pathname.startsWith(tab.href));

            if (tab.isAction) {
              return (
                <button
                  key={tab.name}
                  onClick={() => setShowToolsSheet(true)}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    isActive
                      ? "text-terra-amber font-semibold"
                      : "text-terra-text-secondary hover:text-terra-text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{tab.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? "text-terra-amber font-semibold"
                    : "text-terra-text-secondary hover:text-terra-text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Tools & Admin Action Sheet */}
      {showToolsSheet && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-t-3xl bg-white dark:bg-[#161618] border-t border-black/[0.08] dark:border-white/[0.08] p-6 space-y-5 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-terra-amber" />
                <h3 className="font-display font-bold text-base">Meeting Tools & Console</h3>
              </div>
              <button
                onClick={() => setShowToolsSheet(false)}
                className="p-1 rounded-full text-terra-text-tertiary hover:text-terra-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Functionary Tools */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary block">
                Meeting Functionary Tools
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/tools/timer"
                  onClick={() => setShowToolsSheet(false)}
                  className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2.5"
                >
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs font-semibold">Speech Timer</span>
                    <span className="text-[10px] text-terra-text-tertiary">Stopwatch card</span>
                  </div>
                </Link>

                <Link
                  href="/tools/ah-counter"
                  onClick={() => setShowToolsSheet(false)}
                  className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2.5"
                >
                  <Volume2 className="w-4 h-4 text-terra-amber shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs font-semibold">Ah-Counter</span>
                    <span className="text-[10px] text-terra-text-tertiary">Word & fillers</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Admin Console for ExComm / Admin */}
            {isExCommOrAdmin && (
              <div className="space-y-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    {currentUser?.role === "admin" ? "System Administration" : "Executive Operations"}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                    {currentUser?.role === "admin" ? "Admin" : "Officer"}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/admin/members"
                    onClick={() => setShowToolsSheet(false)}
                    className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3"
                  >
                    <Users className="w-4 h-4 text-terra-amber shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold">Member & Access Management</span>
                      <span className="text-[10px] text-terra-text-tertiary">Manage roster, roles & credentials</span>
                    </div>
                  </Link>

                  <Link
                    href="/admin/meetings/builder"
                    onClick={() => setShowToolsSheet(false)}
                    className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3"
                  >
                    <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold">Agenda Builder Studio</span>
                      <span className="text-[10px] text-terra-text-tertiary">Schedule meetings & allocate timings</span>
                    </div>
                  </Link>

                  <Link
                    href="/admin/announcements"
                    onClick={() => setShowToolsSheet(false)}
                    className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3"
                  >
                    <Megaphone className="w-4 h-4 text-purple-500 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold">Broadcast Announcements</span>
                      <span className="text-[10px] text-terra-text-tertiary">Publish urgent alerts & banners</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* In-Meeting Assistant Drawer */}
      {showAssistant && (
        <InMeetingAssistant onClose={() => setShowAssistant(false)} />
      )}
    </>
  );
}

