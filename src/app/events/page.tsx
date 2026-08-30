"use client";

import React, { useState } from "react";
import { useTerraStore } from "@/lib/store";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { RsvpStatus } from "@/lib/types";
import { eventCreationSchema, sanitizeText } from "@/lib/validations";
import { AlertCircle } from "lucide-react";

export default function EventsHubPage() {
  const { events, currentUser, toggleEventRSVP, createEvent } = useTerraStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // New Event Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("Workshop");
  const [eventDate, setEventDate] = useState("2026-09-19");
  const [startTime, setStartTime] = useState("16:00 - 18:00 IST");
  const [locationName, setLocationName] = useState("Studio 402, Bangalore");
  const [description, setDescription] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const mappedCat = category === "Workshop" ? "workshop" : category === "ExComm Meeting" ? "excomm" : "social";
    const validation = eventCreationSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      category: mappedCat,
      date: eventDate,
      startTime,
      endTime: startTime,
      locationType: "in_person",
      locationName: locationName.trim(),
    });

    if (!validation.success) {
      setCreateError(validation.error.issues[0]?.message || "Invalid event parameters.");
      return;
    }

    createEvent({
      title: sanitizeText(title),
      category,
      eventDate,
      startTime: sanitizeText(startTime),
      locationName: sanitizeText(locationName),
      description: sanitizeText(description),
    });
    setShowCreateModal(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Workshops & Informal Events
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            Social meetups, speech masterclasses, and executive committee sessions.
          </p>
        </div>

        {currentUser && currentUser.role !== "member" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule ExComm / Club Event</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const userRsvp = event.rsvps.find((r) => r.userId === currentUser?.id);
            const attendingCount = event.rsvps.filter((r) => r.status === "attending").length;

            return (
              <div
                key={event.id}
                className="p-6 rounded-3xl terra-glass-card space-y-5 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-terra-blue/10 text-terra-blue text-xs font-semibold">
                      {event.category}
                    </span>
                    <span className="text-xs text-terra-text-tertiary">
                      Host: <strong className="text-terra-text-primary">{event.hostName}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl tracking-tight">
                      {event.title}
                    </h3>
                    <p className="text-xs text-terra-text-secondary mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-terra-text-secondary pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-terra-amber" />
                      <span>{event.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-terra-amber" />
                      <span>{event.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-terra-amber" />
                      <span className="truncate">{event.locationName}</span>
                    </div>
                  </div>

                  {/* Attendee Avatar Stack */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {event.rsvps.slice(0, 4).map((r) => (
                        <img
                          key={r.id}
                          src={r.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                          alt={r.userName}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a1a1c] object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-terra-text-tertiary font-medium">
                      {attendingCount} attending
                    </span>
                  </div>
                </div>

                {/* RSVP Controls Bar */}
                <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between gap-2">
                  <div className="grid grid-cols-3 gap-1.5 w-full">
                    <button
                      onClick={() => toggleEventRSVP(event.id, "attending")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                        userRsvp?.status === "attending"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:bg-black/[0.06]"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Going</span>
                    </button>

                    <button
                      onClick={() => toggleEventRSVP(event.id, "maybe")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                        userRsvp?.status === "maybe"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:bg-black/[0.06]"
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Maybe</span>
                    </button>

                    <button
                      onClick={() => toggleEventRSVP(event.id, "declined")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                        userRsvp?.status === "declined"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-black/[0.03] dark:bg-white/[0.04] text-terra-text-secondary hover:bg-black/[0.06]"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Can't Go</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-terra-blue/10 text-terra-blue flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl">No Events Scheduled</h3>
            <p className="text-xs text-terra-text-secondary leading-relaxed">
              No workshops, social mixers, or ExComm sessions are currently on the calendar.
            </p>
          </div>
          {currentUser && currentUser.role !== "member" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule First Event</span>
            </button>
          )}
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-base">Create Informal Club Event</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stage Presence Workshop"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Social Mixer">Social Mixer</option>
                    <option value="ExComm Meeting">ExComm Meeting</option>
                    <option value="Outdoors">Outdoors</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="e.g. 16:00 - 18:00 IST"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Location</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Third Wave Coffee Roasters"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief agenda or meetup notes..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
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
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
