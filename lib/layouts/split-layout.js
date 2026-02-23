"use strict";

const { BRAND, HEADER_FONT, BODY_FONT, SLIDE, cardShadow } = require("../theme");
const { addHeaderBar, addIconCircle, RECT } = require("../shapes");
const { addBrandingBg, addBrandingFooter } = require("../branding");

// data: {
//   header,
//   left:  { heading?, bullets }
//   right: { heading?, iconKey?, dark?: bool, items?: [{text}], bullets?: [] }
//   branding?
// }
function addSplitLayout(pres, data, icons) {
  const slide = pres.addSlide();
  const branding = data.branding || {};
  slide.background = { color: BRAND.slideBg };

  addBrandingBg(slide, { ...branding, type: "content" });
  addHeaderBar(slide, data.header);

  const startY = SLIDE.contentY;
  const contentH = SLIDE.contentMaxY - startY - 0.1;
  const leftW = 5.5, rightW = 3.1, gap = 0.4;
  const rightX = 0.5 + leftW + gap;

  let leftY = startY;
  if (data.left.heading) {
    slide.addText(data.left.heading, {
      x: 0.5, y: leftY, w: leftW, h: 0.35,
      fontFace: HEADER_FONT, fontSize: 12, bold: true,
      color: BRAND.darkText, margin: 0,
    });
    leftY += 0.42;
  }

  slide.addText(data.left.bullets.map((text, bi) => ({
    text,
    options: {
      bullet: true, breakLine: bi < data.left.bullets.length - 1,
      fontSize: 11, color: BRAND.medText, fontFace: BODY_FONT, paraSpaceAfter: 6,
    },
  })), {
    x: 0.5, y: leftY, w: leftW, h: contentH - (leftY - startY),
    valign: "top", margin: 0,
  });

  const isDark = data.right.dark === true;
  slide.addShape(RECT, {
    x: rightX, y: startY, w: rightW, h: contentH,
    fill: { color: isDark ? BRAND.charcoal : BRAND.subtleBg },
    line: isDark ? { type: "none" } : { color: BRAND.cardBorder, width: 0.5 },
    shadow: isDark ? cardShadow() : undefined,
  });

  if (isDark) {
    slide.addShape(RECT, {
      x: rightX, y: startY, w: rightW, h: 0.06,
      fill: { color: BRAND.redAccent }, line: { type: "none" },
    });
  }

  let rightY = startY + (isDark ? 0.15 : 0.12);

  if (data.right.iconKey) {
    const sz = 0.52;
    addIconCircle(slide, {
      x: rightX + (rightW - sz) / 2, y: rightY,
      size: sz, circleColor: BRAND.redAccent, iconData: icons[data.right.iconKey], pad: 0.11,
    });
    rightY += sz + 0.12;
  }

  if (data.right.heading) {
    slide.addText(data.right.heading, {
      x: rightX, y: rightY, w: rightW, h: 0.36,
      fontFace: HEADER_FONT, fontSize: 12, bold: true,
      color: isDark ? "FFFFFF" : BRAND.darkText, align: "center", margin: 0,
    });
    rightY += 0.42;
    if (isDark) {
      slide.addShape(RECT, {
        x: rightX + 0.2, y: rightY, w: rightW - 0.4, h: 0.01,
        fill: { color: "4A4541" }, line: { type: "none" },
      });
      rightY += 0.1;
    }
  }

  const bodyColor = isDark ? "D4CFC9" : BRAND.medText;

  if (data.right.items) {
    data.right.items.forEach((item, i) => {
      const y = rightY + i * 0.53;
      if (isDark) {
        slide.addShape(RECT, {
          x: rightX + 0.2, y: y + 0.1, w: 0.06, h: 0.25,
          fill: { color: BRAND.redAccent }, line: { type: "none" },
        });
      }
      slide.addText(item.text, {
        x: rightX + (isDark ? 0.34 : 0.2), y,
        w: rightW - (isDark ? 0.45 : 0.3), h: 0.44,
        fontFace: BODY_FONT, fontSize: 9.5,
        color: bodyColor, valign: "middle", margin: 0,
      });
    });
  } else if (data.right.bullets) {
    slide.addText(data.right.bullets.map((text, bi) => ({
      text,
      options: {
        bullet: true, breakLine: bi < data.right.bullets.length - 1,
        fontSize: 10, color: bodyColor, fontFace: BODY_FONT, paraSpaceAfter: 5,
      },
    })), {
      x: rightX + 0.15, y: rightY, w: rightW - 0.25,
      h: contentH - (rightY - startY) - 0.1,
      valign: "top", margin: 0,
    });
  }

  addBrandingFooter(slide, branding);
}

module.exports = { addSplitLayout };
