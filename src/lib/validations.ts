import { z } from "zod";

/**
 * URL Sanitizer and Validator
 * Strictly allows only https:// URLs to eliminate javascript:, data:, and insecure protocols.
 */
export const httpsUrlSchema = z
  .string()
  .trim()
  .refine(
    (url) => {
      if (!url) return true;
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Only secure HTTPS URLs (https://...) are permitted." }
  );

/**
 * Phone Number Validator
 * Supports international formats with optional leading +, spaces, hyphens, and parentheses.
 */
export const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => {
      if (!phone) return true;
      // Allows +91 98765 43210, +1 (555) 123-4567, 9876543210
      return /^(\+?[0-9\s\-\(\)]{7,20})$/.test(phone);
    },
    { message: "Please provide a valid phone number (e.g. +91 98765 43210)." }
  );

/**
 * Text Sanitizer
 * Strips script tags, HTML tags, and dangerous executable characters from free-form text.
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/* ========================================================================= */
/* 1. MEMBER PROFILE VALIDATION SCHEMA */
/* ========================================================================= */
export const memberProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name cannot exceed 80 characters."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(100, "Email cannot exceed 100 characters."),
  phone: phoneSchema.optional(),
  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters.")
    .optional(),
  avatar: httpsUrlSchema.optional(),
  pathwayName: z
    .string()
    .trim()
    .max(80, "Pathway name cannot exceed 80 characters.")
    .optional(),
  pathwayLevel: z.number().int().min(1).max(5).optional(),
  memberJoiningDate: z.string().optional(),
  homeClub: z
    .string()
    .trim()
    .max(100, "Home club name cannot exceed 100 characters.")
    .optional(),
  speechesDelivered: z.number().int().min(0).max(500).optional(),
  rolesCompleted: z.number().int().min(0).max(1000).optional(),
});

export type MemberProfileInput = z.infer<typeof memberProfileSchema>;

/* ========================================================================= */
/* 2. MEETING CREATION VALIDATION SCHEMA */
/* ========================================================================= */
export const agendaItemSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(2, "Agenda item title must be at least 2 characters.").max(100),
  description: z.string().trim().max(300).optional(),
  durationMinutes: z.number().int().min(1, "Duration must be at least 1 min.").max(180),
  roleLabel: z.string().trim().max(60).optional(),
  speakerName: z.string().trim().max(80).optional(),
});

export const meetingCreationSchema = z.object({
  meetingNumber: z
    .number()
    .int()
    .min(1, "Meeting number must be positive.")
    .max(99999, "Meeting number cannot exceed 99,999."),
  title: z
    .string()
    .trim()
    .min(3, "Session title must be at least 3 characters.")
    .max(120, "Session title cannot exceed 120 characters."),
  theme: z
    .string()
    .trim()
    .min(2, "Session theme must be at least 2 characters.")
    .max(100, "Session theme cannot exceed 100 characters."),
  meetingDate: z.string().min(1, "Meeting date is required."),
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  locationType: z.enum(["in_person", "hybrid", "online"]),
  locationName: z
    .string()
    .trim()
    .min(3, "Location name must be at least 3 characters.")
    .max(150, "Location name cannot exceed 150 characters."),
  meetingLink: httpsUrlSchema.optional(),
  tmodName: z
    .string()
    .trim()
    .min(2, "Toastmaster of the Day name must be at least 2 characters.")
    .max(80, "Toastmaster name cannot exceed 80 characters."),
  agenda: z.array(agendaItemSchema).optional(),
});

export type MeetingCreationInput = z.infer<typeof meetingCreationSchema>;

/* ========================================================================= */
/* 3. ANNOUNCEMENT CREATION VALIDATION SCHEMA */
/* ========================================================================= */
export const announcementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Announcement title must be at least 3 characters.")
    .max(120, "Announcement title cannot exceed 120 characters."),
  content: z
    .string()
    .trim()
    .min(5, "Announcement content must be at least 5 characters.")
    .max(2000, "Announcement content cannot exceed 2,000 characters."),
  priority: z.enum(["normal", "important", "urgent"]),
  authorName: z
    .string()
    .trim()
    .min(2, "Author name must be at least 2 characters.")
    .max(80, "Author name cannot exceed 80 characters."),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

