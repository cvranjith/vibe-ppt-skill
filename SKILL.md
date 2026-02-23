# Creative Presentation Skill

## Overview

Generate visually compelling, professionally designed PowerPoint presentations using PptxGenJS. This skill prioritizes **creative, varied layouts** over rigid templates — every deck should feel custom-designed, not stamped from a formula.

## Philosophy

> **Vibe PPT, not Template PPT.** The AI should make creative layout decisions per slide based on content type, not follow a fixed grid. Design principles guide the output — not rigid rules.

---

## Quick Start

```bash
# One-time setup
npm install -g pptxgenjs react-icons react react-dom sharp

# Also needed for visual QA (if available)
# pip install "markitdown[pptx]"
# LibreOffice + poppler for image rendering
```

---

## How to Build a Deck

### Step 1: Analyze the Content

Before writing any code, read the content and decide:
- How many slides?
- What **type** is each slide? (title, objectives, comparison, process flow, detail, dashboard, closing)
- What layout best suits each slide's content? (see Layout Repertoire below)
- What **Font Awesome icons** would reinforce each content section? (see Icon System below)

**Vary layouts across slides.** Never use the same layout twice in a row.

### Step 2: Choose a Color Palette

The **default theme is Oracle Redwood Light** (see Default Theme section below). Use it unless the user explicitly requests a different theme or dark mode.

If a non-Redwood theme is requested, use a **3-color system**:
- **Primary** (60-70% weight): backgrounds, headers — the dominant visual identity
- **Secondary** (20-30%): cards, accents, supporting elements
- **Accent** (5-10%): icons, highlights, call-to-action elements

Alternative palettes (use only when user requests non-Redwood):

| Theme | Primary | Secondary | Accent | Good For |
|-------|---------|-----------|--------|----------|
| Midnight Executive | `1A2744` | `CADCFC` | `3B82F6` | Governance, strategy |
| Ocean Gradient | `065A82` | `1C7293` | `0EA5E9` | Tech, innovation |
| Forest & Moss | `2C5F2D` | `97BC62` | `F5F5F5` | Sustainability, growth |
| Charcoal Minimal | `36454F` | `F2F2F2` | `212121` | Clean, modern |

### Step 3: Write the Generation Code

Use the code structure, patterns, and API reference in [pptxgenjs-reference.md](pptxgenjs-reference.md).

### Step 4: Visual QA (Required)

**Assume there are problems. Your job is to find them.** Your first render is almost never correct. Approach QA as a bug hunt, not a confirmation step.

#### Content QA

Always verify that all text content made it into the slides:

```bash
pip install "markitdown[pptx]" --break-system-packages 2>/dev/null
python -m markitdown output.pptx
```

Check for: missing content, typos, wrong slide order, truncated text.

#### Visual QA (When Image Rendering Is Available)

Convert slides to images and visually inspect every slide:

```bash
# Convert PPTX → PDF → JPG images
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
# Creates slide-01.jpg, slide-02.jpg, etc.
```

Then inspect each image. Look for these specific issues:

- **Overlapping elements** — text bleeding through shapes, icons colliding with text, stacked elements
- **Text overflow or cut off** — content clipped at box edges or running off-slide
- **Content exceeding footer zone** — anything below y: 5.075" (the reserved logo area)
- **Content in top margin** — anything above y: 0.55" (except header bars starting at y: 0)
- **Elements too close** — less than 0.3" gaps between content blocks
- **Uneven spacing** — large empty area in one place, cramped in another
- **Insufficient margin from slide edges** — less than 0.5" from left/right edges
- **Low-contrast text** — light text on light backgrounds, dark text on dark areas
- **Low-contrast icons** — dark icons on dark backgrounds without a contrasting circle
- **Text boxes too narrow** — causing excessive word wrapping
- **Clipped flow elements** — process flow steps cut off at right edge of slide (common issue)
- **Misaligned columns** — cards or similar elements not aligned consistently

