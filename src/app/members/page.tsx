"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Search,
  Mail,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";

export default function MemberDirectoryPage() {
  const { users, currentUser } = useTerraStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.bio?.toLowerCase().includes(search.toLowerCase()) ||
      (u.executiveTitle && u.executiveTitle.toLowerCase().includes(search.toLowerCase())) ||
      (u.pathwayName && u.pathwayName.toLowerCase().includes(search.toLowerCase()));

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "officer" && (u.role === "officer" || u.role === "admin")) ||
      (roleFilter === "member" && u.role === "member");

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Club Members
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            Active members and executive leaders of Terra Toastmasters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role === "admin" && (
            <Link
              href="/admin/members"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Manage Roles & IDs</span>
            </Link>
          )}

          <span className="text-xs font-mono text-terra-text-tertiary">
            {filteredUsers.length} Members
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-terra-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by member name, username, or role..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 transition-all"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs text-terra-text-secondary focus:outline-none"
        >
          <option value="all">All Members ({users.length})</option>
          <option value="officer">Executive Committee ({users.filter((u) => u.role !== "member").length})</option>
          <option value="member">Club Members ({users.filter((u) => u.role === "member").length})</option>
        </select>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-3xl terra-glass-card space-y-4 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-black/[0.08] dark:border-white/[0.08]"
                />
                {member.executiveTitle ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>{member.executiveTitle}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary text-[10px] font-medium capitalize">
                    {member.role}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-bold text-base tracking-tight">
                  {member.name}
                </h3>
                <span className="font-mono text-[11px] text-terra-amber block mt-0.5">
                  @{member.username}
                </span>
                {member.pathwayName && (
                  <span className="text-xs text-terra-text-secondary font-medium block mt-0.5">
                    {member.pathwayName} {member.pathwayLevel ? `• Level ${member.pathwayLevel}` : ""}
                  </span>
                )}
                <p className="text-xs text-terra-text-secondary mt-1.5 line-clamp-2">
                  {member.bio}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between text-xs text-terra-text-tertiary">
              <div className="flex items-center gap-3">
                <span>🎤 {member.speechesDelivered} speeches</span>
                <span>•</span>
                <span>⏱️ {member.rolesCompleted} roles</span>
              </div>
              <a
                href={`mailto:${member.email}`}
                className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-terra-text-secondary transition-colors"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
