"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronLeft,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function TimerToolPage() {
  const { meetings, timerLogs, logTimerEntry, currentUser } = useTerraStore();
  const currentMeeting = meetings[0] || null;

  const presets = [
    { name: "Table Topics", min: 60, mid: 90, max: 120, label: "1 - 2 mins" },
    { name: "Prepared Speech", min: 300, mid: 360, max: 420, label: "5 - 7 mins" },
    { name: "Evaluation", min: 120, mid: 150, max: 180, label: "2 - 3 mins" },
    { name: "Icebreaker", min: 240, mid: 300, max: 360, label: "4 - 6 mins" },
  ];

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(1); // Prepared Speech
  const preset = presets[selectedPresetIndex];

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speakerName, setSpeakerName] = useState("");
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getSignalState = () => {
    if (seconds >= preset.max + 30) return "overtime";
    if (seconds >= preset.max) return "red";
    if (seconds >= preset.mid) return "amber";
    if (seconds >= preset.min) return "green";
    return "idle";
  };

  const signalState = getSignalState();

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleLogTime = () => {
    if (seconds === 0) return;
    const nameToLog = speakerName.trim() || currentUser?.name || "Speaker";
    const isDisqualified = seconds < preset.min - 30 || seconds > preset.max + 30;

    logTimerEntry({
      meetingId: currentMeeting?.id || "session-live",
      speakerName: nameToLog,
      roleOrSpeech: `${preset.name} (${preset.label})`,
      minDuration: preset.min,
      targetDuration: preset.mid,
      maxDuration: preset.max,
      recordedSeconds: seconds,
      disqualified: isDisqualified,
      status: signalState === "idle" ? "under_time" : signalState,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    handleReset();
    setSpeakerName("");
  };

  const getTimerSummaryText = () => {
    return `⏱️ *TERRA TOASTMASTERS — TIMER REPORT* ⏱️
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Meeting:* ${currentMeeting ? currentMeeting.title : "Club Session"}
🕒 *Generated:* ${new Date().toLocaleDateString()}

*RECORDED TIMES:*
${timerLogs
  .map(
    (log, i) =>
      `${i + 1}. *${log.speakerName}* (${log.roleOrSpeech}): ${formatTime(log.recordedSeconds)} ${
        log.disqualified ? "❌ (Disqualified)" : "✅ (Eligible for Voting)"
      }`
  )
  .join("\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(getTimerSummaryText());
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
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
              Live Speech Timer & Signal Card
            </h1>
            <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
              Official timing utility for Timer role holders and Toastmasters functionaries.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="px-3.5 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:text-terra-text-primary text-xs font-semibold flex items-center gap-1.5"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-terra-text-tertiary" />}
          <span>{soundEnabled ? "Audio Signal Ready" : "Muted"}</span>
        </button>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {presets.map((p, idx) => (
          <button
            key={p.name}
            onClick={() => {
              setSelectedPresetIndex(idx);
              handleReset();
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedPresetIndex === idx
                ? "bg-terra-amber/10 border-terra-amber/40 shadow-sm"
                : "bg-white dark:bg-[#161618] border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.15]"
            }`}
          >
            <span className="font-semibold text-xs block text-terra-text-primary">
              {p.name}
            </span>
            <span className="text-[11px] text-terra-text-tertiary block mt-0.5">
              {p.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main Stopwatch Stage Card */}
      <div
        className={`p-8 sm:p-12 rounded-3xl border transition-colors duration-500 text-center relative overflow-hidden flex flex-col items-center justify-center space-y-6 ${
          signalState === "idle"
            ? "bg-white dark:bg-[#161618] border-black/[0.08] dark:border-white/[0.08]"
            : signalState === "green"
            ? "bg-emerald-500 text-white border-emerald-600 shadow-2xl"
            : signalState === "amber"
            ? "bg-amber-500 text-white border-amber-600 shadow-2xl"
            : signalState === "red"
            ? "bg-rose-600 text-white border-rose-700 shadow-2xl"
            : "bg-rose-900 text-white border-rose-950 animate-pulse shadow-2xl"
        }`}
      >
        {/* Signal Status Badge */}
        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${
            signalState === "idle"
              ? "bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary"
              : "bg-black/20 text-white"
          }`}
        >
          {signalState === "idle" && "Timing Active • Watch Signals"}
          {signalState === "green" && "🟢 Green Flag Active (Minimum Time Reached)"}
          {signalState === "amber" && "🟡 Amber Flag Active (Target Time Reached)"}
          {signalState === "red" && "🔴 Red Flag Active (Maximum Time Reached)"}
          {signalState === "overtime" && "⚠️ 30-Second Disqualification Overtime!"}
        </span>

        {/* Digital Clock Numbers */}
        <div className="font-mono text-7xl sm:text-9xl font-extrabold tracking-tight select-none">
          {formatTime(seconds)}
        </div>

        {/* Target Indicator Milestones */}
        <div
          className={`flex items-center gap-4 text-xs font-mono ${
            signalState === "idle" ? "text-terra-text-tertiary" : "text-white/80"
          }`}
        >
          <span>Green: {formatTime(preset.min)}</span>
          <span>•</span>
          <span>Amber: {formatTime(preset.mid)}</span>
          <span>•</span>
          <span>Red: {formatTime(preset.max)}</span>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="px-8 py-3.5 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-black font-bold text-sm shadow-float active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Timer</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm shadow-float active:scale-95 transition-all flex items-center gap-2"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className={`p-3.5 rounded-full backdrop-blur-md active:scale-95 transition-all ${
              signalState === "idle"
                ? "bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary hover:bg-black/[0.08]"
                : "bg-black/20 text-white hover:bg-black/30"
            }`}
            title="Reset Clock"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Speaker Time Logger Card */}
      <div className="p-6 rounded-3xl terra-glass-card space-y-4">
        <h3 className="font-display font-bold text-base tracking-tight">
          Log Speaker Time to Official Meeting Report
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={speakerName}
            onChange={(e) => setSpeakerName(e.target.value)}
            placeholder="Enter speaker name (e.g. David Kumar)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
          />

          <button
            onClick={handleLogTime}
            disabled={seconds === 0}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Record Time ({formatTime(seconds)})</span>
          </button>
        </div>
      </div>

      {/* Recorded Timer Report Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div>
            <h3 className="font-display font-bold text-lg tracking-tight">
              Meeting Timer Report Log
            </h3>
            <p className="text-xs text-terra-text-secondary mt-0.5">
              Live recorded times for {currentMeeting ? `Meeting #${currentMeeting.meetingNumber}` : "Current Session"}.
            </p>
          </div>

          <button
            onClick={handleCopyReport}
            className="px-4 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.08] active:scale-95 transition-all flex items-center gap-1.5"
          >
            {copiedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied Report!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary for Report</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          {timerLogs.map((log, idx) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl terra-glass-card flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary text-xs font-mono font-semibold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-sm">{log.speakerName}</h4>
                  <span className="text-[11px] text-terra-text-tertiary">{log.roleOrSpeech}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold bg-black/[0.03] dark:bg-white/[0.04] px-3 py-1 rounded-xl">
                  {formatTime(log.recordedSeconds)}
                </span>
                {log.disqualified ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-semibold text-[10px]">
                    Disqualified
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-[10px]">
                    Qualified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
