"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import {
  Search,
  Calendar,
  Trophy,
  Users,
  Image as ImageIcon,
  Sparkles,
  Shield,
  Clock,
  X,
} from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { meetings, users, contests } = useTerraStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filteredMeetings = meetings.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.theme.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMembers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContests = contests.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <Search className="w-5 h-5 text-terra-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command, meeting, member or contest..."
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-terra-text-tertiary"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-terra-text-tertiary hover:text-terra-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Shortcuts */}
          {search === "" && (
            <div>
              <p className="px-2 text-[10px] font-semibold text-terra-text-tertiary uppercase tracking-wider mb-1.5">
                Quick Navigation
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigate("/portal")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-terra-amber" />
                  <span className="font-medium">Member Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigate("/meetings")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-terra-emerald" />
                  <span className="font-medium">Meeting Schedule & Open Roles</span>
                </button>
                <button
                  onClick={() => handleNavigate("/contests")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Trophy className="w-4 h-4 text-terra-rose" />
                  <span className="font-medium">Contest Registrations & Hall of Fame</span>
                </button>
                <button
                  onClick={() => handleNavigate("/gallery")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-terra-blue" />
                  <span className="font-medium">Photo Archive & Albums</span>
                </button>
                <button
                  onClick={() => handleNavigate("/tools/timer")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Speech Timer & Signal Card</span>
                </button>
                <button
                  onClick={() => handleNavigate("/tools/ah-counter")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-terra-amber" />
                  <span className="font-medium">Ah-Counter & Word Tracker</span>
                </button>
                <button
                  onClick={() => handleNavigate("/analytics")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Trophy className="w-4 h-4 text-terra-blue" />
                  <span className="font-medium">Club Milestones & DCP Analytics</span>
                </button>
                <button
                  onClick={() => handleNavigate("/admin/members")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Member & Role Access Studio</span>
                </button>
                <button
                  onClick={() => handleNavigate("/admin/meetings/manage")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">Officer Roster & Role Override</span>
                </button>
              </div>
            </div>
          )}

          {/* Meetings List */}
          {filteredMeetings.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-semibold text-terra-text-tertiary uppercase tracking-wider mb-1.5">
                Meetings
              </p>
              <div className="space-y-1">
                {filteredMeetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleNavigate(`/meetings/${m.slug}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-terra-emerald" />
                      <div>
                        <span className="font-semibold block">{m.title}</span>
                        <span className="text-[11px] text-terra-text-tertiary">
                          {m.meetingDate} • Theme: {m.theme}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                      View Roster
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contests List */}
          {filteredContests.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-semibold text-terra-text-tertiary uppercase tracking-wider mb-1.5">
                Contests
              </p>
              <div className="space-y-1">
                {filteredContests.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleNavigate(`/contests/${c.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-terra-amber" />
                      <div>
                        <span className="font-semibold block">{c.title}</span>
                        <span className="text-[11px] text-terra-text-tertiary">
                          {c.contestDate} • {c.participants.length}/{c.maxContestants} Registered
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Members List */}
          {filteredMembers.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-semibold text-terra-text-tertiary uppercase tracking-wider mb-1.5">
                Members
              </p>
              <div className="space-y-1">
                {filteredMembers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleNavigate("/members")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold block">{u.name}</span>
                        <span className="text-[11px] text-terra-text-tertiary">
                          {u.executiveTitle || (u.pathwayName ? `${u.pathwayName} (Level ${u.pathwayLevel || 1})` : `@${u.username}`)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-terra-text-tertiary">
          <span>Navigate with ⌘K</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
