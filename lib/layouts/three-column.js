"use strict";

const { BRAND, HEADER_FONT, BODY_FONT, cardShadow } = require("../theme");
const { addHeaderBar, addCardTopStrip, addIconCircle, RECT } = require("../shapes");
const { addBrandingBg, addBrandingFooter } = require("../branding");

// data: { header, cols: [{ iconKey, color?, title, bullets }], branding? }  — exactly 3 cols
function addThreeColumnCards(pres, data, icons) {
  const slide = pres.addSlide();
  const branding = data.branding || {};
  slide.background = { color: BRAND.slideBg };

  addBrandingBg(slide, { ...branding, type: "content" });
  addHeaderBar(slide, data.header);

  const cardW = 2.83, cardH = 3.5, gap = 0.255;
  const startX = 0.5, startY = 1.1;

  data.cols.forEach((col, i) => {
    const x = startX + i * (cardW + gap);
    const color = col.color || BRAND.palette[i % BRAND.palette.length];

    slide.addShape(RECT, {
      x, y: startY, w: cardW, h: cardH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    addCardTopStrip(slide, { x, y: startY, w: cardW, color });

    addIconCircle(slide, {
      x: x + (cardW - 0.6) / 2, y: startY + 0.18,
      size: 0.6, circleColor: color, iconData: icons[col.iconKey], pad: 0.13,
    });

    slide.addText(col.title, {
      x, y: startY + 0.95, w: cardW, h: 0.45,
      fontFace: HEADER_FONT, fontSize: 12.5, bold: true,
      color: BRAND.darkText, align: "center", margin: 0,
    });

    slide.addShape(RECT, {
      x: x + 0.2, y: startY + 1.45, w: cardW - 0.4, h: 0.01,
      fill: { color: BRAND.cardBorder }, line: { type: "none" },
    });

    slide.addText(col.bullets.map((text, bi) => ({
      text,
      options: {
        bullet: true, breakLine: bi < col.bullets.length - 1,
        fontSize: 10.5, color: BRAND.medText, fontFace: BODY_FONT, paraSpaceAfter: 8,
      },
    })), {
      x: x + 0.2, y: startY + 1.6, w: cardW - 0.4, h: cardH - 1.75,
      valign: "top", margin: 0,
    });
  });

  addBrandingFooter(slide, branding);
}

module.exports = { addThreeColumnCards };