#### Re-Render Specific Slides After Fixes

After fixing issues, you can re-render just the affected slides:

```bash
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 -f N -l N output.pdf slide-fixed
# Where N is the slide number to check
```

#### Verification Loop

1. **Generate slides** → Convert to images → Inspect every slide
2. **List all issues found** (if you found zero issues, look again more critically)
3. **Fix the issues** in code
4. **Re-generate and re-verify** the affected slides — one fix often creates a new problem
5. **Repeat** until a full pass reveals no new issues

**Do not declare success until you've completed at least one fix-and-verify cycle.**

#### When Visual QA Is Not Available

If LibreOffice or pdftoppm is not installed:

1. Use **conservative spacing** — 0.5" margins, 0.3"+ gaps between all elements
2. Run content QA via `markitdown` to verify all text is present
3. **Manually calculate** that no element's `y + h` exceeds 5.075 (footer zone)
4. **Manually calculate** that no element's `x + w` exceeds 9.5 (right margin)
5. For process flows, calculate total width: `n * stepWidth + (n-1) * (gapWidth + arrowWidth)` and ensure it fits within 9.0" (0.5" margins each side)

---

## Default Theme: Oracle Redwood Light

The default presentation theme follows Oracle's Redwood Design System in **light mode**. Only switch to dark mode if the user explicitly asks for it.

### Redwood Light Color Constants

```javascript
const BRAND = {
  // === ORACLE REDWOOD LIGHT PALETTE ===

  // Primary: Oracle Red — used for accent bars, icon circles, key highlights
  oracleRed: "C74634",

  // Warm neutrals — Redwood's signature warm-toned grays
  charcoal: "312D2A",          // Darkest text, title slide backgrounds (dark mode only)
  darkText: "312D2A",          // Primary text on light backgrounds
  medText: "5A5650",           // Secondary/body text
  lightText: "8A8581",         // Captions, muted labels

  // Light backgrounds — warm off-whites (NOT cool blue-grays)
  slideBg: "FAF9F7",           // Main slide background (warm off-white)
  cardBg: "FFFFFF",            // Card/container backgrounds
  subtleBg: "F3F1EE",         // Subtle differentiation, alternate sections

  // Header bar
  headerBg: "312D2A",          // Dark charcoal header bar at top of content slides

  // Accent & highlight colors (Redwood palette)
  redAccent: "C74634",         // Primary accent — Oracle Red
  teal: "0C6B58",              // Secondary accent — Redwood teal/green
  blue: "1B6CB0",              // Tertiary accent — Redwood blue
  amber: "C4841D",             // Warning/caution accent
  green: "13811C",             // Success/positive accent

  // Card differentiation palette (use for multi-card layouts)
  palette: ["C74634", "1B6CB0", "0C6B58", "C4841D"],

  // Card styling
  cardBorder: "E5E1DC",        // Warm gray borders
  cardShadowColor: "000000",   // Shadow base (use with low opacity)

  // Footer
  footerHeight: 0.55,          // Reserve this height at bottom for logo placement
  footerY: 5.075,              // Y position where footer zone begins (5.625 - 0.55)

  // Top margin (match footer for visual balance)
  topMargin: 0.55,

  // Typography
  headerFont: "Oracle Sans",   // Falls back to Calibri if not available
  headerFontFallback: "Calibri",
  bodyFont: "Oracle Sans",     // Falls back to Calibri if not available
  bodyFontFallback: "Calibri",
};
```

### Redwood Light Mode Rules

1. **Slide backgrounds are warm off-white** (`FAF9F7`), never stark white or cool gray
2. **Header bars use dark charcoal** (`312D2A`), not navy or black
3. **Oracle Red** (`C74634`) is the primary accent — used for icon backgrounds, accent bars, highlights
4. **Cards are white** (`FFFFFF`) with warm gray borders (`E5E1DC`) and subtle shadows
5. **Text is warm** — dark charcoal for headings (`312D2A`), warm gray for body (`5A5650`)
6. **No cool blues or navies** as primary colors — Redwood's identity is warm-toned

