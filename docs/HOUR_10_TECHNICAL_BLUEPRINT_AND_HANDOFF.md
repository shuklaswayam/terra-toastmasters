# TERRA — HOUR 10: TECHNICAL BLUEPRINT, DATA ARCHITECTURE & HANDOFF PACKAGE
## Confidential Internal Specification • Terra Toastmasters Operating System

---

## 1. Production-Ready PostgreSQL Schema (DDL)

```sql
-- TERRA TOASTMASTERS PRODUCTION DATABASE SCHEMA (POSTGRESQL 16+)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM TYPES
CREATE TYPE user_role AS ENUM ('member', 'officer', 'admin');
CREATE TYPE meeting_status AS ENUM ('draft', 'published', 'in_progress', 'completed', 'cancelled');
CREATE TYPE contest_status AS ENUM ('draft', 'open', 'closing_soon', 'locked', 'completed');
CREATE TYPE rsvp_status AS ENUM ('attending', 'maybe', 'declined');

-- 1. USERS & AUTH
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'member' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. MEMBER PROFILES
CREATE TABLE member_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    pathway_name VARCHAR(100) DEFAULT 'Dynamic Leadership',
    pathway_level INT DEFAULT 1 CHECK (pathway_level BETWEEN 1 AND 5),
    bio TEXT,
    joined_date DATE DEFAULT CURRENT_DATE NOT NULL
);

-- 3. MEETINGS
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_number INT UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    theme VARCHAR(255),
    word_of_the_day VARCHAR(100),
    meeting_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    zoom_url VARCHAR(500),
    status meeting_status DEFAULT 'published' NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_meetings_date ON meetings(meeting_date DESC);

-- 4. MEETING ROLES & ASSIGNMENTS
CREATE TABLE meeting_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    role_name VARCHAR(100) NOT NULL,
    allocated_minutes INT DEFAULT 5 NOT NULL,
    assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    speech_title VARCHAR(255),
    speech_pathway_project VARCHAR(255),
    is_locked BOOLEAN DEFAULT FALSE NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_meeting_user_role UNIQUE (meeting_id, assigned_user_id, role_name)
);

CREATE INDEX idx_meeting_roles_meeting_id ON meeting_roles(meeting_id);

-- 5. TIMED AGENDA ITEMS
CREATE TABLE agenda_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    sequence_order INT NOT NULL,
    start_time_offset VARCHAR(10) NOT NULL,
    item_title VARCHAR(255) NOT NULL,
    presenter_name VARCHAR(100),
    duration_minutes INT NOT NULL
);

CREATE INDEX idx_agenda_items_order ON agenda_items(meeting_id, sequence_order);

-- 6. CONTESTS
CREATE TABLE contests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    contest_date DATE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    max_contestants INT DEFAULT 8 NOT NULL,
    status contest_status DEFAULT 'open' NOT NULL,
    chair_user_id UUID REFERENCES users(id),
    chief_judge_user_id UUID REFERENCES users(id),
    notes TEXT
);

-- 7. CONTEST PARTICIPANTS
CREATE TABLE contest_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    speech_title VARCHAR(255),
    speaking_order INT,
    placement INT CHECK (placement BETWEEN 1 AND 3),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_contest_registration UNIQUE (contest_id, user_id)
);

-- 8. INFORMAL EVENTS & WORKSHOPS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status rsvp_status DEFAULT 'attending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_event_rsvp UNIQUE (event_id, user_id)
);

-- 9. MEDIA ALBUMS & ASSETS
CREATE TABLE media_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    cover_image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES media_albums(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    width INT,
    height INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_media_assets_album ON media_assets(album_id);
```

---

## 2. Next.js 15 Server Actions & API Contract (24 Endpoints)

```
┌──────────────────────────────────────┬───────────────────────────────┬───────────────────────────┐
│ SERVER ACTION / ENDPOINT             │ INPUT SCHEMA                  │ RESPONSE / MUTATION       │
├──────────────────────────────────────┼───────────────────────────────┼───────────────────────────┤
│ auth:signIn                          │ { email, password }           │ { user, sessionToken }    │
│ auth:requestPasswordReset            │ { email }                     │ { success: true }         │
│ auth:confirmPasswordReset            │ { token, newPassword }        │ { success: true }         │
│ meetings:getUpcoming                 │ { limit: 5 }                  │ Array<MeetingSummary>     │
│ meetings:getBySlug                   │ { slug: string }              │ Meeting & Roles & Agenda  │
│ meetings:createMeeting               │ CreateMeetingInputSchema      │ { meetingId, slug }       │
│ meetings:duplicateMeeting            │ { sourceMeetingId, newDate }  │ { meetingId, slug }       │
│ meetings:cancelMeeting               │ { meetingId, reason }         │ { status: 'cancelled' }   │
│ roles:claimRole                      │ { meetingRoleId, speechData } │ { success, roleRecord }   │
│ roles:dropRole                       │ { meetingRoleId, isLateDrop } │ { success, released: true}│
│ roles:adminAssignRole                │ { meetingRoleId, userId }     │ { success, roleRecord }   │
│ agenda:reorderItems                  │ { meetingId, itemIdsOrdered } │ { success, updatedOffsets}│
│ agenda:updateItemDuration            │ { agendaItemId, durationMins }│ { success, recalculated } │
│ contests:getAll                      │ { category?: string }         │ Array<ContestCard>        │
│ contests:getById                     │ { contestId: string }         │ Contest & Participants    │
│ contests:register                    │ { contestId, speechTitle }    │ { success, participantId }│
│ contests:randomizeSpeakingOrder      │ { contestId }                 │ { success, orderMap }     │
│ contests:publishResults              │ { contestId, placements }     │ { status: 'completed' }   │
│ events:getAll                        │ {}                            │ Array<EventWithRSVPs>     │
│ events:submitRSVP                    │ { eventId, status }           │ { success, updatedCount } │
│ media:getAlbums                      │ { year?: number }             │ Array<MediaAlbum>         │
│ media:getPreSignedUploadUrls         │ { count: number, albumId }    │ Array<UploadUrlRecord>    │
│ media:commitUploadedAssets           │ { albumId, assetUrls }        │ { success, insertedCount }│
│ members:getDirectory                 │ { query?: string }            │ Array<MemberCard>         │
└──────────────────────────────────────┴───────────────────────────────┴───────────────────────────┘
```

