# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Communication Style

- **Be concise.** No lengthy explanations before or after tool calls.
- **Generated scripts: minimal comments.** Only comment non-obvious logic. No section headers, no "Step 1/2/3" banners, no restating what the code obviously does.
- **After generating:** just report the output path and QA results. No summaries.
- **During QA:** list issues found, fix them, re-run. Don't explain what you're about to do — just do it.

---

## What This Skill Does

Given content (pasted text, bullet points, data), produce a visually engaging, custom-designed PowerPoint presentation as a `.pptx` file. Every deck is **designed from scratch** — layouts are chosen per slide based on content, not from a fixed template.

Full design philosophy → **`SKILL.md`** (read before any generation).
PptxGenJS API → **`pptxgenjs-reference.md`**.

---

## Setup

```bash
bash setup.sh             # one-command install (new machine)
node scripts/verify-setup.js  # verify packages are available
```

---

## Workflow: Creating a New Deck

Follow these steps in order. Do not skip steps.

### Step 1 — Analyze Content and Create a Plan

When the user pastes content, **do not generate code yet**. First:

1. Read all the content carefully
2. Decide: how many slides? what type is each slide?
3. Choose the most visually interesting layout for each slide — vary across slides, never use the same layout twice in a row
4. Pick Font Awesome icons that reinforce each section's meaning
5. Present the plan to the user using this exact format:

```
## Deck Plan

**Title**: [Deck title]
**Output**: `output/<topic-slug>/<title-slug>-v1.pptx`
**Slides**: N  |  **Theme**: Oracle Redwood Light

| # | Slide Title | Layout | Key Content |
|---|-------------|--------|-------------|
| 1 | [Title]     | Title Slide | Title + subtitle + context callout |
| 2 | [Title]     | [Layout name] | [What will be shown] |
| 3 | [Title]     | [Layout name] | [What will be shown] |
...

**Layout choices explained:**
- Slide 2: [Why this layout suits this content]
- Slide 3: [Why]
...

Does this look good? Any changes before I generate?
```

**Available layouts** (choose the best fit — do not rotate mechanically):
- **Title Slide** — decorative organic shapes, left-aligned title, subtitle, callout box
- **Icon + Text Rows** — stacked rows with FA icon circle → bold title → description (lists, principles, agenda)
- **Card Grid 2×2** — four white cards with left accent bars and icons (feature sets, quadrants)
- **3-Column Cards** — three equal cards with top colour strip and icon (comparison, categories)
- **Horizontal Process Flow** — coloured step boxes + connectors (workflows, timelines, sequences)
- **Big Number / Stat Callouts** — large metric numbers with icon and label (KPIs, dashboards)
- **Split Layout 60/40** — content left, visual/icon composition right (explanations, spotlights)
- **Dark Closing** — charcoal background, CTA, summary icons (bookend to title slide)

You are not limited to the above. If the content calls for a new layout pattern, design one from scratch and add it to `lib/layouts/` after the deck is generated (see Layout Library rules below).

### Step 2 — Wait for User Confirmation

Do not write any code until the user approves or modifies the plan. If the user suggests changes, update the plan and confirm again before proceeding.

### Step 3 — Generate the PPTX

Once the plan is confirmed:

1. Create the work area for this deck:
   ```
   output/<topic-slug>/work/
   ├── gen.js       ← runtime assembler script (never committed to repo)
   └── plan.md      ← the confirmed deck plan (optional, for iteration reference)
   ```

2. Write `output/<topic-slug>/work/gen.js` — **never write runtime scripts to the repo root**

3. Use layout library functions where a matching pattern exists:
   ```javascript
   const { addTitleSlide, addThreeColumnCards, ... } = require("../../lib/layouts");
   ```
   For slides that need a novel layout not in the library, write the slide function inline in gen.js. If that layout pattern is reusable, extract it into `lib/layouts/` afterward (see Layout Library rules).

4. Script structure:
   ```javascript
   const icons = await preRenderIcons({ ... });   // parallel, at top
   const pres  = new PptxGenJS();
   pres.layout = "LAYOUT_16x9";
   // ... add slides using layout library + any bespoke functions ...
   await pres.writeFile({ fileName: out.filePath });
   ```

5. Run the script: `node output/<topic-slug>/work/gen.js`

6. Report: "Generated: `output/topic/title-v1.pptx`"

### Step 4 — Visual QA Loop (MANDATORY)

