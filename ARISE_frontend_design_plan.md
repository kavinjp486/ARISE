# ARISE AI Harvester — Frontend Redesign Plan

Instructions for rebuilding the UI of the ARISE web app (Digital Twin dashboard + AI Vision Analytics dashboard). Follow this document top to bottom. Every decision here exists to make the product look like calm, trustworthy industrial software rather than a sci-fi demo.

---

## 1. What is wrong with the current design

Observed in the existing screens:

| Problem | Where it shows |
|---|---|
| Too many colours: cyan, neon green, red, amber, yellow, wood-brown, purple icons | Header chips, viewports, metrics, buttons |
| Glow and neon borders on everything, so nothing stands out | Every card, button, bounding box |
| Decorative display font for all headings (wide, all caps) | "VIEWPORT A – TOP VIEW (WOODEN FRAME PROTOTYPE)" |
| Emoji and mixed icon styles | Viewport titles, tab labels |
| Long, shouty labels, uneven alignment | Viewport headers, "Z-Elevator Lead-Screw Plucker Depth" |
| No clear visual hierarchy: status, controls, and data all have equal weight | Header strip, Viewport D |
| Misleading empty/error states: black webcam box with "DISEASED 99%" and "100% defect" | AI Vision page |
| Duplicate/placeholder-looking data in logs | Scan logs |
| Dangerous action (E-STOP) styled like a normal chip | Top right |

Goal: **fewer colours, fewer effects, stronger hierarchy, honest states.**

---

## 2. Design principles

1. **Calm by default, loud only when it matters.** Normal state is neutral. Colour is reserved for status and the primary action.
2. **One accent colour.** If everything glows, nothing is urgent.
3. **Data first.** Numbers and live views are the heroes; chrome (borders, backgrounds) recedes.
4. **Consistency over novelty.** Same card, same spacing, same type scale on both dashboards.
5. **Safety first.** E-STOP is always visible, always the same place, never confused with other buttons.
6. **Honest states.** Loading, offline, no-camera, and no-detection must each have their own designed state. Never show fake numbers.

Reference products to study (look at their dashboards, spacing, and typography, not to copy):

- **Linear / Vercel dashboard**: restrained dark UI, thin borders, one accent
- **Grafana / Datadog**: dense but readable telemetry cards
- **John Deere Operations Center / Trimble Ag**: how agri software structures fields, machines, and alerts
- **Foxglove Studio / Rerun**: robotics viewers, panel layouts, 3D and camera panes
- **Tesla Fleet / Boston Dynamics Orbit**: robot status and teleoperation controls
- **Stripe Dashboard**: type hierarchy, tables, empty states

---

## 3. Theme: "Tea Estate Control Room"

A dark, quiet control-room theme with a single living-green accent that nods to tea leaves. No wood textures, no neon.

### 3.1 Colour palette (3 colours + neutrals)

Only these three brand colours are allowed anywhere in the app.

| Role | Name | Hex | Used for |
|---|---|---|---|
| Base | **Deep Slate** | `#0E1514` | Page background (and its lighter tints for surfaces) |
| Primary accent | **Tea Green** | `#4ADE80` | Primary buttons, active tab, live/healthy status, selected state, key numbers, chart main line |
| Alert | **Amber** | `#F5A524` | Warnings, diseased/attention state, E-STOP outline, danger confirmations |

Neutrals are tints of Deep Slate and do **not** count as extra colours:

```css
:root {
  /* Base + neutral surfaces */
  --bg:           #0E1514;  /* page */
  --surface-1:    #141D1C;  /* cards */
  --surface-2:    #1B2625;  /* raised / hover / inputs */
  --border:       #26332F;  /* 1px dividers */
  --text:         #E6EDEB;  /* primary text */
  --text-muted:   #8FA19C;  /* secondary text, labels */

  /* Brand accents */
  --accent:       #4ADE80;  /* Tea Green */
  --accent-soft:  rgba(74, 222, 128, 0.12); /* tinted backgrounds */
  --alert:        #F5A524;  /* Amber */
  --alert-soft:   rgba(245, 165, 36, 0.12);

  /* Shape */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
```

Rules:

- Green = **healthy / active / go**. Amber = **attention / disease / stop**. Everything else is grey-green neutral.
- No red, cyan, purple, yellow, or brown. A diseased leaf and an E-STOP both use Amber; differentiate by shape and label, not by a new colour.
- No gradients and no glows. Allowed: a subtle 1px border and, for the live indicator only, a small pulsing dot.
- Contrast: body text must meet WCAG AA (4.5:1) against its surface. Check `--text-muted` on `--surface-1`.
- Optional light mode: invert the neutrals, keep the same Green and Amber (darken Green to `#16A34A` for contrast).

