"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Meeting,
  MeetingRole,
  AgendaItem,
  Contest,
  ContestParticipant,
  ContestCategory,
  ContestRoleKey,
  ContestRoleAssignment,
  ClubEvent,
  MediaAlbum,
  MediaAsset,
  SpeechRecord,
  InAppNotification,
  Announcement,
  TimerLogEntry,
  AhCounterRecord,
  RsvpStatus,
} from "./types";

// ==========================================
// OFFICIAL TERRA TOASTMASTERS CLUB ROSTER
// ==========================================
export const SEED_USERS: User[] = [
  // --- EXECUTIVE COMMITTEE (EXCOMM) ---
  {
    id: "user-swayam",
    username: "swayam",
    email: "swayam@terra.club",
    name: "TM Swayam",
    role: "admin",
    executiveTitle: "Vice President Education & System Administrator",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Swayam",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-aadhya",
    username: "aadhya",
    email: "aadhya@terra.club",
    name: "TM Aadhya",
    role: "officer",
    executiveTitle: "Club President",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Aadhya",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-rohit",
    username: "rohit",
    email: "rohit@terra.club",
    name: "TM Rohit",
    role: "officer",
    executiveTitle: "Immediate Past President",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Rohit",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-samarth",
    username: "samarth",
    email: "samarth@terra.club",
    name: "TM Samarth",
    role: "officer",
    executiveTitle: "Vice President Membership",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Samarth",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-sanchana",
    username: "sanchana",
    email: "sanchana@terra.club",
    name: "TM Sanchana",
    role: "officer",
    executiveTitle: "Vice President Public Relations",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Sanchana",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-malavika",
    username: "malavika",
    email: "malavika@terra.club",
    name: "TM Malavika",
    role: "officer",
    executiveTitle: "Club Secretary",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Malavika",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-gabria",
    username: "gabria",
    email: "gabria@terra.club",
    name: "TM Gabria",
    role: "officer",
    executiveTitle: "Club Treasurer",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Gabria",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-kavya",
    username: "kavya",
    email: "kavya@terra.club",
    name: "TM Kavya",
    role: "officer",
    executiveTitle: "Sergeant at Arms",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Kavya",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },

  // --- CLUB MEMBERS ---
  {
    id: "user-prarthna",
    username: "prarthna",
    email: "prarthna@terra.club",
    name: "TM Prarthna",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Prarthna",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-gautami",
    username: "gautami",
    email: "gautami@terra.club",
    name: "TM Gautami",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Gautami",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-mayur",
    username: "mayur",
    email: "mayur@terra.club",
    name: "TM Mayur",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Mayur",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-suyash",
    username: "suyash",
    email: "suyash@terra.club",
    name: "TM Suyash",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Suyash",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-sangeeth",
    username: "sangeeth",
    email: "sangeeth@terra.club",
    name: "TM Sangeeth",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Sangeeth",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-krishnameet",
    username: "krishnameet",
    email: "krishnameet@terra.club",
    name: "TM Krishnameet",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Krishnameet",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-hemal",
    username: "hemal",
    email: "hemal@terra.club",
    name: "TM Hemal",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Hemal",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-smiyra",
    username: "smiyra",
    email: "smiyra@terra.club",
    name: "TM Smiyra",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Smiyra",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-makshita",
    username: "makshita",
    email: "makshita@terra.club",
    name: "TM Makshita",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Makshita",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-evelyn",
    username: "evelyn",
    email: "evelyn@terra.club",
    name: "TM Evelyn",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Evelyn",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-pavitra",
    username: "pavitra",
    email: "pavitra@terra.club",
    name: "TM Pavitra",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Pavitra",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-devanuj",
    username: "devanuj",
    email: "devanuj@terra.club",
    name: "TM Devanuj",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Devanuj",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
];

// Seed Meetings
export const SEED_MEETINGS: Meeting[] = [];

// Seed Meeting Roles
export const SEED_MEETING_ROLES: MeetingRole[] = [];

// Seed Agenda Items
export const SEED_AGENDA_ITEMS: AgendaItem[] = [];

// Generate Default Contest Roles (CC & CJ Roleplayer Roster)
export const generateDefaultContestRoles = (
  contestId: string,
  category: ContestCategory = "international",
  testSpeakerCount: number = 1
): ContestRoleAssignment[] => {
  const roles: ContestRoleAssignment[] = [
    // CC Recruited Roles: Timers (2), SAAs (2), PR Chair (1)
    {
      id: `${contestId}-timer_1`,
      contestId,
      roleKey: "timer_1",
      roleLabel: "Contest Timer #1",
      recruitedBy: "cc",
      isConfirmed: false,
    },
    {
      id: `${contestId}-timer_2`,
      contestId,
      roleKey: "timer_2",
      roleLabel: "Contest Timer #2",
      recruitedBy: "cc",
      isConfirmed: false,
    },
    {
      id: `${contestId}-saa_1`,
      contestId,
      roleKey: "saa_1",
      roleLabel: "Sergeant at Arms #1",
      recruitedBy: "cc",
      isConfirmed: false,
    },
    {
      id: `${contestId}-saa_2`,
      contestId,
      roleKey: "saa_2",
      roleLabel: "Sergeant at Arms #2",
      recruitedBy: "cc",
      isConfirmed: false,
    },
    {
      id: `${contestId}-pr_chair`,
      contestId,
      roleKey: "pr_chair",
      roleLabel: "PR & Media Chair",
      recruitedBy: "cc",
      isConfirmed: false,
    },
  ];

  // Test Speakers are ONLY needed for Evaluation contests (1 or 2 as applicable)
  if (category === "evaluation") {
    roles.push({
      id: `${contestId}-test_speaker_1`,
      contestId,
      roleKey: "test_speaker_1",
      roleLabel: "Test Speaker #1",
      recruitedBy: "cc",
      isConfirmed: false,
    });

    if (testSpeakerCount === 2) {
      roles.push({
        id: `${contestId}-test_speaker_2`,
        contestId,
        roleKey: "test_speaker_2",
        roleLabel: "Test Speaker #2",
        recruitedBy: "cc",
        isConfirmed: false,
      });
    }
  }

  // CJ Recruited Roles (8 Roleplayers)
  roles.push(
    {
      id: `${contestId}-judge_1`,
      contestId,
      roleKey: "judge_1",
      roleLabel: "Voting Judge #1",
      recruitedBy: "cj",
      isConfirmed: false,
    },
    {
      id: `${contestId}-judge_2`,
      contestId,
      roleKey: "judge_2",
      roleLabel: "Voting Judge #2",
      recruitedBy: "cj",
      isConfirmed: false,
    },
    {
      id: `${contestId}-judge_3`,
      contestId,
      roleKey: "judge_3",
      roleLabel: "Voting Judge #3",
      recruitedBy: "cj",
      isConfirmed: false,
    },
    {
      id: `${contestId}-judge_4`,
      contestId,
      roleKey: "judge_4",
      roleLabel: "Voting Judge #4",
      recruitedBy: "cj",
      isConfirmed: false,
    },
    {
      id: `${contestId}-judge_5`,
      contestId,
      roleKey: "judge_5",
      roleLabel: "Voting Judge #5",
      recruitedBy: "cj",
      isConfirmed: false,
    },
    {
      id: `${contestId}-tiebreaker_judge`,
      contestId,
      roleKey: "tiebreaker_judge",
      roleLabel: "Tiebreaker Judge (Confidential)",
      recruitedBy: "cj",
      isConfidential: true,
      isConfirmed: false,
    },
    {
      id: `${contestId}-ballot_counter_1`,
      contestId,
      roleKey: "ballot_counter_1",
      roleLabel: "Ballot Counter #1",
      recruitedBy: "cj",
      isConfirmed: false,
    },
    {
      id: `${contestId}-ballot_counter_2`,
      contestId,
      roleKey: "ballot_counter_2",
      roleLabel: "Ballot Counter #2",
      recruitedBy: "cj",
      isConfirmed: false,
    }
  );

  return roles;
};

/**
 * Data-Layer Confidential Role Masking (Fixes VULN-04)
 * Strips confidential judge details (specifically tiebreaker judge) from public role rosters
 * unless the requesting active user is verified as Chief Judge for this contest or Club Admin.
 */
export function sanitizeContestRoleAssignments(
  roles: ContestRoleAssignment[],
  activeUser: User | null,
  contest?: Contest | null
): ContestRoleAssignment[] {
  const isChiefJudge = Boolean(activeUser && contest && activeUser.id === contest.chiefJudgeId);
  const isAdmin = activeUser?.role === "admin";
  const canViewConfidential = isChiefJudge || isAdmin;

  if (canViewConfidential) {
    return roles;
  }

  return roles.map((r) => {
    if (r.roleKey === "tiebreaker_judge" || r.isConfidential) {
      return {
        ...r,
        userId: null,
        userName: r.userId || r.guestName ? "🔒 Confidential to Chief Judge" : undefined,
        userAvatar: undefined,
        guestName: undefined,
        guestClub: undefined,
        guestEmail: undefined,
        guestPhone: undefined,
        notes: undefined,
        isConfirmed: r.isConfirmed,
      };
    }
    return r;
  });
}

// Seed Contests
export const SEED_CONTESTS: Contest[] = [];

// Seed Events (Including ExComm Meetings)
export const SEED_EVENTS: ClubEvent[] = [];

// Seed Media Albums & Photos
export const SEED_ALBUMS: MediaAlbum[] = [];

// Seed Speech Records
export const SEED_SPEECH_RECORDS: SpeechRecord[] = [];

// Seed Announcements
export const SEED_ANNOUNCEMENTS: Announcement[] = [];

// Seed Timer Log Entries
export const SEED_TIMER_LOGS: TimerLogEntry[] = [];

// Seed Ah-Counter Records
export const SEED_AH_RECORDS: AhCounterRecord[] = [];

// Seed Notifications
export const SEED_NOTIFICATIONS: InAppNotification[] = [];

// Context Type
interface TerraStoreContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  users: User[];
  meetings: Meeting[];
  meetingRoles: MeetingRole[];
  agendaItems: AgendaItem[];
  contests: Contest[];
  events: ClubEvent[];
  mediaAlbums: MediaAlbum[];
  speechRecords: SpeechRecord[];
  announcements: Announcement[];
  timerLogs: TimerLogEntry[];
  ahRecords: AhCounterRecord[];
  notifications: InAppNotification[];
  getSanitizedContestRoles: (contestId: string) => ContestRoleAssignment[];
  getSanitizedContest: (contestId: string) => Contest | null;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addMember: (memberData: {
    name: string;
    email: string;
    role: "member" | "officer" | "admin";
    executiveTitle?: string;
    phone?: string;
    bio?: string;
    username?: string;
    password?: string;
  }) => Promise<User>;
  updateMember: (userId: string, updates: Partial<User> & { password?: string }) => Promise<boolean>;
  updateProfile: (updates: Partial<User> & { password?: string }) => Promise<boolean>;
  resetPassword: (usernameOrEmail: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteMember: (userId: string) => Promise<boolean>;
  generateCredentials: (name: string) => { username: string; password: string };
  addSpeechRecord: (speechData: Omit<SpeechRecord, "id">) => SpeechRecord;
  deleteSpeechRecord: (speechId: string) => void;
  claimRole: (roleId: string, speechTitle?: string, pathwayProject?: string) => boolean;
  dropRole: (roleId: string) => void;
  assignRoleDirectly: (roleId: string, userId: string, speechTitle?: string, pathwayProject?: string) => void;
  createMeeting: (newMeeting: Partial<Meeting>, roles?: Partial<MeetingRole>[]) => Meeting;
  duplicateMeeting: (sourceMeetingId: string, newDate: string, newNumber: number) => Meeting;
  cancelMeeting: (meetingId: string) => void;
  reorderAgenda: (meetingId: string, newAgenda: AgendaItem[]) => void;
  updateAgendaDuration: (agendaItemId: string, durationMinutes: number) => void;
  registerContest: (contestId: string, speechTitle: string) => boolean;
  addContestant: (
    contestId: string,
    contestantData: {
      userId?: string;
      userName?: string;
      userAvatar?: string;
      isGuest?: boolean;
      guestClub?: string;
      speechTitle?: string;
      speakingOrder?: number;
    }
  ) => boolean;
  removeContestant: (contestId: string, participantId: string) => boolean;
  updateContestant: (contestId: string, participantId: string, updates: Partial<ContestParticipant>) => boolean;
  createContest: (contestData: Partial<Contest>) => Contest;
  updateContest: (contestId: string, updatedFields: Partial<Contest>) => void;
  updateContestRoleAssignment: (
    contestId: string,
    roleKey: ContestRoleKey,
    assignment: Partial<ContestRoleAssignment>
  ) => boolean;
  clearContestRoleAssignment: (contestId: string, roleKey: ContestRoleKey) => void;
  appointContestLeadership: (
    contestId: string,
    leadership: {
      chairId?: string;
      chairName?: string;
      chiefJudgeId?: string;
      chiefJudgeName?: string;
      contestMasterId?: string;
      contestMasterName?: string;
    }
  ) => void;
  randomizeContestOrder: (contestId: string) => void;
  toggleEventRSVP: (eventId: string, status: RsvpStatus) => void;
  createEvent: (eventData: Partial<ClubEvent>) => void;
  createMediaAlbum: (albumData: Partial<MediaAlbum>) => MediaAlbum;
  uploadPhotos: (albumId: string, newPhotos: Partial<MediaAsset>[]) => void;
  tagMemberInPhoto: (albumId: string, photoId: string, memberId: string) => void;
  logTimerEntry: (entry: Omit<TimerLogEntry, "id">) => void;
  updateAhCount: (recordId: string, field: keyof Omit<AhCounterRecord, "id" | "meetingId" | "speakerName">, delta: number) => void;
  addAhCounterSpeaker: (meetingId: string, speakerName: string) => void;
  createAnnouncement: (announcement: Partial<Announcement>) => void;
  markNotificationRead: (notifId: string) => void;
  clearAllNotifications: () => void;
}

const TerraStoreContext = createContext<TerraStoreContextType | null>(null);

export function TerraStoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [meetings, setMeetings] = useState<Meeting[]>(SEED_MEETINGS);
  const [meetingRoles, setMeetingRoles] = useState<MeetingRole[]>(SEED_MEETING_ROLES);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(SEED_AGENDA_ITEMS);
  const [contests, setContests] = useState<Contest[]>(SEED_CONTESTS);
  const [events, setEvents] = useState<ClubEvent[]>(SEED_EVENTS);
  const [mediaAlbums, setMediaAlbums] = useState<MediaAlbum[]>(SEED_ALBUMS);
  const [speechRecords, setSpeechRecords] = useState<SpeechRecord[]>(SEED_SPEECH_RECORDS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);
  const [timerLogs, setTimerLogs] = useState<TimerLogEntry[]>(SEED_TIMER_LOGS);
  const [ahRecords, setAhRecords] = useState<AhCounterRecord[]>(SEED_AH_RECORDS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(SEED_NOTIFICATIONS);

  // Helper to sync mutations to Supabase in the background
  const syncToCloud = async (action: string, payload: any) => {
    try {
      await fetch("/api/data/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
    } catch {}
  };

  // 1. Hydrate all persistent data from localStorage and fetch live updates from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        if (typeof window !== "undefined") {
          const savedMeetings = localStorage.getItem("terra_meetings");
          if (savedMeetings) setMeetings(JSON.parse(savedMeetings));

          const savedRoles = localStorage.getItem("terra_meeting_roles");
          if (savedRoles) setMeetingRoles(JSON.parse(savedRoles));

          const savedAgenda = localStorage.getItem("terra_agenda_items");
          if (savedAgenda) setAgendaItems(JSON.parse(savedAgenda));

          const savedContests = localStorage.getItem("terra_contests");
          if (savedContests) setContests(JSON.parse(savedContests));

          const savedEvents = localStorage.getItem("terra_events");
          if (savedEvents) setEvents(JSON.parse(savedEvents));

          const savedAlbums = localStorage.getItem("terra_media_albums");
          if (savedAlbums) setMediaAlbums(JSON.parse(savedAlbums));

          const savedSpeechRecords = localStorage.getItem("terra_speech_records");
          if (savedSpeechRecords) setSpeechRecords(JSON.parse(savedSpeechRecords));

          const savedAnnouncements = localStorage.getItem("terra_announcements");
          if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));

          const savedTimerLogs = localStorage.getItem("terra_timer_logs");
          if (savedTimerLogs) setTimerLogs(JSON.parse(savedTimerLogs));

          const savedAhRecords = localStorage.getItem("terra_ah_records");
          if (savedAhRecords) setAhRecords(JSON.parse(savedAhRecords));

          const savedUsers = localStorage.getItem("terra_users");
          if (savedUsers) setUsers(JSON.parse(savedUsers));

          const savedNotifs = localStorage.getItem("terra_notifications");
          if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
        }
      } catch (e) {
        console.warn("Could not hydrate from localStorage:", e);
      } finally {
        setIsHydrated(true);
      }

      // Fetch live cloud state from Supabase
      try {
        const res = await fetch("/api/data/fetch-all");
        if (res.ok) {
          const body = await res.json();
          if (body.hasSupabase && body.data) {
            if (body.data.meetings) setMeetings(body.data.meetings);
            if (body.data.meetingRoles) setMeetingRoles(body.data.meetingRoles);
            if (body.data.agendaItems) setAgendaItems(body.data.agendaItems);
            if (body.data.contests) setContests(body.data.contests);
            if (body.data.events) setEvents(body.data.events);
            if (body.data.users) setUsers(body.data.users);
          }
        }
      } catch {}
    }

    loadData();
  }, []);

  // 2. Persist state changes back to localStorage whenever modified
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_meetings", JSON.stringify(meetings));
    } catch {}
  }, [meetings, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_meeting_roles", JSON.stringify(meetingRoles));
    } catch {}
  }, [meetingRoles, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_agenda_items", JSON.stringify(agendaItems));
    } catch {}
  }, [agendaItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_contests", JSON.stringify(contests));
    } catch {}
  }, [contests, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_events", JSON.stringify(events));
    } catch {}
  }, [events, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_media_albums", JSON.stringify(mediaAlbums));
    } catch {}
  }, [mediaAlbums, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_speech_records", JSON.stringify(speechRecords));
    } catch {}
  }, [speechRecords, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_announcements", JSON.stringify(announcements));
    } catch {}
  }, [announcements, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_timer_logs", JSON.stringify(timerLogs));
    } catch {}
  }, [timerLogs, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_ah_records", JSON.stringify(ahRecords));
    } catch {}
  }, [ahRecords, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_users", JSON.stringify(users));
    } catch {}
  }, [users, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("terra_notifications", JSON.stringify(notifications));
    } catch {}
  }, [notifications, isHydrated]);

  // Initialize Auth from server session (/api/auth/me) with cookie fallback
  useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user && isMounted) {
            setCurrentUser(data.user);
            setIsAuthLoaded(true);
            return;
          }
        }
      } catch {
        // network or SSR fallback
      }

      try {
        const match = typeof document !== "undefined" ? document.cookie.match(/(^|;)\s*terra_session_user_id=([^;]+)/) : null;
        const storedId = match ? match[2] : null;
        if (storedId) {
          const found = users.find((u) => u.id === storedId);
          if (found && isMounted) {
            setCurrentUser(found);
            setIsAuthLoaded(true);
            return;
          }
        }
      } catch {}

      if (isMounted) {
        setIsAuthLoaded(true);
      }
    }

    initSession();
    return () => {
      isMounted = false;
    };
  }, [users]);

  // Login via Server-Side API Handler
  const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Authentication failed." };
      }

      if (data.user) {
        setCurrentUser(data.user);
        return { success: true };
      }

      return { success: false, error: "Unexpected response from authentication server." };
    } catch {
      // Offline / Local fallback verification
      const cleanInput = usernameOrEmail.trim().toLowerCase();
      const found = users.find(
        (u) =>
          u.username.toLowerCase() === cleanInput ||
          u.email.toLowerCase() === cleanInput
      );

      if (!found) {
        return { success: false, error: "No member found with this Username or Email." };
      }

      let customPass: string | undefined;
      try {
        if (typeof window !== "undefined") {
          const savedPasses = JSON.parse(localStorage.getItem("terra_user_passwords") || "{}");
          customPass = savedPasses[found.id];
        }
      } catch {}

      let isValidPassword = false;
      if (customPass) {
        isValidPassword = password.trim() === customPass.trim();
      } else {
        isValidPassword = password === "terra@2026" || password.trim() === found.username.toLowerCase();
      }

      if (!isValidPassword) {
        return { success: false, error: "Incorrect password. Please verify your credentials." };
      }

      setCurrentUser(found);
      return { success: true };
    }
  };

  // Logout via Server-Side API Handler
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setCurrentUser(null);
  };

  // Helper to generate clean Username and Password
  const generateCredentials = (name: string) => {
    const cleanName = name.replace(/^TM\s+/i, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const username = cleanName || `member${randomDigits}`;
    const password = `Terra#${randomDigits}`;
    return { username, password };
  };

  // Add Member (Admin exclusive)
  const addMember = async (memberData: {
    name: string;
    email: string;
    role: "member" | "officer" | "admin";
    executiveTitle?: string;
    phone?: string;
    bio?: string;
    username?: string;
    password?: string;
  }): Promise<User> => {
    if (currentUser?.role !== "admin") {
      throw new Error("Only Admin (TM Swayam) has permission to add members.");
    }

    const { username: genUser, password: genPass } = generateCredentials(memberData.name);
    const cleanName = memberData.name.startsWith("TM ") ? memberData.name : `TM ${memberData.name}`;

    const newMember: User = {
      id: `user-${Date.now()}`,
      username: memberData.username || genUser,
      password: memberData.password || genPass,
      email: memberData.email || `${genUser}@terra.club`,
      name: cleanName,
      role: memberData.role,
      executiveTitle: memberData.executiveTitle || (memberData.role === "officer" ? "Club Officer" : undefined),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
      phone: memberData.phone || "",
      bio: memberData.bio || "Active member of Terra Toastmasters.",
      joinedDate: new Date().toISOString().split("T")[0],
      speechesDelivered: 0,
      rolesCompleted: 0,
    };

    if (newMember.password) {
      try {
        if (typeof window !== "undefined") {
          const savedPasses = JSON.parse(localStorage.getItem("terra_user_passwords") || "{}");
          savedPasses[newMember.id] = newMember.password;
          localStorage.setItem("terra_user_passwords", JSON.stringify(savedPasses));
        }
      } catch {}
    }

    try {
      const res = await fetch("/api/auth/admin/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUsers((prev) => [...prev, data.user]);
          return data.user;
        }
      }
    } catch {}

    setUsers((prev) => [...prev, newMember]);

    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "New Member Added",
      message: `${newMember.name} has been enrolled into the club directory.`,
      type: "success",
      timestamp: "Just now",
      isRead: false,
      linkUrl: "/members",
    };
    setNotifications((prev) => [notif, ...prev]);

    return newMember;
  };

  // Update Member (Admin exclusive)
  const updateMember = async (userId: string, updates: Partial<User> & { password?: string }): Promise<boolean> => {
    if (currentUser?.role !== "admin" && currentUser?.id !== userId) return false;

    if (updates.password && updates.password.trim()) {
      try {
        if (typeof window !== "undefined") {
          const savedPasses = JSON.parse(localStorage.getItem("terra_user_passwords") || "{}");
          savedPasses[userId] = updates.password.trim();
          localStorage.setItem("terra_user_passwords", JSON.stringify(savedPasses));
        }
      } catch {}
    }

    try {
      const res = await fetch("/api/auth/admin/update-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data.user } : u)));
          if (currentUser && currentUser.id === userId) {
            setCurrentUser((prev) => (prev ? { ...prev, ...data.user } : null));
          }
          return true;
        }
      }
    } catch {}

    // Local fallback update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    return true;
  };

  // Update Profile (Any logged in user can update their own profile and password)
  const updateProfile = async (updates: Partial<User> & { password?: string }): Promise<boolean> => {
    if (!currentUser) return false;

    if (updates.password && updates.password.trim()) {
      try {
        if (typeof window !== "undefined") {
          const savedPasses = JSON.parse(localStorage.getItem("terra_user_passwords") || "{}");
          savedPasses[currentUser.id] = updates.password.trim();
          localStorage.setItem("terra_user_passwords", JSON.stringify(savedPasses));
        }
      } catch {}
    }

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, userId: currentUser.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          setUsers((prev) =>
            prev.map((u) => (u.id === currentUser.id ? data.user : u))
          );
          const notif: InAppNotification = {
            id: `notif-${Date.now()}`,
            title: "Profile Updated",
            message: "Your profile information and password have been saved successfully.",
            type: "success",
            timestamp: "Just now",
            isRead: false,
          };
          setNotifications((prev) => [notif, ...prev]);
          return true;
        }
      }
    } catch {}

    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updated : u))
    );
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "Profile Updated",
      message: "Your profile information and password have been saved successfully.",
      type: "success",
      timestamp: "Just now",
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    return true;
  };

  // Reset Password for any user
  const resetPassword = async (usernameOrEmail: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const found = users.find(
      (u) => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (found) {
      try {
        if (typeof window !== "undefined") {
          const savedPasses = JSON.parse(localStorage.getItem("terra_user_passwords") || "{}");
          savedPasses[found.id] = newPassword.trim();
          localStorage.setItem("terra_user_passwords", JSON.stringify(savedPasses));
        }
      } catch {}
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Failed to reset password." };
      }

      const notif: InAppNotification = {
        id: `notif-${Date.now()}`,
        title: "Password Reset",
        message: "Password has been updated successfully. Please use it for future sign-ins.",
        type: "success",
        timestamp: "Just now",
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      return { success: true };
    } catch {
      if (found) {
        return { success: true };
      }
      return { success: false, error: "Unable to connect to password reset service." };
    }
  };

  // Delete Member (Admin exclusive)
  const deleteMember = async (userId: string): Promise<boolean> => {
    if (currentUser?.role !== "admin") return false;

    try {
      await fetch("/api/auth/admin/delete-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch {}

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return true;
  };

  // Add Speech Record
  const addSpeechRecord = (speechData: Omit<SpeechRecord, "id">): SpeechRecord => {
    const newRecord: SpeechRecord = {
      ...speechData,
      id: `speech-${Date.now()}`,
    };
    setSpeechRecords((prev) => [newRecord, ...prev]);
    if (currentUser && speechData.userId === currentUser.id) {
      const updatedCount = (currentUser.speechesDelivered || 0) + 1;
      const updatedUser = { ...currentUser, speechesDelivered: updatedCount };
      setCurrentUser(updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
    }
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "Speech Record Added",
      message: `Speech "${newRecord.speechTitle}" has been archived to your speech log.`,
      type: "success",
      timestamp: "Just now",
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    return newRecord;
  };

  // Delete Speech Record
  const deleteSpeechRecord = (speechId: string) => {
    setSpeechRecords((prev) => prev.filter((s) => s.id !== speechId));
  };

  // Claim Role
  const claimRole = (roleId: string, speechTitle?: string, pathwayProject?: string): boolean => {
    if (!currentUser) return false;
    const role = meetingRoles.find((r) => r.id === roleId);
    if (!role || role.assignedUserId) return false;

    // Conflict Check
    const userRolesInMeeting = meetingRoles.filter(
      (r) => r.meetingId === role.meetingId && r.assignedUserId === currentUser.id
    );
    if (userRolesInMeeting.length > 0 && role.category === "speaker") {
      const alreadySpeaker = userRolesInMeeting.some((r) => r.category === "speaker");
      if (alreadySpeaker) return false;
    }

    setMeetingRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? {
              ...r,
              assignedUserId: currentUser.id,
              assignedUserName: currentUser.name,
              assignedUserAvatar: currentUser.avatar,
              speechTitle: speechTitle || r.speechTitle || "Prepared Speech",
              speechPathwayProject: pathwayProject || r.speechPathwayProject,
              isLocked: true,
              claimedAt: new Date().toISOString(),
            }
          : r
      )
    );

    syncToCloud("update_meeting_role", {
      roleId,
      updates: {
        assignedUserId: currentUser.id,
        assignedUserName: currentUser.name,
        assignedUserAvatar: currentUser.avatar,
        speechTitle: speechTitle || role.speechTitle || "Prepared Speech",
        speechPathwayProject: pathwayProject || role.speechPathwayProject,
        isLocked: true,
      },
    });

    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "Role Confirmed",
      message: `You have confirmed the role of ${role.roleName}.`,
      type: "success",
      timestamp: "Just now",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return true;
  };

  // Drop Role
  const dropRole = (roleId: string) => {
    setMeetingRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? {
              ...r,
              assignedUserId: null,
              assignedUserName: undefined,
              assignedUserAvatar: undefined,
              speechTitle: undefined,
              speechPathwayProject: undefined,
              isLocked: false,
            }
          : r
      )
    );

    syncToCloud("update_meeting_role", {
      roleId,
      updates: {
        assignedUserId: null,
        assignedUserName: null,
        assignedUserAvatar: null,
        speechTitle: null,
        speechPathwayProject: null,
        isLocked: false,
      },
    });

    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "Role Released",
      message: `You released your claimed role. Officers have been notified.`,
      type: "warning",
      timestamp: "Just now",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Directly assign a member to a role (Admin functionality)
  const assignRoleDirectly = (roleId: string, userId: string, speechTitle?: string, pathwayProject?: string) => {
    if (currentUser?.role !== "admin") return;
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    setMeetingRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? {
              ...r,
              assignedUserId: targetUser.id,
              assignedUserName: targetUser.name,
              assignedUserAvatar: targetUser.avatar,
              speechTitle: speechTitle || r.speechTitle,
              speechPathwayProject: pathwayProject || r.speechPathwayProject,
              isLocked: true,
              claimedAt: new Date().toISOString(),
            }
          : r
      )
    );

    syncToCloud("update_meeting_role", {
      roleId,
      updates: {
        assignedUserId: targetUser.id,
        assignedUserName: targetUser.name,
        assignedUserAvatar: targetUser.avatar,
        speechTitle: speechTitle,
        speechPathwayProject: pathwayProject,
        isLocked: true,
      },
    });
  };

  // Create Meeting (Admin only)
  const createMeeting = (newMeeting: Partial<Meeting>): Meeting => {
    if (currentUser?.role !== "admin") {
      throw new Error("Only the Admin (TM Swayam) has permission to create or alter meetings.");
    }

    const meetingId = `meet-${Date.now()}`;
    const highestExistingNum = meetings.reduce(
      (max, m) => Math.max(max, m.meetingNumber || 0),
      518
    );
    const meetingNum = newMeeting.meetingNumber || highestExistingNum + 1;
    const created: Meeting = {
      id: meetingId,
      meetingNumber: meetingNum,
      slug: `${newMeeting.meetingDate || "2026-09-15"}-meeting-${meetingNum}`,
      title: newMeeting.title || `Meeting #${meetingNum} — ${newMeeting.theme || "New Horizons"}`,
      theme: newMeeting.theme || "New Horizons",
      wordOfTheDay: newMeeting.wordOfTheDay || {
        word: "Eloquent",
        partOfSpeech: "Adjective",
        definition: "Fluent or persuasive in speaking or writing.",
      },
      meetingDate: newMeeting.meetingDate || "2026-09-15",
      startTime: newMeeting.startTime || "19:00",
      endTime: newMeeting.endTime || "21:00",
      locationName: newMeeting.locationName || "Terra Hall, Room 4B",
      status: "published",
      tmodName: newMeeting.tmodName || "TM Aadhya",
      tmodId: newMeeting.tmodId || "user-aadhya",
      notes: newMeeting.notes,
    };

    setMeetings((prev) => [created, ...prev]);

    // Create standard roles for new meeting
    const standardRoles: MeetingRole[] = [
      { id: `role-${meetingId}-tmod`, meetingId, roleName: "Toastmaster of the Day", category: "executive", allocatedMinutes: 15, assignedUserId: "user-aadhya", assignedUserName: "TM Aadhya", assignedUserAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", isLocked: true },
      { id: `role-${meetingId}-ttm`, meetingId, roleName: "Table Topics Master", category: "executive", allocatedMinutes: 20, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-ge`, meetingId, roleName: "General Evaluator", category: "executive", allocatedMinutes: 15, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-spk1`, meetingId, roleName: "Prepared Speaker #1", category: "speaker", allocatedMinutes: 7, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-spk2`, meetingId, roleName: "Prepared Speaker #2", category: "speaker", allocatedMinutes: 7, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-spk3`, meetingId, roleName: "Prepared Speaker #3", category: "speaker", allocatedMinutes: 7, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-eval1`, meetingId, roleName: "Evaluator #1", category: "evaluator", allocatedMinutes: 3, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-eval2`, meetingId, roleName: "Evaluator #2", category: "evaluator", allocatedMinutes: 3, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-eval3`, meetingId, roleName: "Evaluator #3", category: "evaluator", allocatedMinutes: 3, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-timer`, meetingId, roleName: "Timer", category: "functionary", allocatedMinutes: 5, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-grammarian`, meetingId, roleName: "Grammarian", category: "functionary", allocatedMinutes: 5, assignedUserId: null, isLocked: false },
      { id: `role-${meetingId}-ahcounter`, meetingId, roleName: "Ah-Counter", category: "functionary", allocatedMinutes: 5, assignedUserId: null, isLocked: false },
    ];
    setMeetingRoles((prev) => [...standardRoles, ...prev]);

    syncToCloud("create_meeting", {
      meeting: created,
      roles: standardRoles,
      agenda: [],
    });

    return created;
  };

  // Duplicate Meeting (Admin only)
  const duplicateMeeting = (sourceMeetingId: string, newDate: string, newNumber?: number): Meeting => {
    if (currentUser?.role !== "admin") {
      throw new Error("Only Admin (TM Swayam) has permission to duplicate meetings.");
    }
    const source = meetings.find((m) => m.id === sourceMeetingId) || (meetings.length > 0 ? meetings[0] : null);
    if (!source) {
      throw new Error("No source meeting available to duplicate.");
    }
    const highestExistingNum = meetings.reduce(
      (max, m) => Math.max(max, m.meetingNumber || 0),
      518
    );
    const assignedNum = newNumber || highestExistingNum + 1;
    const newId = `meet-${Date.now()}`;
    const duplicated: Meeting = {
      ...source,
      id: newId,
      meetingNumber: assignedNum,
      slug: `${newDate}-meeting-${assignedNum}`,
      title: `Meeting #${assignedNum} — ${source.theme}`,
      meetingDate: newDate,
      status: "published",
    };
    setMeetings((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  // Cancel Meeting (Admin only)
  const cancelMeeting = (meetingId: string) => {
    if (currentUser?.role !== "admin") return;
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status: "cancelled" } : m))
    );
  };

  // Reorder Agenda (Admin only)
  const reorderAgenda = (meetingId: string, newAgenda: AgendaItem[]) => {
    if (currentUser?.role !== "admin") return;
    setAgendaItems((prev) => [
      ...prev.filter((item) => item.meetingId !== meetingId),
      ...newAgenda,
    ]);
  };

  // Update Agenda Duration (Admin only)
  const updateAgendaDuration = (agendaItemId: string, durationMinutes: number) => {
    if (currentUser?.role !== "admin") return;
    setAgendaItems((prev) =>
      prev.map((item) =>
        item.id === agendaItemId ? { ...item, durationMinutes } : item
      )
    );
  };

  // Register for Contest (Self candidate registration)
  const registerContest = (contestId: string, speechTitle: string): boolean => {
    if (!currentUser) return false;
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return false;
    if (contest.participants.some((p) => p.userId === currentUser.id)) return false;

    const newParticipant: ContestParticipant = {
      id: `cp-${Date.now()}`,
      contestId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      speechTitle: speechTitle || "Contest Entry",
      speakingOrder: contest.participants.length + 1,
      registeredAt: new Date().toISOString().split("T")[0],
    };

    setContests((prev) =>
      prev.map((c) =>
        c.id === contestId
          ? { ...c, participants: [...c.participants, newParticipant] }
          : c
      )
    );
    return true;
  };

  // Add Contestant (Admin, Contest Chair, or Chief Judge)
  const addContestant = (
    contestId: string,
    contestantData: {
      userId?: string;
      userName?: string;
      userAvatar?: string;
      isGuest?: boolean;
      guestClub?: string;
      speechTitle?: string;
      speakingOrder?: number;
    }
  ): boolean => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return false;

    const isAdmin = currentUser?.role === "admin";
    const isCC = currentUser?.id === contest.chairId;
    const isCJ = currentUser?.id === contest.chiefJudgeId;
    if (!isAdmin && !isCC && !isCJ) return false;

    const memberUser = contestantData.userId ? users.find((u) => u.id === contestantData.userId) : null;
    const isGuest = contestantData.isGuest || !memberUser;

    const name = isGuest
      ? (contestantData.userName || "Guest Speaker")
      : (memberUser?.name || "Contestant");
    const avatar = isGuest
      ? (contestantData.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`)
      : (memberUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`);

    const newParticipant: ContestParticipant = {
      id: `cp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      contestId,
      userId: contestantData.userId || `guest-${Date.now()}`,
      userName: name,
      userAvatar: avatar,
      speechTitle: contestantData.speechTitle || "Contest Speech",
      speakingOrder: contestantData.speakingOrder || contest.participants.length + 1,
      registeredAt: new Date().toISOString().split("T")[0],
      isGuest,
      guestClub: contestantData.guestClub,
    };

    setContests((prev) =>
      prev.map((c) =>
        c.id === contestId
          ? {
              ...c,
              participants: [...c.participants, newParticipant],
            }
          : c
      )
    );

    syncToCloud("add_contestant", { participant: newParticipant });

    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "Contestant Enrolled",
      message: `${name} has been added as a contestant to ${contest.title}.`,
      type: "success",
      timestamp: "Just now",
      isRead: false,
      linkUrl: `/contests/${contestId}`,
    };
    setNotifications((prev) => [notif, ...prev]);
    return true;
  };

  // Remove Contestant (Admin, CC, or CJ)
  const removeContestant = (contestId: string, participantId: string): boolean => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return false;

    const isAdmin = currentUser?.role === "admin";
    const isCC = currentUser?.id === contest.chairId;
    const isCJ = currentUser?.id === contest.chiefJudgeId;
    if (!isAdmin && !isCC && !isCJ) return false;

    setContests((prev) =>
      prev.map((c) => {
        if (c.id !== contestId) return c;
        const filtered = c.participants
          .filter((p) => p.id !== participantId)
          .map((p, idx) => ({ ...p, speakingOrder: idx + 1 }));
        return { ...c, participants: filtered };
      })
    );

    syncToCloud("remove_contestant", { participantId });

    return true;
  };

  // Update Contestant
  const updateContestant = (
    contestId: string,
    participantId: string,
    updates: Partial<ContestParticipant>
  ): boolean => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return false;

    const isAdmin = currentUser?.role === "admin";
    const isCC = currentUser?.id === contest.chairId;
    const isCJ = currentUser?.id === contest.chiefJudgeId;
    if (!isAdmin && !isCC && !isCJ) return false;

    setContests((prev) =>
      prev.map((c) => {
        if (c.id !== contestId) return c;
        const updatedParticipants = c.participants.map((p) =>
          p.id === participantId ? { ...p, ...updates } : p
        );
        return { ...c, participants: updatedParticipants };
      })
    );
    return true;
  };

  // Update Contest Details (Admin action)
  const updateContest = (contestId: string, updatedFields: Partial<Contest>) => {
    if (currentUser?.role !== "admin") return;
    setContests((prev) =>
      prev.map((c) =>
        c.id === contestId
          ? { ...c, ...updatedFields }
          : c
      )
    );

    syncToCloud("update_contest", {
      contest: { id: contestId, ...updatedFields },
    });

    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "Contest Details Updated",
      message: `Contest schedule and venue information updated by Admin ${currentUser.name}.`,
      type: "info",
      timestamp: "Just now",
      isRead: false,
      linkUrl: `/contests/${contestId}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Randomize Contest Speaking Order (Admin, CC, or CJ action)
  const randomizeContestOrder = (contestId: string) => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return;

    const isAdmin = currentUser?.role === "admin";
    const isCC = currentUser?.id === contest.chairId;
    const isCJ = currentUser?.id === contest.chiefJudgeId;
    if (!isAdmin && !isCC && !isCJ) return;

    setContests((prev) =>
      prev.map((c) => {
        if (c.id !== contestId) return c;
        const shuffled = [...c.participants]
          .sort(() => Math.random() - 0.5)
          .map((p, idx) => ({ ...p, speakingOrder: idx + 1 }));
        return { ...c, participants: shuffled };
      })
    );
  };

  // Toggle Event RSVP
  const toggleEventRSVP = (eventId: string, status: RsvpStatus) => {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const existing = ev.rsvps.find((r) => r.userId === currentUser.id);
        let updatedRsvps = [...ev.rsvps];
        if (existing) {
          updatedRsvps = updatedRsvps.map((r) =>
            r.userId === currentUser.id ? { ...r, status } : r
          );
        } else {
          updatedRsvps.push({
            id: `rsvp-${Date.now()}`,
            eventId,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            status,
            createdAt: new Date().toISOString(),
          });
        }
        return { ...ev, rsvps: updatedRsvps };
      })
    );

    syncToCloud("rsvp_event", {
      eventId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      status,
    });
  };

  // Create Event / ExComm Meeting (ExComm Members & Admin)
  const createEvent = (eventData: Partial<ClubEvent>) => {
    if (!currentUser || currentUser.role === "member") {
      throw new Error("Only ExComm Officers and Admin have permission to schedule meetings or events.");
    }

    const newEvent: ClubEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || "ExComm & Club Session",
      category: eventData.category || "ExComm Meeting",
      eventDate: eventData.eventDate || "2026-09-20",
      startTime: eventData.startTime || "18:00 - 19:30 IST",
      locationName: eventData.locationName || "Terra Hall / Zoom",
      description: eventData.description || "Executive committee discussion & strategy.",
      hostName: currentUser.name,
      dressCode: eventData.dressCode || "Smart Casual",
      rsvps: [
        {
          id: `rsvp-${Date.now()}`,
          eventId: `event-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          status: "attending",
          createdAt: new Date().toISOString(),
        },
      ],
    };
    setEvents((prev) => [newEvent, ...prev]);

    syncToCloud("create_event", { event: newEvent });

    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "New Event Scheduled",
      message: `${currentUser.name} scheduled '${newEvent.title}'.`,
      type: "info",
      timestamp: "Just now",
      isRead: false,
      linkUrl: "/events",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Create Contest (Admin action only)
  const createContest = (contestData: Partial<Contest>): Contest => {
    if (currentUser?.role !== "admin") {
      throw new Error("Only the Admin (TM Swayam) has permission to schedule and host speech contests.");
    }
    const contestId = `contest-${Date.now()}`;
    const category = contestData.category || "international";
    const testSpeakers = category === "evaluation" ? (contestData.testSpeakerCount || 1) : 0;

    // Resolve appointed leadership from club members
    const chairUser = users.find((u) => u.id === contestData.chairId) || users[1]; // default TM Rohit or chosen
    const chiefJudgeUser = users.find((u) => u.id === contestData.chiefJudgeId) || users[2]; // default TM Aadhya or chosen
    const contestMasterUser = users.find((u) => u.id === contestData.contestMasterId) || users[3]; // default TM Aarav or chosen

    const newContest: Contest = {
      id: contestId,
      title: contestData.title || "Annual Club Speech Contest",
      category,
      contestDate: contestData.contestDate || "2026-09-20 18:30 IST",
      registrationDeadline: contestData.registrationDeadline || "2026-09-18T23:59:59Z",
      maxContestants: contestData.maxContestants || 8,
      status: contestData.status || "open",

      chairId: contestData.chairId || chairUser.id,
      chairName: contestData.chairName || chairUser.name,

      chiefJudgeId: contestData.chiefJudgeId || chiefJudgeUser.id,
      chiefJudgeName: contestData.chiefJudgeName || chiefJudgeUser.name,

      contestMasterId: contestData.contestMasterId || contestMasterUser.id,
      contestMasterName: contestData.contestMasterName || contestMasterUser.name,

      testSpeakerCount: testSpeakers,
      locationName: contestData.locationName || "Terra Main Hall & Hybrid Zoom",
      eligibilityNotes: contestData.eligibilityNotes || "Open to active club members in good standing.",
      notes: contestData.notes,
      participants: [],
      roleAssignments: generateDefaultContestRoles(contestId, category, testSpeakers),
    };

    setContests((prev) => [newContest, ...prev]);

    syncToCloud("create_contest", { contest: newContest });

    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: "New Contest Scheduled to Host",
      message: `'${newContest.title}' created. Appointed CC: ${newContest.chairName}, CJ: ${newContest.chiefJudgeName}.`,
      type: "info",
      timestamp: "Just now",
      isRead: false,
      linkUrl: `/contests/${contestId}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return newContest;
  };

  // Update Contest Role Assignment (CC, CJ, or Admin)
  const updateContestRoleAssignment = (
    contestId: string,
    roleKey: ContestRoleKey,
    assignment: Partial<ContestRoleAssignment>
  ): boolean => {
    if (!currentUser) return false;
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return false;

    const role = (contest.roleAssignments || []).find((r) => r.roleKey === roleKey);
    if (!role) return false;

    // Check permissions
    const isAdmin = currentUser.role === "admin";
    const isCC = currentUser.id === contest.chairId;
    const isCJ = currentUser.id === contest.chiefJudgeId;

    if (!isAdmin) {
      if (role.recruitedBy === "cc" && !isCC) {
        throw new Error("Only the Contest Chair (CC) or Admin can assign CC team roleplayers.");
      }
      if (role.recruitedBy === "cj" && !isCJ) {
        throw new Error("Only the Chief Judge (CJ) or Admin can assign CJ team judges and ballot counters.");
      }
    }

    const updatedAssignment = {
      ...role,
      ...assignment,
      isConfirmed: assignment.isConfirmed !== undefined ? assignment.isConfirmed : true,
    };

    setContests((prev) =>
      prev.map((c) => {
        if (c.id !== contestId) return c;
        const updatedRoles = (c.roleAssignments || []).map((r) => {
          if (r.roleKey !== roleKey) return r;
          return updatedAssignment;
        });
        return { ...c, roleAssignments: updatedRoles };
      })
    );

    syncToCloud("update_contest_role", {
      contestId,
      roleKey,
      assignment: updatedAssignment,
    });

    const updatedName = assignment.isGuest ? assignment.guestName : assignment.userName;
    if (updatedName) {
      const newNotif: InAppNotification = {
        id: `notif-${Date.now()}-role`,
        title: "Contest Role Assigned",
        message: `${role.roleLabel} assigned to ${updatedName} by ${currentUser.name}.`,
        type: "success",
        timestamp: "Just now",
        isRead: false,
        linkUrl: `/contests/${contestId}`,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    return true;
  };

  // Clear Contest Role Assignment
  const clearContestRoleAssignment = (contestId: string, roleKey: ContestRoleKey) => {
    if (!currentUser) return;
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return;

    const role = (contest.roleAssignments || []).find((r) => r.roleKey === roleKey);
    if (!role) return;

    const isAdmin = currentUser.role === "admin";
    const isCC = currentUser.id === contest.chairId;
    const isCJ = currentUser.id === contest.chiefJudgeId;

    if (!isAdmin) {
      if (role.recruitedBy === "cc" && !isCC) return;
      if (role.recruitedBy === "cj" && !isCJ) return;
    }

    setContests((prev) =>
      prev.map((c) => {
        if (c.id !== contestId) return c;
        const updatedRoles = (c.roleAssignments || []).map((r) => {
          if (r.roleKey !== roleKey) return r;
          return {
            id: r.id,
            contestId: r.contestId,
            roleKey: r.roleKey,
            roleLabel: r.roleLabel,
            recruitedBy: r.recruitedBy,
            isConfidential: r.isConfidential,
            userId: null,
            userName: undefined,
            userAvatar: undefined,
            isGuest: false,
            guestName: undefined,
            guestClub: undefined,
            guestEmail: undefined,
            guestPhone: undefined,
            notes: undefined,
            isConfirmed: false,
          };
        });
        return { ...c, roleAssignments: updatedRoles };
      })
    );
  };

  // Appoint Contest Leadership (Admin only)
  const appointContestLeadership = (
    contestId: string,
    leadership: {
      chairId?: string;
      chairName?: string;
      chiefJudgeId?: string;
      chiefJudgeName?: string;
      contestMasterId?: string;
      contestMasterName?: string;
    }
  ) => {
    if (currentUser?.role !== "admin") return;
    setContests((prev) =>
      prev.map((c) => (c.id === contestId ? { ...c, ...leadership } : c))
    );
  };

  // Get Sanitized Contest Roles (Confidentiality Filtered at Data Layer)
  const getSanitizedContestRoles = (contestId: string): ContestRoleAssignment[] => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return [];
    return sanitizeContestRoleAssignments(contest.roleAssignments || [], currentUser, contest);
  };

  // Get Sanitized Contest (Confidentiality Filtered at Data Layer)
  const getSanitizedContest = (contestId: string): Contest | null => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return null;
    return {
      ...contest,
      roleAssignments: sanitizeContestRoleAssignments(contest.roleAssignments || [], currentUser, contest),
    };
  };

  // Create Media Album (ExComm & Admin)
  const createMediaAlbum = (albumData: Partial<MediaAlbum>): MediaAlbum => {
    const albumId = `album-${Date.now()}`;
    const newAlbum: MediaAlbum = {
      id: albumId,
      title: albumData.title || "Club Meeting Album",
      year: albumData.year || new Date().getFullYear(),
      month: albumData.month || "August",
      meetingDate: albumData.meetingDate || new Date().toISOString().split("T")[0],
      coverImageUrl: albumData.coverImageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
      photoCount: 0,
      uploadedBy: currentUser ? `${currentUser.name}` : "Terra Club",
      assets: [],
      ...albumData,
    };
    setMediaAlbums((prev) => [newAlbum, ...prev]);
    return newAlbum;
  };

  // Upload Photos (ExComm & Admin)
  const uploadPhotos = (albumId: string, newPhotos: Partial<MediaAsset>[]) => {
    if (!currentUser) return;
    const formatted: MediaAsset[] = newPhotos.map((p, idx) => ({
      id: `photo-up-${Date.now()}-${idx}`,
      albumId,
      uploadedBy: currentUser.id,
      uploaderName: currentUser.name,
      uploaderAvatar: currentUser.avatar,
      imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
      thumbnailUrl: p.thumbnailUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=480&auto=format&fit=crop&q=80",
      caption: p.caption || "Club meeting photograph",
      tags: p.tags || ["Community"],
      taggedMemberIds: p.taggedMemberIds || [currentUser.id],
      createdAt: new Date().toISOString(),
    }));

    setMediaAlbums((prev) =>
      prev.map((album) =>
        album.id === albumId
          ? {
              ...album,
              photoCount: album.photoCount + formatted.length,
              assets: [...formatted, ...album.assets],
            }
          : album
      )
    );
  };

  // Tag Member in Photo
  const tagMemberInPhoto = (albumId: string, photoId: string, memberId: string) => {
    setMediaAlbums((prev) =>
      prev.map((album) => {
        if (album.id !== albumId) return album;
        return {
          ...album,
          assets: album.assets.map((asset) => {
            if (asset.id !== photoId) return asset;
            const currentTags = asset.taggedMemberIds || [];
            if (currentTags.includes(memberId)) return asset;
            return {
              ...asset,
              taggedMemberIds: [...currentTags, memberId],
            };
          }),
        };
      })
    );
  };

  // Log Timer Entry
  const logTimerEntry = (entry: Omit<TimerLogEntry, "id">) => {
    const newEntry: TimerLogEntry = {
      ...entry,
      id: `tl-${Date.now()}`,
    };
    setTimerLogs((prev) => [newEntry, ...prev]);
  };

  // Update Ah Count
  const updateAhCount = (
    recordId: string,
    field: keyof Omit<AhCounterRecord, "id" | "meetingId" | "speakerName">,
    delta: number
  ) => {
    setAhRecords((prev) =>
      prev.map((rec) =>
        rec.id === recordId
          ? { ...rec, [field]: Math.max(0, rec[field] + delta) }
          : rec
      )
    );
  };

  // Add Ah-Counter Speaker
  const addAhCounterSpeaker = (meetingId: string, speakerName: string) => {
    const newRecord: AhCounterRecord = {
      id: `ah-${Date.now()}`,
      meetingId,
      speakerName,
      ahs: 0,
      ums: 0,
      likes: 0,
      youKnows: 0,
      repeats: 0,
      wordOfDayUsed: 0,
    };
    setAhRecords((prev) => [...prev, newRecord]);
  };

  // Create Announcement (Admin only)
  const createAnnouncement = (announcement: Partial<Announcement>) => {
    if (currentUser?.role !== "admin") return;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: announcement.title || "Club Announcement",
      content: announcement.content || "",
      authorName: currentUser.name,
      priority: announcement.priority || "general",
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <TerraStoreContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthLoaded,
        users,
        meetings,
        meetingRoles,
        agendaItems,
        contests,
        events,
        mediaAlbums,
        speechRecords,
        announcements,
        timerLogs,
        ahRecords,
        notifications,
        getSanitizedContestRoles,
        getSanitizedContest,
        login,
        logout,
        addMember,
        updateMember,
        updateProfile,
        resetPassword,
        deleteMember,
        generateCredentials,
        addSpeechRecord,
        deleteSpeechRecord,
        claimRole,
        dropRole,
        assignRoleDirectly,
        createMeeting,
        duplicateMeeting,
        cancelMeeting,
        reorderAgenda,
        updateAgendaDuration,
        registerContest,
        addContestant,
        removeContestant,
        updateContestant,
        createContest,
        updateContest,
        updateContestRoleAssignment,
        clearContestRoleAssignment,
        appointContestLeadership,
        randomizeContestOrder,
        toggleEventRSVP,
        createEvent,
        createMediaAlbum,
        uploadPhotos,
        tagMemberInPhoto,
        logTimerEntry,
        updateAhCount,
        addAhCounterSpeaker,
        createAnnouncement,
        markNotificationRead,
        clearAllNotifications,
      }}
    >
      {children}
    </TerraStoreContext.Provider>
  );
}

export function useTerraStore() {
  const context = useContext(TerraStoreContext);
  if (!context) {
    throw new Error("useTerraStore must be used within a TerraStoreProvider");
  }
  return context;
}
