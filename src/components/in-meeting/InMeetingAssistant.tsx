"use client";

import React, { useState } from "react";
import { useTerraStore } from "@/lib/store";
import {
  X,
  Radio,
  Clock,
  BookOpen,
  Camera,
  CheckCircle2,
  Volume2,
} from "lucide-react";

export function InMeetingAssistant({ onClose }: { onClose: () => void }) {
  const { meetings, agendaItems, uploadPhotos, mediaAlbums, createMediaAlbum } = useTerraStore();
  const [activeTab, setActiveTab] = useState<"agenda" | "words" | "snap">("agenda");
  const [snappedSuccess, setSnappedSuccess] = useState(false);

  const activeMeeting = meetings[0] || null;

  const handleSnapPhoto = () => {
    let albumId = mediaAlbums[0]?.id;
    if (!albumId) {
      const created = createMediaAlbum({
        title: activeMeeting ? `${activeMeeting.theme} Album` : "Club Session Album",
        year: new Date().getFullYear(),
        month: new Date().toLocaleString("default", { month: "long" }),
        coverImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
      });
      albumId = created.id;
    }

    uploadPhotos(albumId, [
      {
        imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=480&auto=format&fit=crop&q=80",
        caption: "Live stage snapshot from mobile assistant",
        tags: ["Live Snapshot", "Mobile"],
      },
    ]);
    setSnappedSuccess(true);
    setTimeout(() => setSnappedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-5 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <span className="font-display font-semibold text-sm">Live Meeting Assistant</span>
              <span className="text-[10px] text-terra-text-tertiary block">
                {activeMeeting ? activeMeeting.theme : "No Active Meeting"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-terra-text-tertiary hover:text-terra-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-xl my-3">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "agenda"
                ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                : "text-terra-text-secondary"
            }`}
          >
            Timed Agenda
          </button>
          <button
            onClick={() => setActiveTab("words")}
            className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "words"
                ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                : "text-terra-text-secondary"
            }`}
          >
            Word & Timer
          </button>
          <button
            onClick={() => setActiveTab("snap")}
            className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "snap"
                ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                : "text-terra-text-secondary"
            }`}
          >
            Snap Photo
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-2">
          {activeTab === "agenda" && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>CURRENT ON STAGE</span>
                  </span>
                  <span className="font-mono text-[11px]">19:25 - 19:50 IST</span>
                </div>
                <p className="text-xs font-bold mt-1">Prepared Speeches Session (3 Slots)</p>
                <p className="text-[11px] opacity-80 mt-0.5">David Kumar & Elena Vance</p>
              </div>

              <div className="space-y-1.5 pt-1">
                {agendaItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-[10px] text-terra-text-tertiary mt-0.5">
                        {item.startTimeOffset}
                      </span>
                      <div>
                        <p className="font-medium text-xs leading-snug">{item.itemTitle}</p>
                        <p className="text-[10px] text-terra-text-tertiary">{item.presenterName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-terra-text-tertiary bg-black/[0.04] dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                      {item.durationMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "words" && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-terra-amber/10 border border-terra-amber/20 text-terra-text-primary">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-terra-amber uppercase tracking-wider">
                    Word of the Day
                  </span>
                  <span className="text-xs text-terra-text-tertiary">
                    {activeMeeting?.wordOfTheDay?.partOfSpeech || "adjective"}
                  </span>
                </div>
                <h4 className="text-lg font-bold mt-1 font-display">
                  "{activeMeeting?.wordOfTheDay?.word || "Eloquent"}"
                </h4>
                <p className="text-xs text-terra-text-secondary mt-1">
                  {activeMeeting?.wordOfTheDay?.definition || "Fluent or persuasive in speaking or writing."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-[10px] font-bold text-terra-text-tertiary uppercase tracking-wider block mb-2">
                  Timer Guidelines
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <span className="block font-bold">5:00</span>
                    <span className="text-[10px]">🟢 Green Flag</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                    <span className="block font-bold">6:00</span>
                    <span className="text-[10px]">🟡 Amber Flag</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400">
                    <span className="block font-bold">7:00</span>
                    <span className="text-[10px]">🔴 Red Flag</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "snap" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-terra-amber/10 flex items-center justify-center mx-auto text-terra-amber">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display">Capture & Upload Stage Snapshot</h4>
                <p className="text-xs text-terra-text-secondary mt-1 max-w-xs mx-auto">
                  Automatically adds your photo to Meeting #142 official club album.
                </p>
              </div>

              <button
                onClick={handleSnapPhoto}
                className="px-6 py-2.5 rounded-full bg-terra-amber text-white font-semibold text-xs shadow-float active:scale-95 transition-all flex items-center gap-2 mx-auto"
              >
                <Camera className="w-4 h-4" />
                <span>Snap & Upload to Album</span>
              </button>

              {snappedSuccess && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Photo uploaded directly to Meeting #142 Album!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
