# TERRA — HOUR 05: MEMBER COMMAND CENTER, SPEECH ARCHIVE & PATHWAY PORTFOLIO
## Confidential Internal Specification • Terra Toastmasters Operating System

---

## 1. Member Workspace Overview (`/portal`)

The **Member Command Center** is the primary home screen for authenticated club members. It is structured as an **Apple-inspired Asymmetric Bento Grid** that delivers high-density operational utility without visual clutter.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TERRA •      [Dashboard]  [Meetings]  [Contests]  [Events]  [Gallery]  [Directory]   [🔍] [🔔] [Avatar] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  👋 Good evening, Elena                                                 Next Meeting: In 3 Days  │
│                                                                                                  │
│  ┌─────────────────────────────────────────────────┐ ┌─────────────────────────────────────────┐  │
│  │ 🌟 NEXT MEETING COMMAND CARD (2/3 Grid Slot)     │ │ ⚡ QUICK ROLE SIGNUP WIDGET (1/3 Slot)  │  │
│  │ Meeting #142 • Tuesday, Aug 18, 2026 • 19:00 IST │ │ 3 Roles Available for Aug 18            │  │
│  │ Theme: "Breaking Boundaries"                     │ │                                         │  │
│  │ TMOD: Sophia Chen | Venue: Terra Hall / Zoom     │ │ • 🔍 Evaluator 2            [Claim Role]│  │
│  │                                                  │ │ • 🔔 Ah-Counter             [Claim Role]│  │
│  │ Your Status: 🎤 Speaker Slot #2 (Confirmed)      │ │ • ⏱️ Timer (All)             [Claim Role]│  │
│  │ Title: "Designing AI for Humans" (Level 3)       │ │                                         │  │
│  │                                                  │ │ [View Complete Meeting Roster →]        │  │
│  │ [View Full Live Agenda]  [Sync to Apple Cal]     │ │                                         │  │
│  └─────────────────────────────────────────────────┘ └─────────────────────────────────────────┘  │
│                                                                                                  │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────────────────┐  │
│  │ 🏆 ACTIVE CONTEST HUB   │ │ 📸 RECENT MEMORIES      │ │ 📊 MY SPEECH & PATHWAY JOURNEY      │  │
│  │ Humorous Speech Contest │ │ Aug 04 - Meeting #141   │ │ Dynamic Leadership — Level 3        │  │
│  │ Closes: Friday 23:59    │ │ 42 Photos Uploaded      │ │ [████████████░░░░░░░░] 60% Complete │  │
│  │ 6 of 8 Slots Claimed    │ │ Cover: Elena Vance      │ │ • Speeches Delivered: 8             │  │
│  │                         │ │                         │ │ • Roles Completed: 16               │  │
│  │ [Register as Candidate] │ │ [Browse Photo Album →]  │ │ [View My Complete Speech Portfolio] │  │
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bento Grid Module Specifications

### Module 1: Next Meeting Command Card (Hero 2/3 Slot)
- **Geometry**: Spans 8 columns on 12-column desktop grid (`col-span-12 lg:col-span-8`).
- **Visual Style**: High-contrast white card (`dark:bg-[#161618]`), 16px radius, subtle 1px border, diffused shadow.
- **Dynamic Content States**:
  - *State A (User holds a role)*: Displays confirmed role badge (`Speaker #2`), speech title, pathway project, and quick links to edit speech notes or view agenda.
  - *State B (User has no role)*: Displays an inviting prompt: *"You have no role assigned for Meeting #142 • 3 roles remaining."* with an emerald `Browse Open Roles` action.

### Module 2: Quick Role Signup Widget (1/3 Slot)
- **Geometry**: Spans 4 columns (`col-span-12 lg:col-span-4`).
- **Interaction**: Displays up to 3 open roles for the immediate next meeting. Clicking `[Claim Role]` executes an optimistic role lock in under 200ms with spring animation.

### Module 3: Active Contest Card (1/3 Slot)
- Shows upcoming contest deadline, category badge, and 1-click candidate registration button.

### Module 4: Recent Memories Card (1/3 Slot)
- Displays cover photo of the latest session album with photo count chip (`42 photos`) and direct lightbox link.

### Module 5: Personal Journey & Pathway Progress Card (1/3 Slot)
- Displays current Toastmasters Pathway title, radial/bar progress indicator (e.g., *Level 3 - 60%*), and aggregate counts of speeches delivered and roles performed.

---

## 3. Personal Speech Archive & Portfolio (`/portal/profile`)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ELENA VANCE — SPEECH & LEADERSHIP PORTFOLIO                      [Edit Profile] [Export Record] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  Pathway: Dynamic Leadership (Level 3) • Club Member since Oct 2024 • 8 Speeches Delivered       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  CHRONOLOGICAL SPEECH ARCHIVE                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🎤 Speech #8 • Aug 18, 2026 • Meeting #142                                                 │  │
│  │ Title: "Designing AI for Humans" | Pathway: DL Level 3 - Project: Understanding Emotional  │  │
│  │ Evaluator: Marcus Brody | Timing: 6:45 (Target 5-7m)                                       │  │
│  │ Private Notes: "Great use of vocal variety; practice pausing before key transitions."     │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🎤 Speech #7 • July 21, 2026 • Meeting #140                                                │  │
│  │ Title: "The Architecture of Silence" | Pathway: DL Level 3 - Project: Active Listening     │  │
│  │ Evaluator: Aisha Patel | Timing: 5:50 (Target 5-7m) | Award: 🏆 Best Speaker               │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                  │
│  ROLE HISTORY LOG (LAST 5 SESSIONS)                                                              │
│  • Aug 04, 2026 (Meeting #141): Table Topics Master                                              │
│  • July 07, 2026 (Meeting #139): Evaluator 1 (Evaluated David Kumar)                             │
│  • June 16, 2026 (Meeting #138): Toastmaster of the Day                                          │
│  • June 02, 2026 (Meeting #137): Timer                                                           │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Club Member Directory (`/members`)

A high-density, searchable directory for internal member collaboration:
- **Search & Filters**: Search by name, filter by Pathway name (`Dynamic Leadership`, `Presentation Mastery`, etc.), or filter by ExComm role.
- **Member Card**: Avatar, Full Name, Pathway Level badge (`DL L3`), Executive Title (`VP Education` if applicable), member join date, and email/WhatsApp direct links.

---

## 5. Hour 05 Completion Checklist & Sign-Off

- [x] **Member Dashboard Bento Grid** fully specified with responsive 12-column geometry.
- [x] **Next Meeting Command Card** state logic documented for both assigned and unassigned members.
- [x] **Personal Speech Archive & Evaluation Portfolio** designed with privacy controls.
- [x] **Club Member Directory** search and filtering models established.

---

*Hour 05 complete. Proceed to **Hour 06: Meeting & Session Management Engine**.*