---

## 3. Storage Architecture: Cloudflare R2 / AWS S3 Media Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  MEDIA STORAGE HIERARCHY (OBJECT STORAGE BUCKET: terra-media-prod)                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  terra-media-prod/                                                                               │
│  ├── avatars/                                                                                    │
│  │   └── [user_uuid]_[timestamp].webp              (200x200px square compressed avatar)      │
│  └── albums/                                                                                     │
│      └── [year]/                                                                                 │
│          └── [month]/                                                                            │
│              └── [meeting_slug]/                                                                 │
│                  ├── raw/                                                                        │
│                  │   └── [asset_uuid]_original.webp (Max 2560px width, WebP Q85)              │
│                  └── thumbs/                                                                     │
│                      └── [asset_uuid]_thumb.webp    (480px width, WebP Q75 for Masonry Grid)    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Next.js 15 Directory Architecture

```text
terra/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (portal)/
│   │   │   ├── layout.tsx                # Authenticated Navbar & Mobile Dock
│   │   │   ├── page.tsx                  # /portal - Member Command Center
│   │   │   ├── meetings/
│   │   │   │   ├── page.tsx              # /meetings - Meeting Schedule
│   │   │   │   └── [slug]/page.tsx       # /meetings/[slug] - Detail & Roster
│   │   │   ├── contests/
│   │   │   │   ├── page.tsx              # /contests - Contest Hub
│   │   │   │   └── [id]/page.tsx         # /contests/[id] - Contest Detail
│   │   │   ├── events/
│   │   │   │   └── page.tsx              # /events - Workshops & Socials
│   │   │   ├── gallery/
│   │   │   │   ├── page.tsx              # /gallery - Media Archive
│   │   │   │   ├── [year]/[slug]/page.tsx# /gallery/[year]/[slug] - Album
│   │   │   │   └── upload/page.tsx       # /gallery/upload - Ingestion Studio
│   │   │   ├── members/page.tsx          # /members - Directory
│   │   │   └── profile/page.tsx          # /portal/profile - Speech Archive
│   │   └── admin/
│   │       ├── layout.tsx                # Officer RBAC Guard Layout
│   │       ├── page.tsx                  # /admin - Command Center
│   │       └── meetings/builder/page.tsx # /admin/meetings/builder
│   ├── components/
│   │   ├── ui/                           # shadcn & Radix Primitives
│   │   ├── bento/                        # Bento Grid Card Modules
│   │   ├── meeting/                      # Role Cards, Timed Agenda, Assistant
│   │   ├── media/                        # Masonry Grid, Lightbox Modal
│   │   └── navigation/                   # Desktop Frosted Nav, Mobile Dock
│   ├── lib/
│   │   ├── db/                           # Drizzle / Prisma ORM Client
│   │   ├── auth/                         # NextAuth Configuration & RBAC
│   │   └── storage/                      # S3 / Cloudflare R2 Client
│   └── styles/
│       └── globals.css                   # Tailwind Root Design Tokens
└── tailwind.config.ts
```

---

## 5. Master Engineering Handoff Checklist

### Phase 1: Foundation (Days 1–3)
- [ ] Initialize Next.js 15 repository with TypeScript, Tailwind CSS v4, and shadcn/ui.
- [ ] Provision PostgreSQL database on Supabase/Neon and run the schema DDL script.
- [ ] Implement NextAuth.js JWT authentication with route middleware guards for `/portal` and `/admin`.
- [ ] Configure Cloudflare R2 / AWS S3 client and pre-signed URL generator.

### Phase 2: Core Meeting & Roster Engine (Days 4–7)
- [ ] Build Member Dashboard Bento Grid (`/portal`) with live Next Meeting card.
- [ ] Implement Session Detail Page (`/meetings/[slug]`) with optimistic role claim triggers.
- [ ] Implement Role Dropping warning modal and late alert notification hooks (<48h).
- [ ] Build Admin Drag-and-Drop Agenda Studio with auto-calculating timestamp offsets.
- [ ] Implement Printable Apple-styled PDF Agenda and WhatsApp text exporter.

### Phase 3: Contests, Media & Polish (Days 8–10)
- [ ] Build Contest Hub (`/contests`) with category tabs, waitlisting, and Winner Podium.
- [ ] Build Informal Events Hub (`/events`) with 1-click interactive RSVPs.
- [ ] Build Photo Gallery (`/gallery`) with justified masonry grid and Apple Lightbox modal.
- [ ] Implement Batch Photo Ingestion Studio with client-side WebP compression.
- [ ] Build Mobile In-Meeting Assistant layout (390px/430px) for live club sessions.
- [ ] Perform WCAG AA accessibility audit and end-to-end user journey tests.

---

*Hour 10 complete. The 10-hour product design sprint is 100% complete and implementation-ready.*