### 3.2 Typography

| Use | Font | Notes |
|---|---|---|
| UI text, headings | **Inter** (or Geist) | Sentence case, not all caps |
| Numbers, coordinates, IDs, timestamps | **JetBrains Mono** (or IBM Plex Mono) | Use tabular numerals so values do not jiggle |

Type scale:

| Token | Size / Weight | Use |
|---|---|---|
| `display` | 32 / 600 | Single hero metric (e.g., confidence) |
| `h1` | 24 / 600 | Page title |
| `h2` | 16 / 600 | Card title |
| `body` | 14 / 400 | Default |
| `label` | 12 / 500, uppercase, 0.04em tracking | Small field labels only |
| `mono` | 13 / 500 | Telemetry values |

Remove the wide display font (Orbitron-style) everywhere.

### 3.3 Spacing, layout, and surfaces

- 8px spacing grid: 4, 8, 12, 16, 24, 32, 48.
- Page max width 1440px, 24px page padding, 16px gap between cards.
- Cards: `--surface-1` background, 1px `--border`, `--radius-lg`, 16-20px padding. No shadows, no glow.
- Card header pattern (identical everywhere): title left (`h2`), optional status pill or action right, 1px divider beneath.
- Use one 12-column grid on desktop, 1 column on mobile.

### 3.4 Iconography

- One icon set only: **Lucide** (24px grid, 1.5px stroke). Remove all emoji.
- Icons are `--text-muted` by default, `--accent` when active.

---

## 4. Global layout

```
┌──────────────────────────────────────────────────────────────┐
│ Top bar:  Logo · ARISE  |  Estate / Sector      [E-STOP]     │
├───────────┬──────────────────────────────────────────────────┤
│ Sidebar   │  Status strip (GPS · Tension · Battery · Link)   │
│  Digital  ├──────────────────────────────────────────────────┤
│  Twin     │                                                  │
│  AI Vision│              Page content                        │
│  (future: │                                                  │
│  Logs,    │                                                  │
│  Settings)│                                                  │
└───────────┴──────────────────────────────────────────────────┘
```

### 4.1 Top bar (64px)

- Left: logo mark + "ARISE" + small muted subtitle "Nilgiris Tea Estate · Sector B". Drop the "AI HARVESTER v2.4" chip; put version in the footer or settings.
- Right: **mode switch** (Autonomous | Teleop) as a segmented control, then **E-STOP**.
- E-STOP: outlined Amber button with a stop icon, always the right-most item, always visible (sticky). Clicking opens a confirm only to *release*, never to trigger.

### 4.2 Navigation

- Replace the top pill tabs with a **left sidebar** (icon + label) or a simple underline tab bar under the top bar. Pick one; sidebar scales better.
- Active item: `--accent-soft` background, `--accent` icon and text. Inactive: muted.

### 4.3 Status strip

A single row of four equal stat tiles under the top bar, shared by both dashboards:

| Tile | Format | Colour rule |
|---|---|---|
| RTK/GPS | "Fixed · ±1.2 cm" | Green when fixed, Amber when float/lost |
| Cable tension | "142 N" | Green in range, Amber out of range |
| Battery | "88%" + thin bar | Green above 20%, Amber below |
| Link latency | "12 ms" | Green below threshold, Amber above |

Tile design: muted `label` on top, `mono` value below, a 6px status dot at right. No icons-in-boxes, no coloured borders.

---

## 5. Dashboard 1 — Digital Twin

### 5.1 Layout (desktop)

```
┌─────────────────────────────┬──────────────────────────────┐
│  Top view (field map)       │  Side elevation              │
│  8 cols                     │  4 cols                      │
├─────────────────────────────┼──────────────────────────────┤
│  First-person camera        │  Teleoperation controls      │
│  7 cols                     │  5 cols                      │
└─────────────────────────────┴──────────────────────────────┘
```

Rename the viewports to plain, short titles (drop "Viewport A/B/C/D" and the parenthetical prototype text):

| Old | New |
|---|---|
| Viewport A – Top view (wooden frame prototype) | **Field map** |
| Viewport B – Side elevation (timber frame & mechanics) | **Side elevation** |
| Viewport C – First-person view (pan & step navigation) | **Camera view** |
| Viewport D – Expanded robot teleoperation control center | **Teleoperation** |