/* ========================================================================= */
/* 4. CONTEST CREATION & LEADERSHIP SCHEMA */
/* ========================================================================= */
export const contestCreationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Contest title must be at least 3 characters.")
    .max(120, "Contest title cannot exceed 120 characters."),
  category: z.enum(["humorous", "international", "evaluation", "table_topics"]),
  level: z.enum(["club", "area", "division", "district"]),
  contestDate: z.string().min(1, "Contest date is required."),
  locationName: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters.")
    .max(150, "Location cannot exceed 150 characters."),
  chairName: z
    .string()
    .trim()
    .min(2, "Contest Chair (CC) name must be at least 2 characters.")
    .max(80, "CC name cannot exceed 80 characters."),
  chiefJudgeName: z
    .string()
    .trim()
    .min(2, "Chief Judge (CJ) name must be at least 2 characters.")
    .max(80, "CJ name cannot exceed 80 characters."),
  contestMasterName: z
    .string()
    .trim()
    .max(80, "CM name cannot exceed 80 characters.")
    .optional(),
  testSpeakerCount: z.enum(["0", "1", "2"]).or(z.number().int().min(0).max(2)).optional(),
});

export type ContestCreationInput = z.infer<typeof contestCreationSchema>;

/* ========================================================================= */
/* 5. CONTEST ROLE RECRUITMENT ASSIGNMENT SCHEMA */
/* ========================================================================= */
export const contestRoleAssignmentSchema = z
  .object({
    isGuest: z.boolean(),
    clubMemberId: z.string().optional(),
    guestName: z.string().trim().max(80).optional(),
    guestClub: z.string().trim().max(100).optional(),
    guestPhone: phoneSchema.optional(),
    guestEmail: z.string().trim().email("Invalid guest email.").optional().or(z.literal("")),
    notes: z.string().trim().max(300, "Notes cannot exceed 300 characters.").optional(),
  })
  .refine(
    (data) => {
      if (data.isGuest) {
        return !!data.guestName && data.guestName.length >= 2;
      }
      return !!data.clubMemberId && data.clubMemberId.length > 0;
    },
    {
      message: "Please specify either an enrolled club member or a valid visiting guest name.",
    }
  );

export type ContestRoleAssignmentInput = z.infer<typeof contestRoleAssignmentSchema>;

/* ========================================================================= */
/* 6. SPEECH RECORD LOGGING SCHEMA */
/* ========================================================================= */
export const speechRecordSchema = z.object({
  meetingNumber: z.number().int().min(1, "Meeting number must be positive.").max(99999),
  meetingDate: z.string().min(1, "Meeting date is required."),
  speechTitle: z
    .string()
    .trim()
    .min(2, "Speech title must be at least 2 characters.")
    .max(150, "Speech title cannot exceed 150 characters."),
  pathwayProject: z
    .string()
    .trim()
    .min(2, "Pathway project must be at least 2 characters.")
    .max(100, "Pathway project cannot exceed 100 characters."),
  evaluatorName: z
    .string()
    .trim()
    .min(2, "Evaluator name must be at least 2 characters.")
    .max(80, "Evaluator name cannot exceed 80 characters."),
  timingMinutes: z
    .string()
    .trim()
    .min(1, "Timing duration is required.")
    .max(20, "Timing duration cannot exceed 20 characters."),
  awardWon: z.string().trim().max(60).optional(),
  privateNotes: z.string().trim().max(1000, "Notes cannot exceed 1,000 characters.").optional(),
});

export type SpeechRecordInput = z.infer<typeof speechRecordSchema>;

/* ========================================================================= */
/* 7. INFORMAL CLUB EVENT CREATION SCHEMA */
/* ========================================================================= */
export const eventCreationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Event title must be at least 3 characters.")
    .max(120, "Event title cannot exceed 120 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Event description must be at least 5 characters.")
    .max(1000, "Event description cannot exceed 1,000 characters."),
  category: z.enum(["excomm", "workshop", "social", "special"]),
  date: z.string().min(1, "Event date is required."),
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  locationType: z.enum(["in_person", "online", "hybrid"]),
  locationName: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters.")
    .max(150, "Location cannot exceed 150 characters."),
  meetingLink: httpsUrlSchema.optional(),
});

export type EventCreationInput = z.infer<typeof eventCreationSchema>;

/* ========================================================================= */
/* 8. MEDIA ALBUM & PHOTO UPLOAD SCHEMA */
/* ========================================================================= */
export const mediaUploadSchema = z.object({
  albumTitle: z
    .string()
    .trim()
    .min(3, "Album title must be at least 3 characters.")
    .max(120, "Album title cannot exceed 120 characters."),
  meetingNumber: z.number().int().min(1).max(99999),
  year: z.number().int().min(2000).max(2100),
  photoUrls: z
    .array(httpsUrlSchema)
    .min(1, "Please provide at least one valid HTTPS photo URL.")
    .max(50, "Cannot upload more than 50 photos in a single batch."),
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;
