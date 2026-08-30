"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import {
  Shield,
  Plus,
  Trash2,
  Edit3,
  Key,
  Copy,
  CheckCircle2,
  ChevronLeft,
  Search,
  UserCheck,
  UserPlus,
  X,
  Lock,
  Sparkles,
  Mail,
  Phone,
  AlertTriangle,
} from "lucide-react";
import { User, UserRole } from "@/lib/types";

export default function AdminMemberManagementPage() {
  const router = useRouter();
  const {
    currentUser,
    users,
    addMember,
    updateMember,
    deleteMember,
    generateCredentials,
  } = useTerraStore();

  // Search & Filter
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  // Form State for Add Member
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<UserRole>("member");
  const [addExecutiveTitle, setAddExecutiveTitle] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addBio, setAddBio] = useState("");
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editJoinedDate, setEditJoinedDate] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPathwayName, setEditPathwayName] = useState("");
  const [editPathwayLevel, setEditPathwayLevel] = useState<number>(0);
  const [editSpeechesDelivered, setEditSpeechesDelivered] = useState<number>(0);
  const [editRolesCompleted, setEditRolesCompleted] = useState<number>(0);
  const [editRole, setEditRole] = useState<UserRole>("member");
  const [editExecutiveTitle, setEditExecutiveTitle] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Auto-generate credentials for new member
  const handleAutoGenerate = () => {
    if (!addName.trim()) return;
    const { username, password } = generateCredentials(addName);
    setAddUsername(username);
    setAddPassword(password);
    if (!addEmail) {
      setAddEmail(`${username}@terra.club`);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    await addMember({
      name: addName.trim(),
      email: addEmail || `${addUsername || "member"}@terra.club`,
      role: addRole,
      executiveTitle: addRole !== "member" ? addExecutiveTitle : undefined,
      phone: addPhone,
      bio: addBio || "",
      username: addUsername,
      password: addPassword,
    });

    setShowAddModal(false);
    // Reset
    setAddName("");
    setAddEmail("");
    setAddRole("member");
    setAddExecutiveTitle("");
    setAddPhone("");
    setAddBio("");
    setAddUsername("");
    setAddPassword("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updates: Partial<User> & { password?: string } = {
      name: editName.trim() || editingUser.name,
      email: editEmail.trim() || editingUser.email,
      phone: editPhone.trim(),
      joinedDate: editJoinedDate.trim(),
      bio: editBio.trim(),
      pathwayName: editPathwayName.trim(),
      pathwayLevel: Number(editPathwayLevel) || 0,
      speechesDelivered: Number(editSpeechesDelivered) || 0,
      rolesCompleted: Number(editRolesCompleted) || 0,
      role: editRole,
      executiveTitle: editRole !== "member" ? editExecutiveTitle : undefined,
    };
    if (editPassword.trim()) {
      updates.password = editPassword.trim();
    }

    await updateMember(editingUser.id, updates);
    setEditingUser(null);
    setEditPassword("");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    await deleteMember(deletingUser.id);
    setDeletingUser(null);
  };

  // 1-Click Copy Login Credentials to clipboard
  const copyCredentials = (user: User) => {
    const text = `🌿 Terra Toastmasters — Login Credentials\n\nName: ${user.name}\nUsername: ${user.username}\nPassword: ${user.password || "terra@2026"}\nPortal: http://localhost:3000/auth/login\n\nPlease log in and keep your credentials safe.`;
    navigator.clipboard.writeText(text);
    setCopiedUserId(user.id);
    setTimeout(() => setCopiedUserId(null), 2500);
  };

  // Guard
  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">Admin Permission Required</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            Member roster management, credential generation, and role assignment vest exclusively in the Admin role (TM Swayam).
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

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.executiveTitle && u.executiveTitle.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h1 className="font-display text-2xl font-bold tracking-tight">
                Member & Access Management
              </h1>
            </div>
            <p className="text-xs text-terra-text-secondary mt-0.5">
              Add new club members, assign executive roles, auto-generate login credentials, and manage membership.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setAddName("");
            setAddEmail("");
            setAddRole("member");
            setAddExecutiveTitle("");
            setAddUsername("");
            setAddPassword("");
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-terra-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, username, or executive role..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40 transition-all"
          />
        </div>

        <div className="flex gap-2 sm:col-span-2 justify-end">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs text-terra-text-secondary focus:outline-none"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="admin">Admins ({users.filter((u) => u.role === "admin").length})</option>
            <option value="officer">Officers / ExComm ({users.filter((u) => u.role === "officer").length})</option>
            <option value="member">Members ({users.filter((u) => u.role === "member").length})</option>
          </select>
        </div>
      </div>

      {/* Members Management Table / Cards */}
      <div className="rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-float overflow-hidden">
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {filteredUsers.map((member) => (
            <div
              key={member.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-black/[0.08] dark:border-white/[0.08]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm">{member.name}</h3>
                    {member.role === "admin" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        <span>Admin</span>
                      </span>
                    )}
                    {member.role === "officer" && (
                      <span className="px-2 py-0.5 rounded-full bg-terra-blue/10 text-terra-blue text-[10px] font-semibold">
                        ExComm
                      </span>
                    )}
                    {member.role === "member" && (
                      <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary text-[10px] font-medium">
                        Member
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-terra-text-secondary mt-0.5">
                    <span className="font-mono text-[11px] text-terra-amber">
                      @{member.username}
                    </span>
                    <span>•</span>
                    <span>{member.email}</span>
                    {member.executiveTitle && (
                      <>
                        <span>•</span>
                        <strong className="text-terra-text-primary font-medium">
                          {member.executiveTitle}
                        </strong>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* 1-Click Copy Credentials */}
                <button
                  onClick={() => copyCredentials(member)}
                  title="Copy Login Credentials"
                  className="px-2.5 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] text-terra-text-secondary hover:text-terra-text-primary text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  {copiedUserId === member.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Credentials</span>
                    </>
                  )}
                </button>

                {/* Edit Role & Credentials */}
                <button
                  onClick={() => {
                    setEditingUser(member);
                    setEditName(member.name);
                    setEditEmail(member.email);
                    setEditPhone(member.phone || "");
                    setEditJoinedDate(member.joinedDate || "");
                    setEditBio(member.bio || "");
                    setEditPathwayName(member.pathwayName || "");
                    setEditPathwayLevel(member.pathwayLevel || 0);
                    setEditSpeechesDelivered(member.speechesDelivered || 0);
                    setEditRolesCompleted(member.rolesCompleted || 0);
                    setEditRole(member.role);
                    setEditExecutiveTitle(member.executiveTitle || "");
                    setEditPassword(member.password || "");
                  }}
                  className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] text-terra-text-secondary hover:text-terra-text-primary transition-colors"
                  title="Edit Member Profile & Access"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Member (Cannot delete oneself) */}
                {member.id !== currentUser.id && (
                  <button
                    onClick={() => setDeletingUser(member)}
                    className="p-2 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-xs text-terra-text-tertiary">
              No members found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-terra-amber" />
                <h3 className="font-display font-bold text-base">Add New Club Member</h3>
              </div>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Full Member Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. TM John Doe"
                    required
                    className="flex-1 px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
                  />
                  <button
                    type="button"
                    onClick={handleAutoGenerate}
                    className="px-3 py-2 rounded-xl bg-terra-amber/10 text-terra-amber font-semibold text-xs hover:bg-terra-amber/20 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Gen</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Assigned Role</label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  >
                    <option value="member">Club Member</option>
                    <option value="officer">ExComm Officer</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Executive Title (Optional)</label>
                  <input
                    type="text"
                    value={addExecutiveTitle}
                    onChange={(e) => setAddExecutiveTitle(e.target.value)}
                    placeholder="e.g. Vice President Membership"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-terra-amber/[0.03] border border-terra-amber/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-terra-amber text-xs flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>Login Credentials</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoGenerate}
                    className="text-[11px] text-terra-amber hover:underline font-medium"
                  >
                    Regenerate Credentials
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-semibold text-terra-text-secondary">Username</label>
                    <input
                      type="text"
                      value={addUsername}
                      onChange={(e) => setAddUsername(e.target.value)}
                      placeholder="e.g. johndoe"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-semibold text-terra-text-secondary">Initial Password</label>
                    <input
                      type="text"
                      value={addPassword}
                      onChange={(e) => setAddPassword(e.target.value)}
                      placeholder="e.g. Terra#8392"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Email Address</label>
                  <input
                    type="email"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="johndoe@terra.club"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Phone Number</label>
                  <input
                    type="text"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Bio & Focus (Optional)</label>
                <textarea
                  value={addBio}
                  onChange={(e) => setAddBio(e.target.value)}
                  placeholder="Short member introduction..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  Create Member Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER PROFILE & ACCESS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-terra-amber/10 text-terra-amber flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Edit Member Profile & Access</h3>
                  <p className="text-[11px] text-terra-text-secondary">@{editingUser.username} • {editingUser.name}</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)}>
                <X className="w-4 h-4 text-terra-text-tertiary" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Member Joining Date</label>
                  <input
                    type="date"
                    value={editJoinedDate}
                    onChange={(e) => setEditJoinedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Club Role Level</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  >
                    <option value="member">Club Member</option>
                    <option value="officer">ExComm Officer</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Executive Title</label>
                  <input
                    type="text"
                    value={editExecutiveTitle}
                    onChange={(e) => setEditExecutiveTitle(e.target.value)}
                    placeholder="e.g. Club Secretary, Club Treasurer, SAA..."
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Pathway Education Track</label>
                  <input
                    type="text"
                    value={editPathwayName}
                    onChange={(e) => setEditPathwayName(e.target.value)}
                    placeholder="e.g. Presentation Mastery"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Pathway Level (0 - 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={editPathwayLevel}
                    onChange={(e) => setEditPathwayLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Speeches Delivered</label>
                  <input
                    type="number"
                    min={0}
                    value={editSpeechesDelivered}
                    onChange={(e) => setEditSpeechesDelivered(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-terra-text-secondary">Roles Completed</label>
                  <input
                    type="number"
                    min={0}
                    value={editRolesCompleted}
                    onChange={(e) => setEditRolesCompleted(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="font-semibold text-terra-text-secondary">Bio / Elevator Pitch</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Short member summary..."
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs"
                />
              </div>

              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-terra-text-secondary">Update / Reset Password</label>
                  <button
                    type="button"
                    onClick={() => setEditPassword(`Terra#${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[11px] text-terra-amber hover:underline"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave blank to keep existing password"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  Save Member Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display font-bold text-base">Remove {deletingUser.name}?</h3>
              <p className="text-xs text-terra-text-secondary mt-1">
                This will delete their login credentials and member profile from the Terra database.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="w-1/2 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="w-1/2 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 active:scale-95 transition-all shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
