"use strict";

// ============================================================
// Oracle Redwood Light Theme — default for all decks
// Use DARK_OVERRIDES only when user explicitly requests dark mode
// ============================================================

const BRAND = {
  // Primary accent
  oracleRed:   "C74634",

  // Warm neutrals
  charcoal:    "312D2A",   // Darkest — title slide dark bg
  darkText:    "312D2A",   // Primary text on light backgrounds
  medText:     "5A5650",   // Body text
  lightText:   "8A8581",   // Captions, muted labels

  // Slide backgrounds (warm off-white — NOT cool grays)
  slideBg:     "FAF9F7",   // Main slide background
  cardBg:      "FFFFFF",   // Card/container background
  subtleBg:    "F3F1EE",   // Alternate sections, callout boxes

  // Header bar (content slides)
  headerBg:    "312D2A",   // Dark charcoal top bar

  // Accent colors
  redAccent:   "C74634",   // Primary — Oracle Red
  teal:        "0C6B58",   // Secondary
  blue:        "1B6CB0",   // Tertiary
  amber:       "C4841D",   // Caution / warm highlight
  green:       "13811C",   // Success / positive

  // Card differentiation palette (rotate per card in multi-card layouts)
  palette:     ["C74634", "1B6CB0", "0C6B58", "C4841D"],

  // Card borders & shadows
  cardBorder:  "E5E1DC",   // Warm gray border
};

// Apply these on top of BRAND when user requests dark mode
const DARK_OVERRIDES = {
  slideBg:    "312D2A",
  cardBg:     "3D3835",
  subtleBg:   "2A2623",
  headerBg:   "1F1C1A",
  darkText:   "FFFFFF",
  medText:    "D4CFC9",
  lightText:  "A39E98",
  cardBorder: "4A4541",
};

const HEADER_FONT = "Oracle Sans";
const BODY_FONT   = "Oracle Sans";

// Slide dimensions (LAYOUT_16x9, all in inches)
const SLIDE = {
  w:            10,
  h:            5.625,
  contentMaxY:  5.075,   // Footer zone starts here — keep EMPTY
  footerH:      0.55,    // Reserved for logo (5.075 → 5.625)
  topMargin:    0.55,    // Clear zone above content (except full-bleed header bars)
  leftMargin:   0.5,
  rightEdge:    9.5,     // x + w must not exceed this
  contentW:     9.0,     // rightEdge - leftMargin
  // With a 0.7" header bar, content starts at y:1.25 (0.55" gap below bar)
  contentY:     1.25,    // y start for content when header bar is present
};

// Factory function — NEVER reuse (pptxgenjs mutates option objects)
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.06,
});

module.exports = { BRAND, DARK_OVERRIDES, HEADER_FONT, BODY_FONT, SLIDE, cardShadow };