### Redwood Dark Mode (Only When User Requests)

If the user asks for dark mode or dark slides:

```javascript
const DARK_OVERRIDES = {
  slideBg: "312D2A",           // Charcoal background
  cardBg: "3D3835",            // Slightly lighter charcoal for cards
  subtleBg: "2A2623",          // Deeper charcoal for contrast
  headerBg: "1F1C1A",          // Near-black header
  darkText: "FFFFFF",          // White text on dark bg
  medText: "D4CFC9",           // Light warm gray for body
  lightText: "A39E98",         // Muted text
  cardBorder: "4A4541",        // Dark warm border
};
```

### Font Handling

Oracle Sans may not be installed on all systems. Use this pattern:

```javascript
// Prefer Oracle Sans, fallback to Calibri
const HEADER_FONT = "Calibri";  // Safe default; user can swap to "Oracle Sans" if available
const BODY_FONT = "Calibri";

// If the user provides Oracle Sans font files, use them:
// const HEADER_FONT = "Oracle Sans";
// const BODY_FONT = "Oracle Sans";
```

---

## Footer & Logo Zone

**CRITICAL: Always reserve space at the bottom of every slide for the company logo.**

Looking at the reference slide layout, the logo sits in the bottom-right corner within a reserved footer zone. This zone must remain clear on every slide.

### Footer Space Rules

```
┌──────────────────────────────────────────────────┐
│  Top margin: 0.55"                                │  ← Keep clear (matches footer)
│  ┌────────────────────────────────────────────┐   │
│  │                                            │   │
│  │         CONTENT AREA                       │   │
│  │         (all layouts fit here)             │   │
│  │                                            │   │
│  │         Max Y: 5.075" (footerY)           │   │
│  └────────────────────────────────────────────┘   │
│  Footer zone: 5.075" to 5.625" (0.55" height)    │  ← Reserved for logo
│  Logo position: bottom-right corner               │
└──────────────────────────────────────────────────┘
```

### Implementation

```javascript
// Content must not extend below this Y value
const CONTENT_MAX_Y = 5.075;

// Footer area — logo will be placed here later via branding pass
// Leave this zone EMPTY on every slide
// If adding a thin footer bar for design, place it at:
const FOOTER_BAR_Y = 5.075;
const FOOTER_BAR_H = 0.55;
```

### What Goes in the Footer Zone

- **Nothing during creative generation** — leave it blank
- The user will add the company logo (bottom-right, roughly 0.9" × 0.3") via their branding skill
- Optionally, a thin colored bar can sit at `y: 5.075` as a visual base, but content must not overlap

---

## Layout Repertoire

These are **options to choose from**, not a sequence to follow. Pick the layout that best fits each slide's content.

**All layouts must respect the top margin (0.55") and footer zone (below 5.075").**

