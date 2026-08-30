# TERRA — HOUR 09: MOBILE IN-MEETING ASSISTANT & UX STATES AUDIT
## Confidential Internal Specification • Terra Toastmasters Operating System

---

## 1. Mobile In-Meeting Assistant Mode (375px – 430px Viewport)

During live club meetings (e.g., Tuesday 19:00 to 21:00 IST), Terra automatically switches the mobile interface into a high-speed **In-Meeting Assistant**. This reduces battery consumption, maximizes readability, and allows members to track the meeting in real time.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  MOBILE IN-MEETING ASSISTANT (390px)                                     │
├──────────────────────────────────────────────────────────────────────────┤
│  🔴 LIVE NOW • MEETING #142                          [Word: Tenacity]    │
│  Theme: "Breaking Boundaries"                        TMOD: Sophia C.     │
├──────────────────────────────────────────────────────────────────────────┤
│  [Agenda]        [Roster]         [Role Sheet]       [📸 Snap Photo]     │
├──────────────────────────────────────────────────────────────────────────┤
│  CURRENT ITEM (19:28 / 19:50 IST)                                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ 🎤 Prepared Speech #2 (5-7m)                                       │  │
│  │ Speaker: Elena Vance                                               │  │
│  │ Title: "Designing AI for Humans"                                   │  │
│  │ Evaluator: Marcus Brody (Evaluator #2)                             │  │
│  │ ⏱️ Timer Signals: Green at 5:00 • Amber at 6:00 • Red at 7:00       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  UP NEXT                                                                 │
│  • 19:35 - Prepared Speech #3: Liam Thorne ("A Journey of Ten Steps")    │
│  • 19:45 - Table Topics Impromptu Session (Liam Thorne)                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ 📸 Instant Photo: Snap a great stage moment?       [+ Add to Album]│  │
│  └────────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────┤
│    🏠 Home        📅 Meetings       🏆 Contests      📸 Gallery    👤 Profile  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. iOS-Style Native Bottom Drawers & Action Sheets

Complex desktop dialogs are automatically replaced on mobile viewports with native **Bottom Action Sheets** featuring smooth swipe-to-dismiss gestures.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  ░░░ (Swipe Handle)                                                │  │
│  │                                                                    │  │
│  │  Confirm Role Claim: Evaluator #2                                  │  │
│  │  Meeting #142 • Tuesday, Aug 18, 2026 • 19:00 IST                  │  │
│  │                                                                    │  │
│  │  You are volunteering to evaluate:                                 │  │
│  │  Elena Vance — "Designing AI for Humans" (5-7m)                    │  │
│  │                                                                    │  │
│  │  [  Confirm & Lock Role  ]                                         │  │
│  │  [  Cancel  ]                                                      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comprehensive 18-State UX Dictionary

```
┌─────┬──────────────────────┬─────────────────┬───────────────────────────────────────────────────────────┐
│ #   │ VIEW / CONTEXT       │ STATE TYPE      │ VISUAL & BEHAVIORAL SPECIFICATION                         │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 01  │ Dashboard Bento      │ Empty           │ "No upcoming meetings scheduled. Check back soon." card.  │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 02  │ Dashboard Bento      │ Skeleton Load   │ Shimmering 16px pulse geometry matching bento slots.      │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 03  │ Dashboard Bento      │ Error           │ "Unable to load meeting stream" with retry button.        │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 04  │ Role Claim Button    │ Idle Available  │ Emerald badge: `[Claim Role]`                             │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 05  │ Role Claim Button    │ Optimistic Lock │ Pill scales down; displays spinner + `[Locking...]`       │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 06  │ Role Claim Button    │ Confirmed       │ Transitions to member avatar + `[Confirmed]`              │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 07  │ Role Claim Button    │ Conflict Block  │ Disabled ghost pill with explanatory tooltip.             │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 08  │ Role Roster          │ Late Drop (<48h)│ High-friction amber alert sheet with warning copy.        │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 09  │ Contest Hub          │ Registration Cl.│ Red pill: `[Registration Closed]` — participant list lock │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 10  │ Contest Hub          │ Waitlist Active │ `[Join Waitlist (Position #2)]`                           │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 11  │ Photo Gallery        │ Empty Album     │ Warm illustration: "No memories captured yet for #142."   │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 12  │ Photo Lightbox       │ Loading Asset   │ Shimmering placeholder maintaining exact aspect ratio.    │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 13  │ Batch Ingestion      │ Compressing     │ Progress bar indicating WebP conversion (e.g., 42/50).    │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 14  │ Batch Ingestion      │ Network Drop    │ Individual asset flags `[Retry Upload]` without restart.  │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 15  │ Member Directory     │ No Search Match │ "No club members found matching '[Query]'."               │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 16  │ Global In-App        │ Success Toast   │ Top-center dark pill toast: `Role claimed successfully`   │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 17  │ Global In-App        │ Offline Banner  │ "Offline Mode • Displaying cached meeting agenda."        │
├─────┼──────────────────────┼─────────────────┼───────────────────────────────────────────────────────────┤
│ 18  │ Admin Agenda Builder │ Time Overflow   │ Red header badge: "Agenda exceeds meeting time by 12 mins"│
└─────┴──────────────────────┴─────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 4. Hour 09 Completion Checklist & Sign-Off

- [x] **Mobile In-Meeting Assistant** layout specified for real-time club participation.
- [x] **Native Bottom Action Sheets & Drawers** documented for touch viewports.
- [x] **Comprehensive 18-State UX Dictionary** codified across all views and edge conditions.

---

*Hour 09 complete. Proceed to **Hour 10: Technical Blueprint, Data Architecture & Implementation Handoff**.*
