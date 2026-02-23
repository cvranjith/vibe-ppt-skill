"use strict";

const { BRAND, HEADER_FONT, BODY_FONT } = require("../theme");
const { addTitleDecorations, RECT } = require("../shapes");

// data: { line1, line2, subtitle?, context?: { title, text, accentColor? } }
function addTitleSlide(pres, data) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addTitleDecorations(slide, "light");

  slide.addShape(RECT, {
    x: 0, y: 1.0, w: 0.1, h: 2.8,
    fill: { color: BRAND.redAccent }, line: { type: "none" },
  });

  slide.addText(data.line1, {
    x: 0.45, y: 1.0, w: 6.0, h: 0.85,
    fontFace: HEADER_FONT, fontSize: 34, bold: true,
    color: BRAND.darkText, margin: 0,
  });

  slide.addText(data.line2, {
    x: 0.45, y: 1.85, w: 6.0, h: 0.85,
    fontFace: HEADER_FONT, fontSize: 34, bold: true,
    color: BRAND.redAccent, margin: 0,
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.45, y: 2.82, w: 5.8, h: 0.45,
      fontFace: BODY_FONT, fontSize: 13,
      color: BRAND.medText, margin: 0,
    });
  }

  if (data.context) {
    const { title: ctxTitle, text: ctxText, accentColor = BRAND.teal } = data.context;
    slide.addShape(RECT, {
      x: 0.45, y: 3.5, w: 5.6, h: 1.2,
      fill: { color: BRAND.subtleBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
    });
    slide.addShape(RECT, {
      x: 0.45, y: 3.5, w: 0.06, h: 1.2,
      fill: { color: accentColor }, line: { type: "none" },
    });
    slide.addText(ctxTitle, {
      x: 0.65, y: 3.57, w: 5.2, h: 0.28,
      fontFace: HEADER_FONT, fontSize: 10, bold: true,
      color: accentColor, margin: 0,
    });
    slide.addText(ctxText, {
      x: 0.65, y: 3.87, w: 5.2, h: 0.75,
      fontFace: BODY_FONT, fontSize: 9.5,
      color: BRAND.medText, margin: 0,
    });
  }
}

module.exports = { addTitleSlide };