### 5.2 Field map card

- Draw the frame as a clean 1px outline rectangle, **not** a wooden texture. Cell grid in `--border` colour at low contrast.
- Cables: thin 1.5px lines in `--text-muted`; the active cable segments in `--accent`. No thick neon diagonals.
- Payload: a small rounded square in `--accent` with a crosshair; label chip shows `R5-C6` and `X 50% · Y 50%` in mono.
- Plucked/covered cells: faint green fill (`--accent-soft`).
- Disease or obstacle cells: Amber outline + small warning icon. Remove the red tint.
- Idlers (NW/NE/SW/SE): small hollow circles at the corners with a muted label, not floating green badges that overlap the frame text.
- Card header right side: two inline stats: "Coverage 0%" and "Position X 50 · Y 50".
- Add a small legend under the map (Payload, Covered, Attention) in one row.

### 5.3 Side elevation card

- Same line-drawing style: two vertical rails (1px outlines, no wood fill), payload block, hopper.
- Hopper fill level shown as a thin progress bar with "24 shoots" text, not a decorative blob of leaves.
- Z-depth shown by a dimension line with a numeric label ("Depth 30%").
- Rotated text on the rails is hard to read, so replace it with small horizontal labels near the rails.

### 5.4 Camera view card

- Video fills the card with a 10px radius; add a bottom gradient-free caption bar.
- Detection box: 2px `--accent` outline, small label tab above "Fresh tea shoots · 98%". Remove the glow and extra HUD text ("CAMERA FOV [...]").
- Show step as a compact stepper at the bottom: "Step 5 of 8" with a thin progress bar, plus prev/next icon buttons.
- State: if there is no feed, show the empty state from section 7.

### 5.4 Teleoperation card

- Segmented control for speed profile: **Standard 0.8 m/s | Turbo 1.8 m/s**. Selected = `--accent-soft` bg + accent text.
- D-pad: standard cross layout, square 56px buttons, `--surface-2` fill, 1px border, icon only (arrows) with keyboard hint ("W A S D").
- **Pluck** is the single primary action: solid `--accent` fill, dark text, placed in the centre of the D-pad or as a full-width button below it.
- Z-elevator depth: slider with a thin accent track, value in mono at right ("30%"). Shorten the label to "Plucker depth".
- Position readout (X, Y, Z) as three mono tiles in the card footer.
- Disable the whole controls card with a visible banner when the mode is Autonomous.

---

## 6. Dashboard 2 — AI Vision Analytics

### 6.1 Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Page header: "Leaf health" · live status pill · Refresh      │
├───────────────────────────────┬──────────────────────────────┤
│ Live camera + bounding box    │ Current leaf result          │
│ 8 cols                        │ 4 cols                       │
│                               │ Recommendation               │
├───────────────────────────────┼──────────────────────────────┤
│ Classification reference      │ Recent scans (table)         │
└───────────────────────────────┴──────────────────────────────┘
```

### 6.2 Header

- Title "Leaf health detector", one muted line of description.
- Right side: status pill "Live · 600 ms" (green dot, pulsing) and a secondary **Refresh** button (outline, not filled).

### 6.3 Live camera card

- 16:9 video area. Overlay chips at top-left ("Live") and top-right ("Binary vision engine") in small translucent dark pills, not bright bordered boxes.
- Bounding box: 2px outline. **Green** for healthy, **Amber** for diseased. Label tab shows class + confidence.
- Footer row: "1080p · 60 FPS · 640×480 detection frame" in muted mono.

### 6.4 Result card

- Top: a status pill ("Healthy" green / "Diseased" amber) and the diagnosis name ("Anthracnose lesions") as `h2`.
- Confidence as a `display` mono number with a thin horizontal bar beneath it.
- Two metric tiles: **Defect area** and **Bounding box**. Show "n/a" if nothing is detected, never "100%".
- Recommendation block: a card with a left 3px accent/alert bar, an icon, and a short sentence: "Apply organic fungicide to this sector." Add a secondary button "Mark sector for treatment".

### 6.5 Classification reference

- Two compact cards (Healthy / Diseased), each with a pill, a one-line description, and ideally a sample leaf thumbnail. Remove the "Agronomist audited" blue label or turn it into a muted footnote.

### 6.6 Recent scans table

- Real table: columns **Scan ID · Time · Status · Diagnosis · Confidence**.
- Row height 44px, 1px bottom borders, no zebra stripes, hover = `--surface-2`.
- Scan ID in mono, status as a small pill, confidence right-aligned mono.
- Show the last 8 scans, with a "View all" link. IDs must be sequential and unique, and timestamps must be unique per scan (the current duplicates look like fake data).

---

## 7. Component specs

| Component | Spec |
|---|---|
| **Button, primary** | `--accent` fill, `#06210F` text, 36px height, `--radius-md`, 500 weight |
| **Button, secondary** | Transparent, 1px `--border`, `--text`; hover `--surface-2` |
| **Button, danger (E-STOP)** | Transparent, 1px `--alert`, `--alert` text; hover `--alert-soft` |
| **Segmented control** | `--surface-2` track, selected segment `--accent-soft` + accent text |
| **Status pill** | 22px height, tinted background (`*-soft`), coloured text, 6px dot |
| **Stat tile** | Muted label, mono value, optional dot; no border colour changes |
| **Card** | As in 3.3 |
| **Slider** | 4px track, accent filled part, 16px round thumb with 2px `--bg` ring |
| **Table** | As in 6.6 |
| **Tooltip** | `--surface-2`, 1px border, 12px text |

