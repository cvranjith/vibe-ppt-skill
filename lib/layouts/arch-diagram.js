"use strict";

const { BRAND, HEADER_FONT, BODY_FONT, SLIDE, cardShadow } = require("../theme");
const { addHeaderBar, addIconCircle, RECT, LINE } = require("../shapes");
const { addBrandingBg, addBrandingFooter } = require("../branding");

// data: {
//   header,
//   tiers: [{
//     label,
//     color?,
//     sublabel?,          // optional one-line description of the tier
//     nodes: [{ label, sublabel?, iconKey? }]
//   }],
//   connectors?: bool,   // default true — draw arrows between tiers
//   branding?
// }
//
// Produces a fully-editable top-down tier architecture diagram.
// 2–5 tiers, 1–6 nodes per tier. All shapes are native PPT objects.

function addArchDiagram(pres, data, icons) {
  const slide = pres.addSlide();
  const branding = data.branding || {};
  slide.background = { color: BRAND.slideBg };

  addBrandingBg(slide, { ...branding, type: "content" });
  addHeaderBar(slide, data.header);

  const numTiers  = data.tiers.length;
  const connH     = 0.22;
  const startX    = 0.5;
  const startY    = SLIDE.contentY;
  const totalW    = 9.0;
  const availH    = SLIDE.contentMaxY - startY - 0.08;
  const tierH     = (availH - (numTiers - 1) * connH) / numTiers;
  const drawConn  = data.connectors !== false;

  data.tiers.forEach((tier, ti) => {
    const tierY = startY + ti * (tierH + connH);
    const color = tier.color || BRAND.palette[ti % BRAND.palette.length];

    // Tier container
    slide.addShape(RECT, {
      x: startX, y: tierY, w: totalW, h: tierH,
      fill: { color: BRAND.subtleBg },
      line: { color, width: 0.75 },
    });

    // Left accent strip
    slide.addShape(RECT, {
      x: startX, y: tierY, w: 0.06, h: tierH,
      fill: { color }, line: { type: "none" },
    });

    // Tier label (+ optional sublabel)
    const hasSublabel = !!tier.sublabel;
    slide.addText(tier.label, {
      x: startX + 0.14, y: tierY + 0.06, w: totalW - 0.2, h: 0.22,
      fontFace: HEADER_FONT, fontSize: 8, bold: true,
      color, margin: 0,
    });
    if (hasSublabel) {
      slide.addText(tier.sublabel, {
        x: startX + 0.14, y: tierY + 0.27, w: totalW - 0.2, h: 0.16,
        fontFace: BODY_FONT, fontSize: 7.5,
        color: BRAND.lightText, margin: 0,
      });
    }

    // Nodes
    const nodes       = tier.nodes || [];
    const labelRows   = hasSublabel ? 0.46 : 0.32;   // vertical space consumed by tier label
    const nodeAreaX   = startX + 0.14;
    const nodeAreaW   = totalW - 0.22;
    const nodeGap     = 0.14;
    const nodeW       = (nodeAreaW - (nodes.length - 1) * nodeGap) / nodes.length;
    const nodeH       = tierH - labelRows - 0.08;
    const nodeY       = tierY + labelRows;
    const showIcon    = nodeH >= 0.52 && nodes.some(n => n.iconKey);
    const iconSize    = Math.min(0.36, nodeH * 0.46);

    nodes.forEach((node, ni) => {
      const nx = nodeAreaX + ni * (nodeW + nodeGap);

      slide.addShape(RECT, {
        x: nx, y: nodeY, w: nodeW, h: nodeH,
        fill: { color: BRAND.cardBg },
        line: { color, width: 0.5 },
        shadow: cardShadow(),
      });

      if (showIcon && node.iconKey && icons[node.iconKey]) {
        addIconCircle(slide, {
          x: nx + (nodeW - iconSize) / 2, y: nodeY + 0.06,
          size: iconSize, circleColor: color,
          iconData: icons[node.iconKey], pad: 0.07,
        });
        const labelY  = nodeY + iconSize + 0.1;
        const labelH  = nodeH - iconSize - 0.12;
        slide.addText(node.label, {
          x: nx + 0.04, y: labelY, w: nodeW - 0.08, h: labelH,
          fontFace: BODY_FONT, fontSize: 8.5,
          color: BRAND.darkText, align: "center", valign: "top", margin: 0,
        });
      } else {
        slide.addText(node.label, {
          x: nx + 0.06, y: nodeY, w: nodeW - 0.12, h: nodeH,
          fontFace: BODY_FONT, fontSize: 9,
          color: BRAND.darkText, align: "center", valign: "middle", margin: 0,
        });
      }

      if (node.sublabel) {
        // Rendered as part of label text when no icon, or skipped if tight
      }
    });

    // Connector arrows to next tier
    if (drawConn && ti < numTiers - 1) {
      const connY   = tierY + tierH;
      const nArrows = Math.min(Math.max(nodes.length, 1), 4);
      const step    = totalW / (nArrows + 1);
      for (let ai = 0; ai < nArrows; ai++) {
        const ax = startX + step * (ai + 1);
        slide.addShape(LINE, {
          x: ax, y: connY, w: 0, h: connH,
          line: { color: BRAND.lightText, width: 1.0, endArrowType: "triangle" },
        });
      }
    }
  });

  addBrandingFooter(slide, branding);
}

module.exports = { addArchDiagram };
