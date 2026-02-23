"use strict";

const { BRAND, HEADER_FONT, BODY_FONT, cardShadow } = require("../theme");
const { addHeaderBar, addIconCircle, RECT, LINE } = require("../shapes");

// data: { header, steps: [{ iconKey, color?, num?, title, desc }], note?, notes?: [] }
// stepW auto-calculated from count; note/notes renders a callout bar below steps
function addProcessFlow(pres, data, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, data.header);

  const n = data.steps.length;
  const gapW = 0.18;
  const stepW = (9.0 - (n - 1) * gapW) / n;
  const hasNote = !!(data.note || data.notes);
  const stepH = hasNote ? 2.55 : 3.4;
  const startX = 0.5, startY = 1.22;

  data.steps.forEach((step, i) => {
    const x = startX + i * (stepW + gapW);
    const color = step.color || BRAND.palette[i % BRAND.palette.length];

    slide.addShape(RECT, {
      x, y: startY, w: stepW, h: stepH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    slide.addShape(RECT, {
      x, y: startY, w: stepW, h: 0.06,
      fill: { color }, line: { type: "none" },
    });

    if (step.num) {
      slide.addText(step.num, {
        x: x + 0.08, y: startY + 0.1, w: 0.45, h: 0.22,
        fontFace: BODY_FONT, fontSize: 8, bold: true, color, margin: 0,
      });
    }

    const iconSize = Math.min(0.52, stepW * 0.35);
    addIconCircle(slide, {
      x: x + (stepW - iconSize) / 2, y: startY + 0.2,
      size: iconSize, circleColor: color, iconData: icons[step.iconKey], pad: iconSize * 0.21,
    });

    slide.addText(step.title, {
      x, y: startY + 0.86, w: stepW, h: 0.52,
      fontFace: HEADER_FONT, fontSize: Math.min(11, stepW * 7.5), bold: true,
      color: BRAND.darkText, align: "center", margin: 0,
    });

    slide.addText(step.desc, {
      x: x + 0.06, y: startY + 1.42, w: stepW - 0.12, h: stepH - 1.55,
      fontFace: BODY_FONT, fontSize: Math.min(9.5, stepW * 6.5),
      color: BRAND.medText, align: "center", margin: 0,
    });

    if (i < n - 1) {
      slide.addShape(LINE, {
        x: x + stepW + 0.02, y: startY + stepH / 2,
        w: gapW - 0.04, h: 0,
        line: { color: BRAND.redAccent, width: 1.5 },
      });
    }
  });

  if (hasNote) {
    const noteY = startY + stepH + 0.18;
    slide.addShape(RECT, {
      x: 0.5, y: noteY, w: 9.0, h: 0.72,
      fill: { color: BRAND.subtleBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
    });

    const noteItems = Array.isArray(data.notes) ? data.notes : [data.note];
    if (noteItems.length === 1) {
      slide.addText(noteItems[0], {
        x: 0.7, y: noteY + 0.08, w: 8.6, h: 0.56,
        fontFace: BODY_FONT, fontSize: 9.5,
        color: BRAND.medText, valign: "middle", margin: 0,
      });
    } else {
      slide.addText(noteItems.map((t, i) => ({
        text: t,
        options: {
          bullet: true, breakLine: i < noteItems.length - 1,
          fontSize: 9, color: BRAND.medText, fontFace: BODY_FONT, paraSpaceAfter: 2,
        },
      })), {
        x: 0.7, y: noteY + 0.06, w: 8.6, h: 0.6,
        valign: "top", margin: 0,
      });
    }
  }
}

module.exports = { addProcessFlow };