### States every data component must support

| State | Design |
|---|---|
| Loading | Skeleton blocks in `--surface-2`, shimmer subtle |
| No camera / offline | Centred icon, "Camera offline", muted helper text, Retry button; status pills go neutral grey |
| No detection | "No leaf in view" in neutral grey, metrics show "–" |
| Warning | Amber pill + amber value |
| Error | Same as warning plus a message and a retry action |

Important: the AI Vision page currently reports "Diseased 99%" with a black stream. Without a live frame the result must show the **offline/no detection** state, not a diagnosis.

---

## 8. Motion

- Duration 150-200 ms, ease-out. Only animate: hover colour, tab change, panel fade-in, slider value, the live-dot pulse.
- No glowing, no scanning lines, no parallax.
- Respect `prefers-reduced-motion`.

---

## 9. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥1280 px | Full layouts as above, sidebar expanded |
| 768-1279 px | Sidebar collapses to icons; two-column grids become one column for the widest cards |
| <768 px | Bottom tab bar replaces sidebar; status strip becomes a 2×2 grid; teleop D-pad gets 64px touch targets; E-STOP stays pinned top-right |

---

## 10. Accessibility checklist

- Never rely on colour alone: every Green/Amber state also has a label or icon.
- Minimum touch target 44×44 px for teleop controls.
- Visible focus ring: 2px `--accent`, 2px offset.
- Keyboard: arrow keys / WASD drive the robot, Space = Pluck, Esc does nothing dangerous.
- Add `aria-live="polite"` on status updates and `aria-label` on icon-only buttons.

---

## 11. Suggested implementation stack

| Concern | Suggestion |
|---|---|
| Framework | React + Vite (or Next.js) |
| Styling | Tailwind CSS with the tokens in 3.1 mapped into `tailwind.config` |
| Components | shadcn/ui as a base, restyled to this spec |
| Icons | `lucide-react` |
| Charts | Recharts or uPlot, with accent line, muted gridlines |
| Field map / elevation | Inline SVG components driven by state |
| Realtime | WebSocket for telemetry; WebRTC/MJPEG for video |

Folder idea:

```
src/
  styles/tokens.css
  components/ui/        (Button, Card, Pill, Segmented, Slider, Table)
  components/layout/    (TopBar, Sidebar, StatusStrip)
  features/digital-twin/ (FieldMap, SideElevation, CameraView, Teleop)
  features/vision/       (LiveFeed, ResultCard, Reference, ScanTable)
```

---

## 12. Build order

1. Add tokens (`tokens.css`) and load Inter + JetBrains Mono.
2. Build the shared shell: top bar, sidebar, status strip, E-STOP.
3. Build UI primitives (Card, Button, Pill, Segmented, Slider, Table).
4. Rebuild Digital Twin page: Field map, Side elevation, Camera, Teleop.
5. Rebuild AI Vision page: Live feed, Result, Reference, Scan table.
6. Add loading, offline, and empty states everywhere.
7. Responsive pass, then accessibility pass.
8. Remove all unused colours, glows, emoji, and the old display font.

## 13. Definition of done

- Only Deep Slate, Tea Green, and Amber appear (plus neutral tints).
- No glow, gradients, emoji, or all-caps headings (labels excepted).
- Both dashboards share the same shell, card style, type scale, and spacing.
- Every status is understandable without colour.
- No fake or duplicate data; every empty state is designed.
- E-STOP is visible and reachable on every screen.
