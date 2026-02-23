"use strict";

const { BRAND, HEADER_FONT, BODY_FONT } = require("../theme");
const { addIconCircle, ELLIPSE } = require("../shapes");

// data: { line1, line2?, subtext, items?: [{ iconKey, label }] }
function addDarkClosing(pres, data, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.charcoal };

  slide.addShape(ELLIPSE, {
    x: -1.5, y: 3.0, w: 4.5, h: 4.5,
    fill: { color: BRAND.redAccent, transparency: 65 }, line: { type: "none" },
  });
  slide.addShape(ELLIPSE, {
    x: 7.8, y: -1.2, w: 3.5, h: 3.5,
    fill: { color: BRAND.redAccent, transparency: 60 }, line: { type: "none" },
  });

  const hasLine2 = !!data.line2;
  const titleY = hasLine2 ? 1.1 : 1.5;

  slide.addText(data.line1, {
    x: 0.8, y: titleY, w: 8.4, h: 0.8,
    fontFace: HEADER_FONT, fontSize: 34, bold: true,
    color: "FFFFFF", align: "center", margin: 0,
  });

  if (hasLine2) {
    slide.addText(data.line2, {
      x: 0.8, y: titleY + 0.8, w: 8.4, h: 0.7,
      fontFace: HEADER_FONT, fontSize: 34, bold: true,
      color: BRAND.redAccent, align: "center", margin: 0,
    });
  }

  const subtextY = hasLine2 ? titleY + 1.65 : titleY + 0.95;
  slide.addText(data.subtext, {
    x: 1.5, y: subtextY, w: 7.0, h: 0.65,
    fontFace: BODY_FONT, fontSize: 12,
    color: "D4CFC9", align: "center", margin: 0,
  });

  const items = data.items || [];
  if (items.length > 0) {
    const itemW = 2.5;
    const itemStartX = (10 - items.length * itemW) / 2;
    const itemY = 3.9;

    items.forEach((item, i) => {
      const x = itemStartX + i * itemW;
      addIconCircle(slide, {
        x: x + (itemW - 0.45) / 2, y: itemY,
        size: 0.45, circleColor: BRAND.redAccent, iconData: icons[item.iconKey], pad: 0.1,
      });
      slide.addText(item.label, {
        x, y: itemY + 0.52, w: itemW, h: 0.28,
        fontFace: BODY_FONT, fontSize: 9.5,
        color: "A39E98", align: "center", margin: 0,
      });
    });
  }
}

module.exports = { addDarkClosing };
