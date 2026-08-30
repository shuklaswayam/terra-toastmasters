"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Radio,
  ChevronLeft,
  X,
} from "lucide-react";

import { announcementSchema, sanitizeText } from "@/lib/validations";
import { AlertCircle } from "lucide-react";

export default function AnnouncementsAdminPage() {
  const { announcements, createAnnouncement, currentUser } = useTerraStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"general" | "important" | "urgent">("general");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const mappedPriority = priority === "general" ? "normal" : priority;
    const validation = announcementSchema.safeParse({
      title: title.trim(),
      content: content.trim(),
      priority: mappedPriority,
      authorName: currentUser?.name || "Club Executive",
    });

    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || "Invalid announcement details.");
      return;
    }

    createAnnouncement({
      title: sanitizeText(title),
      content: sanitizeText(content),
      priority,
    });
    setShowCreateModal(false);
    setTitle("");
    setContent("");
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">Admin Permission Required</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            Broadcasting club-wide announcements and priority alerts vests strictly with the System Administrator (TM Swayam).
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

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary hover:text-terra-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Broadcast Announcements Studio
            </h1>
            <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
              Publish high-priority notices and club updates to all member dashboards.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-3xl terra-glass-card space-y-3 relative overflow-hidden border-l-4 ${
                ann.priority === "urgent"
                  ? "border-l-rose-500"
                  : ann.priority === "important"
                  ? "border-l-amber-500"
                  : "border-l-emerald-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ann.priority === "urgent"
                        ? "bg-rose-500/10 text-rose-600"
                        : ann.priority === "important"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-xs text-terra-text-tertiary">Posted on {ann.createdAt}</span>
                </div>

                <span className="text-xs text-terra-text-secondary">
                  By <strong className="text-terra-text-primary">{ann.authorName}</strong>
                </span>
              </div>

              <h3 className="font-display font-bold text-lg">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-terra-text-secondary leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
            <Radio className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl">No Broadcasts Published</h3>
            <p className="text-xs text-terra-text-secondary leading-relaxed">
              No club announcements have been posted yet. Create an announcement to broadcast notices to all members.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-base">New Club Announcement</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Venue Update for Meeting #143"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                >
                  <option value="general">General Notice</option>
                  <option value="important">Important (Amber Banner)</option>
                  <option value="urgent">Urgent Alert (Red Banner)</option>
                </select>
              </div>

              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Content & Message</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full message details for club members..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
