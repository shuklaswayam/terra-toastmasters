"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  ChevronLeft,
  Plus,
  Minus,
  Copy,
  CheckCircle2,
  Sparkles,
  Volume2,
  UserPlus,
} from "lucide-react";

export default function AhCounterToolPage() {
  const { ahRecords, updateAhCount, addAhCounterSpeaker, meetings } = useTerraStore();
  const currentMeeting = meetings[0] || null;

  const [newSpeakerName, setNewSpeakerName] = useState("");
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handleAddSpeaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpeakerName.trim()) {
      addAhCounterSpeaker(currentMeeting?.id || "session-live", newSpeakerName.trim());
      setNewSpeakerName("");
    }
  };

  const getAhReportSummaryText = () => {
    return `🔔 *TERRA TOASTMASTERS — AH-COUNTER & WORD REPORT* 🔔
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Meeting:* ${currentMeeting ? currentMeeting.title : "Club Session"}
📖 *Word of the Day:* "${currentMeeting?.wordOfTheDay?.word || "Eloquent"}"

*SPEAKER TALLIES:*
${ahRecords
  .map(
    (rec) =>
      `• *${rec.speakerName}:* Ahs: ${rec.ahs} | Ums: ${rec.ums} | Likes: ${rec.likes} | You Knows: ${rec.youKnows} | Repeats: ${rec.repeats} | 🎯 Word of the Day: ${rec.wordOfDayUsed} times`
  )
  .join("\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(getAhReportSummaryText());
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div className="flex items-center gap-3">
          <Link
            href="/meetings"
            className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary hover:text-terra-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Ah-Counter & Word of the Day Tracker
            </h1>
            <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
              Live tally tracker for Ahs, Ums, crutch phrases, and Word of the Day usage.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyReport}
          className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copiedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied Verbal Report!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Verbal Report</span>
            </>
          )}
        </button>
      </div>

      {/* Word of the Day Reminder Banner */}
      <div className="p-4 rounded-3xl bg-terra-amber/10 border border-terra-amber/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-terra-amber uppercase tracking-wider block">
            Meeting Word of the Day
          </span>
          <span className="font-display text-lg font-bold">"{currentMeeting?.wordOfTheDay?.word || "Eloquent"}"</span>
          <span className="text-xs text-terra-text-secondary ml-2">
            ({currentMeeting?.wordOfTheDay?.partOfSpeech || "adjective"}) — {currentMeeting?.wordOfTheDay?.definition || "Fluent or persuasive in speaking or writing."}
          </span>
        </div>
      </div>

      {/* Add Speaker Input */}
      <form onSubmit={handleAddSpeaker} className="flex gap-3">
        <input
          type="text"
          value={newSpeakerName}
          onChange={(e) => setNewSpeakerName(e.target.value)}
          placeholder="Add attendee name for Table Topics or prepared speeches..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Speaker</span>
        </button>
      </form>

      {/* Tallies Grid */}
      {ahRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ahRecords.map((record) => (
            <div
              key={record.id}
              className="p-6 rounded-3xl terra-glass-card space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base">{record.speakerName}</h3>
                <span className="text-xs font-mono font-semibold text-terra-amber bg-terra-amber/10 px-2.5 py-0.5 rounded-full">
                  Word of Day: {record.wordOfDayUsed}x
                </span>
              </div>

              {/* Counter Items Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
              {/* Ahs */}
              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-center space-y-1.5">
                <span className="text-[10px] font-bold text-terra-text-tertiary uppercase">"Ah / Um"</span>
                <div className="font-mono text-xl font-bold">{record.ahs + record.ums}</div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => updateAhCount(record.id, "ahs", -1)}
                    className="p-1 rounded bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateAhCount(record.id, "ahs", 1)}
                    className="p-1 rounded bg-terra-amber text-white hover:bg-amber-600 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Likes */}
              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-center space-y-1.5">
                <span className="text-[10px] font-bold text-terra-text-tertiary uppercase">"Like"</span>
                <div className="font-mono text-xl font-bold">{record.likes}</div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => updateAhCount(record.id, "likes", -1)}
                    className="p-1 rounded bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateAhCount(record.id, "likes", 1)}
                    className="p-1 rounded bg-terra-amber text-white hover:bg-amber-600 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* You Know */}
              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-center space-y-1.5">
                <span className="text-[10px] font-bold text-terra-text-tertiary uppercase">"You Know"</span>
                <div className="font-mono text-xl font-bold">{record.youKnows}</div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => updateAhCount(record.id, "youKnows", -1)}
                    className="p-1 rounded bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateAhCount(record.id, "youKnows", 1)}
                    className="p-1 rounded bg-terra-amber text-white hover:bg-amber-600 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Word of the Day +1 trigger */}
            <button
              onClick={() => updateAhCount(record.id, "wordOfDayUsed", 1)}
              className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+1 Used Word of the Day ("{currentMeeting?.wordOfTheDay?.word || "Eloquent"}")</span>
            </button>
          </div>
        ))}
      </div>
      ) : (
        <div className="py-16 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto">
            <Volume2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl">No Speakers Added Yet</h3>
            <p className="text-xs text-terra-text-secondary leading-relaxed">
              Type an attendee or speaker name above and click "+ Add Speaker" to begin tracking filler words and Word of the Day usage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