**The first render is NEVER the final output.** Treat QA as a bug hunt, not a confirmation step. The quality of this step is what separates a good deck from a great one.

#### Content QA (always run)
```bash
python -m markitdown output/<topic>/<file>.pptx
```
Check: missing content, typos, wrong slide order, truncated text.

#### Visual QA (run if LibreOffice + pdftoppm available)
```bash
bash qa.sh output/<topic>/<file>.pptx
```
Or manually:
```bash
soffice --headless --convert-to pdf output/<topic>/<file>.pptx
pdftoppm -jpeg -r 150 output/<topic>/<file>.pdf qa_images/slide
```

**Inspect every slide image. Look specifically for:**
- Overlapping elements — text bleeding through shapes, icons colliding with text
- Text overflow — content clipped at box edges or running off-slide
- Content in footer zone — anything with `y + h > 5.075"` (must be empty)
- Content above top margin — anything `y < 0.55"` except header bars
- Elements too close — less than 0.3" gaps between content blocks
- Process flow steps clipped at the right edge (common mistake — check x + w ≤ 9.5)
- Low-contrast text — light on light, or dark on dark
- Misaligned cards — columns not lining up

#### The Fix Loop
1. List every issue found (if you find zero issues, look again more critically)
2. Fix all issues in code
3. Re-run the script → re-render affected slides → verify the fixes worked
4. One fix often reveals or creates another — repeat until a full pass is clean
5. **Do not declare success until you've completed at least one fix-and-verify cycle**

#### When Visual QA Is Unavailable
If LibreOffice/pdftoppm is not installed, use manual coordinate checks:
- Verify every element: `y + h ≤ 5.075` and `x + w ≤ 9.5`
- For process flows: calculate total width = `n * stepW + (n-1) * gapW ≤ 9.0`
- Use `markitdown` for content verification
- Use conservative 0.5" margins and 0.3"+ gaps

### Step 5 — Deliver

Tell the user: "Your deck is ready at `output/topic/title-v1.pptx`"

When user iterates ("make slide 3 bolder", "add a metrics slide"), edit `output/<topic>/work/gen.js` and re-run — the next version auto-increments (`v2`, `v3` etc.).

---

## File Ownership Rules

### What belongs in the repo (permanent, reusable)

```
lib/
├── theme.js         Brand colors, dimensions, shadow factory
├── icons.js         preRenderIcons() utility
├── shapes.js        Low-level shape helpers (addHeaderBar, addCard, etc.)
├── output.js        Versioned output path management
└── layouts/         Parameterized layout modules — NO real data, pure structure
    ├── title-slide.js
    ├── three-column.js
    ├── card-grid.js
    ├── process-flow.js
    ├── icon-rows.js
    ├── stat-callouts.js
    ├── split-layout.js
    ├── dark-closing.js
    └── index.js

examples/
└── generate-template.js   Reference demo (do not use for real decks)
```

### What belongs in the work area (runtime, throwaway)

```
output/
└── <topic-slug>/
    ├── work/
    │   ├── gen.js      ← assembler script for this deck (never committed)
    │   └── plan.md     ← confirmed plan for this deck (never committed)
    ├── <title>-v1.pptx
    ├── <title>-v2.pptx
    └── ...
```

`output/` is gitignored. Nothing inside it is ever committed. Work area scripts are kept only as long as the user is iterating on that deck.

### Layout Library Rules

- Every file in `lib/layouts/` must be **data-free** — no hardcoded content, colors, or icon choices from a specific deck
- Each layout exports a single function: `(pres, data, icons)` — all content comes from `data`, all icons by key from `icons`
- When a new layout pattern is invented during a project and it is **reusable** (not one-off), extract it from `gen.js` into a new `lib/layouts/<name>.js` and add it to `lib/layouts/index.js`
- After adding a new layout to the library, commit it: `git add lib/layouts/ && git commit -m "Add <name> layout"`
- Do not add a layout to the library if it is tightly coupled to specific content — keep it in `gen.js`

---

## Output Naming Convention

```
output/
└── <topic-slug>/
    ├── work/
    │   └── gen.js
    ├── <deck-title>-v1.pptx   ← first generation
    ├── <deck-title>-v2.pptx   ← after user feedback
    └── <deck-title>-v3.pptx   ← further iteration
```

Use `getOutputPath(briefTitle, deckTitle)` from `lib/output.js` — it handles slug conversion and version auto-increment.

---

## Design Principles

