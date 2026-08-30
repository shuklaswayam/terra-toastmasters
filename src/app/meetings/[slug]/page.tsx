"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Share2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  X,
  Copy,
  ChevronRight,
} from "lucide-react";

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    meetings,
    meetingRoles,
    agendaItems,
    currentUser,
    claimRole,
    dropRole,
  } = useTerraStore();

  if (!currentUser) return null;

  const meeting =
    meetings.find((m) => m.slug === slug) || (meetings.length > 0 ? meetings[0] : null);

  if (!meeting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">Meeting Not Found</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            The requested session has not been scheduled or was removed.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/meetings"
              className="px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary font-semibold text-xs hover:bg-black/[0.08] transition-all"
            >
              All Meetings
            </Link>
            {currentUser?.role === "admin" && (
              <Link
                href="/admin/meetings/builder"
                className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all"
              >
                + Create Meeting
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const roles = meetingRoles.filter((r) => r.meetingId === meeting.id);
  const agendas = agendaItems
    .filter((a) => a.meetingId === meeting.id)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  // Modals state
  const [selectedRoleForClaim, setSelectedRoleForClaim] = useState<string | null>(null);
  const [speechTitleInput, setSpeechTitleInput] = useState("");
  const [pathwayInput, setPathwayInput] = useState("");

  const [roleToDrop, setRoleToDrop] = useState<string | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const executiveRoles = roles.filter((r) => r.category === "executive");
  const speakerRoles = roles.filter((r) => r.category === "speaker");
  const evaluatorRoles = roles.filter((r) => r.category === "evaluator");
  const functionaryRoles = roles.filter((r) => r.category === "functionary");

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoleForClaim) {
      claimRole(selectedRoleForClaim, speechTitleInput, pathwayInput);
      setSelectedRoleForClaim(null);
      setSpeechTitleInput("");
      setPathwayInput("");
    }
  };

  const handleConfirmDrop = () => {
    if (roleToDrop) {
      dropRole(roleToDrop);
      setRoleToDrop(null);
    }
  };

  // WhatsApp plain text generation
  const getWhatsAppAgendaText = () => {
    return `🌿 *TERRA TOASTMASTERS — MEETING #${meeting.meetingNumber}* 🌿
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${meeting.meetingDate}
⏰ *Time:* ${meeting.startTime} - ${meeting.endTime} IST
📍 *Venue:* ${meeting.locationName}
🎯 *Theme:* ${meeting.theme}
📖 *Word of the Day:* ${meeting.wordOfTheDay.word} (${meeting.wordOfTheDay.partOfSpeech})

*ROLE ROSTER:*
${roles
  .map(
    (r) =>
      `• *${r.roleName}:* ${
        r.assignedUserName
          ? r.assignedUserName + (r.speechTitle ? ` ("${r.speechTitle}")` : "")
          : "[OPEN SLOT - Claim on Portal]"
      }`
  )
  .join("\n")}

👉 Claim role: https://terra.club/meetings/${meeting.slug}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(getWhatsAppAgendaText());
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Session Hero Banner */}
      <div className="p-8 rounded-3xl terra-glass-card space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-xs font-mono">
              MEETING #{meeting.meetingNumber}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
              ● Published Session
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:text-terra-text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Export</span>
            </button>
            <Link
              href={`/meetings/${meeting.slug}/print`}
              className="px-3.5 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:text-terra-text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agenda</span>
            </Link>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {meeting.theme}
          </h1>
          <p className="text-sm text-terra-text-secondary">
            Toastmaster of the Day: <strong className="text-terra-text-primary">{meeting.tmodName}</strong>
          </p>
        </div>

        {/* Word of the Day & Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-terra-amber/10 border border-terra-amber/20">
            <span className="text-[10px] font-bold text-terra-amber uppercase tracking-wider block">
              Word of the Day
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-lg font-bold">"{meeting.wordOfTheDay.word}"</span>
              <span className="text-xs text-terra-text-tertiary">({meeting.wordOfTheDay.partOfSpeech})</span>
            </div>
            <p className="text-xs text-terra-text-secondary mt-1">
              {meeting.wordOfTheDay.definition}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] space-y-1.5 text-xs text-terra-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-terra-amber" />
              <span>{meeting.meetingDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-terra-amber" />
              <span>{meeting.startTime} - {meeting.endTime} IST</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terra-amber" />
              <span className="truncate">{meeting.locationName}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-terra-text-tertiary uppercase tracking-wider block">
                Session Photo Album
              </span>
              <p className="text-xs text-terra-text-secondary mt-1">
                6 high-resolution memories uploaded for this meeting.
              </p>
            </div>
            <Link
              href={`/gallery/2026/${meeting.slug}`}
              className="text-xs text-terra-blue font-semibold hover:underline flex items-center gap-1 mt-2"
            >
              <span>Browse Photo Album</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Role Roster Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              Interactive Role Roster
            </h2>
            <p className="text-xs text-terra-text-secondary mt-0.5">
              Click 'Claim Role' to volunteer or edit your speech project notes.
            </p>
          </div>
        </div>

        {/* 1. Executive Roles */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-terra-text-tertiary uppercase tracking-wider">
            Executive & Meeting Leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {executiveRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                currentUserId={currentUser.id}
                onClaim={() => setSelectedRoleForClaim(role.id)}
                onDrop={() => setRoleToDrop(role.id)}
              />
            ))}
          </div>
        </div>

        {/* 2. Prepared Speakers & Evaluators */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-terra-text-tertiary uppercase tracking-wider">
            Prepared Speakers & Evaluators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {speakerRoles.map((role, idx) => {
              const pairedEvaluator = evaluatorRoles[idx];
              return (
                <div key={role.id} className="space-y-3">
                  <RoleCard
                    role={role}
                    currentUserId={currentUser.id}
                    onClaim={() => setSelectedRoleForClaim(role.id)}
                    onDrop={() => setRoleToDrop(role.id)}
                  />
                  {pairedEvaluator && (
                    <RoleCard
                      role={pairedEvaluator}
                      currentUserId={currentUser.id}
                      onClaim={() => setSelectedRoleForClaim(pairedEvaluator.id)}
                      onDrop={() => setRoleToDrop(pairedEvaluator.id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Functional Roles */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-terra-text-tertiary uppercase tracking-wider">
            Technical & Functional Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {functionaryRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                currentUserId={currentUser.id}
                onClaim={() => setSelectedRoleForClaim(role.id)}
                onDrop={() => setRoleToDrop(role.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Timed Live Agenda Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Timed Meeting Agenda
          </h2>
          <span className="text-xs font-mono text-terra-text-tertiary">
            Total Allocated: 106 / 120 Mins
          </span>
        </div>

        <div className="space-y-2">
          {agendas.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl terra-glass-card flex items-center justify-between gap-4 text-xs transition-all hover:border-black/[0.1] dark:hover:border-white/[0.1]"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary">
                  {item.startTimeOffset}
                </span>
                <div>
                  <h4 className="font-semibold text-sm">{item.itemTitle}</h4>
                  <p className="text-terra-text-tertiary text-xs mt-0.5">{item.presenterName}</p>
                </div>
              </div>

              <span className="font-mono text-xs text-terra-text-secondary font-semibold bg-black/[0.02] dark:bg-white/[0.02] px-2.5 py-1 rounded-full border border-black/[0.04] dark:border-white/[0.04]">
                {item.durationMinutes} mins
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CLAIM ROLE MODAL */}
      {selectedRoleForClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-base">Claim Role Volunteer</h3>
              <button onClick={() => setSelectedRoleForClaim(null)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-terra-text-secondary">
                  Speech Title (Optional for speaking slots)
                </label>
                <input
                  type="text"
                  value={speechTitleInput}
                  onChange={(e) => setSpeechTitleInput(e.target.value)}
                  placeholder="e.g. The Power of Intentional Pauses"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-terra-text-secondary">
                  Pathway Project Name
                </label>
                <input
                  type="text"
                  value={pathwayInput}
                  onChange={(e) => setPathwayInput(e.target.value)}
                  placeholder="e.g. Dynamic Leadership - Level 3"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoleForClaim(null)}
                  className="w-1/2 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
                >
                  Confirm & Lock Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LATE ROLE DROP WARNING MODAL */}
      {roleToDrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161618] border border-rose-500/20 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-terra-rose">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-display font-bold text-base">Late Role Cancellation Warning</h3>
            </div>

            <p className="text-xs text-terra-text-secondary leading-relaxed">
              This meeting is scheduled in less than 48 hours. Dropping your role impacts meeting coordination.
              An urgent vacancy alert will automatically be dispatched to the Vice President Education.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRoleToDrop(null)}
                className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
              >
                Keep My Role
              </button>
              <button
                onClick={handleConfirmDrop}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 active:scale-95 transition-all shadow-sm"
              >
                Confirm Drop (Alert Officers)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP EXPORTER MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-base">Formatted WhatsApp Agenda</h3>
              <button onClick={() => setShowWhatsAppModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-xs font-mono text-terra-text-secondary overflow-x-auto whitespace-pre-wrap max-h-64">
              {getWhatsAppAgendaText()}
            </pre>

            <button
              onClick={handleCopyWhatsApp}
              className="w-full py-2.5 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {copiedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Formatted WhatsApp Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Atomic Role Card Subcomponent
function RoleCard({
  role,
  currentUserId,
  onClaim,
  onDrop,
}: {
  role: any;
  currentUserId: string;
  onClaim: () => void;
  onDrop: () => void;
}) {
  const isAssignedToCurrentUser = role.assignedUserId === currentUserId;

  return (
    <div className="p-4 rounded-2xl terra-glass-card space-y-3 relative overflow-hidden flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-terra-text-tertiary">
          <span className="font-mono">{role.allocatedMinutes} mins</span>
          {role.assignedUserId ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Confirmed</span>
            </span>
          ) : (
            <span className="text-terra-amber font-semibold">Vacant Slot</span>
          )}
        </div>

        <h4 className="font-display font-bold text-sm leading-snug">{role.roleName}</h4>
        {role.speechTitle && (
          <p className="text-xs text-terra-text-secondary italic">"{role.speechTitle}"</p>
        )}
      </div>

      <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
        {role.assignedUserId ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src={role.assignedUserAvatar}
                alt={role.assignedUserName}
                className="w-6 h-6 rounded-full object-cover border border-black/10"
              />
              <span className="text-xs font-semibold truncate max-w-[120px]">
                {role.assignedUserName}
              </span>
            </div>

            {isAssignedToCurrentUser && (
              <button
                onClick={onDrop}
                className="text-[11px] text-terra-rose font-medium hover:underline"
              >
                Release
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onClaim}
            className="w-full py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Claim Role</span>
          </button>
        )}
      </div>
    </div>
  );
}
