# TERRA — HOUR 01: PRODUCT CHARTER, PERSONAS & SCOPE MATRIX
## Confidential Internal Specification • Terra Toastmasters Operating System

---

## 1. Executive Product Vision & Value Proposition

### 1.1 The Core Problem
Legacy club management platforms (such as Easy-Speak and Toastmasters International Club Central) are plagued by outdated 2000s-era UI, painful multi-step navigation, zero mobile optimization for live in-meeting usage, fragmented photo sharing over WhatsApp groups (where memories are lost in chat histories), and disconnected contest signups managed via ad-hoc Google Sheets.

### 1.2 The Terra Vision
**Terra** is a bespoke, 100% private, authenticated club operating system designed exclusively for the members and executive committee of Terra Toastmasters. It is engineered with **Apple-grade visual restraint, optical depth, and high-density typography**, paired with **modern interactive component mechanics inspired by 21st.dev** (fluid bento cards, tactile spring-physics controls, and real-time status indicators).

Terra transforms club management into a cohesive, enjoyable digital ecosystem where:
- Claiming an open meeting role takes less than 10 seconds.
- Meeting agendas update live and adjust dynamically.
- Contest lifecycles are structured and transparent.
- Club memories and session photos are automatically organized in a pristine chronological archive.
- Members build a permanent, personalized portfolio of speeches, evaluations, and leadership milestones.

---

## 2. Deep Persona Profiles & Jobs-To-Be-Done (JTBD)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PRIMARY PERSONA MATRIX                                    │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ PERSONA                  │ PRIMARY GOALS               │ CORE FRICTION POINTS          │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ Elena Vance              │ • Rapid role claiming       │ • Role claimed via WhatsApp   │
│ Active Club Member       │ • Live agenda during meet   │   gets lost or forgotten      │
│ (28, Product Designer)   │ • Speech & evaluation log   │ • No mobile-friendly agenda   │
│                          │ • Browse meeting memories   │ • Evaluations scattered       │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ Marcus Brody             │ • Build agenda in <5 mins   │ • Manually chasing members    │
│ VP Education (Officer)   │ • Real-time roster tracking │ • Fixing agenda timing in     │
│ (34, Engineering Lead)   │ • Contest orchestration     │   Word/Excel docs             │
│                          │ • Role drop triage (<48h)   │ • Duplicate contest entries   │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ Sophia Chen              │ • Broadcast club updates    │ • Photos compressed in chat   │
│ VP PR / President        │ • Curate high-res photos    │ • No central club archive     │
│ (31, Marketing Director) │ • Track club milestones     │ • Hard to track member trends │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

### Persona 1: Elena Vance — The Active Member
* **Profile**: 28-year-old product designer. Attends bi-weekly meetings consistently. Working through Pathway *Dynamic Leadership (Level 3)*.
* **Context of Use**: 
  - *At Desk (Sunday evening)*: Opens Terra on MacBook to review upcoming meetings and claim Evaluator or Speaker roles.
  - *On Mobile (Tuesday 19:15 in meeting)*: Glances at iPhone to check who the next speaker is, see the Word of the Day, and snap a quick photo to upload to the session album.
* **Jobs To Be Done**:
  1. *"When an upcoming meeting is announced, I want to see which roles are open immediately so that I can sign up for speech slots before they fill up."*
  2. *"When I deliver a speech, I want my title, pathway project, and evaluator notes recorded permanently in my profile so that I can track my growth."*
  3. *"When browsing club memories, I want to see photos categorized by meeting date so that I can easily find and download high-resolution photos of my speech."*

### Persona 2: Marcus Brody — The Vice President Education (Officer Admin)
* **Profile**: 34-year-old software engineering manager. Responsible for meeting quality, role fulfillment, agenda publishing, and contest management.
* **Context of Use**:
  - *At Desk (Mid-week)*: Builds upcoming agendas using drag-and-drop templates, verifies speaker eligibility, and monitors vacant roles.
  - *On Mobile (Meeting Day)*: Handles last-minute role reassignments when a member drops out.
