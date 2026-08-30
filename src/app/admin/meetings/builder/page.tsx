"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import {
  Shield,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { AgendaItem } from "@/lib/types";

export default function AgendaBuilderStudioPage() {
  const router = useRouter();
  const { currentUser, createMeeting, duplicateMeeting, meetings } = useTerraStore();

  const [theme, setTheme] = useState("The Courage to Pivot");
  const [meetingDate, setMeetingDate] = useState("2026-09-15");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:00");
  const [locationName, setLocationName] = useState("Terra Hall, Room 4B / Hybrid Zoom");
  const [wordWord, setWordWord] = useState("Audacious");
  const [wordPart, setWordPart] = useState("Adjective");
  const [wordDef, setWordDef] = useState("Showing a willingness to take surprisingly bold risks.");

  // Agenda items builder state
  const [builderAgenda, setBuilderAgenda] = useState<AgendaItem[]>([
    { id: "b-1", meetingId: "temp", sequenceOrder: 1, startTimeOffset: "19:00", itemTitle: "Call to Order & Welcome", presenterName: "Sergeant at Arms", durationMinutes: 5 },
    { id: "b-2", meetingId: "temp", sequenceOrder: 2, startTimeOffset: "19:05", itemTitle: "Presidential Opening Remarks", presenterName: "Club President", durationMinutes: 10 },
    { id: "b-3", meetingId: "temp", sequenceOrder: 3, startTimeOffset: "19:15", itemTitle: "TMOD Introduction & Role Team", presenterName: "Toastmaster of Day", durationMinutes: 10 },
    { id: "b-4", meetingId: "temp", sequenceOrder: 4, startTimeOffset: "19:25", itemTitle: "Prepared Speech #1", presenterName: "Speaker 1", durationMinutes: 7 },
    { id: "b-5", meetingId: "temp", sequenceOrder: 5, startTimeOffset: "19:32", itemTitle: "Prepared Speech #2", presenterName: "Speaker 2", durationMinutes: 7 },
    { id: "b-6", meetingId: "temp", sequenceOrder: 6, startTimeOffset: "19:39", itemTitle: "Prepared Speech #3", presenterName: "Speaker 3", durationMinutes: 7 },
    { id: "b-7", meetingId: "temp", sequenceOrder: 7, startTimeOffset: "19:46", itemTitle: "Table Topics Impromptu Session", presenterName: "Table Topics Master", durationMinutes: 20 },
    { id: "b-8", meetingId: "temp", sequenceOrder: 8, startTimeOffset: "20:06", itemTitle: "Evaluations & Technical Reports", presenterName: "General Evaluator Team", durationMinutes: 20 },
    { id: "b-9", meetingId: "temp", sequenceOrder: 9, startTimeOffset: "20:26", itemTitle: "Awards & Adjournment", presenterName: "Club President", durationMinutes: 15 },
  ]);

  // Recalculate offsets whenever items change
  const recalculateOffsets = (items: AgendaItem[], start = "19:00") => {
    let [hours, mins] = start.split(":").map(Number);
    let currentTotalMinutes = hours * 60 + mins;

    return items.map((item, idx) => {
      const h = Math.floor(currentTotalMinutes / 60) % 24;
      const m = currentTotalMinutes % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      currentTotalMinutes += item.durationMinutes;
      return {
        ...item,
        sequenceOrder: idx + 1,
        startTimeOffset: timeStr,
      };
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...builderAgenda];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setBuilderAgenda(recalculateOffsets(updated, startTime));
  };

  const handleMoveDown = (index: number) => {
    if (index === builderAgenda.length - 1) return;
    const updated = [...builderAgenda];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setBuilderAgenda(recalculateOffsets(updated, startTime));
  };

  const handleDurationChange = (index: number, newDur: number) => {
    const updated = [...builderAgenda];
    updated[index].durationMinutes = newDur;
    setBuilderAgenda(recalculateOffsets(updated, startTime));
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const updated = [...builderAgenda];
    updated[index].itemTitle = newTitle;
    setBuilderAgenda(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = builderAgenda.filter((_, i) => i !== index);
    setBuilderAgenda(recalculateOffsets(updated, startTime));
  };

  const handleAddItem = () => {
    const newItem: AgendaItem = {
      id: `b-custom-${Date.now()}`,
      meetingId: "temp",
      sequenceOrder: builderAgenda.length + 1,
      startTimeOffset: "20:41",
      itemTitle: "Custom Activity / Break",
      presenterName: "Presenter",
      durationMinutes: 10,
    };
    const updated = [...builderAgenda, newItem];
    setBuilderAgenda(recalculateOffsets(updated, startTime));
  };

  const nextMeetingNumber = meetings.reduce(
    (max, m) => Math.max(max, m.meetingNumber || 0),
    518
  ) + 1;

  const handlePublishMeeting = () => {
    const created = createMeeting({
      meetingNumber: nextMeetingNumber,
      title: `Meeting #${nextMeetingNumber} — ${theme}`,
      theme,
      meetingDate,
      startTime,
      endTime,
      locationName,
      wordOfTheDay: {
        word: wordWord,
        partOfSpeech: wordPart,
        definition: wordDef,
      },
    });

    router.push(`/meetings/${created.slug}`);
  };

  const handleDuplicateLastMeeting = () => {
    const lastMeeting = meetings[0];
    const nextNum = (lastMeeting?.meetingNumber || 518) + 1;
    const duplicated = duplicateMeeting(lastMeeting ? lastMeeting.id : "temp", "2026-09-22", nextNum);
    router.push(`/meetings/${duplicated.slug}`);
  };

  const totalDuration = builderAgenda.reduce((acc, item) => acc + item.durationMinutes, 0);

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">Admin Permission Required</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            All agenda creation and meeting modification capabilities vest strictly in the Admin role.
          </p>
          <button
            onClick={() => router.push("/portal")}
            className="px-5 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Agenda Builder Studio
            </h1>
            <p className="text-xs text-terra-text-secondary">
              Drag, reorder, and dynamically configure meeting agendas for Terra Toastmasters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {meetings.length > 0 && (
            <button
              onClick={handleDuplicateLastMeeting}
              className="px-4 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.06] transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate Meeting #{meetings[0].meetingNumber}</span>
            </button>
          )}
          <button
            onClick={handlePublishMeeting}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish Session Live</span>
          </button>
        </div>
      </div>

      {/* Meeting Parameters Card */}
      <div className="p-6 rounded-3xl terra-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm tracking-tight">
            Session Identity & Logistics
          </h3>
          <span className="px-2.5 py-1 rounded-full bg-terra-amber/15 text-terra-amber font-mono font-bold text-xs border border-terra-amber/30">
            Next Session: Meeting #{nextMeetingNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-terra-text-secondary">Meeting Theme</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-terra-text-secondary">Meeting Date</label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-terra-text-secondary">Start Time - End Time</label>
            <div className="flex gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setBuilderAgenda(recalculateOffsets(builderAgenda, e.target.value));
                }}
                className="w-1/2 px-2 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-1/2 px-2 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-terra-text-secondary">Word of the Day</label>
            <input
              type="text"
              value={wordWord}
              onChange={(e) => setWordWord(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
            />
          </div>
        </div>
      </div>

      {/* Interactive Agenda Blocks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div>
            <h3 className="font-display font-bold text-base tracking-tight">
              Interactive Timed Agenda Blocks
            </h3>
            <p className="text-xs text-terra-text-secondary mt-0.5">
              Reorder sequence with arrows; all downstream timestamps auto-recalculate.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
            Total Allocated: {totalDuration} / 120 Mins
          </span>
        </div>

        <div className="space-y-2">
          {builderAgenda.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl terra-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-black/[0.06] disabled:opacity-30"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === builderAgenda.length - 1}
                    className="p-1 rounded hover:bg-black/[0.06] disabled:opacity-30"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.06]">
                  {item.startTimeOffset}
                </span>

                <input
                  type="text"
                  value={item.itemTitle}
                  onChange={(e) => handleTitleChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-transparent border border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold focus:outline-none focus:bg-black/[0.02]"
                />
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-terra-text-tertiary">Duration:</span>
                <select
                  value={item.durationMinutes}
                  onChange={(e) => handleDurationChange(idx, Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] font-mono text-xs"
                >
                  <option value={3}>3 mins</option>
                  <option value={5}>5 mins</option>
                  <option value={7}>7 mins</option>
                  <option value={10}>10 mins</option>
                  <option value={15}>15 mins</option>
                  <option value={20}>20 mins</option>
                  <option value={25}>25 mins</option>
                </select>

                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="p-1.5 rounded-lg text-terra-rose hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddItem}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold text-terra-text-secondary hover:border-black/[0.2] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Agenda Block</span>
        </button>
      </div>
    </div>
  );
}
