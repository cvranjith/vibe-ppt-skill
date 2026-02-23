# PptxGenJS API Reference

Practical reference for generating slides in this workspace. All patterns follow [SKILL.md](SKILL.md).

---

## Setup

```javascript
const PptxGenJS = require("pptxgenjs");
const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";   // 10" × 5.625"
pres.title  = "My Presentation";
```

---

## Writing the File

```javascript
// Always await — writeFile returns a Promise
await pres.writeFile({ fileName: "output.pptx" });
```

---

## Slide Management

```javascript
const slide = pres.addSlide();

// Set slide background (preferred over drawing a full rect)
slide.background = { color: "FAF9F7" };
```

---

## `slide.addShape(type, options)`

### Shape Type Strings

| Shape       | String         | Via pres.shapes           |
|-------------|----------------|---------------------------|
| Rectangle   | `"rect"`       | `pres.ShapeType.rect`     |
| Oval/Circle | `"ellipse"`    | `pres.ShapeType.ellipse`  |
| Line        | `"line"`       | `pres.ShapeType.line`     |
| Rounded Rect| `"roundRect"`  | `pres.ShapeType.roundRect`|

### Position & Size

All values are in **inches**.

```javascript
slide.addShape("rect", {
  x: 0.5,   // left edge
  y: 1.25,  // top edge
  w: 4.0,   // width
  h: 1.5,   // height
});
```

### Fill

```javascript
fill: { color: "C74634" }                    // Solid color — NO # prefix!
fill: { color: "8A8581", transparency: 50 }  // 50% transparent (0–100)
fill: { type: "none" }                       // No fill (transparent)
```

### Line (border)

```javascript
line: { color: "E5E1DC", width: 0.5 }   // Thin border
line: { type: "none" }                   // No border
line: { color: "C74634", width: 2 }      // Thick colored border
```

### Shadow (use factory function — never reuse object)

```javascript
// CORRECT: factory function
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.06
});
slide.addShape("rect", { ..., shadow: cardShadow() });

// WRONG: reusing same object corrupts multiple shapes
const s = { type: "outer", ... };
slide.addShape("rect", { ..., shadow: s });  // ❌
slide.addShape("rect", { ..., shadow: s });  // ❌ mutated
```

### Rounded Rectangle

```javascript
slide.addShape("roundRect", {
  x: 0.5, y: 1.0, w: 3.0, h: 0.6,
  rectRadius: 0.1,              // Corner radius in inches
  fill: { color: "C74634" },
  line: { type: "none" },
});
```

### Line Shape (for connectors)

```javascript
// Horizontal line
slide.addShape("line", {
  x: 2.5, y: 2.0, w: 0.4, h: 0,
  line: { color: "C74634", width: 1.5 },
});
```

---

## `slide.addText(text, options)` — Single Text Box

```javascript
slide.addText("SLIDE TITLE", {
  x: 0.5,  y: 0.12, w: 9.0, h: 0.46,
  fontFace: "Calibri",
  fontSize: 20,
  bold: true,
  color: "FFFFFF",       // No # prefix
  align: "left",         // "left" | "center" | "right"
  valign: "middle",      // "top" | "middle" | "bottom"
  margin: 0,             // Set to 0 when aligning with shapes
  wrap: true,            // Default true
  italic: false,
  underline: false,
  charSpacing: 2,        // Letter spacing (for tracking labels)
});
```

---

## `slide.addText(textArray, globalOptions)` — Mixed/Bullet Text

Each item in the array is `{ text: string, options: {} }`.
Options on each item override the global options.

```javascript
// Bullet list — ALWAYS use bullet:true, never "•"
slide.addText([
  {
    text: "First point",
    options: { bullet: true, breakLine: true, fontSize: 11,
               color: "5A5650", fontFace: "Calibri", paraSpaceAfter: 8 }
  },
  {
    text: "Second point",
    options: { bullet: true, breakLine: true, fontSize: 11,
               color: "5A5650", fontFace: "Calibri", paraSpaceAfter: 8 }
  },
  {
    text: "Third point",  // Last item: no breakLine
    options: { bullet: true, fontSize: 11,
               color: "5A5650", fontFace: "Calibri" }
  },
], {
  x: 0.5, y: 1.5, w: 4.0, h: 2.0,
  valign: "top",
  margin: 0,
});
```

### Mixed inline formatting

```javascript
slide.addText([
  { text: "Bold label: ",  options: { bold: true, color: "312D2A" } },
  { text: "normal value",  options: { bold: false, color: "5A5650" } },
], { x: 0.5, y: 2.0, w: 5.0, h: 0.4, fontSize: 11, fontFace: "Calibri", margin: 0 });
```

### Key text options

| Option         | Type    | Notes                                               |
|----------------|---------|-----------------------------------------------------|
| `bullet`       | boolean | `true` for bullet point — never use "•"             |
| `breakLine`    | boolean | Line break after this run (all but last item)       |
| `paraSpaceAfter`| number | Space after paragraph in points — use instead of `lineSpacing` with bullets |
| `charSpacing`  | number | Letter spacing (tracking) in points                 |
| `hyperlink`    | object  | `{ url: "https://..." }`                            |

