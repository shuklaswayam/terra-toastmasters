# TERRA — HOUR 04: VISUAL DESIGN SYSTEM, DESIGN TOKENS & COMPONENT FOUNDATIONS
## Apple Industrial Restraint × 21st.dev Component Craft • Terra Toastmasters

---

## 1. Visual Theme, Atmosphere & Design Philosophy

Terra's design identity rejects generic SaaS dashboard templates, neon purple gradients, and floating AI blobs. Instead, it embodies **Apple industrial minimalism**—characterized by architectural whitespace, monochrome typographic authority, optical contrast, and subtle physical depth—paired with **21st.dev's modern interactive components** (fluid bento grid assemblies, spring-physics pill segmented controls, and tactile action docks).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TERRA TASTE & AESTHETIC SPECTRUM                          │
├───────────────────┬──────────────────────────────────┬─────────────────────────────────┤
│ DIMENSION         │ RATING & CLASSIFICATION          │ BEHAVIORAL MANIFESTATION        │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Density           │ Level 6 (Daily Balanced Utility) │ Generous 24px-32px gutters;     │
│                   │                                  │ high-density monospace tables   │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Variance          │ Level 7 (Asymmetric Bento Grid)  │ 2/3 + 1/3 offset grid modules;  │
│                   │                                  │ no generic 3-equal-card rows    │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Motion            │ Level 6 (Weighted Spring Physics)│ Stiffness 120, Damping 18;      │
│                   │                                  │ tactile -1px press scales       │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Optical Contrast  │ Level 9 (Pristine Apple Contrast)│ Deep charcoal ink on off-white; │
│                   │                                  │ 1px subtle hairline dividers    │
└───────────────────┴──────────────────────────────────┴─────────────────────────────────┘
```

---

## 2. Master Color Palette & Semantic Tokens

### 2.1 Core Neutral Canvas & Surfaces
```
┌──────────────────────────────┬───────────┬──────────────┬──────────────────────────────────────────┐
│ TOKEN NAME                   │ LIGHT HEX │ DARK HEX     │ FUNCTIONAL ROLE                          │
├──────────────────────────────┼───────────┼──────────────┼──────────────────────────────────────────┤
│ --terra-bg-canvas            │ #FBFBFD   │ #0C0C0E      │ Application root backdrop                │
│ --terra-bg-surface           │ #FFFFFF   │ #161618      │ Primary card & container fill            │
│ --terra-bg-subtle            │ #F4F4F6   │ #202024      │ Secondary chips, tables & wells          │
│ --terra-text-primary         │ #18181B   │ #F4F4F6      │ Primary headlines & high-emphasis text   │
│ --terra-text-secondary       │ #71717A   │ #A1A1AA      │ Body text, subtitles & field labels      │
│ --terra-text-tertiary        │ #A1A1AA   │ #52525B      │ Monospace timecodes, metadata & hints    │
│ --terra-border-hairline      │ #E4E4E7   │ #27272A      │ 1px subtle container dividers & borders  │
│ --terra-border-strong        │ #D4D4D8   │ #3F3F46      │ Active inputs & interactive focus rings  │
└──────────────────────────────┴───────────┴──────────────┴──────────────────────────────────────────┘
```

### 2.2 Semantic Status & Club Accents
```
┌──────────────────────────────┬───────────┬──────────────┬──────────────────────────────────────────┐
│ TOKEN NAME                   │ LIGHT HEX │ DARK HEX     │ FUNCTIONAL ROLE                          │
├──────────────────────────────┼───────────┼──────────────┼──────────────────────────────────────────┤
│ --terra-warm-amber (Brand)   │ #D97706   │ #F59E0B      │ Terra brand warmth, status dots, ExComm  │
│ --terra-emerald (Success)    │ #059669   │ #10B981      │ Open / Available roles, Confirmed RSVPs  │
│ --terra-amber (Warning)      │ #D97706   │ #F59E0B      │ Role vacant (<48h), Closing soon badge   │
│ --terra-rose (Urgent/Danger) │ #DC2626   │ #EF4444      │ Role drop confirm, Cancelled session     │
│ --terra-accent-blue (Action) │ #0071E3   │ #2997FF      │ Apple Blue links, calendar sync actions  │
└──────────────────────────────┴───────────┴──────────────┴──────────────────────────────────────────┘
```

---

## 3. Typographic Architecture & Scale

```
┌──────────────────┬─────────────────────┬───────────┬─────────┬───────────────┬─────────────────────────┐
│ STYLE ROLE       │ FONT FAMILY         │ SIZE      │ WEIGHT  │ TRACKING      │ LINE HEIGHT             │
├──────────────────┼─────────────────────┼───────────┼─────────┼───────────────┼─────────────────────────┤
│ Display 1        │ SF Pro Display      │ 36px/2.25 │ 600-700 │ -0.030em      │ 1.15 (Tight)            │
│ Display 2        │ SF Pro Display      │ 28px/1.75 │ 600     │ -0.025em      │ 1.20                    │
│ Section Heading  │ SF Pro Display      │ 20px/1.25 │ 600     │ -0.015em      │ 1.30                    │
│ Card Title       │ SF Pro Display      │ 16px/1.00 │ 600     │ -0.010em      │ 1.40                    │
│ Body Regular     │ SF Pro Text / Inter │ 14px/0.87 │ 400     │ -0.005em      │ 1.50 (Relaxed)          │
│ Body Medium      │ SF Pro Text / Inter │ 14px/0.87 │ 500     │ -0.005em      │ 1.50                    │
│ Caption / Label  │ SF Pro Text / Inter │ 12px/0.75 │ 500     │ +0.010em      │ 1.40 (Uppercase opt.)   │
│ Timecode / Timer │ SF Mono / JetBrains │ 13px/0.81 │ 500     │ +0.020em      │ 1.20 (Monospace tabular)│
└──────────────────┴─────────────────────┴───────────┴─────────┴───────────────┴─────────────────────────┘
```

---

## 4. Elevation, Radii & Surface Systems

### 4.1 Border Radii Hierarchy
- **Card Containers & Bento Slots**: `16px` (`rounded-2xl`)
- **Modals & Floating Action Sheets**: `24px` (`rounded-3xl`)
- **Buttons, Inputs & Dropdowns**: `12px` (`rounded-xl`)
- **Pills, Role Badges & Status Chips**: `9999px` (`rounded-full`)

### 4.2 Apple Diffused Shadow Hierarchy
```css
/* Rest Surface Shadow */
--shadow-rest: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02);