- **Vibe PPT, not Template PPT** — every deck is custom-designed. Layout choices come from the content, not a rotation schedule.
- **Icons everywhere meaningful** — use Font Awesome icons (never unicode ●■▶★) on section heads, card titles, process steps, bullet groups. Don't overdo it — one icon per section/card, not per line.
- **Icons must be prominent** — circles/squares containing icons must be large enough to be clearly legible. Minimum 0.5" diameter for standalone icons; use `pad: 0.09` (or less) so the icon fills the circle. Icon rows: scale to 80% of row height (cap 0.62"). Never use the default 0.12" pad.
- **Vary layouts** — never use the same layout twice in a row
- **Light mode by default** — Oracle Redwood Light. Dark mode only if user asks.
- **Warm palette** — Redwood uses warm off-whites and charcoals. No cool blues or grays.

---

## Architecture

```
lib/
├── theme.js      BRAND colors, SLIDE dimensions, cardShadow() factory
├── icons.js      preRenderIcons() — batch async FA icon → base64 PNG
├── shapes.js     addHeaderBar(), addCard(), addIconCircle(), addTitleDecorations(), etc.
├── output.js     getOutputPath() — versioned output path management
└── layouts/      Parameterized layout modules (see Layout Library Rules above)

examples/
└── generate-template.js   Working demo — all layout types (do not modify for real decks)

assets/          Drop logo.png here for footer branding
output/          All generated decks + per-deck work areas (gitignored)
```

### Slide Dimensions

```
Slide:        10.0" × 5.625"
Footer zone:  y ≥ 5.075"  ← ALWAYS EMPTY (reserved for logo)
Top margin:   y ≥ 0.55"   (except full-bleed header bars at y:0)
Side margins: x ≥ 0.5",   x + w ≤ 9.5"
Content area: 9.0" wide × 4.525" tall  (or 3.825" with header bar)
Content Y:    1.25" when header bar is present
```

### Key Code Patterns

```javascript
// ── Output path (always use this) ──
const { getOutputPath } = require("../../lib/output");  // from work/gen.js
const out = getOutputPath("topic slug", "Full Deck Title");
await pres.writeFile({ fileName: out.filePath });

// ── Icons (pre-render at top of script) ──
// react-icons color prop uses # prefix; pptxgenjs hex does NOT
const icons = await preRenderIcons({
  rocketW: [FaRocket, "#FFFFFF"],   // white icon on colored circle
  rocketR: [FaRocket, "#C74634"],   // colored icon on white card
});

// ── Layout library (preferred) ──
const { addTitleSlide, addProcessFlow } = require("../../lib/layouts");
addTitleSlide(pres, { line1, line2, subtitle, context });
addProcessFlow(pres, { header, steps, notes }, icons);

// ── Bespoke slide (when no library match) ──
const slide = pres.addSlide();
slide.background = { color: BRAND.slideBg };
addHeaderBar(slide, "SLIDE TITLE");   // content starts at SLIDE.contentY = 1.25"

// ── Shadow — NEVER reuse objects (pptxgenjs mutates them) ──
shadow: cardShadow()   // factory function, called fresh each time
```

### Non-Negotiable Rules

1. **No `#` in PptxGenJS hex colors** — `"C74634"` ✓  `"#C74634"` ✗
   Exception: react-icons `color` prop DOES need `#`: `"#FFFFFF"` ✓
2. **Never reuse options objects** — always factory functions for shadows
3. **`bullet: true`** — never `"•"` unicode
4. **`breakLine: true`** between all but last item in text arrays
5. **`paraSpaceAfter`** for bullet spacing — not `lineSpacing`
6. **`margin: 0`** on text boxes aligned with shapes/icons
7. **`y + h ≤ 5.075`** and **`x + w ≤ 9.5`** — always verify
8. **Runtime scripts live in `output/<topic>/work/gen.js`** — never in repo root

### Default Theme Quick Reference

| Purpose              | Hex       |
|----------------------|-----------|
| Slide background     | `FAF9F7`  |
| Header bar / dark text | `312D2A` |
| Body text            | `5A5650`  |
| Muted captions       | `8A8581`  |
| Red (primary accent) | `C74634`  |
| Teal                 | `0C6B58`  |
| Blue                 | `1B6CB0`  |
| Amber                | `C4841D`  |
| Card bg / white      | `FFFFFF`  |
| Card border          | `E5E1DC`  |
| Subtle bg / callouts | `F3F1EE`  |
