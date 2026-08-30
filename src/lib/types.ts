export type UserRole = "member" | "officer" | "admin";
export type MeetingStatus = "draft" | "published" | "in_progress" | "completed" | "cancelled";
export type ContestStatus = "draft" | "open" | "closing_soon" | "locked" | "completed";
export type ContestCategory = "international" | "table_topics" | "evaluation" | "humorous";
export type RsvpStatus = "attending" | "maybe" | "declined";

export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  pathwayName?: string;
  pathwayLevel?: number;
  bio?: string;
  executiveTitle?: string;
  joinedDate: string;
  speechesDelivered: number;
  rolesCompleted: number;
  memberId?: string;
  awardsWon?: number;
}

export interface MeetingRole {
  id: string;
  meetingId: string;
  roleName: string;
  category: "executive" | "speaker" | "evaluator" | "functionary";
  allocatedMinutes: number;
  assignedUserId: string | null;
  assignedUserName?: string;
  assignedUserAvatar?: string;
  speechTitle?: string;
  speechPathwayProject?: string;
  isLocked: boolean;
  claimedAt?: string;
}

export interface AgendaItem {
  id: string;
  meetingId: string;
  sequenceOrder: number;
  startTimeOffset: string; // e.g. "19:00"
  itemTitle: string;
  presenterName: string;
  durationMinutes: number;
}

export interface Meeting {
  id: string;
  meetingNumber: number;
  slug: string;
  title: string;
  theme: string;
  wordOfTheDay: {
    word: string;
    partOfSpeech: string;
    definition: string;
  };
  meetingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  locationName: string;
  zoomUrl?: string;
  status: MeetingStatus;
  notes?: string;
  tmodName: string;
  tmodId?: string;
}

export interface ContestParticipant {
  id: string;
  contestId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  speechTitle?: string;
  speakingOrder?: number;
  placement?: 1 | 2 | 3;
  registeredAt: string;
  isGuest?: boolean;
  guestClub?: string;
}

export type ContestRoleKey =
  | "timer_1"
  | "timer_2"
  | "saa_1"
  | "saa_2"
  | "pr_chair"
  | "test_speaker_1"
  | "test_speaker_2"
  | "judge_1"
  | "judge_2"
  | "judge_3"
  | "judge_4"
  | "judge_5"
  | "tiebreaker_judge"
  | "ballot_counter_1"
  | "ballot_counter_2";

export interface ContestRoleAssignment {
  id: string;
  contestId: string;
  roleKey: ContestRoleKey;
  roleLabel: string;
  recruitedBy: "cc" | "cj";
  isConfidential?: boolean; // true for tiebreaker_judge

  // Member assignment (if from club roster)
  userId?: string | null;
  userName?: string;
  userAvatar?: string;

  // Custom / Visiting guest assignment
  isGuest?: boolean;
  guestName?: string;
  guestClub?: string;
  guestEmail?: string;
  guestPhone?: string;

  notes?: string;
  isConfirmed?: boolean;
}

export interface Contest {
  id: string;
  title: string;
  category: ContestCategory;
  contestDate: string;
  registrationDeadline: string;
  maxContestants: number;
  status: ContestStatus;

  // Appointed Leadership (From Club Members)
  chairId?: string;
  chairName: string;
  chiefJudgeId?: string;
  chiefJudgeName: string;
  contestMasterId?: string;
  contestMasterName?: string;

  testSpeakerCount?: 0 | 1 | 2;

  eligibilityNotes: string;
  notes?: string;
  locationName: string;
  participants: ContestParticipant[];
  roleAssignments: ContestRoleAssignment[];
}

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  status: RsvpStatus;
  createdAt: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  category: "Workshop" | "Social Mixer" | "ExComm Meeting" | "Outdoors" | "Joint Meeting";
  eventDate: string;
  startTime: string;
  locationName: string;
  description: string;
  hostName: string;
  dressCode?: string;
  rsvps: EventRSVP[];
}

export interface MediaAsset {
  id: string;
  albumId: string;
  uploadedBy: string;
  uploaderName: string;
  uploaderAvatar: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  tags: string[];
  taggedMemberIds?: string[];
  createdAt: string;
}

export interface MediaAlbum {
  id: string;
  meetingId?: string;
  title: string;
  year: number;
  month: string; // "August"
  meetingDate: string;
  coverImageUrl: string;
  photoCount: number;
  uploadedBy: string;
  assets: MediaAsset[];
}

export interface SpeechRecord {
  id: string;
  userId: string;
  meetingNumber: number;
  meetingDate: string;
  speechTitle: string;
  pathwayProject?: string;
  evaluatorName: string;
  timingMinutes: string;
  privateNotes: string;
  awardWon?: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  priority: "general" | "important" | "urgent";
  createdAt: string;
  isActive: boolean;
}

export interface TimerLogEntry {
  id: string;
  meetingId: string;
  speakerName: string;
  roleOrSpeech: string;
  minDuration: number; // in seconds
  targetDuration: number;
  maxDuration: number;
  recordedSeconds: number;
  disqualified: boolean;
  status: "green" | "amber" | "red" | "overtime" | "under_time";
  timestamp: string;
}

export interface AhCounterRecord {
  id: string;
  meetingId: string;
  speakerName: string;
  ahs: number;
  ums: number;
  likes: number;
  youKnows: number;
  repeats: number;
  wordOfDayUsed: number;
}