---

## `slide.addImage(options)`

```javascript
// From base64 data URI (icons rendered via lib/icons.js)
slide.addImage({
  data: "image/png;base64,iVBOR...",  // from iconToBase64Png()
  x: 0.62, y: 0.62,
  w: 0.31, h: 0.31,
});

// From file path
slide.addImage({
  path: "./assets/logo.png",
  x: 8.5, y: 5.1,
  w: 0.9, h: 0.3,
});
```

---

## Slide Dimensions Cheat Sheet

```
Slide:       10.0" × 5.625"
Top margin:   0.55"  (y < 0.55 only for full-bleed header bars)
Footer zone:  y > 5.075" — ALWAYS EMPTY (reserved for logo)
Left margin:  x = 0.5"
Right edge:   x + w ≤ 9.5"
Content width: 9.0"  (0.5" to 9.5")

With header bar (h=0.7"):
  Content Y start: 1.25"  (0.7 header + 0.55 gap)
  Content height:  3.825" (1.25" to 5.075")
```

---

## Critical Rules (Non-Negotiable)

1. **No `#` in hex colors** for PptxGenJS — `"C74634"` not `"#C74634"`
   - Exception: react-icons `color` prop DOES need `#`: `"#FFFFFF"`
2. **Never reuse options objects** — pptxgenjs mutates them. Use factory functions.
3. **bullet: true** — never unicode `"•"` characters
4. **breakLine: true** between items in text arrays (except last)
5. **paraSpaceAfter** for bullet spacing — not `lineSpacing`
6. **margin: 0** on text boxes aligned next to shapes/icons
7. **content y + h ≤ 5.075** — footer zone must stay clear
8. **x + w ≤ 9.5** — right margin boundary
9. **RECTANGLE not ROUNDED_RECTANGLE** for accent bar overlays on cards

---

## Common Patterns

### Header bar + content slide skeleton

```javascript
const slide = pres.addSlide();
slide.background = { color: "FAF9F7" };
addHeaderBar(slide, "SLIDE TITLE");
// Content starts at SLIDE.contentY = 1.25"
```

### Icon in circle + label

```javascript
// Circle at (x, y), icon centered inside
addIconCircle(slide, {
  x: 0.5, y: 1.3, size: 0.55,
  circleColor: BRAND.redAccent,
  iconData: icons.rocketWhite,
});
slide.addText("Feature Name", {
  x: 1.2, y: 1.32, w: 3.0, h: 0.3,
  fontFace: HEADER_FONT, fontSize: 13, bold: true, color: BRAND.darkText, margin: 0,
});
```

### Card with left accent bar

```javascript
addCard(slide, {
  x: 0.5, y: 1.25, w: 4.35, h: 1.65,
  accentColor: BRAND.redAccent,  // palette[i] for varied colors
});
// Then add icon, title, bullets inside card starting at x+0.15+accentBarWidth
```

### Process flow step

```javascript
// Draw step box
slide.addShape("rect", {
  x: stepX, y: stepY, w: stepW, h: stepH,
  fill: { color: BRAND.cardBg },
  line: { color: BRAND.cardBorder, width: 0.5 },
  shadow: cardShadow(),
});
// Top color strip
slide.addShape("rect", {
  x: stepX, y: stepY, w: stepW, h: 0.06,
  fill: { color: stepColor }, line: { type: "none" },
});
// Connector line between steps
slide.addShape("line", {
  x: stepX + stepW + 0.05, y: stepY + stepH / 2,
  w: gapW - 0.1, h: 0,
  line: { color: BRAND.redAccent, width: 1.5 },
});
```

---

## Icon Import Reference

```javascript
// Strategy & Governance
const { FaFlag, FaBullseye, FaChessKing, FaRoute, FaCompass } = require("react-icons/fa");

// Process & Workflow
const { FaArrowRight, FaCogs, FaProjectDiagram, FaSitemap, FaTasks } = require("react-icons/fa");

// People & Teams
const { FaUsers, FaUserTie, FaHandshake, FaUserShield } = require("react-icons/fa");

// Risk & Security
const { FaShieldAlt, FaExclamationTriangle, FaLock, FaBug } = require("react-icons/fa");

// Analytics & Metrics
const { FaChartBar, FaChartLine, FaChartPie, FaTachometerAlt } = require("react-icons/fa");

// Growth & Success
const { FaRocket, FaLightbulb, FaTrophy, FaCheckCircle } = require("react-icons/fa");

// Technology & Cloud
const { FaCloud, FaDatabase, FaServer, FaCode, FaGlobe } = require("react-icons/fa");

// Finance & Time
const { FaDollarSign, FaCalendarCheck, FaClock, FaHourglass } = require("react-icons/fa");
```
