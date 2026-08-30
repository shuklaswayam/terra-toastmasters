"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Trophy,
  Calendar,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Plus,
  X,
  Shield,
  UserCheck,
  UserPlus,
  Volume2,
  Lock,
  Globe,
  Copy,
  Printer,
  ChevronRight,
  Edit3,
  Trash2,
  Share2,
} from "lucide-react";
import { ContestCategory, ContestRoleAssignment, ContestRoleKey, User } from "@/lib/types";
import { contestCreationSchema, contestRoleAssignmentSchema, sanitizeText } from "@/lib/validations";
import { AlertCircle } from "lucide-react";

export default function ContestHubPage() {
  const {
    contests,
    currentUser,
    users,
    registerContest,
    createContest,
    updateContestRoleAssignment,
    clearContestRoleAssignment,
    appointContestLeadership,
    getSanitizedContestRoles,
  } = useTerraStore();

  const [activeTab, setActiveTab] = useState<"entries" | "hosting">("entries");
  const [selectedCategory, setSelectedCategory] = useState<ContestCategory | "all">("all");
  const [selectedHostingContestId, setSelectedHostingContestId] = useState<string | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<{
    contestId: string;
    role: ContestRoleAssignment;
  } | null>(null);
  const [registerContestId, setRegisterContestId] = useState<string | null>(null);
  const [speechTitleInput, setSpeechTitleInput] = useState("");
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const [createContestError, setCreateContestError] = useState<string | null>(null);
  const [roleAssignError, setRoleAssignError] = useState<string | null>(null);

  // New Contest Form State (Admin)
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ContestCategory>("humorous");
  const [newDate, setNewDate] = useState("2026-09-26");
  const [newMaxContestants, setNewMaxContestants] = useState(8);
  const [newLocation, setNewLocation] = useState("Terra Club Stage & Zoom Live");
  const [newChairId, setNewChairId] = useState("");
  const [newChiefJudgeId, setNewChiefJudgeId] = useState("");
  const [newContestMasterId, setNewContestMasterId] = useState("");
  const [newTestSpeakerCount, setNewTestSpeakerCount] = useState<0 | 1 | 2>(1);
  const [newNotes, setNewNotes] = useState("");

  // Role Assignment State
  const [assignMode, setAssignMode] = useState<"club" | "guest">("club");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestClub, setGuestClub] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [roleNotes, setRoleNotes] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(true);

  // Active hosting contest & sanitized roles
  const currentHostingContest =
    contests.find((c) => c.id === selectedHostingContestId) || contests[0];
  const hostingRoleAssignments = currentHostingContest
    ? getSanitizedContestRoles(currentHostingContest.id)
    : [];

  const filteredContests = contests.filter(
    (c) => selectedCategory === "all" || c.category === selectedCategory
  );

  const completedContests = contests.filter((c) => c.status === "completed");

  const isAdmin = currentUser?.role === "admin";
  const isCC = currentHostingContest && currentUser?.id === currentHostingContest.chairId;
  const isCJ = currentHostingContest && currentUser?.id === currentHostingContest.chiefJudgeId;

  // Handle register contestant
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerContestId) {
      registerContest(registerContestId, sanitizeText(speechTitleInput));
      setRegisterContestId(null);
      setSpeechTitleInput("");
    }
  };

  // Handle schedule contest submit (Admin only)
  const handleCreateContestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateContestError(null);

    const chairUser = users.find((u) => u.id === newChairId);
    const cjUser = users.find((u) => u.id === newChiefJudgeId);
    const cmUser = users.find((u) => u.id === newContestMasterId);

    const validation = contestCreationSchema.safeParse({
      title: (newTitle.trim() || "Terra Annual Speech Contest"),
      category: newCategory,
      level: "club",
      contestDate: newDate,
      locationName: newLocation.trim() || "Terra Club Stage",
      chairName: chairUser?.name || "TM Rohit",
      chiefJudgeName: cjUser?.name || "TM Aadhya",
      contestMasterName: cmUser?.name || undefined,
      testSpeakerCount: newCategory === "evaluation" ? newTestSpeakerCount : 0,
    });

    if (!validation.success) {
      setCreateContestError(validation.error.issues[0]?.message || "Invalid contest parameters.");
      return;
    }

    const created = createContest({
      title: sanitizeText(newTitle) || "Terra Annual Speech Contest",
      category: newCategory,
      contestDate: newDate,
      maxContestants: Number(newMaxContestants),
      locationName: sanitizeText(newLocation),
      testSpeakerCount: newCategory === "evaluation" ? newTestSpeakerCount : 0,
      chairId: newChairId,
      chairName: chairUser?.name || "TM Rohit",
      chiefJudgeId: newChiefJudgeId,
      chiefJudgeName: cjUser?.name || "TM Aadhya",
      contestMasterId: newContestMasterId,
      contestMasterName: cmUser?.name || "TM Aarav",
      notes: sanitizeText(newNotes),
    });

    setSelectedHostingContestId(created.id);
    setShowCreateModal(false);
    setNewTitle("");
    setActiveTab("hosting");
  };

  // Open edit role modal
  const openEditRoleModal = (contestId: string, role: ContestRoleAssignment) => {
    setEditingRole({ contestId, role });
    setRoleAssignError(null);
    if (role.isGuest) {
      setAssignMode("guest");
      setGuestName(role.guestName || "");
      setGuestClub(role.guestClub || "");
      setGuestEmail(role.guestEmail || "");
      setGuestPhone(role.guestPhone || "");
      setSelectedMemberId("");
    } else {
      setAssignMode("club");
      setSelectedMemberId(role.userId || "");
      setGuestName("");
      setGuestClub("");
      setGuestEmail("");
      setGuestPhone("");
    }
    setRoleNotes(role.notes || "");
    setIsConfirmed(role.isConfirmed !== false);
  };

  // Save role assignment
  const handleSaveRoleAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    setRoleAssignError(null);

    const isGuest = assignMode === "guest";
    const validation = contestRoleAssignmentSchema.safeParse({
      isGuest,
      clubMemberId: !isGuest ? selectedMemberId : undefined,
      guestName: isGuest ? guestName.trim() : undefined,
      guestClub: isGuest ? guestClub.trim() || undefined : undefined,
      guestPhone: isGuest && guestPhone.trim() ? guestPhone.trim() : undefined,
      guestEmail: isGuest && guestEmail.trim() ? guestEmail.trim() : undefined,
      notes: roleNotes.trim() || undefined,
    });

    if (!validation.success) {
      setRoleAssignError(validation.error.issues[0]?.message || "Invalid role assignment details.");
      return;
    }

    if (assignMode === "club") {
      const member = users.find((u) => u.id === selectedMemberId);
      if (!member) {
        setRoleAssignError("Selected member not found in club directory.");
        return;
      }

      updateContestRoleAssignment(editingRole.contestId, editingRole.role.roleKey, {
        userId: member.id,
        userName: member.name,
        userAvatar: member.avatar,
        isGuest: false,
        guestName: undefined,
        guestClub: undefined,
        guestEmail: undefined,
        guestPhone: undefined,
        notes: sanitizeText(roleNotes),
        isConfirmed,
      });
    } else {
      updateContestRoleAssignment(editingRole.contestId, editingRole.role.roleKey, {
        userId: null,
        userName: `${sanitizeText(guestName)} (Guest)`,
        userAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestName)}`,
        isGuest: true,
        guestName: sanitizeText(guestName),
        guestClub: sanitizeText(guestClub) || "Visiting Toastmaster",
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        notes: sanitizeText(roleNotes),
        isConfirmed,
      });
    }

    setEditingRole(null);
  };

  // Copy WhatsApp Briefing Sheet
  const handleCopyWhatsAppBriefing = () => {
    if (!currentHostingContest) return;
    const ccRoles = hostingRoleAssignments.filter((r) => r.recruitedBy === "cc");
    const cjRoles = hostingRoleAssignments.filter((r) => r.recruitedBy === "cj");

    let text = `🏆 *TERRA TOASTMASTERS — CONTEST HOSTING ROSTER* 🏆\n`;
    text += `*Contest:* ${currentHostingContest.title}\n`;
    text += `*Date & Time:* ${currentHostingContest.contestDate}\n`;
    text += `*Venue:* ${currentHostingContest.locationName}\n\n`;

    text += `👑 *LEADERSHIP TEAM*\n`;
    text += `• *Contest Chair (CC):* ${currentHostingContest.chairName}\n`;
    text += `• *Chief Judge (CJ):* ${currentHostingContest.chiefJudgeName}\n`;
    if (currentHostingContest.contestMasterName) {
      text += `• *Contest Master (CM):* ${currentHostingContest.contestMasterName}\n`;
    }
    text += `\n`;

    text += `📋 *CONTEST CHAIR TEAM (Recruited by CC)*\n`;
    ccRoles.forEach((r) => {
      const assignee = r.isGuest ? `${r.guestName} (${r.guestClub})` : r.userName || "Vacant / Open";
      text += `• ${r.roleLabel}: ${assignee} ${r.isConfirmed ? "✅" : "⏳"}\n`;
    });
    text += `\n`;

    text += `⚖️ *CHIEF JUDGE TEAM (Recruited by CJ)*\n`;
    cjRoles.forEach((r) => {
      if (r.roleKey === "tiebreaker_judge") {
        text += `• ${r.roleLabel}: [CONFIDENTIAL TO CHIEF JUDGE] 🔒\n`;
      } else {
        const assignee = r.isGuest ? `${r.guestName} (${r.guestClub})` : r.userName || "Vacant / Open";
        text += `• ${r.roleLabel}: ${assignee} ${r.isConfirmed ? "✅" : "⏳"}\n`;
      }
    });

    navigator.clipboard.writeText(text);
    alert("WhatsApp Contest Briefing Roster copied to clipboard!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Club Contest Hub
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            Host speech championships, recruit roleplayers, and manage contestant registrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Tab Switcher */}
          <div className="flex items-center p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
            <button
              onClick={() => setActiveTab("entries")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "entries"
                  ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                  : "text-terra-text-secondary hover:text-terra-text-primary"
              }`}
            >
              🏆 Contests & Entries
            </button>
            <button
              onClick={() => setActiveTab("hosting")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "hosting"
                  ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                  : "text-terra-text-secondary hover:text-terra-text-primary"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-terra-amber" />
              <span>Hosting & Role Roster</span>
            </button>
          </div>

          {/* Admin Schedule Contest Trigger */}
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
              title="Admin: Schedule Contest & Appoint Leadership"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Host Contest</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONTEST ENTRIES & OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === "entries" && (
        <div className="space-y-6">
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-1 p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-full border border-black/[0.04] dark:border-white/[0.06] w-fit">
            {[
              { id: "all", name: "All Contests" },
              { id: "international", name: "International Speech" },
              { id: "table_topics", name: "Table Topics" },
              { id: "evaluation", name: "Evaluation" },
              { id: "humorous", name: "Humorous Speech" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as ContestCategory | "all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                    : "text-terra-text-secondary hover:text-terra-text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Contests Grid */}
          {filteredContests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredContests.map((contest) => {
                const isRegistered =
                  !!currentUser &&
                  contest.participants.some((p) => p.userId === currentUser.id);

                return (
                  <div
                    key={contest.id}
                    className="p-6 rounded-3xl terra-glass-card space-y-4 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-terra-amber/10 text-terra-amber text-xs font-semibold uppercase tracking-wider">
                          {contest.category.replace("_", " ")}
                        </span>
                        {contest.status === "closing_soon" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-xs font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Closes Soon</span>
                          </span>
                        )}
                        {contest.status === "open" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                            Open for Entries
                          </span>
                        )}
                        {contest.status === "completed" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] text-terra-text-tertiary text-xs">
                            Completed & Scored
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-xl tracking-tight">
                          {contest.title}
                        </h3>
                        <p className="text-xs text-terra-text-secondary mt-1">
                          CC: <strong className="text-terra-text-primary">{contest.chairName}</strong> • CJ:{" "}
                          <strong className="text-terra-text-primary">{contest.chiefJudgeName}</strong>
                          {contest.contestMasterName && (
                            <span> • CM: <strong className="text-terra-text-primary">{contest.contestMasterName}</strong></span>
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-terra-text-secondary pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-terra-amber" />
                          <span>{contest.contestDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-terra-amber" />
                          <span>
                            {contest.participants.length} / {contest.maxContestants} Registered
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-terra-text-tertiary italic bg-black/[0.02] dark:bg-white/[0.02] p-2.5 rounded-xl">
                        Eligibility: {contest.eligibilityNotes}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between gap-3">
                      {isRegistered ? (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Registered as Contestant</span>
                        </span>
                      ) : contest.status !== "completed" ? (
                        <button
                          onClick={() => setRegisterContestId(contest.id)}
                          className="px-4 py-1.5 rounded-full bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                        >
                          Register as Candidate
                        </button>
                      ) : (
                        <span className="text-xs text-terra-text-tertiary">Contest Concluded</span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedHostingContestId(contest.id);
                            setActiveTab("hosting");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-terra-amber/10 text-terra-amber text-xs font-semibold hover:bg-terra-amber/20 transition-all flex items-center gap-1"
                        >
                          <span>Role Roster</span>
                        </button>
                        <Link
                          href={`/contests/${contest.id}`}
                          className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.08] transition-all flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-3xl bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl">No Contests Scheduled</h3>
                <p className="text-xs text-terra-text-secondary leading-relaxed">
                  No active speech championships found in this category. The Admin can create a contest and appoint CC, CJ, and CM.
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Contest to Host</span>
                </button>
              )}
            </div>
          )}

          {/* Hall of Fame Podium for Completed Contests */}
          {completedContests.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-black/[0.04] dark:border-white/[0.04]">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-terra-amber" />
                  <span>Contest Hall of Fame</span>
                </h2>
                <p className="text-xs text-terra-text-secondary mt-0.5">
                  Celebrating Terra's past speech and table topics champions.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HOSTING & ROLE ROSTER STUDIO */}
      {/* ========================================================================= */}
      {activeTab === "hosting" && (
        <div className="space-y-6">
          {contests.length === 0 ? (
            <div className="py-16 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl">No Hosted Contest Active</h3>
                <p className="text-xs text-terra-text-secondary leading-relaxed">
                  The Admin creates the contest and appoints the Contest Chair (CC), Chief Judge (CJ), and Contest Master (CM) from club members. Once appointed, the CC and CJ log in to recruit their roleplayers.
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Contest & Appoint Leadership</span>
                </button>
              )}
            </div>
          ) : (
            currentHostingContest && (
              <>
                {/* Contest Selector Header & Quick Export */}
                <div className="p-6 rounded-3xl terra-glass-card space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-terra-amber/15 text-terra-amber flex items-center justify-center font-bold">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display font-bold text-lg">{currentHostingContest.title}</h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-terra-amber/15 text-terra-amber text-[10px] font-bold uppercase tracking-wider">
                            {currentHostingContest.category.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-terra-text-secondary mt-0.5">
                          {currentHostingContest.contestDate} • {currentHostingContest.locationName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {contests.length > 1 && (
                        <select
                          value={selectedHostingContestId || ""}
                          onChange={(e) => setSelectedHostingContestId(e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold focus:outline-none"
                        >
                          {contests.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={handleCopyWhatsAppBriefing}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                        title="Copy formatted WhatsApp briefing roster"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copy Briefing</span>
                      </button>
                    </div>
                  </div>

                  {/* Leadership Pod */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                    {/* Contest Chair Card */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 tracking-wider">
                          Contest Chair (CC)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] font-semibold">
                          {currentHostingContest.category === "evaluation"
                            ? `Recruiting ${5 + (currentHostingContest.testSpeakerCount || 1)} Roles`
                            : "Recruiting 5 Roles"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs">
                          CC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-terra-text-primary">
                            {currentHostingContest.chairName}
                          </p>
                          <p className="text-[10px] text-terra-text-tertiary">
                            {currentHostingContest.category === "evaluation"
                              ? "Recruits: Timers, SAAs, PR, Test Speaker"
                              : "Recruits: Timers, SAAs, PR Chair"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chief Judge Card */}
                    <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                          Chief Judge (CJ)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-200 text-[10px] font-semibold">
                          Recruiting 8 Roles
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-700 flex items-center justify-center font-bold text-xs">
                          CJ
                        </div>
                        <div>
                          <p className="text-xs font-bold text-terra-text-primary">
                            {currentHostingContest.chiefJudgeName}
                          </p>
                          <p className="text-[10px] text-terra-text-tertiary">
                            Recruits: 5 Judges, Tiebreaker, Ballot Counters
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contest Master Card */}
                    <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                          Contest Master (CM)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-800 dark:text-purple-200 text-[10px] font-semibold">
                          Stage Lead
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-700 flex items-center justify-center font-bold text-xs">
                          CM
                        </div>
                        <div>
                          <p className="text-xs font-bold text-terra-text-primary">
                            {currentHostingContest.contestMasterName || "Appointed Member"}
                          </p>
                          <p className="text-[10px] text-terra-text-tertiary">
                            Stage introductions & candidate briefings
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contextual User Access Callout */}
                  <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-terra-amber" />
                      {isAdmin ? (
                        <span>
                          <strong>Admin Master Access:</strong> You have permission to manage all CC & CJ roleplayers, edit contest logistics, and re-appoint leadership.
                        </span>
                      ) : isCC ? (
                        <span className="text-amber-800 dark:text-amber-300 font-medium">
                          <strong>Contest Chair Portal:</strong> You are logged in as CC. You can assign your {currentHostingContest.category === "evaluation" ? "Timers, SAAs, PR Chair, and Test Speakers" : "Timers, SAAs, and PR Chair"} below.
                        </span>
                      ) : isCJ ? (
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                          <strong>Chief Judge Portal:</strong> You are logged in as CJ. You can recruit your 5 Voting Judges, confidential Tiebreaker Judge, and 2 Ballot Counters below.
                        </span>
                      ) : (
                        <span className="text-terra-text-secondary">
                          <strong>Club Roster View:</strong> View-only role roster for upcoming speech contest. Tiebreaker judge identity is kept strictly confidential.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* TWO COLUMN RECRUITMENT SQUADS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* SQUAD 1: CONTEST CHAIR (CC) SQUAD */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-base">Contest Chair (CC) Team</h3>
                          <p className="text-[11px] text-terra-text-secondary">
                            {currentHostingContest.category === "evaluation"
                              ? "Timers, Sergeant at Arms, PR Chair, and Test Speakers"
                              : "Timers, Sergeant at Arms, and PR Chair"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-semibold">
                        Recruited by CC {currentHostingContest.chairName}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {hostingRoleAssignments
                        .filter((r) => r.recruitedBy === "cc")
                        .map((role) => {
                          const canEdit = isAdmin || isCC;
                          const isAssigned = !!(role.userId || role.guestName);

                          return (
                            <div
                              key={role.id}
                              className={`p-3.5 rounded-2xl border transition-all ${
                                isAssigned
                                  ? "bg-white dark:bg-[#161618] border-black/[0.08] dark:border-white/[0.08] shadow-xs"
                                  : "bg-black/[0.02] dark:bg-white/[0.02] border-dashed border-black/[0.12] dark:border-white/[0.12]"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-terra-text-primary">
                                      {role.roleLabel}
                                    </span>
                                    {role.isGuest && (
                                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-semibold flex items-center gap-1">
                                        <Globe className="w-2.5 h-2.5" />
                                        <span>Visiting Roleplayer</span>
                                      </span>
                                    )}
                                    {isAssigned && role.isConfirmed && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-0.5">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        <span>Confirmed</span>
                                      </span>
                                    )}
                                  </div>

                                  {isAssigned ? (
                                    <div>
                                      <p className="text-xs font-semibold text-terra-text-primary">
                                        {role.isGuest ? role.guestName : role.userName}
                                      </p>
                                      {role.isGuest && role.guestClub && (
                                        <p className="text-[11px] text-terra-text-secondary">
                                          Club: {role.guestClub}
                                        </p>
                                      )}
                                      {role.notes && (
                                        <p className="text-[10px] text-terra-text-tertiary italic">
                                          Note: {role.notes}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-terra-text-tertiary italic">
                                      Unassigned slot — awaiting CC appointment
                                    </p>
                                  )}
                                </div>

                                {canEdit && (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => openEditRoleModal(currentHostingContest.id, role)}
                                      className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-xs font-semibold text-terra-text-primary transition-colors flex items-center gap-1"
                                    >
                                      <Edit3 className="w-3 h-3 text-terra-amber" />
                                      <span>{isAssigned ? "Change" : "Assign"}</span>
                                    </button>

                                    {isAssigned && (
                                      <button
                                        onClick={() =>
                                          clearContestRoleAssignment(
                                            currentHostingContest.id,
                                            role.roleKey
                                          )
                                        }
                                        className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-terra-text-tertiary hover:text-rose-600 transition-colors"
                                        title="Clear slot"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* SQUAD 2: CHIEF JUDGE (CJ) SQUAD */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-base">Chief Judge (CJ) Team</h3>
                          <p className="text-[11px] text-terra-text-secondary">
                            5 Voting Judges, 1 Confidential Tiebreaker, and 2 Ballot Counters
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 font-semibold">
                        Recruited by CJ {currentHostingContest.chiefJudgeName}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {hostingRoleAssignments
                        .filter((r) => r.recruitedBy === "cj")
                        .map((role) => {
                          const canEdit = isAdmin || isCJ;
                          const isAssigned = !!(role.userId || role.guestName);
                          const isConfidentialTiebreaker = role.roleKey === "tiebreaker_judge";
                          const canViewConfidential = isAdmin || isCJ;

                          return (
                            <div
                              key={role.id}
                              className={`p-3.5 rounded-2xl border transition-all ${
                                isConfidentialTiebreaker
                                  ? "bg-amber-500/[0.03] border-amber-500/30"
                                  : isAssigned
                                  ? "bg-white dark:bg-[#161618] border-black/[0.08] dark:border-white/[0.08] shadow-xs"
                                  : "bg-black/[0.02] dark:bg-white/[0.02] border-dashed border-black/[0.12] dark:border-white/[0.12]"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-terra-text-primary">
                                      {role.roleLabel}
                                    </span>
                                    {isConfidentialTiebreaker && (
                                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                                        <Lock className="w-2.5 h-2.5" />
                                        <span>Confidential to CJ</span>
                                      </span>
                                    )}
                                    {role.isGuest && (
                                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-semibold flex items-center gap-1">
                                        <Globe className="w-2.5 h-2.5" />
                                        <span>Visiting Judge</span>
                                      </span>
                                    )}
                                    {isAssigned && role.isConfirmed && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-0.5">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        <span>Confirmed</span>
                                      </span>
                                    )}
                                  </div>

                                  {isConfidentialTiebreaker && !canViewConfidential ? (
                                    <p className="text-xs text-terra-text-tertiary italic flex items-center gap-1">
                                      <Lock className="w-3 h-3" />
                                      <span>Identity strictly concealed per Toastmasters Contest Rulebook</span>
                                    </p>
                                  ) : isAssigned ? (
                                    <div>
                                      <p className="text-xs font-semibold text-terra-text-primary">
                                        {role.isGuest ? role.guestName : role.userName}
                                      </p>
                                      {role.isGuest && role.guestClub && (
                                        <p className="text-[11px] text-terra-text-secondary">
                                          Club: {role.guestClub}
                                        </p>
                                      )}
                                      {role.notes && (
                                        <p className="text-[10px] text-terra-text-tertiary italic">
                                          Note: {role.notes}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-terra-text-tertiary italic">
                                      Unassigned slot — awaiting CJ appointment
                                    </p>
                                  )}
                                </div>

                                {canEdit && (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => openEditRoleModal(currentHostingContest.id, role)}
                                      className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-xs font-semibold text-terra-text-primary transition-colors flex items-center gap-1"
                                    >
                                      <Edit3 className="w-3 h-3 text-blue-500" />
                                      <span>{isAssigned ? "Change" : "Assign"}</span>
                                    </button>

                                    {isAssigned && (
                                      <button
                                        onClick={() =>
                                          clearContestRoleAssignment(
                                            currentHostingContest.id,
                                            role.roleKey
                                          )
                                        }
                                        className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-terra-text-tertiary hover:text-rose-600 transition-colors"
                                        title="Clear slot"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROLE APPOINTMENT MODAL (CLUB MEMBER VS VISITING GUEST) */}
      {/* ========================================================================= */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <h3 className="font-display font-bold text-base">
                  Assign: {editingRole.role.roleLabel}
                </h3>
                <p className="text-xs text-terra-text-secondary mt-0.5">
                  Recruiting for {editingRole.role.recruitedBy === "cc" ? "Contest Chair Team" : "Chief Judge Team"}
                </p>
              </div>
              <button
                onClick={() => setEditingRole(null)}
                className="p-1 rounded-full text-terra-text-tertiary hover:text-terra-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {roleAssignError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{roleAssignError}</span>
              </div>
            )}

            {/* Selection Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setAssignMode("club")}
                className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  assignMode === "club"
                    ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                    : "text-terra-text-secondary hover:text-terra-text-primary"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Club Member</span>
              </button>
              <button
                type="button"
                onClick={() => setAssignMode("guest")}
                className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  assignMode === "guest"
                    ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                    : "text-terra-text-secondary hover:text-terra-text-primary"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visiting Guest Roleplayer</span>
              </button>
            </div>

            <form onSubmit={handleSaveRoleAssignment} className="space-y-4">
              {assignMode === "club" ? (
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold text-terra-text-secondary">
                    Select Club Member
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 font-medium"
                  >
                    <option value="">-- Choose Member from Terra Roster --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.executiveTitle || `${u.role}`}) • {u.speechesDelivered} speeches
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <div>
                    <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                      Guest Roleplayer Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. TM Rahul Saxena, DTM"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                        Home Club / District
                      </label>
                      <input
                        type="text"
                        value={guestClub}
                        onChange={(e) => setGuestClub(e.target.value)}
                        placeholder="e.g. Inspira TM (District 98)"
                        className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest.speaker@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Notes / Special Instructions */}
              <div>
                <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                  Briefing Notes / Instructions
                </label>
                <input
                  type="text"
                  value={roleNotes}
                  onChange={(e) => setRoleNotes(e.target.value)}
                  placeholder="e.g. Arrive 15 mins prior for Chief Judge briefing"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                />
              </div>

              {/* Status Confirmation Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="confirmCheck"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-terra-amber focus:ring-terra-amber"
                />
                <label htmlFor="confirmCheck" className="text-xs font-medium text-terra-text-primary">
                  Mark Roleplayer as Confirmed
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN SCHEDULE CONTEST & APPOINT LEADERSHIP MODAL */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>Host Speech Contest & Appoint Leadership</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            {createContestError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{createContestError}</span>
              </div>
            )}

            <form onSubmit={handleCreateContestSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                  Contest Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Terra Annual International Speech & Evaluation Contest 2026"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className={`grid gap-3 ${newCategory === "evaluation" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                <div>
                  <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ContestCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                  >
                    <option value="international">International Speech</option>
                    <option value="evaluation">Evaluation Contest</option>
                    <option value="humorous">Humorous Speech</option>
                    <option value="table_topics">Table Topics</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                    Max Contestants
                  </label>
                  <input
                    type="number"
                    value={newMaxContestants}
                    onChange={(e) => setNewMaxContestants(Number(e.target.value))}
                    min={2}
                    max={20}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                  />
                </div>

                {newCategory === "evaluation" && (
                  <div>
                    <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                      Test Speakers (Evaluation)
                    </label>
                    <select
                      value={newTestSpeakerCount}
                      onChange={(e) => setNewTestSpeakerCount(Number(e.target.value) as 1 | 2)}
                      className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                    >
                      <option value={1}>1 Test Speaker</option>
                      <option value={2}>2 Test Speakers</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                    Contest Date & Time *
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. 2026-09-20 18:30 IST"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                    Location / Hybrid Zoom
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Terra Main Hall & Hybrid Zoom"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Appoint Leadership from Club */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary block">
                  Appoint Contest Leadership (From Club Roster)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-amber-700 dark:text-amber-300 block mb-1">
                      👑 Contest Chair (CC) *
                    </label>
                    <select
                      value={newChairId}
                      onChange={(e) => setNewChairId(e.target.value)}
                      required
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none font-medium"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-700 dark:text-blue-300 block mb-1">
                      ⚖️ Chief Judge (CJ) *
                    </label>
                    <select
                      value={newChiefJudgeId}
                      onChange={(e) => setNewChiefJudgeId(e.target.value)}
                      required
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none font-medium"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 block mb-1">
                      🎤 Contest Master (CM)
                    </label>
                    <select
                      value={newContestMasterId}
                      onChange={(e) => setNewContestMasterId(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none font-medium"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
                >
                  Publish & Open Roles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANDIDATE REGISTRATION MODAL */}
      {/* ========================================================================= */}
      {registerContestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-base">Register as Contest Candidate</h3>
              <button onClick={() => setRegisterContestId(null)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-terra-text-secondary">
                  Contest Speech Title (Working Title)
                </label>
                <input
                  type="text"
                  value={speechTitleInput}
                  onChange={(e) => setSpeechTitleInput(e.target.value)}
                  placeholder="e.g. Beyond the Horizon"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-terra-text-secondary">
                <p className="font-semibold text-terra-amber">Eligibility Verification:</p>
                <p className="text-[11px] mt-0.5">
                  By registering, you confirm you are an active member in good standing with completed required pathway projects.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRegisterContestId(null)}
                  className="w-1/2 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
