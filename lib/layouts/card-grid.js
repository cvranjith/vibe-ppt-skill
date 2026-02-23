"use strict";

const { BRAND, HEADER_FONT, BODY_FONT, SLIDE } = require("../theme");
const { addHeaderBar, addCard, addIconCircle } = require("../shapes");
const { addBrandingBg, addBrandingFooter } = require("../branding");

// data: { header, cards: [{ iconKey, color?, title, bullets }], branding? }  — exactly 4 cards
function addCardGrid(pres, data, icons) {
  const slide = pres.addSlide();
  const branding = data.branding || {};
  slide.background = { color: BRAND.slideBg };

  addBrandingBg(slide, { ...branding, type: "content" });
  addHeaderBar(slide, data.header);

  const cardW = 4.35, cardH = 1.72, gapX = 0.30, gapY = 0.22;
  const startX = 0.5, startY = SLIDE.contentY;

  data.cards.forEach((card, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    const color = card.color || BRAND.palette[i % BRAND.palette.length];

    addCard(slide, { x, y, w: cardW, h: cardH, accentColor: color });

    addIconCircle(slide, {
      x: x + 0.10, y: y + 0.16, size: 0.42,
      circleColor: color, iconData: icons[card.iconKey], pad: 0.09,
    });

    slide.addText(card.title, {
      x: x + 0.62, y: y + 0.16, w: cardW - 0.72, h: 0.34,
      fontFace: HEADER_FONT, fontSize: 11.5, bold: true,
      color: BRAND.darkText, valign: "middle", margin: 0,
    });

    slide.addText(card.bullets.map((text, bi) => ({
      text,
      options: {
        bullet: true, breakLine: bi < card.bullets.length - 1,
        fontSize: 9.5, color: BRAND.medText, fontFace: BODY_FONT, paraSpaceAfter: 4,
      },
    })), {
      x: x + 0.62, y: y + 0.56, w: cardW - 0.75, h: cardH - 0.68,
      valign: "top", margin: 0,
    });
  });

  addBrandingFooter(slide, branding);
}

module.exports = { addCardGrid };
