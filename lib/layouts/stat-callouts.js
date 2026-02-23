"use strict";

const { BRAND, HEADER_FONT, BODY_FONT, cardShadow } = require("../theme");
const { addHeaderBar, addIconCircle, RECT } = require("../shapes");
const { addBrandingBg, addBrandingFooter } = require("../branding");

// data: { header, headerSub?, stats: [{ iconKey, color?, number, label, desc }], branding? }
function addStatCallouts(pres, data, icons) {
  const slide = pres.addSlide();
  const branding = data.branding || {};
  slide.background = { color: BRAND.slideBg };

  addBrandingBg(slide, { ...branding, type: "content" });
  addHeaderBar(slide, data.header, data.headerSub);

  const n = data.stats.length;
  const gap = 0.2;
  const cardW = (9.0 - (n - 1) * gap) / n;
  const cardH = 3.0;
  const startX = 0.5, startY = 1.4;

  data.stats.forEach((stat, i) => {
    const x = startX + i * (cardW + gap);
    const color = stat.color || BRAND.palette[i % BRAND.palette.length];

    slide.addShape(RECT, {
      x, y: startY, w: cardW, h: cardH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    slide.addShape(RECT, {
      x, y: startY, w: cardW, h: 0.07,
      fill: { color }, line: { type: "none" },
    });

    addIconCircle(slide, {
      x: x + (cardW - 0.55) / 2, y: startY + 0.25,
      size: 0.55, circleColor: color, iconData: icons[stat.iconKey],
    });

    slide.addText(stat.number, {
      x, y: startY + 1.0, w: cardW, h: 0.8,
      fontFace: HEADER_FONT, fontSize: 34, bold: true,
      color, align: "center", margin: 0,
    });

    slide.addText(stat.label, {
      x, y: startY + 1.82, w: cardW, h: 0.38,
      fontFace: HEADER_FONT, fontSize: 11, bold: true,
      color: BRAND.darkText, align: "center", margin: 0,
    });

    slide.addText(stat.desc, {
      x: x + 0.1, y: startY + 2.22, w: cardW - 0.2, h: 0.55,
      fontFace: BODY_FONT, fontSize: 9.5,
      color: BRAND.medText, align: "center", margin: 0,
    });
  });

  addBrandingFooter(slide, branding);
}

module.exports = { addStatCallouts };
