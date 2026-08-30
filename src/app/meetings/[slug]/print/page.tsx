"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import { ArrowLeft, Printer } from "lucide-react";

export default function MeetingPrintableAgendaPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const { meetings, meetingRoles, agendaItems } = useTerraStore();
  const meeting = meetings.find((m) => m.slug === slug) || (meetings.length > 0 ? meetings[0] : null);

  useEffect(() => {
    if (meeting) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [meeting]);

  if (!meeting) {
    return (
      <div className="min-h-screen bg-white text-black p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold font-display">Meeting Not Found</h2>
          <p className="text-xs text-neutral-600">The requested agenda is not available for printing.</p>
          <Link href="/meetings" className="inline-block px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold">
            Return to Meetings
          </Link>
        </div>
      </div>
    );
  }

  const roles = meetingRoles.filter((r) => r.meetingId === meeting.id);
  const agendas = agendaItems
    .filter((a) => a.meetingId === meeting.id)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  return (
    <div className="min-h-screen bg-white text-black p-8 sm:p-12 print:p-0 max-w-4xl mx-auto space-y-8">
      {/* Screen-only Controls */}
      <div className="print:hidden flex items-center justify-between pb-4 border-b">
        <button
          onClick={() => router.back()}
          className="px-3 py-1.5 rounded-lg bg-neutral-100 text-xs font-semibold hover:bg-neutral-200 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Session</span>
        </button>

        <button
          onClick={() => window.print()}
          className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF (⌘P)</span>
        </button>
      </div>

      {/* Printable Header */}
      <div className="flex items-start justify-between border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">TERRA TOASTMASTERS</h1>
          <p className="text-xs uppercase tracking-widest text-neutral-600 font-semibold mt-0.5">
            Club #2849102 • Area 4, Division D, District 92
          </p>
        </div>

        <div className="text-right font-mono text-xs">
          <p className="font-bold text-sm">MEETING #{meeting.meetingNumber}</p>
          <p className="text-neutral-600">{meeting.meetingDate}</p>
          <p className="text-neutral-600">{meeting.startTime} - {meeting.endTime} IST</p>
        </div>
      </div>

      {/* Theme & Word of the Day Banner */}
      <div className="grid grid-cols-2 gap-4 border border-black p-4 rounded-lg text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Meeting Theme
          </span>
          <h2 className="text-base font-bold mt-0.5">"{meeting.theme}"</h2>
          <p className="text-neutral-600 mt-0.5">Toastmaster of the Day: <strong>{meeting.tmodName}</strong></p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Word of the Day
          </span>
          <p className="text-sm font-bold mt-0.5">
            "{meeting.wordOfTheDay.word}" <span className="font-normal text-xs text-neutral-600">({meeting.wordOfTheDay.partOfSpeech})</span>
          </p>
          <p className="text-neutral-700 text-[11px] mt-0.5 leading-snug">
            {meeting.wordOfTheDay.definition}
          </p>
        </div>
      </div>

      {/* Role Roster Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
          Meeting Role Roster
        </h3>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b text-neutral-600 text-[10px] uppercase">
              <th className="py-1.5 font-bold">Role Title</th>
              <th className="py-1.5 font-bold">Assigned Member</th>
              <th className="py-1.5 font-bold">Speech Title / Project</th>
              <th className="py-1.5 font-bold text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {roles.map((r) => (
              <tr key={r.id} className="py-1">
                <td className="py-1.5 font-semibold">{r.roleName}</td>
                <td className="py-1.5">{r.assignedUserName || "— Open Slot —"}</td>
                <td className="py-1.5 italic text-neutral-600">{r.speechTitle || "—"}</td>
                <td className="py-1.5 text-right font-mono">{r.allocatedMinutes}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timed Agenda Table */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
          Timed Order of Business
        </h3>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b text-neutral-600 text-[10px] uppercase">
              <th className="py-1.5 font-bold">Time</th>
              <th className="py-1.5 font-bold">Agenda Item</th>
              <th className="py-1.5 font-bold">Presenter / Lead</th>
              <th className="py-1.5 font-bold text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {agendas.map((a) => (
              <tr key={a.id}>
                <td className="py-1.5 font-mono font-semibold">{a.startTimeOffset}</td>
                <td className="py-1.5 font-medium">{a.itemTitle}</td>
                <td className="py-1.5 text-neutral-600">{a.presenterName}</td>
                <td className="py-1.5 text-right font-mono">{a.durationMinutes} mins</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-neutral-300 flex items-center justify-between text-[10px] text-neutral-500">
        <span>Terra Toastmasters • Where Voices Find Their Ground</span>
        <span>https://terra.club/meetings/{meeting.slug}</span>
      </div>
    </div>
  );
}
