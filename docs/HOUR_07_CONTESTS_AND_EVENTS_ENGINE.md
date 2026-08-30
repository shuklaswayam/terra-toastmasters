# TERRA — HOUR 07: CONTEST ORCHESTRATION & INFORMAL EVENTS ENGINE
## Confidential Internal Specification • Terra Toastmasters Operating System

---

## 1. Contest Hub & Category Ecosystem (`/contests`)

The Contest Hub manages the full lifecycle of Terra's semi-annual club contests across the four official Toastmasters categories:
1. **International Speech Contest** (5–7 mins, Pathway eligibility required)
2. **Table Topics Contest** (1–2 mins impromptu, open to all active members)
3. **Evaluation Contest** (2–3 mins evaluation of a test speaker)
4. **Humorous Speech Contest** (5–7 mins original humorous speech)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TERRA CONTEST HUB — ANNUAL CLUB CONTESTS 2026                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  CATEGORY FILTER: [All Contests] [International] [Table Topics] [Evaluation] [Humorous]          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🎙️ INTERNATIONAL SPEECH CONTEST 2026                       [REGISTRATION OPEN (CLOSES 48H)] │  │
│  │ Date: Sept 12, 2026 • 18:30 IST | Venue: Terra Grand Hall / Zoom Hybrid                   │  │
│  │ Contest Chair: Marcus Brody | Chief Judge: Elena Vance | Capacity: 6 / 8 Contestants       │  │
│  │ Eligibility: Completed minimum Level 1 & 2 in any Pathway                                  │  │
│  │                                                                                            │  │
│  │ [Register as Contestant]               [View Live Contest Roster →]                        │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🎲 TABLE TOPICS CONTEST 2026                              [REGISTRATION OPEN]              │  │
│  │ Date: Sept 12, 2026 • 20:00 IST | Venue: Terra Grand Hall                                  │  │
│  │ Contest Chair: Liam Thorne | Capacity: 8 / 10 Contestants                                  │  │
│  │                                                                                            │  │
│  │ [Register as Contestant]               [View Live Contest Roster →]                        │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Contest Detail, Live Roster & Winner Podium (`/contests/[id]`)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  INTERNATIONAL SPEECH CONTEST 2026                             [Admin Score Panel] [Export List] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  CONFIRMED CONTESTANTS (SPEAKING ORDER DETERMINED BY BRIEFING DRAW)                              │
│  1. David Kumar — "Beyond the Horizon"                           [Confirmed Contestant]          │
│  2. Aisha Patel — "The Chemistry of Courage"                     [Confirmed Contestant]          │
│  3. Kenji Sato  — "Finding Rhythm in Silence"                    [Confirmed Contestant]          │
│  4. Sophia Chen — "Words That Echo"                              [Confirmed Contestant]          │
│  5. Liam Thorne — "A Journey of Ten Steps"                       [Confirmed Contestant]          │
│  6. Elena Vance — "The Architecture of Tomorrow"                 [Confirmed Contestant]          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  🏆 CONTEST HALL OF FAME PODIUM (POST-EVENT RESULTS VIEW)                                        │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────────────────┐  │
│  │ 🥈 2ND PLACE PODIUM     │ │ 🥇 1ST PLACE CHAMPION   │ │ 🥉 3RD PLACE PODIUM                 │  │
│  │ David Kumar             │ │ Aisha Patel             │ │ Elena Vance                         │  │
│  │ "Beyond the Horizon"    │ │ "Chemistry of Courage"  │ │ "Architecture of Tomorrow"          │  │
│  │ [Photo: Award Ceremony] │ │ [Photo: Award Ceremony] │ │ [Photo: Award Ceremony]             │  │
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Informal Events & Workshops Hub (`/events`)

The Informal Events engine handles social mixers, speech workshops, outdoor meetups, and executive committee sessions with interactive 1-click RSVP toggles.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TERRA WORKSHOPS & SOCIAL EVENTS                                              [+ Create Event]   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 💡 WORKSHOP: "Vocal Variety & Stage Command Masterclass"                                   │  │
│  │ 📅 Saturday, Aug 29, 2026 • 16:00 - 18:00 IST | 📍 Studio 402, Bangalore                   │  │
│  │ Host: Marcus Brody (VP Education) | Dress Code: Smart Casual                               │  │
│  │                                                                                            │  │
│  │ RSVP STATUS: [✅ Attending]  [❔ Maybe]  [❌ Can't Go]                                       │  │
│  │ Attendees: 18 Members Attending [👤][👤][👤][👤] +14 others                                │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ ☕ SOCIAL MIXER: "Terra Monsoon Coffee & Fellowship Meet"                                   │  │
│  │ 📅 Sunday, Sept 06, 2026 • 10:30 AM IST | 📍 Third Wave Coffee Roasters                    │  │
│  │ Host: Sophia Chen (President) | Open to all Terra club members                             │  │
│  │                                                                                            │  │
│  │ RSVP STATUS: [✅ Attending]  [❔ Maybe]  [❌ Can't Go]                                       │  │
│  │ Attendees: 12 Members Attending [👤][👤][👤] +9 others                                     │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Hour 07 Completion Checklist & Sign-Off

- [x] **Contest Hub & 4 Category Workflows** specified with active status pills.
- [x] **Contest Registration & Randomized Speaking Order Engine** documented.
- [x] **Apple-Elevated Winner Podium (Gold/Silver/Bronze)** designed.
- [x] **Informal Events Hub & 1-Click Interactive RSVP Toggle** specified.

---

*Hour 07 complete. Proceed to **Hour 08: Media Architecture, Photo Albums & Chronological Pipeline**.*