* **Jobs To Be Done**:
  1. *"When creating a new meeting, I want to duplicate a previous meeting template and adjust speakers with drag-and-drop so that agenda creation takes under 3 minutes."*
  2. *"When a member drops a role within 48 hours of meeting time, I want an immediate automated alert so that I can fill the vacancy without delay."*
  3. *"When organizing our annual contest, I want a structured registration portal that enforces caps and validates eligibility so that we avoid administrative chaos."*

### Persona 3: Sophia Chen — VP Public Relations & Club President
* **Profile**: 31-year-old marketing director. Focuses on club culture, executive communications, and media preservation.
* **Context of Use**:
  - *Post-Meeting (Wednesday morning)*: Ingests 40+ raw photos from the club camera, applies batch session tags, and publishes the album.
* **Jobs To Be Done**:
  1. *"When session photos are captured, I want to batch drag-and-drop upload them and have them auto-filed under the specific meeting date."*
  2. *"When broadcasting club notices (e.g., venue change or theme reveal), I want to post an announcement banner that every member sees upon logging in."*

---

## 3. Comprehensive MoSCoW Scope Matrix (Internal Platform)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                TERRA MOSCOW FEATURE PRIORITIZATION                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ MUST HAVE (MVP - Core 10-Hour Sprint Target)                                                     │
│  [M-01] Role-Based Authentication (Member vs. Officer/Admin via secure JWT sessions)            │
│  [M-02] Gated Route Architecture (All views require auth; unauthenticated redirects to /login)   │
│  [M-03] Member Command Center (/portal) with Next Meeting hero card & open-role quick claim      │
│  [M-04] Interactive Meeting Detail (/meetings/[slug]) with Role Roster & Timed Agenda           │
│  [M-05] Real-Time Self-Serve Role Claiming with optimistic UI & duplicate conflict prevention    │
│  [M-06] Role Dropping Guardrails (Confirmation modal + automated officer alert if <48h)         │
│  [M-07] Admin Drag-and-Drop Agenda Builder with auto-calculating minute offsets                 │
│  [M-08] Admin Meeting Roster Management (Direct assign, replace, slot add/remove)               │
│  [M-09] Contest Hub (/contests) supporting 4 Toastmasters Categories with registration states   │
│  [M-10] Contest Participant Registration with 1-click eligibility check                         │
│  [M-11] Contest Winner Hall of Fame Podium display                                              │
│  [M-12] Informal Events & Workshop Hub (/events) with 1-click interactive RSVP toggles           │
│  [M-13] Chronological Photo Gallery (/gallery) structured by Year -> Month -> Session           │
│  [M-14] Apple-Inspired Dark-Backdrop Lightbox Viewer with keyboard & touch navigation           │
│  [M-15] Drag-and-Drop Multi-Photo Batch Uploader with EXIF session auto-matching                │
│  [M-16] Member Speech & Evaluation Portfolio (/portal/profile)                                  │
│  [M-17] Searchable Club Member Directory (/members)                                             │
│  [M-18] Mobile In-Meeting Assistant layout (390px/430px)                                         │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SHOULD HAVE (Phase 2 - Immediate Post-Launch v1.1)                                               │
│  [S-01] Automated WhatsApp Plaintext Agenda Generator                                           │
│  [S-02] Printable 1-Page Minimalist PDF Agenda Formatter                                        │
│  [S-03] 1-Click Meeting Duplication from historical templates                                   │
│  [S-04] Photo Tagging by Member Profile ID                                                      │
│  [S-05] 1-Click ZIP Album Batch Download                                                        │
│  [S-06] Automated Email Agenda Ping 24 Hours Prior to Meeting                                   │
│  [S-07] Apple Calendar & Google Calendar 1-Click Sync (.ics)                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ COULD HAVE (Phase 3 - Enhanced Club Intelligence v1.2)                                           │
│  [C-01] Toastmasters Pathway Level Progress Radial Visualizer (Levels 1–5)                       │
│  [C-02] Live In-Meeting Stopwatch / Signal Card UI (Green / Amber / Red)                        │
│  [C-03] Member Participation & Speech Leaderboard                                               │
│  [C-04] Offline Progressive Web App (PWA) cache for low-connectivity venues                      │
│  [C-05] Toastmaster of the Day Script Helper & Intro generator                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ WON'T HAVE (Strictly Out of Scope for this System)                                               │
│  [W-01] Public unauthenticated landing pages or marketing microsites                            │
│  [W-02] Public guest RSVP forms or external lead magnets                                        │
│  [W-03] Financial dues / Stripe payment gateway processing                                      │
│  [W-04] Custom video hosting/streaming (use external unlisted YouTube links if needed)           │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Operating Assumptions & Club Cadence Rules

