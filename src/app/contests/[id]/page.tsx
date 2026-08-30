"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Trophy,
  Calendar,
  Users,
  Shuffle,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Plus,
  Edit3,
  MapPin,
  Clock,
  Shield,
  Lock,
  Globe,
  Trash2,
  Share2,
  Mic,
  AlertCircle,
} from "lucide-react";
import { ContestCategory, ContestParticipant, ContestRoleAssignment, ContestRoleKey, ContestStatus } from "@/lib/types";

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    contests,
    currentUser,
    users,
    registerContest,
    addContestant,
    removeContestant,
    updateContestant,
    updateContest,
    randomizeContestOrder,
    updateContestRoleAssignment,
    clearContestRoleAssignment,
    getSanitizedContestRoles,
  } = useTerraStore();
  const contest = contests.find((c) => c.id === id) || (contests.length > 0 ? contests[0] : null);
  const roleAssignments = contest ? getSanitizedContestRoles(contest.id) : [];

  const [activeSection, setActiveSection] = useState<"roster" | "contestants">("roster");
  const [showRegModal, setShowRegModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [speechTitle, setSpeechTitle] = useState("");

  // Contestant Management State
  const [showAddContestantModal, setShowAddContestantModal] = useState(false);
  const [editingContestant, setEditingContestant] = useState<ContestParticipant | null>(null);
  const [contestantMode, setContestantMode] = useState<"club" | "guest">("club");
  const [contestantMemberId, setContestantMemberId] = useState("");
  const [contestantGuestName, setContestantGuestName] = useState("");
  const [contestantGuestClub, setContestantGuestClub] = useState("");
  const [contestantSpeechTitle, setContestantSpeechTitle] = useState("");
  const [contestantSpeakingOrder, setContestantSpeakingOrder] = useState<number>(1);
  const [contestantError, setContestantError] = useState<string | null>(null);

  // Role Assignment Modal State
  const [editingRole, setEditingRole] = useState<ContestRoleAssignment | null>(null);
  const [assignMode, setAssignMode] = useState<"club" | "guest">("club");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestClub, setGuestClub] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [roleNotes, setRoleNotes] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(true);

  // Edit Form State
  const [editTitle, setEditTitle] = useState(contest?.title || "");
  const [editCategory, setEditCategory] = useState<ContestCategory>(contest?.category || "international");
  const [editDate, setEditDate] = useState(contest?.contestDate || "");
  const [editLocation, setEditLocation] = useState(contest?.locationName || "");
  const [editChairId, setEditChairId] = useState(contest?.chairId || "");
  const [editChiefJudgeId, setEditChiefJudgeId] = useState(contest?.chiefJudgeId || "");
  const [editContestMasterId, setEditContestMasterId] = useState(contest?.contestMasterId || "");
  const [editMaxContestants, setEditMaxContestants] = useState(contest?.maxContestants || 8);
  const [editStatus, setEditStatus] = useState<ContestStatus>(contest?.status || "open");
  const [editEligibility, setEditEligibility] = useState(contest?.eligibilityNotes || "");

  if (!contest) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">Contest Not Found</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            The requested contest session has not been scheduled or was removed.
          </p>
          <div className="pt-2">
            <Link
              href="/contests"
              className="inline-block px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all"
            >
              Back to Contest Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser?.role === "admin";
  const isCC = currentUser?.id === contest.chairId;
  const isCJ = currentUser?.id === contest.chiefJudgeId;

  const isUserRegistered =
    !!currentUser && contest.participants.some((p) => p.userId === currentUser.id);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerContest(contest.id, speechTitle);
    setShowRegModal(false);
    setSpeechTitle("");
  };

  const handleOpenAddContestant = () => {
    setContestantError(null);
    setEditingContestant(null);
    setContestantMode("club");
    setContestantMemberId("");
    setContestantGuestName("");
    setContestantGuestClub("");
    setContestantSpeechTitle("");
    setContestantSpeakingOrder(contest.participants.length + 1);
    setShowAddContestantModal(true);
  };

  const handleOpenEditContestant = (participant: ContestParticipant) => {
    setContestantError(null);
    setEditingContestant(participant);
    setContestantSpeechTitle(participant.speechTitle || "");
    setContestantSpeakingOrder(participant.speakingOrder || 1);
    setShowAddContestantModal(true);
  };

  const handleSaveContestant = (e: React.FormEvent) => {
    e.preventDefault();
    setContestantError(null);

    if (editingContestant) {
      updateContestant(contest.id, editingContestant.id, {
        speechTitle: speechTitle.trim() || contestantSpeechTitle.trim() || "Contest Speech",
        speakingOrder: Number(contestantSpeakingOrder) || 1,
      });
      setShowAddContestantModal(false);
      setEditingContestant(null);
    } else {
      if (contestantMode === "club") {
        if (!contestantMemberId) {
          setContestantError("Please select a club member from the roster.");
          return;
        }
        if (contest.participants.some((p) => p.userId === contestantMemberId)) {
          setContestantError("This member is already registered as a contestant.");
          return;
        }
        addContestant(contest.id, {
          userId: contestantMemberId,
          speechTitle: contestantSpeechTitle.trim() || "Contest Speech",
          speakingOrder: Number(contestantSpeakingOrder) || (contest.participants.length + 1),
        });
      } else {
        if (!contestantGuestName.trim()) {
          setContestantError("Please enter the guest speaker's full name.");
          return;
        }
        addContestant(contest.id, {
          isGuest: true,
          userName: contestantGuestName.trim(),
          guestClub: contestantGuestClub.trim() || "Visiting Toastmaster",
          speechTitle: contestantSpeechTitle.trim() || "Contest Speech",
          speakingOrder: Number(contestantSpeakingOrder) || (contest.participants.length + 1),
        });
      }
      setShowAddContestantModal(false);
    }

    setContestantMemberId("");
    setContestantGuestName("");
    setContestantGuestClub("");
    setContestantSpeechTitle("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chairUser = users.find((u) => u.id === editChairId);
    const cjUser = users.find((u) => u.id === editChiefJudgeId);
    const cmUser = users.find((u) => u.id === editContestMasterId);

    updateContest(contest.id, {
      title: editTitle,
      category: editCategory,
      contestDate: editDate,
      locationName: editLocation,
      chairId: editChairId,
      chairName: chairUser?.name || contest.chairName,
      chiefJudgeId: editChiefJudgeId,
      chiefJudgeName: cjUser?.name || contest.chiefJudgeName,
      contestMasterId: editContestMasterId,
      contestMasterName: cmUser?.name || contest.contestMasterName,
      maxContestants: Number(editMaxContestants),
      status: editStatus,
      eligibilityNotes: editEligibility,
    });
    setShowEditModal(false);
  };

  // Open edit role modal
  const openEditRoleModal = (role: ContestRoleAssignment) => {
    setEditingRole(role);
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

    if (assignMode === "club") {
      const member = users.find((u) => u.id === selectedMemberId);
      if (!member) return;

      updateContestRoleAssignment(contest.id, editingRole.roleKey, {
        userId: member.id,
        userName: member.name,
        userAvatar: member.avatar,
        isGuest: false,
        guestName: undefined,
        guestClub: undefined,
        guestEmail: undefined,
        guestPhone: undefined,
        notes: roleNotes,
        isConfirmed,
      });
    } else {
      if (!guestName.trim()) return;

      updateContestRoleAssignment(contest.id, editingRole.roleKey, {
        userId: null,
        userName: `${guestName.trim()} (Guest)`,
        userAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestName)}`,
        isGuest: true,
        guestName: guestName.trim(),
        guestClub: guestClub.trim() || "Visiting Toastmaster",
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        notes: roleNotes,
        isConfirmed,
      });
    }

    setEditingRole(null);
  };

  const handleCopyWhatsAppBriefing = () => {
    const ccRoles = roleAssignments.filter((r) => r.recruitedBy === "cc");
    const cjRoles = roleAssignments.filter((r) => r.recruitedBy === "cj");

    let text = `🏆 *TERRA TOASTMASTERS — CONTEST ROSTER* 🏆\n`;
    text += `*Contest:* ${contest.title}\n`;
    text += `*Date:* ${contest.contestDate}\n`;
    text += `*Location:* ${contest.locationName}\n\n`;

    text += `👑 *LEADERSHIP*\n`;
    text += `• CC: ${contest.chairName}\n`;
    text += `• CJ: ${contest.chiefJudgeName}\n`;
    if (contest.contestMasterName) text += `• CM: ${contest.contestMasterName}\n`;
    text += `\n`;

    text += `📋 *CONTEST CHAIR TEAM*\n`;
    ccRoles.forEach((r) => {
      const assignee = r.isGuest ? `${r.guestName} (${r.guestClub})` : r.userName || "Open";
      text += `• ${r.roleLabel}: ${assignee} ${r.isConfirmed ? "✅" : "⏳"}\n`;
    });
    text += `\n`;

    text += `⚖️ *CHIEF JUDGE TEAM*\n`;
    cjRoles.forEach((r) => {
      if (r.roleKey === "tiebreaker_judge") {
        text += `• ${r.roleLabel}: [CONFIDENTIAL TO CJ] 🔒\n`;
      } else {
        const assignee = r.isGuest ? `${r.guestName} (${r.guestClub})` : r.userName || "Open";
        text += `• ${r.roleLabel}: ${assignee} ${r.isConfirmed ? "✅" : "⏳"}\n`;
      }
    });

    navigator.clipboard.writeText(text);
    alert("WhatsApp Briefing copied!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back Link */}
      <Link
        href="/contests"
        className="inline-flex items-center gap-1.5 text-xs text-terra-text-secondary hover:text-terra-text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Contest Hub</span>
      </Link>

      {/* Contest Hero */}
      <div className="p-8 rounded-3xl terra-glass-card space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-terra-amber/10 border border-terra-amber/20 text-terra-amber text-xs font-semibold uppercase tracking-wider">
              {contest.category.replace("_", " ")}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                contest.status === "open"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : contest.status === "closing_soon"
                  ? "bg-amber-500/10 text-amber-600"
                  : contest.status === "locked"
                  ? "bg-rose-500/10 text-rose-600"
                  : "bg-black/[0.04] text-terra-text-tertiary"
              }`}
            >
              {contest.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Admin Edit Details Trigger */}
            {isAdmin && (
              <button
                onClick={() => {
                  setEditTitle(contest.title);
                  setEditCategory(contest.category);
                  setEditDate(contest.contestDate);
                  setEditLocation(contest.locationName);
                  setEditChairId(contest.chairId || "");
                  setEditChiefJudgeId(contest.chiefJudgeId || "");
                  setEditContestMasterId(contest.contestMasterId || "");
                  setEditMaxContestants(contest.maxContestants);
                  setEditStatus(contest.status);
                  setEditEligibility(contest.eligibilityNotes);
                  setShowEditModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-terra-amber/10 border border-terra-amber/30 text-terra-amber hover:bg-terra-amber/20 active:scale-95 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Leadership & Settings</span>
              </button>
            )}

            {isAdmin && contest.status !== "completed" && (
              <button
                onClick={() => randomizeContestOrder(contest.id)}
                className="px-3.5 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.08] active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Shuffle className="w-3.5 h-3.5 text-terra-amber" />
                <span>Randomize Order</span>
              </button>
            )}

            <button
              onClick={handleCopyWhatsAppBriefing}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Briefing</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {contest.title}
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-1">
            Contest Chair: <strong className="text-terra-text-primary">{contest.chairName}</strong> • Chief Judge:{" "}
            <strong className="text-terra-text-primary">{contest.chiefJudgeName}</strong>
            {contest.contestMasterName && (
              <span> • Contest Master: <strong className="text-terra-text-primary">{contest.contestMasterName}</strong></span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-terra-text-secondary">
          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-terra-text-tertiary mb-1">
              <Calendar className="w-3.5 h-3.5 text-terra-amber" />
              <span className="text-[10px] uppercase font-bold">Scheduled Timing</span>
            </div>
            <span className="font-semibold text-terra-text-primary text-xs">{contest.contestDate}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-terra-text-tertiary mb-1">
              <MapPin className="w-3.5 h-3.5 text-terra-amber" />
              <span className="text-[10px] uppercase font-bold">Venue & Address</span>
            </div>
            <span className="font-semibold text-terra-text-primary text-xs truncate block">{contest.locationName}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-terra-text-tertiary mb-1">
              <Users className="w-3.5 h-3.5 text-terra-amber" />
              <span className="text-[10px] uppercase font-bold">Capacity & Entries</span>
            </div>
            <span className="font-semibold text-terra-text-primary text-xs">
              {contest.participants.length} / {contest.maxContestants} Slots Filled
            </span>
          </div>
        </div>

        {/* User Registration Status Banner */}
        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
          {isUserRegistered ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are officially registered as a contestant.</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-terra-text-secondary">
                Interested in competing? Registration is open to all eligible club members.
              </span>
              {contest.status !== "completed" && (
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-4 py-1.5 rounded-full bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                >
                  Register as Candidate
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION TABS */}
      <div className="flex items-center gap-2 border-b border-black/[0.04] dark:border-white/[0.04] pb-2">
        <button
          onClick={() => setActiveSection("roster")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === "roster"
              ? "bg-[#18181B] dark:bg-white text-white dark:text-black shadow-sm"
              : "text-terra-text-secondary hover:text-terra-text-primary"
          }`}
        >
          🎪 Hosting Role Roster (CC & CJ Teams)
        </button>
        <button
          onClick={() => setActiveSection("contestants")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === "contestants"
              ? "bg-[#18181B] dark:bg-white text-white dark:text-black shadow-sm"
              : "text-terra-text-secondary hover:text-terra-text-primary"
          }`}
        >
          🎤 Contestant Roster & Order ({contest.participants.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: HOSTING ROLE ROSTER (CC & CJ TEAMS) */}
      {/* ========================================================================= */}
      {activeSection === "roster" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CONTEST CHAIR SQUAD */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                <div>
                  <h3 className="font-display font-bold text-base text-terra-text-primary">
                    Contest Chair (CC) Team
                  </h3>
                  <p className="text-[11px] text-terra-text-secondary">
                    Recruited by CC {contest.chairName} ({contest.category === "evaluation" ? "Timers, SAAs, PR, Test Speakers" : "Timers, SAAs, PR Chair"})
                  </p>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-semibold">
                  CC Squad
                </span>
              </div>

              <div className="space-y-2.5">
                {roleAssignments
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
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 text-[10px] font-semibold flex items-center gap-1">
                                  <Globe className="w-2.5 h-2.5" />
                                  <span>Guest</span>
                                </span>
                              )}
                              {isAssigned && role.isConfirmed && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold">
                                  Confirmed
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
                                    {role.guestClub}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-terra-text-tertiary italic">
                                Vacant slot
                              </p>
                            )}
                          </div>

                          {canEdit && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditRoleModal(role)}
                                className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-xs font-semibold text-terra-text-primary"
                              >
                                {isAssigned ? "Edit" : "Assign"}
                              </button>
                              {isAssigned && (
                                <button
                                  onClick={() => clearContestRoleAssignment(contest.id, role.roleKey)}
                                  className="p-1.5 rounded-xl text-terra-text-tertiary hover:text-rose-600"
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

            {/* CHIEF JUDGE SQUAD */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                <div>
                  <h3 className="font-display font-bold text-base text-terra-text-primary">
                    Chief Judge (CJ) Team
                  </h3>
                  <p className="text-[11px] text-terra-text-secondary">
                    Recruited by CJ {contest.chiefJudgeName} (5 Judges, Tiebreaker, Ballot Counters)
                  </p>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 font-semibold">
                  CJ Squad
                </span>
              </div>

              <div className="space-y-2.5">
                {roleAssignments
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
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-semibold flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Confidential</span>
                                </span>
                              )}
                              {role.isGuest && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 text-[10px] font-semibold flex items-center gap-1">
                                  <Globe className="w-2.5 h-2.5" />
                                  <span>Guest Judge</span>
                                </span>
                              )}
                              {isAssigned && role.isConfirmed && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold">
                                  Confirmed
                                </span>
                              )}
                            </div>

                            {isConfidentialTiebreaker && !canViewConfidential ? (
                              <p className="text-xs text-terra-text-tertiary italic">
                                Identity concealed per contest rulebook
                              </p>
                            ) : isAssigned ? (
                              <div>
                                <p className="text-xs font-semibold text-terra-text-primary">
                                  {role.isGuest ? role.guestName : role.userName}
                                </p>
                                {role.isGuest && role.guestClub && (
                                  <p className="text-[11px] text-terra-text-secondary">
                                    {role.guestClub}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-terra-text-tertiary italic">
                                Vacant slot
                              </p>
                            )}
                          </div>

                          {canEdit && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditRoleModal(role)}
                                className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-xs font-semibold text-terra-text-primary"
                              >
                                {isAssigned ? "Edit" : "Assign"}
                              </button>
                              {isAssigned && (
                                <button
                                  onClick={() => clearContestRoleAssignment(contest.id, role.roleKey)}
                                  className="p-1.5 rounded-xl text-terra-text-tertiary hover:text-rose-600"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CONTESTANT ROSTER & SPEAKING ORDER */}
      {/* ========================================================================= */}
      {activeSection === "contestants" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.04] dark:border-white/[0.04]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-terra-amber/10 text-terra-amber flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight">
                  Official Contestant Roster & Speaking Order
                </h2>
                <p className="text-xs text-terra-text-secondary">
                  {contest.participants.length} / {contest.maxContestants} enrolled speakers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(isAdmin || isCC || isCJ) && contest.participants.length > 1 && (
                <button
                  onClick={() => randomizeContestOrder(contest.id)}
                  className="px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-xs font-semibold text-terra-text-primary flex items-center gap-1.5 transition-all"
                  title="Draw of lots: Randomize speaking order"
                >
                  <Shuffle className="w-3.5 h-3.5 text-terra-amber" />
                  <span>Draw of Lots</span>
                </button>
              )}

              {(isAdmin || isCC || isCJ) && (
                <button
                  onClick={handleOpenAddContestant}
                  className="px-4 py-2 rounded-xl bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contestant</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contest.participants
              .sort((a, b) => (a.speakingOrder || 0) - (b.speakingOrder || 0))
              .map((p, idx) => {
                const canManage = isAdmin || isCC || isCJ;

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl terra-glass-card flex items-center justify-between gap-4 group hover:border-terra-amber/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-terra-amber/15 text-terra-amber font-display font-bold text-sm flex items-center justify-center border border-terra-amber/20 shrink-0">
                        #{p.speakingOrder || idx + 1}
                      </span>

                      <img
                        src={p.userAvatar}
                        alt={p.userName}
                        className="w-11 h-11 rounded-2xl object-cover border border-black/10 shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-bold text-sm truncate">{p.userName}</h4>
                          {p.isGuest && (
                            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-700 text-[9px] font-semibold">
                              Guest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-terra-text-secondary italic truncate">
                          &ldquo;{p.speechTitle || "Contest Speech"}&rdquo;
                        </p>
                        {p.isGuest && p.guestClub && (
                          <p className="text-[10px] text-terra-text-tertiary truncate">
                            {p.guestClub}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {canManage ? (
                        <>
                          <button
                            onClick={() => handleOpenEditContestant(p)}
                            className="p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-terra-text-tertiary hover:text-terra-text-primary transition-colors"
                            title="Edit details / speaking order"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeContestant(contest.id, p.id)}
                            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-terra-text-tertiary hover:text-rose-600 transition-colors"
                            title="Remove contestant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                          Confirmed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

            {contest.participants.length === 0 && (
              <div className="col-span-2 py-12 text-center space-y-3 p-6 rounded-3xl terra-glass-card">
                <div className="w-12 h-12 rounded-2xl bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base">No Contestants Enrolled Yet</h3>
                  <p className="text-xs text-terra-text-secondary max-w-sm mx-auto">
                    Contestants can self-register or be added directly by the Contest Chair, Chief Judge, or Admin.
                  </p>
                </div>
                {(isAdmin || isCC || isCJ) && (
                  <button
                    onClick={handleOpenAddContestant}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Contestant</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROLE ASSIGNMENT MODAL (CLUB MEMBER VS VISITING GUEST) */}
      {/* ========================================================================= */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <h3 className="font-display font-bold text-base">
                  Assign: {editingRole.roleLabel}
                </h3>
                <p className="text-xs text-terra-text-secondary mt-0.5">
                  Recruiting for {editingRole.recruitedBy === "cc" ? "Contest Chair Team" : "Chief Judge Team"}
                </p>
              </div>
              <button
                onClick={() => setEditingRole(null)}
                className="p-1 rounded-full text-terra-text-tertiary hover:text-terra-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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
                <span>Visiting Guest</span>
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
                        {u.name} ({u.executiveTitle || `${u.role}`})
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
                      className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
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
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                  Briefing Notes
                </label>
                <input
                  type="text"
                  value={roleNotes}
                  onChange={(e) => setRoleNotes(e.target.value)}
                  placeholder="e.g. Briefing starts 18:00 IST"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                />
              </div>

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
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN EDIT CONTEST MODAL */}
      {/* ========================================================================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-terra-amber" />
                <h3 className="font-display font-bold text-base">Edit Contest Details & Leadership</h3>
              </div>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Contest Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  >
                    <option value="international">International Speech</option>
                    <option value="table_topics">Table Topics</option>
                    <option value="evaluation">Evaluation</option>
                    <option value="humorous">Humorous Speech</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Contest Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  >
                    <option value="open">Open for Entries</option>
                    <option value="closing_soon">Closing Soon</option>
                    <option value="locked">Registration Locked</option>
                    <option value="completed">Completed & Scored</option>
                  </select>
                </div>
              </div>

              {/* Leadership Selection */}
              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary block">
                  Appointed Leadership (Club Roster)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-amber-700 block mb-1">Contest Chair</label>
                    <select
                      value={editChairId}
                      onChange={(e) => setEditChairId(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border text-xs"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-blue-700 block mb-1">Chief Judge</label>
                    <select
                      value={editChiefJudgeId}
                      onChange={(e) => setEditChiefJudgeId(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border text-xs"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-purple-700 block mb-1">Contest Master</label>
                    <select
                      value={editContestMasterId}
                      onChange={(e) => setEditContestMasterId(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border text-xs"
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

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANDIDATE REGISTRATION MODAL */}
      {/* ========================================================================= */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-base">Register as Contestant</h3>
              <button onClick={() => setShowRegModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-terra-text-secondary">
                  Speech Title
                </label>
                <input
                  type="text"
                  value={speechTitle}
                  onChange={(e) => setSpeechTitle(e.target.value)}
                  placeholder="e.g. The Quiet Power"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT CONTESTANT MODAL */}
      {/* ========================================================================= */}
      {showAddContestantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-terra-amber/15 text-terra-amber flex items-center justify-center font-bold">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">
                    {editingContestant ? "Edit Contestant Details" : "Enroll Contestant / Speaker"}
                  </h3>
                  <p className="text-[11px] text-terra-text-secondary">
                    {contest.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddContestantModal(false);
                  setEditingContestant(null);
                }}
                className="p-1 rounded-full text-terra-text-tertiary hover:text-terra-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {contestantError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{contestantError}</span>
              </div>
            )}

            {!editingContestant && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setContestantMode("club")}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    contestantMode === "club"
                      ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                      : "text-terra-text-secondary hover:text-terra-text-primary"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Club Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContestantMode("guest")}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    contestantMode === "guest"
                      ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                      : "text-terra-text-secondary hover:text-terra-text-primary"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visiting Guest Speaker</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSaveContestant} className="space-y-4">
              {!editingContestant ? (
                contestantMode === "club" ? (
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-terra-text-secondary">
                      Select Member from Terra Roster *
                    </label>
                    <select
                      value={contestantMemberId}
                      onChange={(e) => setContestantMemberId(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 font-medium"
                    >
                      <option value="">-- Choose Member --</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.executiveTitle || u.role}) • {u.pathwayName || "Pathways"}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                        Guest Speaker Full Name *
                      </label>
                      <input
                        type="text"
                        value={contestantGuestName}
                        onChange={(e) => setContestantGuestName(e.target.value)}
                        placeholder="e.g. TM Sneha Reddy"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-terra-text-secondary block mb-1">
                        Home Club / District
                      </label>
                      <input
                        type="text"
                        value={contestantGuestClub}
                        onChange={(e) => setContestantGuestClub(e.target.value)}
                        placeholder="e.g. Bangalore Toastmasters Club (District 92)"
                        className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )
              ) : (
                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-3">
                  <img
                    src={editingContestant.userAvatar}
                    alt={editingContestant.userName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-terra-text-primary">{editingContestant.userName}</p>
                    <p className="text-[10px] text-terra-text-secondary">Enrolled Contestant</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-terra-text-secondary">
                    Speech Title / Topic
                  </label>
                  <input
                    type="text"
                    value={contestantSpeechTitle}
                    onChange={(e) => setContestantSpeechTitle(e.target.value)}
                    placeholder="e.g. The Art of Listening"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-terra-text-secondary">
                    Speaking #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={contestantSpeakingOrder}
                    onChange={(e) => setContestantSpeakingOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddContestantModal(false);
                    setEditingContestant(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                >
                  {editingContestant ? "Save Changes" : "Enroll Speaker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
