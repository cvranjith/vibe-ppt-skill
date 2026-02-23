"use strict";

const { BRAND, HEADER_FONT, BODY_FONT, SLIDE } = require("../theme");
const { addHeaderBar, addIconCircle, RECT } = require("../shapes");
const { addBrandingBg, addBrandingFooter } = require("../branding");

// data: { header, rows: [{ iconKey, color?, title, desc }], numbered?: bool, branding? }
function addIconRows(pres, data, icons) {
  const slide = pres.addSlide();
  const branding = data.branding || {};
  slide.background = { color: BRAND.slideBg };

  addBrandingBg(slide, { ...branding, type: "content" });
  addHeaderBar(slide, data.header);

  const contentH = SLIDE.contentMaxY - SLIDE.contentY - 0.05;
  const rowH = contentH / data.rows.length;
  const startY = SLIDE.contentY;

  data.rows.forEach((row, i) => {
    const y = startY + i * rowH;
    const color = row.color || BRAND.palette[i % BRAND.palette.length];
    const circleSize = Math.min(0.55, rowH * 0.58);

    if (i > 0) {
      slide.addShape(RECT, {
        x: 0.5, y: y - 0.04, w: 9.0, h: 0.01,
        fill: { color: BRAND.cardBorder }, line: { type: "none" },
      });
    }

    addIconCircle(slide, {
      x: 0.5, y: y + (rowH - circleSize) / 2 - 0.04,
      size: circleSize, circleColor: color, iconData: icons[row.iconKey],
    });

    slide.addText(row.title, {
      x: 1.22, y: y + 0.06, w: data.numbered ? 7.2 : 7.8, h: 0.32,
      fontFace: HEADER_FONT, fontSize: 13, bold: true,
      color: BRAND.darkText, margin: 0,
    });

    slide.addText(row.desc, {
      x: 1.22, y: y + 0.38, w: data.numbered ? 7.2 : 7.8, h: rowH - 0.48,
      fontFace: BODY_FONT, fontSize: 11,
      color: BRAND.medText, margin: 0,
    });

    if (data.numbered) {
      slide.addText(String(i + 1).padStart(2, "0"), {
        x: 8.8, y: y + 0.06, w: 0.6, h: 0.52,
        fontFace: HEADER_FONT, fontSize: 20, bold: true,
        color: BRAND.cardBorder, align: "right", valign: "middle", margin: 0,
      });
    }
  });

  addBrandingFooter(slide, branding);
}

module.exports = { addIconRows };
