# TERRA — HOUR 08: MEDIA ARCHITECTURE, PHOTO ALBUMS & CHRONOLOGICAL PIPELINE
## Confidential Internal Specification • Terra Toastmasters Operating System

---

## 1. Master Media Archive (`/gallery`)

The Terra Media Archive organizes all club photography chronologically and anchors every visual asset directly to a parent meeting session or informal event.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  TERRA PHOTO ARCHIVE                                           [+ Upload Photos] [Download ZIP]  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  📁 Terra Archive  /  📅 2026  /  🌙 August  /  📸 Meeting #142: Breaking Boundaries             │
│  42 High-Resolution Photos • Captured by Marcus Brody (VP PR) on Aug 18, 2026                    │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  VIEW MODE: [📁 By Session Album]  [🖼️ Continuous Masonry Stream]                                 │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  SESSION PHOTO MASONRY GRID                                                                      │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐   │
│  │                    │ │                    │ │                    │ │                    │   │
│  │    [Photo 1]       │ │    [Photo 2]       │ │    [Photo 3]       │ │    [Photo 4]       │   │
│  │  TMOD Opening      │ │  Speaker 1 Stage   │ │  Table Topics Fun  │ │  Best Speaker Win  │   │
│  │  (Sophia Chen)     │ │  (David Kumar)     │ │  (Liam Thorne)     │ │  (Elena Vance)     │   │
│  │                    │ │                    │ │                    │ │                    │   │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘ └────────────────────┘   │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐   │
│  │                    │ │                    │ │                    │ │                    │   │
│  │    [Photo 5]       │ │    [Photo 6]       │ │    [Photo 7]       │ │    [Photo 8]       │   │
│  │  Evaluators Panel  │ │  Timer In Action   │ │  Club Fellowship   │ │  Meeting Adjourned │   │
│  │  (Marcus Brody)    │ │  (Kenji Sato)      │ │  (Group Photo)     │ │  (Closing Cheer)   │   │
│  │                    │ │                    │ │                    │ │                    │   │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘ └────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Apple-Inspired Lightbox Modal Specification

When any photo thumbnail is tapped or clicked:
1. **Backdrop & Depth**: Instant `#000000`/90% frosted blur (`backdrop-blur-2xl`) overlay with zero content shift.
2. **Gesture & Keyboard Controls**:
   - `Left Arrow` / `Right Arrow`: Smooth cross-fade to adjacent image with Framer Motion spring physics.
   - `Escape`: Closes modal and restores scroll position.
   - `Mobile Touch`: Horizontal swipe with velocity-based snapping; pull-down to dismiss.
3. **Metadata Side-Drawer (Toggleable via `[ℹ️ Info]`)**:
   - Associated Session Title (`Meeting #142 - Breaking Boundaries`).
   - Timestamp & Camera EXIF details.
   - Uploaded By (Avatar + Name).
   - Tagged Members (Clickable avatar chips linking to member profiles).
   - Action: `[⬇️ Download High-Res Original (4.2 MB)]`.

---

## 3. High-Speed Batch Ingestion Studio (`/gallery/upload`)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  BATCH PHOTO INGESTION STUDIO                                                 [Cancel] [Publish] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  📂 DRAG & DROP RAW PHOTOS HERE (OR CLICK TO BROWSE)                                       │  │
│  │  Supports JPEG, PNG, HEIC, WebP • Up to 50 photos per batch (Max 25MB each)                │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                  │
│  SMART TARGET SESSION ASSIGNMENT                                                                 │
│  Target Session: [🎯 Meeting #142: Breaking Boundaries (Aug 18, 2026) — Auto-Matched from EXIF ▼]│
│                                                                                                  │
│  BATCH TAGGING: [🏷️ Awards] [🏷️ Prepared Speeches] [🏷️ Table Topics] [🏷️ Social Moments]      │
│                                                                                                  │
│  UPLOAD QUEUE (12 ASSETS READY)                                                                  │
│  [■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■] 100% Compressed (Client-Side WebP Conversion)           │
│  • IMG_8492.jpg (3.8MB -> 420KB WebP) ........................................ [✅ Ready]       │
│  • IMG_8493.jpg (4.1MB -> 480KB WebP) ........................................ [✅ Ready]       │
│  • IMG_8494.jpg (3.2MB -> 390KB WebP) ........................................ [✅ Ready]       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Hour 08 Completion Checklist & Sign-Off

- [x] **Chronological Media Hierarchy** structured (`Year -> Month -> Session_Slug -> Assets`).
- [x] **Session Photo Masonry Grid** designed with progressive WebP loading.
- [x] **Apple-Grade Lightbox Viewer** specified with gestures and metadata drawer.
- [x] **Batch Ingestion Pipeline** documented with client-side WebP compression and EXIF date auto-matching.

---

*Hour 08 complete. Proceed to **Hour 09: Mobile In-Meeting Assistant & UX States**.*
