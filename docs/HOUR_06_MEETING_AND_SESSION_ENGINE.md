# TERRA — HOUR 06: MEETING & SESSION MANAGEMENT ENGINE
## Confidential Internal Specification • Terra Toastmasters Operating System

---

## 1. Session Detail & Interactive Role Board (`/meetings/[slug]`)

The Session Detail page serves as the single source of truth for every Terra club meeting. It combines an interactive role assignment roster with a real-time timed agenda.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TERRA MEETING #142 — "BREAKING BOUNDARIES"                    [Print PDF Agenda] [Copy WhatsApp] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  📅 Tuesday, Aug 18, 2026 • 19:00 - 21:00 IST | 📍 Terra Hall, Room 4B / Zoom Hybrid             │
│  TMOD: Sophia Chen | Word of the Day: "Tenacity" (Noun) | Status: [🔴 PUBLISHED / ACTIVE]        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  INTERACTIVE ROLE ROSTER                                                                         │
│                                                                                                  │
│  [EXECUTIVE & MEETING LEADS]                                                                     │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────────────────┐  │
│  │ 🎙️ Toastmaster of Day   │ │ 🎲 Table Topics Master  │ │ 🔍 General Evaluator                │  │
│  │ Sophia Chen             │ │ Liam Thorne             │ │ Marcus Brody                        │  │
│  │ [Confirmed Lead]        │ │ [Confirmed Lead]        │ │ [Confirmed Lead]                    │  │
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────────────────┘  │
│                                                                                                  │
│  [PREPARED SPEAKERS & EVALUATORS]                                                                │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────────────────┐  │
│  │ 🎤 Speaker 1 (5-7m)     │ │ 🎤 Speaker 2 (5-7m)     │ │ 🎤 Speaker 3 (5-7m)                 │  │
│  │ David Kumar             │ │ Elena Vance             │ │ 🟢 Available Slot                   │  │
│  │ "The Quiet Power"       │ │ "Designing AI"          │ │ [ Claim Speaker #3 Slot ]           │  │
│  ├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────────────────┤  │
│  │ 🔍 Evaluator 1 (2-3m)   │ │ 🔍 Evaluator 2 (2-3m)   │ │ 🔍 Evaluator 3 (2-3m)               │  │
│  │ Priya Sharma            │ │ 🟢 Available Slot       │ │ Aisha Patel                         │  │
│  │ [Assigned to David]     │ │ [ Claim Evaluator #2 ]  │ │ [Assigned to Speaker 3]             │  │
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────────────────┘  │
│                                                                                                  │
│  [FUNCTIONAL ROLES]                                                                              │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────────────────┐  │
│  │ ⏱️ Timer (All Sessions) │ │ 📖 Grammarian           │ │ 🔔 Ah-Counter & Hark Master         │  │
│  │ Kenji Sato              │ │ Aisha Patel             │ │ 🟢 Available Slot                   │  │
│  │ [Confirmed]             │ │ [Confirmed]             │ │ [ Claim Ah-Counter ]                │  │
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  TIMED LIVE AGENDA                                                                               │
│  19:00 - 19:05 [05m]  Call to Order & Welcome Rules ................. Sergeant at Arms (Kenji S.)│
│  19:05 - 19:15 [10m]  Presidential Address & Guests ................. President (Marcus B.)    │
│  19:15 - 19:25 [10m]  TMOD Introduction & Role Team ................. TMOD (Sophia C.)          │
│  19:25 - 19:50 [25m]  Prepared Speeches Session (3 Slots) ........... Speakers & Timer           │
│  19:50 - 20:10 [20m]  Table Topics Impromptu Session ................ TT Master (Liam T.)       │
│  20:10 - 20:30 [20m]  Evaluations & Technical Reports ............... Gen Evaluator & Team      │
│  20:30 - 20:45 [15m]  Awards, Business & Adjournment ................ President (Marcus B.)     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Admin Drag-and-Drop Agenda Studio (`/admin/meetings/builder`)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  AGENDA BUILDER STUDIO — MEETING #142                               [Save Draft] [Publish Live]  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  Meeting Settings: [Standard 3-Speaker ▼] [Duplicate Past Meeting ▼] [Add Speaker/Eval Pair +] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  DRAG-AND-DROP AGENDA ITEMS                                                                      │
│  ::: [19:00] Call to Order & Welcome ...................... [ 5 mins ▼] [Presenter: SAA      ▼] 🗑️│
│  ::: [19:05] President Opening Remarks .................... [10 mins ▼] [Presenter: Marcus B. ▼] 🗑️│
│  ::: [19:15] TMOD Opening & Role Intros ................... [10 mins ▼] [Presenter: Sophia C. ▼] 🗑️│
│  ::: [19:25] Prepared Speech #1: David Kumar .............. [ 7 mins ▼] [Presenter: David K.  ▼] 🗑️│
│  ::: [19:32] Prepared Speech #2: Elena Vance .............. [ 7 mins ▼] [Presenter: Elena V.  ▼] 🗑️│
│  ::: [19:39] Prepared Speech #3: (Open Slot) .............. [ 7 mins ▼] [Presenter: Unassigned▼] 🗑️│
│  ::: [19:46] Table Topics Impromptu Session ............... [20 mins ▼] [Presenter: Liam T.   ▼] 🗑️│
│  ::: [20:06] Evaluations Session .......................... [20 mins ▼] [Presenter: GE Team   ▼] 🗑️│
│  ::: [20:26] Club Business & Awards ....................... [15 mins ▼] [Presenter: President ▼] 🗑️│
│                                                                                                  │
│  [+ Add Custom Agenda Block]                                    Total Allocated Time: 106 / 120m │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Export Generators: Apple-Styled PDF & WhatsApp Formatter

### 3.1 WhatsApp Plaintext Generator Output
```text
🌿 *TERRA TOASTMASTERS — MEETING #142* 🌿
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* Tuesday, August 18, 2026
⏰ *Time:* 19:00 - 21:00 IST
📍 *Venue:* Terra Hall, Room 4B / Hybrid Zoom
🎯 *Theme:* Breaking Boundaries
📖 *Word of the Day:* Tenacity (Noun)

*ROLE ROSTER:*
• *TMOD:* Sophia Chen
• *Table Topics Master:* Liam Thorne
• *General Evaluator:* Marcus Brody
• *Speaker 1:* David Kumar ("The Quiet Power")
• *Speaker 2:* Elena Vance ("Designing AI")
• *Speaker 3:* [OPEN SLOT - Claim on Terra Portal]
• *Evaluator 1:* Priya Sharma
• *Evaluator 2:* [OPEN SLOT - Claim on Terra Portal]
• *Timer:* Kenji Sato
• *Grammarian:* Aisha Patel
• *Ah-Counter:* [OPEN SLOT]

👉 Claim your role: https://terra.club/meetings/2026-08-18
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 4. Hour 06 Completion Checklist & Sign-Off

- [x] **Session Detail UI & Interactive Role Grid** specified with clear visual status tokens.
- [x] **Admin Drag-and-Drop Agenda Studio** documented with auto-calculating minute offset engine.
- [x] **Printable Apple-Minimalist PDF Agenda & WhatsApp Plaintext Formatter** built.
- [x] **Role Conflict Prevention and Late-Drop Policies** enforced in the data layer.

---

*Hour 06 complete. Proceed to **Hour 07: Contests & Informal Events Engine**.*
