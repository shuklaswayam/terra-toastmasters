"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTerraStore } from "@/lib/store";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Clock,
  Volume2,
  LogOut,
  Users,
  Calendar,
  Layers,
  Megaphone,
  Printer,
  Wrench,
  Radio,
  Trophy,
  User,
  ChevronRight,
} from "lucide-react";
import { InMeetingAssistant } from "../in-meeting/InMeetingAssistant";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    notifications,
    announcements,
    logout,
    markNotificationRead,
    clearAllNotifications,
  } = useTerraStore();

  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
        setShowAdminMenu(false);
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    router.push("/auth/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/portal" },
    { name: "Meetings", href: "/meetings" },
    { name: "Contests", href: "/contests" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Members", href: "/members" },
    { name: "Analytics", href: "/analytics" },
  ];

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const urgentAnnouncement = announcements.find(
    (a) => a.isActive && (a.priority === "urgent" || a.priority === "important")
  );

  const isRoleToolsActive = pathname.startsWith("/tools");
  const isAdminActive = pathname.startsWith("/admin");
  const isExCommOrAdmin = currentUser?.role === "admin" || currentUser?.role === "officer";

  // Hide on login page
  if (pathname === "/auth/login") return null;

  return (
    <header className="sticky top-0 z-40 w-full transition-colors" ref={navRef}>
      {/* Top Urgent Announcement Banner */}
      {urgentAnnouncement && (
        <div className="bg-amber-500 text-black px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 text-center shadow-xs">
          <span className="px-1.5 py-0.5 rounded bg-black/10 text-[10px] uppercase font-bold tracking-wider">
            {urgentAnnouncement.priority}
          </span>
          <span>
            {urgentAnnouncement.title}: {urgentAnnouncement.content}
          </span>
        </div>
      )}

      {/* Main Frosted Glass Navbar */}
      <div className="terra-glass border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-6">
            <Link
              href="/portal"
              className="flex items-center gap-2 font-display text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span>Terra</span>
              <span className="w-2 h-2 rounded-full bg-terra-amber animate-pulse" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-full border border-black/[0.04] dark:border-white/[0.06]">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/portal" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                        : "text-terra-text-secondary hover:text-terra-text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools, Admin Console, and Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-3 sm:ml-6 pl-3 sm:pl-4 border-l border-black/[0.06] dark:border-white/[0.08]">
            {/* 1. ROLE TOOLS DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowToolsMenu(!showToolsMenu);
                  setShowAdminMenu(false);
                  setShowUserMenu(false);
                  setShowNotifications(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isRoleToolsActive || showToolsMenu
                    ? "bg-terra-amber/15 text-terra-amber border border-terra-amber/30 shadow-xs"
                    : "bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-terra-text-secondary hover:text-terra-text-primary hover:bg-black/[0.06]"
                }`}
                title="Meeting Functionary & Speaker Tools"
              >
                <Wrench className="w-3.5 h-3.5 text-terra-amber" />
                <span className="font-semibold">Tools</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-150 ${
                    showToolsMenu ? "rotate-180 text-terra-amber" : "text-terra-text-tertiary"
                  }`}
                />
              </button>

              {showToolsMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-float p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2.5 py-1.5 border-b border-black/[0.04] dark:border-white/[0.04] mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-terra-text-tertiary tracking-wider">
                      Role & Meeting Tools
                    </span>
                    <span className="text-[10px] text-terra-amber font-medium">Live Studio</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/tools/timer"
                      onClick={() => setShowToolsMenu(false)}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-terra-text-primary">Speech Timer Card</span>
                        <span className="text-[11px] text-terra-text-secondary leading-tight block">
                          Green/Amber/Red stopwatch & timing record generator
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/tools/ah-counter"
                      onClick={() => setShowToolsMenu(false)}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-terra-amber/10 text-terra-amber group-hover:scale-105 transition-transform">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-terra-text-primary">Ah-Counter & Word Tracker</span>
                        <span className="text-[11px] text-terra-text-secondary leading-tight block">
                          Real-time filler words counter & Word-of-the-Day tallies
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        setShowToolsMenu(false);
                        setShowAssistantModal(true);
                      }}
                      className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group text-left"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <Radio className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-terra-text-primary">In-Meeting Assistant</span>
                        <span className="text-[11px] text-terra-text-secondary leading-tight block">
                          Live stage drawer with agenda progress & snap sharing
                        </span>
                      </div>
                    </button>

                    <Link
                      href="/meetings"
                      onClick={() => setShowToolsMenu(false)}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-terra-text-primary">Printable Agendas</span>
                        <span className="text-[11px] text-terra-text-secondary leading-tight block">
                          Clean one-page high-contrast meeting agenda printouts
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. ADMIN / EXCOMM CONSOLE DROPDOWN */}
            {isExCommOrAdmin && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAdminMenu(!showAdminMenu);
                    setShowToolsMenu(false);
                    setShowUserMenu(false);
                    setShowNotifications(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isAdminActive || showAdminMenu
                      ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shadow-xs"
                      : "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold">
                    {currentUser?.role === "admin" ? "Admin" : "ExComm"}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-emerald-600 dark:text-emerald-400 transition-transform duration-150 ${
                      showAdminMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-float p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-2.5 py-1.5 border-b border-black/[0.04] dark:border-white/[0.04] mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-terra-text-tertiary tracking-wider">
                        {currentUser?.role === "admin" ? "System Administration" : "Executive Operations"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                        {currentUser?.role === "admin" ? "Full Access" : "ExComm Officer"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {/* Member & Access Manager */}
                      <Link
                        href="/admin/members"
                        onClick={() => setShowAdminMenu(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-terra-amber/10 text-terra-amber group-hover:scale-105 transition-transform">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-semibold text-terra-text-primary">Member & Access Roster</span>
                            <ChevronRight className="w-3 h-3 text-terra-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[11px] text-terra-text-secondary leading-tight block">
                            Manage members, assign roles & reset passwords
                          </span>
                        </div>
                      </Link>

                      {/* Agenda Builder Studio */}
                      <Link
                        href="/admin/meetings/builder"
                        onClick={() => setShowAdminMenu(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-semibold text-terra-text-primary">Agenda Builder Studio</span>
                            <ChevronRight className="w-3 h-3 text-terra-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[11px] text-terra-text-secondary leading-tight block">
                            Schedule meetings, customize agenda & allocate timings
                          </span>
                        </div>
                      </Link>

                      {/* Role Roster Override */}
                      <Link
                        href="/admin/meetings/manage"
                        onClick={() => setShowAdminMenu(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-terra-blue/10 text-terra-blue group-hover:scale-105 transition-transform">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-semibold text-terra-text-primary">Role Slot Manager</span>
                            <ChevronRight className="w-3 h-3 text-terra-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[11px] text-terra-text-secondary leading-tight block">
                            Override slot claims & assign speakers directly
                          </span>
                        </div>
                      </Link>

                      {/* Broadcast Announcements */}
                      <Link
                        href="/admin/announcements"
                        onClick={() => setShowAdminMenu(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-semibold text-terra-text-primary">Broadcast Announcements</span>
                            <ChevronRight className="w-3 h-3 text-terra-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[11px] text-terra-text-secondary leading-tight block">
                            Publish urgent notices & club-wide banners
                          </span>
                        </div>
                      </Link>

                      {/* Contests Studio */}
                      <Link
                        href="/contests"
                        onClick={() => setShowAdminMenu(false)}
                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-semibold text-terra-text-primary">Contests Studio</span>
                            <ChevronRight className="w-3 h-3 text-terra-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[11px] text-terra-text-secondary leading-tight block">
                            Schedule speech contests & contestant orders
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Search Shortcut */}
            <button
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-terra-text-tertiary text-xs hover:text-terra-text-secondary transition-colors"
              title="Search Terra (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-terra-text-secondary transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                  setShowAdminMenu(false);
                  setShowToolsMenu(false);
                }}
                className="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-terra-text-secondary transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terra-rose ring-2 ring-white dark:ring-[#161618]" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-float p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm">Notifications</span>
                      {unreadNotifications.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-terra-amber/10 text-terra-amber text-[10px] font-medium">
                          {unreadNotifications.length} New
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-terra-text-tertiary hover:text-terra-text-secondary"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-terra-text-tertiary">
                        All caught up! No new notifications.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkUrl) router.push(n.linkUrl);
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors text-left ${
                            n.isRead
                              ? "hover:bg-black/[0.02] dark:hover:bg-white/[0.02] opacity-75"
                              : "bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.05]"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {n.type === "success" && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            )}
                            {n.type === "warning" && (
                              <AlertTriangle className="w-4 h-4 text-terra-amber mt-0.5 flex-shrink-0" />
                            )}
                            {n.type === "info" && (
                              <Sparkles className="w-4 h-4 text-terra-blue mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-xs font-semibold">{n.title}</p>
                              <p className="text-xs text-terra-text-secondary mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-terra-text-tertiary mt-1 block">
                                {n.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Menu */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                    setShowAdminMenu(false);
                    setShowToolsMenu(false);
                  }}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-black/10 dark:border-white/10"
                  />
                  <span className="hidden sm:inline text-xs font-semibold">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-terra-text-tertiary" />
                </button>

                {/* Profile Popover */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#161618] border border-black/[0.08] dark:border-white/[0.08] shadow-float p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-2.5 py-2 border-b border-black/[0.04] dark:border-white/[0.04] mb-2">
                      <p className="text-xs font-bold text-terra-text-primary">{currentUser.name}</p>
                      <p className="text-[11px] text-terra-amber font-mono">@{currentUser.username}</p>
                      <p className="text-[11px] text-terra-text-tertiary capitalize mt-0.5">
                        {currentUser.executiveTitle || `${currentUser.role} Member`}
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <Link
                        href="/portal/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-terra-text-secondary" />
                        <span>My Profile & Speeches</span>
                      </Link>
                      <Link
                        href="/analytics"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <Trophy className="w-3.5 h-3.5 text-terra-amber" />
                        <span>Club DCP & Milestones</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-terra-rose hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating In-Meeting Assistant Trigger */}
      {showAssistantModal && (
        <InMeetingAssistant onClose={() => setShowAssistantModal(false)} />
      )}
    </header>
  );
}

export default Navbar;