Content area: `y: 0.55` to `y: 5.075` = **4.525" of usable height**.
With a header bar (0.7"): content starts at `y: 1.25`, giving **3.825" for content**.

### Title Slide

**Light mode (default):**
- Warm off-white background (`FAF9F7`) with Oracle Red accent shapes
- Left-aligned title, bold, 32-38pt in charcoal
- Subtitle in medium text color
- Optional decorative shapes (large red organic forms on right side, echoing Redwood's visual language)
- Context callout box with icon near bottom (above footer zone)

**Dark mode (only if requested):**
- Charcoal background (`312D2A`) with red accent shapes
- White title text
- Light warm gray subtitle

### Card Grid (2×2 or 2×3)
- White cards on warm off-white background
- Each card: left colored accent bar (using palette colors), **Font Awesome icon in colored circle**, bold title, body text
- Use different palette colors per card for visual differentiation
- Shadow on cards for depth

### Column Cards (3-up)
- Three equal-width cards side by side
- Colored header strip at top of each card with **centered Font Awesome icon in semi-transparent circle**
- Title and bullet content below
- Works well for categorization / comparison

### Horizontal Process Flow
- Row of colored step boxes with arrow connectors between them
- Detail cards below expanding on key steps
- **Use Font Awesome icons inside step boxes** where relevant
- Good for workflows, timelines, sequences

### Icon + Text Rows
- Stacked rows, each with: **Font Awesome icon in colored circle** → bold header → description
- Left-aligned, clean spacing
- Good for feature lists, principles, requirements

### Big Number / Stat Callouts
- Large numbers (48-60pt) with small labels
- Arrange in a row or 2×2
- **Font Awesome icon above or beside each number**
- Good for dashboards, KPIs, metrics

### Split Layout (60/40)
- Content on one side (60%), visual element on other (40%)
- The visual can be an icon composition, shape arrangement, or diagram
- Good for explanatory slides

### Dark Closing / Dashboard (only if requested or for emphasis)
- Charcoal background matching Redwood dark
- Card grid with semi-transparent warm dark cards
- Bottom summary bar with **icon + text pairs**
- Creates bookend effect with title slide

---

## Icon System

**IMPORTANT: Always use Font Awesome icons from `react-icons/fa` as the primary icon source.** These provide consistent, recognizable, professional iconography. Never use unicode symbols (●, ■, ▶, ★) as substitutes for proper icons — they look unprofessional and are unreliable across systems.

Every content section, card, list item heading, or process step should have an accompanying icon where it makes semantic sense. Icons should **reinforce the meaning** of the content, not just decorate.

### Setup Code

```javascript
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}
```

### Icon Selection Guide

Choose icons that **semantically match** the content. Here's a reference for common presentation topics:

**Strategy & Governance:**
```javascript
const { FaFlag, FaBullseye, FaChessKing, FaRoute, FaCompass } = require("react-icons/fa");
```

**Process & Workflow:**
```javascript
const { FaArrowRight, FaCogs, FaProjectDiagram, FaSitemap, FaStream, FaTasks } = require("react-icons/fa");
```

**People & Teams:**
```javascript
const { FaUsers, FaUserTie, FaHandshake, FaPeopleCarry, FaUserShield } = require("react-icons/fa");
```

**Risk & Security:**
```javascript
const { FaShieldAlt, FaExclamationTriangle, FaLock, FaBug, FaFireExtinguisher } = require("react-icons/fa");
```

**Analytics & Metrics:**
```javascript
const { FaChartBar, FaChartLine, FaChartPie, FaTachometerAlt, FaPoll } = require("react-icons/fa");
```

**Communication & Documents:**
```javascript
const { FaClipboardList, FaFileAlt, FaEnvelope, FaComments, FaBullhorn } = require("react-icons/fa");
```

**Growth & Success:**
```javascript
const { FaRocket, FaLightbulb, FaTrophy, FaCheckCircle, FaThumbsUp } = require("react-icons/fa");
```

**Technology & Cloud:**
```javascript
const { FaCloud, FaDatabase, FaServer, FaCode, FaMicrochip, FaGlobe } = require("react-icons/fa");
```

**Time & Planning:**
```javascript
const { FaCalendarCheck, FaClock, FaHourglass, FaHistory, FaStopwatch } = require("react-icons/fa");
```

**Finance & Business:**
```javascript
const { FaDollarSign, FaBalanceScale, FaBuilding, FaBriefcase, FaIndustry } = require("react-icons/fa");
```

**Visibility & Insight:**
```javascript
const { FaEye, FaSearch, FaBinoculars, FaGlasses, FaSearchPlus } = require("react-icons/fa");
```

### Available Icon Libraries (react-icons)

- **`react-icons/fa`** — Font Awesome (PRIMARY, use this by default)
- `react-icons/md` — Material Design (use when FA lacks a specific icon)
- `react-icons/hi` — Heroicons (alternate style)
- `react-icons/bi` — Bootstrap Icons (alternate style)

### Icon Presentation Patterns

**Pattern 1: Icon in colored circle (most common)**
```javascript
// Colored circle background
slide.addShape(pres.shapes.OVAL, {
  x: iconX, y: iconY, w: 0.55, h: 0.55,
  fill: { color: BRAND.redAccent }  // or any palette color
});
// White icon on top (render icon with white color)
slide.addImage({
  data: whiteIconPng,
  x: iconX + 0.12, y: iconY + 0.12, w: 0.31, h: 0.31
});
```

**Pattern 2: Colored icon on light background (for subtle use)**
```javascript
// Icon rendered in accent color, placed directly on card/slide background
slide.addImage({
  data: coloredIconPng,  // rendered with Oracle Red or palette color
  x: iconX, y: iconY, w: 0.35, h: 0.35
});
```

**Pattern 3: Large feature icon (for emphasis)**
```javascript
// Larger icon for section headers or feature highlights
slide.addShape(pres.shapes.OVAL, {
  x: iconX, y: iconY, w: 0.75, h: 0.75,
  fill: { color: BRAND.redAccent }
});
slide.addImage({
  data: whiteIconPng,
  x: iconX + 0.17, y: iconY + 0.17, w: 0.41, h: 0.41
});
```

### Icon Rendering Tips

- **Render at 256px or higher** for crisp output. The `size` parameter controls rasterization resolution, not display size on the slide.
- **Pre-render all icons** at the start of the script into a lookup object to avoid async issues:
  ```javascript
  const icons = {};
  icons.flag = await iconToBase64Png(FaFlag, "#FFFFFF", 256);
  icons.flagRed = await iconToBase64Png(FaFlag, "#C74634", 256);
  // ... etc
  ```
- **White icons** for placement on colored circles/backgrounds
- **Colored icons** (in Oracle Red or palette color) for placement on white/light card backgrounds

---

## Typography

### Size Scale

| Element | Size | Weight | Color (Light Mode) |
|---------|------|--------|-------------------|
| Slide title (title slides) | 32-38pt | Bold | `312D2A` (charcoal) |
| Slide title (header bars) | 20-22pt | Bold | `FFFFFF` (white on dark bar) |
| Section header / card title | 13-16pt | Bold | `312D2A` |
| Body text | 11-13pt | Regular | `5A5650` (warm gray) |
| Captions / labels | 9-11pt | Regular | `8A8581` (muted) |
| Tracking labels (uppercase) | 10-11pt | Bold, charSpacing: 2 | `C74634` (Oracle Red) |

### Bullet Lists

```javascript
// ALWAYS use bullet: true, NEVER unicode "•" characters
slide.addText([
  { text: "First item", options: { bullet: true, breakLine: true, fontSize: 11, color: BRAND.medText, fontFace: BODY_FONT, paraSpaceAfter: 8 } },
  { text: "Second item", options: { bullet: true, breakLine: true, fontSize: 11, color: BRAND.medText, fontFace: BODY_FONT, paraSpaceAfter: 8 } },
  { text: "Third item", options: { bullet: true, fontSize: 11, color: BRAND.medText, fontFace: BODY_FONT } }
], { x: 0.5, y: 1.5, w: 4, h: 2, valign: "top", margin: 0 });
```

---

## Visual Polish Techniques

### Card Shadows (Redwood Style)
```javascript
// Factory function — NEVER reuse shadow objects (pptxgenjs mutates them)
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8,
  offset: 2, angle: 135, opacity: 0.06  // Subtle, warm feel
});
```

### Left Accent Bars on Cards
```javascript
// Thin colored bar on left edge of a white card
slide.addShape(pres.shapes.RECTANGLE, {
  x: cardX, y: cardY, w: 0.06, h: cardH,
  fill: { color: BRAND.redAccent }
});
```

### Top Colored Strips
```javascript
// Colored header strip at top of card
slide.addShape(pres.shapes.RECTANGLE, {
  x: cardX, y: cardY, w: cardW, h: 0.06,
  fill: { color: BRAND.redAccent }
});
```

### Consistent Header Bar (Content Slides)
```javascript
// Dark charcoal bar at top of content slides
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.7, fill: { color: BRAND.headerBg }
});
slide.addText("SLIDE TITLE", {
  x: 0.7, y: 0.12, w: 8, h: 0.45,
  fontFace: HEADER_FONT, fontSize: 20, color: "FFFFFF",
  bold: true, margin: 0
});
```

### Decorative Shapes (Redwood Style)
Redwood uses **warm organic shapes** — large rounded forms in red and warm grays, often overlapping, with subtle dot/line patterns. For title slides:

```javascript
// Large red organic shape (top-right area of title slide)
slide.addShape(pres.shapes.OVAL, {
  x: 6.5, y: -1.5, w: 6, h: 6,
  fill: { color: BRAND.redAccent }
});
// Overlapping warm gray shape
slide.addShape(pres.shapes.OVAL, {
  x: 7.5, y: 2.5, w: 4, h: 4,
  fill: { color: "8A8581", transparency: 50 }
});
```

---

## Critical PptxGenJS Rules

These are non-negotiable — violating them corrupts files or creates visual bugs:

1. **NEVER use `#` prefix in hex colors** — `"FF0000"` not `"#FF0000"`
2. **NEVER encode opacity in hex strings** — use `opacity` property instead
3. **NEVER reuse option objects** across multiple `addShape`/`addText` calls — pptxgenjs mutates them. Use factory functions.
4. **Use `bullet: true`** not unicode `"•"` characters
5. **Use `breakLine: true`** between text array items
6. **Avoid `lineSpacing` with bullets** — use `paraSpaceAfter` instead
7. **Use `RECTANGLE` not `ROUNDED_RECTANGLE`** when adding accent bar overlays
8. **Set `margin: 0`** on text boxes when aligning with shapes/icons
9. **All content must stay above y: 5.075"** — the footer zone is reserved

### Slide Dimensions (LAYOUT_16x9)
- Width: 10 inches
- Height: 5.625 inches
- Top margin: 0.55" (clear zone, matching footer)
- Footer zone: below 5.075" (reserved for logo)
- Usable content area: 0.55" to 5.075" vertically, 0.5" to 9.5" horizontally

---

## Light Mode vs Dark Mode

### Default: Light Mode
- Warm off-white slide backgrounds (`FAF9F7`)
- Dark charcoal header bars (`312D2A`)
- White cards with warm shadows
- Dark text on light backgrounds
- Oracle Red accents

### Dark Mode (Only When Requested)
Switch to dark mode **only if the user explicitly says** "dark mode", "dark slides", "dark theme", or "dark background."

When in dark mode:
- Charcoal slide backgrounds (`312D2A`)
- Near-black header bars (`1F1C1A`)
- Semi-transparent warm dark cards (`3D3835`)
- White/light text on dark backgrounds
- Oracle Red accents remain the same

### Per-Slide Dark Mode
Some slides may use dark mode for emphasis even in a light deck:
- Title slides (optional — creates contrast)
- Closing/summary slides (creates bookend effect)
- Dashboard slides (data-heavy content often reads better on dark)

Only use per-slide dark mode if it serves the content. Default to all-light.

---

## Example Prompt to Claude

When asking Claude to generate a deck:

```
Create a professional presentation with these slides:
[paste content]

Use Oracle Redwood Light theme. Use appropriate Font Awesome icons
for each content section. Vary layouts across slides.
```

---

## File Structure for Your Skill

```
pptx-creative-skill/
├── SKILL.md                    # This file
├── pptxgenjs-reference.md      # API reference (copy from platform skill)
├── assets/                     # Corporate assets (added later)
│   ├── logo.png                # Oracle logo for footer
│   └── slide-bg.png            # Optional background image
└── examples/                   # Reference outputs
    └── sample-deck.pptx
```