/* Elevated Bento Card Shadow */
--shadow-bento: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02);

/* Hover / Active Float Shadow */
--shadow-float: 0 16px 36px -8px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03);

/* Modal & Action Dock Shadow */
--shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.18);
```

### 4.3 Frosted Glass Surface Specs
```css
/* Apple Frosted Navbar & Bottom Dock */
.terra-glass {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(228, 228, 231, 0.6);
}

.dark .terra-glass {
  background: rgba(22, 22, 24, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(39, 39, 42, 0.6);
}
```

---

## 5. 21st.dev Component Catalog & Atomic Specifications

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          21ST.DEV COMPONENT BLUEPRINTS                                 │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ COMPONENT                │ INTERACTION SPECIFICATION & ANATOMY                         │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 1. Tactile Role Card     │ 16px radius card showing Role Icon + Title + Time Allocation│
│                          │ + Holder Avatar. State: Emerald [Claim Role] pill button    │
│                          │ transforms to Avatar + [Confirmed] on optimistic lock.      │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 2. Segmented Pill Tab    │ Frosted capsule container with sliding spring background    │
│                          │ indicator behind active tab. LayoutId shared transition.    │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 3. Bento Dashboard Grid  │ Responsive CSS Grid (12-col) with 2/3 primary hero slot     │
│                          │ and 1/3 secondary modules. Subtle 1px border hover glow.    │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 4. Floating Action Dock  │ Contextual bottom bar for mobile with haptic-scale buttons  │
│                          │ and dynamic live status pill.                               │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 5. Lightbox Modal        │ Deep #000000/90% backdrop with swipe gestures, metadata     │
│                          │ slide-over drawer, and zoom cursor.                         │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 6. Timecode Chip         │ Monospace pill (e.g. `19:05 - 19:20 [15m]`) with subtle     │
│                          │ border and dark muted typography.                           │
└──────────────────────────┴─────────────────────────────────────────────────────────────┘
```

### 5.1 Tactile Button Hierarchy
- **Primary Action (Dark Pill)**:
  - Classes: `bg-[#18181B] text-white hover:bg-black active:scale-[0.98] transition-all rounded-xl px-4 py-2.5 font-medium text-sm shadow-sm dark:bg-white dark:text-black dark:hover:bg-neutral-200`
- **Role Claim Trigger (Emerald Pill)**:
  - Classes: `bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.97] transition-all rounded-full px-3.5 py-1.5 font-medium text-xs shadow-sm flex items-center gap-1.5`
- **Secondary Ghost Pill**:
  - Classes: `bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:scale-[0.98] transition-all rounded-xl px-4 py-2.5 text-sm dark:bg-neutral-800 dark:text-neutral-200`
- **Destructive Action Pill**:
  - Classes: `bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-[0.98] rounded-xl px-4 py-2 text-sm font-medium dark:bg-rose-950/30 dark:text-rose-400`

---

## 6. Motion & Spring Physics Architecture

Terra uses **Framer Motion** with calibrated Apple spring curves. Linear transitions are strictly forbidden.

```typescript
// Terra Calibrated Spring Configurations
export const terraSpring = {
  // Primary modal & sheet transitions
  modal: {
    type: "spring",
    stiffness: 120,
    damping: 18,
    mass: 0.8
  },
  // Tactile buttons & segmented tab pills
  pillTab: {
    type: "spring",
    stiffness: 280,
    damping: 26
  },
  // Staggered list reveals (meeting agenda items)
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02
      }
    }
  },
  staggerItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } }
  }
};
```

---

## 7. Explicit Anti-Patterns & AI Slop Ban-List

```
┌──────────────────────────────────────┬───────────────────────────────────────────────────────────┐
│ FORBIDDEN AI SLOP CLICHÉ             │ TERRA MANDATORY ALTERNATIVE                               │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Neon purple/pink gradient glows   │ ✅ Subtle 1px zinc borders and clean neutral white/black  │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Floating background blobs / mesh  │ ✅ Clean solid canvas with crisp typographic structure    │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Generic 3-equal-column cards      │ ✅ Asymmetric 2/3 + 1/3 Bento Grid with visual hierarchy  │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Overly bubbly 32px rounded cards  │ ✅ Architectural 16px (`rounded-2xl`) with crisp corners  │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Fake invented metrics (99.9% SLA) │ ✅ Authentic Toastmasters data (Speeches, Roles, Pathways)│
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Lazy "SYSTEM // 2024" headers     │ ✅ Clear human titles: "Meeting #142 • August 18, 2026"   │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Pure #000000 harsh black text     │ ✅ Deep Charcoal Ink `#18181B` with optical softening     │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ❌ Spinning circular loading wheels  │ ✅ Shimmering skeletal geometry matching exact card sizes │
└──────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 8. Tailwind CSS Root Token Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terra: {
          canvas: "var(--terra-bg-canvas)",
          surface: "var(--terra-bg-surface)",
          subtle: "var(--terra-bg-subtle)",
          text: {
            primary: "var(--terra-text-primary)",
            secondary: "var(--terra-text-secondary)",
            tertiary: "var(--terra-text-tertiary)",
          },
          border: {
            hairline: "var(--terra-border-hairline)",
            strong: "var(--terra-border-strong)",
          },
          amber: "#D97706",
          emerald: "#059669",
          rose: "#DC2626",
          blue: "#0071E3",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-display)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        rest: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        bento: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        float: "0 16px 36px -8px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.18)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 9. Hour 04 Completion Checklist & Sign-Off

- [x] **Visual Atmosphere & Mood Spectrum** codified for Apple industrial elegance.
- [x] **Color Palette & Semantic Tokens** defined with exact hexes for Light and Dark modes.
- [x] **Typographic Scale & Font Pairings** established with strict tracking and line heights.
- [x] **Elevation, Diffused Shadows & Frosted Glass** formulas documented.
- [x] **21st.dev Component Catalog & Atomic Button Hierarchy** specified.
- [x] **Framer Motion Spring Physics Curves** configured.
- [x] **Comprehensive Anti-Slop Ban-List** locked.
- [x] **Tailwind CSS Configuration Module** provided for direct developer ingestion.

---

*Hour 04 complete. Proceed to **Hour 05: Member Command Center, Speech Archive & Pathway Portfolio**.*