1. **Meeting Frequency & Timing**:
   - Standard club meetings occur bi-weekly on Tuesday evenings: **19:00 to 21:00 IST**.
   - Executive Committee (ExComm) meetings occur once a month.
   - Contests occur twice a year (Annual Club Contest cycle).
2. **Role Roster Standard Archetype (Standard 3-Speaker Meeting)**:
   - **Executive Roles (3)**: Toastmaster of the Day (TMOD), Table Topics Master (TTM), General Evaluator (GE).
   - **Speaker Slots (3)**: Prepared Speaker 1, Prepared Speaker 2, Prepared Speaker 3.
   - **Evaluator Slots (3)**: Evaluator 1, Evaluator 2, Evaluator 3.
   - **Functional Roles (4)**: Timer, Grammarian, Ah-Counter, Hark Master / SAA.
3. **Session Anchoring Principle**:
   - Every single asset created in Terra (agenda items, role records, speech notes, photos) is permanently foreign-keyed to a parent `Meeting` or `Event` record. Nothing floats in isolation.

---

## 5. Architectural Governance & Critical Decisions Log

```
┌──────────────────────────────────────┬───────────────────────────────────────────────────────────┐
│ DECISION TOPIC                       │ RESOLUTION & RATIONALE                                    │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ 1. Public vs. Private Gating         │ 100% Private. Root '/' redirects to '/portal' or '/login'.│
│                                      │ Eliminates marketing distractions; focuses purely on UX.  │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ 2. Role Claiming Governance          │ Hybrid: Instant-claim for functional roles & evaluators.  │
│                                      │ Instant-claim with soft officer override for TMOD/Speakers│
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ 3. Role Conflict Engine              │ Hard block on double-booking major roles (cannot be both  │
│                                      │ Speaker & Evaluator or TMOD & TT Master in same session). │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ 4. Late Role Drop Policy (<48h)      │ Allowed with modal warning. Triggers automated high-      │
│                                      │ priority notification to VPE and marks role as 'Vacant'.  │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ 5. Contest Speaking Order            │ Kept hidden/alphabetical until official draw briefing.    │
│                                      │ Officer can trigger 1-click 'Randomize Order' to lock it. │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ 6. Media Ingestion & Filing          │ Auto-filed by EXIF timestamp matching nearest meeting.    │
│                                      │ Fallback: 'Yearly Community Moments' album.               │
└──────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 6. Hour 01 Completion Checklist & Sign-Off

- [x] **Product Vision & Value Proposition** articulated for internal club excellence.
- [x] **3 Core Personas (Elena, Marcus, Sophia)** defined with realistic JTBD and in-meeting contexts.
- [x] **MoSCoW Matrix** locked across 36 internal features with public/guest features eliminated.
- [x] **Operating Cadence & Standard Roster Structure** codified.
- [x] **6 Architectural Governance Decisions** formally logged.

---

*Hour 01 complete. Proceed to **Hour 02: Information Architecture, Gated Routing & Content Graph**.*
