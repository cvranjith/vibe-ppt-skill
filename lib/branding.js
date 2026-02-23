"use strict";

const path = require("path");
const fs   = require("fs");
const { BODY_FONT, SLIDE } = require("./theme");

const ASSETS = path.join(__dirname, "..", "assets", "background");
const YEAR   = new Date().getFullYear();

function listAssets(pattern) {
  try { return fs.readdirSync(ASSETS).filter(f => pattern.test(f)).map(f => path.join(ASSETS, f)); }
  catch { return []; }
}
function pick(arr) { return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; }
function asset(name) { return path.join(ASSETS, name); }

// Call BEFORE any content is added to the slide.
// opts: { type?: 'title'|'content'|'dark', abstractBg?: bool, leftMargin?: bool }
function addBrandingBg(slide, opts = {}) {
  const { type = "content", abstractBg = false, leftMargin = false } = opts;

  if (abstractBg) {
    const img = pick(listAssets(/^light-abstract-\d+\.(png|jpg)$/i));
    if (img) {
      if (type === "title") {
        slide.addImage({ path: img, x: 0, y: 0, w: SLIDE.w, h: SLIDE.h });
      } else {
        // Right-side decorative, behind content, subtle
        slide.addImage({ path: img, x: 4.5, y: 0.7, w: 5.5, h: SLIDE.contentMaxY - 0.7, transparency: 82 });
      }
    }
  }

  if (type === "title") {
    const logo = asset("logo.png");
    if (fs.existsSync(logo)) {
      // logo.png is 288×45 → aspect 6.4:1
      slide.addImage({ path: logo, x: 0.35, y: 0.22, w: 2.0, h: 0.31 });
    }
  }

  if (leftMargin && type !== "title") {
    const img = pick(listAssets(/^left-margin-\d+\.png$/i));
    if (img) {
      // Full slide height, thin strip — sits in the left margin behind all content
      slide.addImage({ path: img, x: 0, y: 0, w: 0.18, h: SLIDE.h });
    }
  }
}

// Call AFTER all content is added to the slide.
// opts: { year?: number, dark?: bool }
function addBrandingFooter(slide, opts = {}) {
  const { year = YEAR, dark = false } = opts;

  const oTag = asset("o-tag.png");
  if (fs.existsSync(oTag)) {
    // Smaller, touches bottom edge, right-side gap ~0.18"
    slide.addImage({ path: oTag, x: 9.42, y: 5.225, w: 0.4, h: 0.4 });
  }

  slide.addText(`Copyright \u00A9 ${year}, Oracle and/or its affiliates`, {
    x: 0.4, y: 5.22, w: 5.5, h: 0.26,
    fontFace: BODY_FONT, fontSize: 7.5,
    color: dark ? "706B65" : "8A8581",
    valign: "middle", margin: 0,
  });
}

module.exports = { addBrandingBg, addBrandingFooter };
