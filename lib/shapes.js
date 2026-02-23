"use strict";

// ============================================================
// Reusable shape/layout helpers for PptxGenJS slides
// All coordinates in inches. All colors WITHOUT # prefix.
// ============================================================

const { BRAND, HEADER_FONT, BODY_FONT, SLIDE, cardShadow } = require("./theme");

// PptxGenJS shape type string constants (stable across v3.x)
const RECT    = "rect";
const ELLIPSE = "ellipse";
const LINE    = "line";

// ── Slide background ──────────────────────────────────────────

/**
 * Set the slide background color.
 * Prefer this over drawing a full-slide rectangle.
 */
function addBackground(slide, color) {
  slide.background = { color };
}

// ── Header bar ────────────────────────────────────────────────

/**
 * Add the standard dark charcoal header bar (y:0, h:0.7) to a content slide.
 * After calling this, start content at y: SLIDE.contentY (1.25").
 *
 * @param {object} slide  - PptxGenJS slide
 * @param {string} title  - Slide title (will be UPPERCASED by caller convention)
 * @param {string} [sub]  - Optional subtitle shown after " | "
 */
const STRIP_W = 0.1; // Left margin strip width — header bar starts after this

function addHeaderBar(slide, title, sub) {
  slide.addShape(RECT, {
    x: STRIP_W, y: 0, w: SLIDE.w - STRIP_W, h: 0.7,
    fill: { color: BRAND.headerBg },
    line: { type: "none" },
  });

  const parts = [{ text: title, options: { bold: true } }];
  if (sub) {
    parts.push({ text: "  |  " + sub, options: { bold: false, color: "A39E98" } });
  }

  slide.addText(parts, {
    x: 0.5, y: 0.12, w: 9.0, h: 0.46,
    fontFace: HEADER_FONT, fontSize: 20,
    color: "FFFFFF", valign: "middle", margin: 0,
  });
}

// ── Cards ─────────────────────────────────────────────────────

/**
 * Add a white card with optional left accent bar and drop shadow.
 *
 * @param {object} slide
 * @param {object} opts
 *   @param {number}  opts.x
 *   @param {number}  opts.y
 *   @param {number}  opts.w
 *   @param {number}  opts.h
 *   @param {string}  [opts.accentColor]  - Hex color for left accent bar (omit to skip)
 *   @param {boolean} [opts.shadow=true]
 */
function addCard(slide, { x, y, w, h, accentColor, shadow = true }) {
  slide.addShape(RECT, {
    x, y, w, h,
    fill: { color: BRAND.cardBg },
    line: { color: BRAND.cardBorder, width: 0.5 },
    shadow: shadow ? cardShadow() : undefined,
  });
  if (accentColor) {
    // Left accent bar (overlaid on card, 0.06" wide)
    slide.addShape(RECT, {
      x, y, w: 0.06, h,
      fill: { color: accentColor },
      line: { type: "none" },
    });
  }
}

/**
 * Add a colored strip across the TOP of a card (for column-card layout).
 *
 * @param {object} slide
 * @param {object} opts - { x, y, w, color }
 */
function addCardTopStrip(slide, { x, y, w, color }) {
  slide.addShape(RECT, {
    x, y, w, h: 0.06,
    fill: { color },
    line: { type: "none" },
  });
}

// ── Icon helpers ──────────────────────────────────────────────

/**
 * Add an icon inside a filled circle (Pattern 1 from SKILL.md).
 * The circle is drawn first, then the icon image on top.
 *
 * @param {object} slide
 * @param {object} opts
 *   @param {number} opts.x           - Circle top-left X
 *   @param {number} opts.y           - Circle top-left Y
 *   @param {number} [opts.size=0.55] - Circle diameter in inches
 *   @param {string} opts.circleColor - Fill color (no #)
 *   @param {string} opts.iconData    - base64 PNG from iconToBase64Png
 *   @param {number} [opts.pad=0.12]  - Padding inside circle for icon
 */
function addIconCircle(slide, { x, y, size = 0.55, circleColor, iconData, pad = 0.12 }) {
  slide.addShape(ELLIPSE, {
    x, y, w: size, h: size,
    fill: { color: circleColor },
    line: { type: "none" },
  });
  if (iconData) {
    slide.addImage({
      data: iconData,
      x: x + pad, y: y + pad,
      w: size - pad * 2, h: size - pad * 2,
    });
  }
}

/**
 * Add a large feature icon circle (Pattern 3 from SKILL.md, 0.75" diameter).
 */
function addIconCircleLarge(slide, { x, y, circleColor, iconData }) {
  addIconCircle(slide, { x, y, size: 0.75, circleColor, iconData, pad: 0.17 });
}

// ── Connectors ────────────────────────────────────────────────

/**
 * Add a horizontal line connector (for process flow gaps between steps).
 *
 * @param {object} slide
 * @param {object} opts - { x, y, w, color }
 */
function addHorizontalConnector(slide, { x, y, w, color }) {
  slide.addShape(LINE, {
    x, y, w, h: 0,
    line: { color, width: 1.5 },
  });
}

// ── Decorative shapes ─────────────────────────────────────────

/**
 * Add Redwood-style large organic oval decorations for title slides.
 * These intentionally extend off the slide edges.
 *
 * @param {object} slide
 * @param {"light"|"dark"} mode
 */
function addTitleDecorations(slide, mode = "light") {
  const primary = BRAND.redAccent;
  const secondary = mode === "dark" ? "4A4541" : "8A8581";

  // Large red oval (top-right, extends off slide)
  slide.addShape(ELLIPSE, {
    x: 6.5, y: -1.5, w: 6, h: 6,
    fill: { color: primary },
    line: { type: "none" },
  });
  // Secondary gray oval (lower-right, partially off slide)
  slide.addShape(ELLIPSE, {
    x: 7.5, y: 2.5, w: 4, h: 4,
    fill: { color: secondary, transparency: 50 },
    line: { type: "none" },
  });
}

module.exports = {
  addBackground,
  addHeaderBar,
  addCard,
  addCardTopStrip,
  addIconCircle,
  addIconCircleLarge,
  addHorizontalConnector,
  addTitleDecorations,
  RECT,
  ELLIPSE,
  LINE,
};
