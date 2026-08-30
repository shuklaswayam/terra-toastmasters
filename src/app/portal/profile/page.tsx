"use client";

import React, { useState } from "react";
import { useTerraStore } from "@/lib/store";
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  User as UserIcon,
  Sparkles,
  FileText,
  Shield,
  Edit3,
  Phone,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Camera,
  Hash,
  Share2,
} from "lucide-react";
import { SpeechRecord } from "@/lib/types";

const PATHWAY_TRACKS = [
  "Presentation Mastery",
  "Dynamic Leadership",
  "Innovative Planning",
  "Effective Coaching",
  "Persuasive Influence",
  "Strategic Relationships",
  "Visionary Communication",
  "Engaging Humor",
  "Team Collaboration",
  "Motivational Strategies",
  "Leadership Development",
];

import { memberProfileSchema, speechRecordSchema, sanitizeText } from "@/lib/validations";
import { AlertCircle } from "lucide-react";

export default function MemberProfilePage() {
  const { currentUser, speechRecords, updateProfile, addSpeechRecord, deleteSpeechRecord } =
    useTerraStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSpeechModal, setShowAddSpeechModal] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editJoinedDate, setEditJoinedDate] = useState(currentUser?.joinedDate || "");
  const [editBio, setEditBio] = useState(currentUser?.bio || "");
  const [editPathwayName, setEditPathwayName] = useState(currentUser?.pathwayName || "");
  const [editPathwayLevel, setEditPathwayLevel] = useState(currentUser?.pathwayLevel || 1);
  const [editSpeechesDelivered, setEditSpeechesDelivered] = useState(currentUser?.speechesDelivered || 0);
  const [editRolesCompleted, setEditRolesCompleted] = useState(currentUser?.rolesCompleted || 0);
  const [editMemberId, setEditMemberId] = useState(currentUser?.memberId || "");
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || "");
  const [editPassword, setEditPassword] = useState("");

  // New Speech Form State
  const [speechMeetingNumber, setSpeechMeetingNumber] = useState<number>(1);
  const [speechDate, setSpeechDate] = useState(new Date().toISOString().split("T")[0]);
  const [speechTitle, setSpeechTitle] = useState("");
  const [speechPathwayProject, setSpeechPathwayProject] = useState("Level 1: Icebreaker");
  const [speechEvaluator, setSpeechEvaluator] = useState("");
  const [speechTiming, setSpeechTiming] = useState("5:45");
  const [speechNotes, setSpeechNotes] = useState("");
  const [speechAward, setSpeechAward] = useState("");

  if (!currentUser) return null;

  const handleOpenEdit = () => {
    setEditError(null);
    setEditName(currentUser.name);
    setEditPhone(currentUser.phone || "");
    setEditJoinedDate(currentUser.joinedDate || "");
    setEditBio(currentUser.bio || "");
    setEditPathwayName(currentUser.pathwayName || "Presentation Mastery");
    setEditPathwayLevel(currentUser.pathwayLevel || 1);
    setEditSpeechesDelivered(currentUser.speechesDelivered || 0);
    setEditRolesCompleted(currentUser.rolesCompleted || 0);
    setEditMemberId(currentUser.memberId || "");
    setEditAvatar(currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`);
    setEditPassword("");
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    const validation = memberProfileSchema.safeParse({
      name: editName,
      email: currentUser.email,
      phone: editPhone.trim() || undefined,
      bio: editBio.trim() || undefined,
      avatar: editAvatar.trim() || undefined,
      pathwayName: editPathwayName.trim() || undefined,
      pathwayLevel: Number(editPathwayLevel) || 1,
      memberJoiningDate: editJoinedDate.trim() || undefined,
      speechesDelivered: Number(editSpeechesDelivered) || 0,
      rolesCompleted: Number(editRolesCompleted) || 0,
    });

    if (!validation.success) {
      setEditError(validation.error.issues[0]?.message || "Invalid profile details provided.");
      return;
    }

    const updates: Partial<typeof currentUser> & { password?: string } = {
      name: sanitizeText(editName) || currentUser.name,
      phone: editPhone.trim(),
      joinedDate: editJoinedDate.trim(),
      bio: sanitizeText(editBio),
      pathwayName: sanitizeText(editPathwayName),
      pathwayLevel: Number(editPathwayLevel) || 1,
      speechesDelivered: Number(editSpeechesDelivered) || 0,
      rolesCompleted: Number(editRolesCompleted) || 0,
      memberId: sanitizeText(editMemberId),
      avatar: editAvatar.trim() || currentUser.avatar,
    };

    if (editPassword.trim()) {
      if (editPassword.trim().length < 6) {
        setEditError("New password must be at least 6 characters.");
        return;
      }
      updates.password = editPassword.trim();
    }

    await updateProfile(updates);
    setShowEditModal(false);
    setEditPassword("");
  };

  const handleCreateSpeechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSpeechError(null);

    const validation = speechRecordSchema.safeParse({
      meetingNumber: Number(speechMeetingNumber) || 1,
      meetingDate: speechDate,
      speechTitle: speechTitle.trim(),
      pathwayProject: speechPathwayProject.trim(),
      evaluatorName: speechEvaluator.trim() || "General Evaluator",
      timingMinutes: speechTiming.trim() || "6:00",
      privateNotes: speechNotes.trim() || undefined,
      awardWon: speechAward.trim() || undefined,
    });

    if (!validation.success) {
      setSpeechError(validation.error.issues[0]?.message || "Invalid speech details provided.");
      return;
    }

    addSpeechRecord({
      userId: currentUser.id,
      meetingNumber: Number(speechMeetingNumber) || 1,
      meetingDate: speechDate,
      speechTitle: sanitizeText(speechTitle),
      pathwayProject: sanitizeText(speechPathwayProject),
      evaluatorName: sanitizeText(speechEvaluator) || "General Evaluator",
      timingMinutes: sanitizeText(speechTiming) || "6:00",
      privateNotes: sanitizeText(speechNotes) || "Constructive feedback and speech execution recorded.",
      awardWon: speechAward.trim() ? sanitizeText(speechAward) : undefined,
    });

    setShowAddSpeechModal(false);
    setSpeechTitle("");
    setSpeechEvaluator("");
    setSpeechNotes("");
    setSpeechAward("");
  };

  const userSpeeches = speechRecords.filter(
    (s) => s.userId === currentUser.id
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Profile Header Hero */}
      <div className="p-6 sm:p-8 rounded-3xl terra-glass-card relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-black/[0.08] dark:border-white/[0.08] shadow-float bg-white/5"
              />
              <button
                onClick={handleOpenEdit}
                className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                title="Change Avatar"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {currentUser.name}
                </h1>
                {currentUser.pathwayName && (
                  <span className="px-3 py-1 rounded-full bg-terra-amber/10 border border-terra-amber/20 text-terra-amber text-xs font-semibold">
                    {currentUser.pathwayName} {currentUser.pathwayLevel ? `— Level ${currentUser.pathwayLevel}` : ""}
                  </span>
                )}
                {currentUser.executiveTitle && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{currentUser.executiveTitle}</span>
                  </span>
                )}
                {currentUser.memberId && (
                  <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[11px] font-mono text-terra-text-tertiary">
                    ID: {currentUser.memberId}
                  </span>
                )}
              </div>

              {currentUser.bio ? (
                <p className="text-xs sm:text-sm text-terra-text-secondary max-w-2xl leading-relaxed">
                  {currentUser.bio}
                </p>
              ) : (
                <p className="text-xs text-terra-text-tertiary italic">
                  No personal bio added yet. Click "Edit Profile" to add your introduction.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-terra-text-tertiary pt-1">
                {currentUser.joinedDate ? (
                  <span>📅 Member since {currentUser.joinedDate}</span>
                ) : (
                  <span className="text-terra-amber">📅 Set your joining date</span>
                )}
                <span>•</span>
                <span>📧 {currentUser.email}</span>
                {currentUser.phone && (
                  <>
                    <span>•</span>
                    <span>📱 {currentUser.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenEdit}
            className="px-4 py-2 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Aggregate Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
            <span className="block font-display text-2xl font-bold">{currentUser.speechesDelivered}</span>
            <span className="text-xs text-terra-text-tertiary">Speeches Delivered</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
            <span className="block font-display text-2xl font-bold">{currentUser.rolesCompleted}</span>
            <span className="text-xs text-terra-text-tertiary">Roles Completed</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
            <span className="block font-display text-2xl font-bold text-terra-emerald">
              {currentUser.pathwayLevel ? `Level ${currentUser.pathwayLevel}` : "Level 1"}
            </span>
            <span className="text-xs text-terra-text-tertiary">
              {currentUser.pathwayName || "Pathways Track"}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]">
            <span className="block font-display text-2xl font-bold text-terra-amber">
              {userSpeeches.filter((s) => s.awardWon).length} 🏆
            </span>
            <span className="text-xs text-terra-text-tertiary">Awards Won</span>
          </div>
        </div>
      </div>

      {/* Chronological Speech Archive */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              Chronological Speech Records
            </h2>
            <p className="text-xs text-terra-text-secondary mt-0.5">
              Permanent digital record of your prepared speeches, pathway projects, and evaluator feedback.
            </p>
          </div>

          <button
            onClick={() => setShowAddSpeechModal(true)}
            className="px-4 py-2 rounded-xl bg-terra-amber text-white text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Completed Speech</span>
          </button>
        </div>

        {userSpeeches.length > 0 ? (
          <div className="space-y-3">
            {userSpeeches.map((speech) => (
              <div
                key={speech.id}
                className="p-6 rounded-3xl terra-glass-card space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-xs font-mono">
                      Meeting #{speech.meetingNumber}
                    </span>
                    <span className="text-xs text-terra-text-tertiary">{speech.meetingDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {speech.awardWon && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terra-amber/10 border border-terra-amber/20 text-terra-amber text-xs font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>{speech.awardWon}</span>
                      </span>
                    )}
                    <button
                      onClick={() => deleteSpeechRecord(speech.id)}
                      className="p-1 text-terra-text-tertiary hover:text-rose-500 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold tracking-tight">
                    "{speech.speechTitle}"
                  </h3>
                  <p className="text-xs text-terra-emerald font-medium mt-0.5">
                    {speech.pathwayProject}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2 text-terra-text-secondary">
                    <UserIcon className="w-4 h-4 text-terra-text-tertiary" />
                    <span>Evaluator: <strong className="text-terra-text-primary">{speech.evaluatorName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-terra-text-secondary">
                    <Clock className="w-4 h-4 text-terra-text-tertiary" />
                    <span>Speech Duration: <strong className="font-mono text-terra-text-primary">{speech.timingMinutes}</strong></span>
                  </div>
                </div>

                {/* Private Feedback Note Box */}
                {speech.privateNotes && (
                  <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04] text-xs text-terra-text-secondary">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-terra-text-tertiary block mb-1">
                      Private Evaluator Feedback Notes
                    </span>
                    <p className="italic">"{speech.privateNotes}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg">No Speeches Recorded Yet</h3>
              <p className="text-xs text-terra-text-secondary leading-relaxed">
                Log your completed prepared speeches, project evaluations, and awards to track your Pathway advancement.
              </p>
            </div>
            <button
              onClick={() => setShowAddSpeechModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Speech</span>
            </button>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-terra-amber/10 text-terra-amber flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Edit Member Profile</h3>
                  <p className="text-[11px] text-terra-text-secondary">Update your contact, joining date, and Toastmasters details.</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    placeholder="e.g. TM Swayam"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Member Joining Date */}
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Member Joining Date</label>
                  <input
                    type="date"
                    value={editJoinedDate}
                    onChange={(e) => setEditJoinedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>

                {/* Toastmasters Member ID */}
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Toastmasters Member ID</label>
                  <input
                    type="text"
                    value={editMemberId}
                    onChange={(e) => setEditMemberId(e.target.value)}
                    placeholder="e.g. #08492102"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pathway Track */}
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Pathway Education Track</label>
                  <select
                    value={editPathwayName}
                    onChange={(e) => setEditPathwayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  >
                    <option value="">None Selected</option>
                    {PATHWAY_TRACKS.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pathway Level */}
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Current Pathway Level</label>
                  <select
                    value={editPathwayLevel}
                    onChange={(e) => setEditPathwayLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  >
                    <option value={0}>Level 0 (Not Started)</option>
                    <option value={1}>Level 1 (Mastering Fundamentals)</option>
                    <option value={2}>Level 2 (Learning Your Style)</option>
                    <option value={3}>Level 3 (Increasing Knowledge)</option>
                    <option value={4}>Level 4 (Building Skills)</option>
                    <option value={5}>Level 5 (Demonstrating Expertise)</option>
                  </select>
                </div>
              </div>

              {/* Speeches & Roles Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Total Speeches Completed</label>
                  <input
                    type="number"
                    min={0}
                    value={editSpeechesDelivered}
                    onChange={(e) => setEditSpeechesDelivered(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Total Meeting Roles Taken</label>
                  <input
                    type="number"
                    min={0}
                    value={editRolesCompleted}
                    onChange={(e) => setEditRolesCompleted(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="font-semibold text-terra-text-secondary">Bio / Elevator Pitch</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a short introduction about your goals, interests, or speaking journey..."
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-1">
                <label className="font-semibold text-terra-text-secondary">Profile Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-terra-text-secondary">Update Password</label>
                  <span className="text-[10px] text-terra-text-tertiary">Leave blank to keep current</span>
                </div>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] font-semibold hover:bg-black/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG SPEECH MODAL */}
      {showAddSpeechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-terra-emerald/10 text-terra-emerald flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Log Completed Speech</h3>
                  <p className="text-[11px] text-terra-text-secondary">Archive a delivered speech to your permanent educational record.</p>
                </div>
              </div>
              <button onClick={() => setShowAddSpeechModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            {speechError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSpeechSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Meeting Number</label>
                  <input
                    type="number"
                    min={1}
                    value={speechMeetingNumber}
                    onChange={(e) => setSpeechMeetingNumber(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Meeting Date</label>
                  <input
                    type="date"
                    value={speechDate}
                    onChange={(e) => setSpeechDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-terra-text-secondary">Speech Title</label>
                <input
                  type="text"
                  value={speechTitle}
                  onChange={(e) => setSpeechTitle(e.target.value)}
                  placeholder="e.g. Embracing Uncertainty"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Pathway Project / Assignment</label>
                  <input
                    type="text"
                    value={speechPathwayProject}
                    onChange={(e) => setSpeechPathwayProject(e.target.value)}
                    placeholder="e.g. Level 1: Icebreaker"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Evaluator Name</label>
                  <input
                    type="text"
                    value={speechEvaluator}
                    onChange={(e) => setSpeechEvaluator(e.target.value)}
                    placeholder="e.g. TM Swayam"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Recorded Duration</label>
                  <input
                    type="text"
                    value={speechTiming}
                    onChange={(e) => setSpeechTiming(e.target.value)}
                    placeholder="e.g. 6:15"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-terra-text-secondary">Award Won (Optional)</label>
                  <select
                    value={speechAward}
                    onChange={(e) => setSpeechAward(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none"
                  >
                    <option value="">None</option>
                    <option value="Best Speaker">Best Speaker 🏆</option>
                    <option value="Best Evaluator">Best Evaluator 🥇</option>
                    <option value="Best Table Topics">Best Table Topics 🎖️</option>
                    <option value="Most Improved">Most Improved 🌟</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-terra-text-secondary">Evaluator Feedback / Private Notes</label>
                <textarea
                  rows={2}
                  value={speechNotes}
                  onChange={(e) => setSpeechNotes(e.target.value)}
                  placeholder="Key commendations and recommendations from your evaluator..."
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowAddSpeechModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-terra-amber text-white font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                >
                  Archive Speech
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
