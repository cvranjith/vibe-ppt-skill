"use strict";

const PptxGenJS = require("pptxgenjs");
const { BRAND, HEADER_FONT, BODY_FONT, SLIDE, cardShadow } = require("./lib/theme");
const { preRenderIcons } = require("./lib/icons");
const { getOutputPath } = require("./lib/output");
const {
  addHeaderBar, addCard, addCardTopStrip,
  addIconCircle, addTitleDecorations, RECT, ELLIPSE, LINE,
} = require("./lib/shapes");

const {
  FaSitemap, FaClipboardList, FaUsers, FaShieldAlt,
  FaExchangeAlt, FaChartLine, FaFilter, FaCheckSquare,
  FaBell, FaProjectDiagram, FaTachometerAlt,
} = require("react-icons/fa");

const OUT = getOutputPath("apac governance", "APAC Product Service Governance Framework");

async function main() {
  const icons = await preRenderIcons({
    sitemapW:  [FaSitemap,        "#FFFFFF"],
    clipW:     [FaClipboardList,  "#FFFFFF"],
    usersW:    [FaUsers,          "#FFFFFF"],
    shieldW:   [FaShieldAlt,      "#FFFFFF"],
    exchangeW: [FaExchangeAlt,    "#FFFFFF"],
    chartW:    [FaChartLine,      "#FFFFFF"],
    filterW:   [FaFilter,         "#FFFFFF"],
    checkW:    [FaCheckSquare,    "#FFFFFF"],
    bellW:     [FaBell,           "#FFFFFF"],
    flowW:     [FaProjectDiagram, "#FFFFFF"],
    dashW:     [FaTachometerAlt,  "#FFFFFF"],
  });

  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  pres.title  = "APAC Product & Service Governance Framework";

  addTitleSlide(pres, icons);
  addScopeSlide(pres, icons);
  addFlowSlide(pres, icons);
  addDisciplineSlide(pres, icons);
  addDashboardSlide(pres, icons);
  addClosingSlide(pres, icons);

  await pres.writeFile({ fileName: OUT.filePath });
  console.log("Generated:", OUT.displayPath);
}

function addTitleSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addTitleDecorations(slide, "light");

  slide.addShape(RECT, {
    x: 0, y: 1.0, w: 0.1, h: 2.8,
    fill: { color: BRAND.redAccent }, line: { type: "none" },
  });

  slide.addText("APAC Product & Service", {
    x: 0.45, y: 1.0, w: 6.0, h: 0.85,
    fontFace: HEADER_FONT, fontSize: 34, bold: true,
    color: BRAND.darkText, margin: 0,
  });

  slide.addText("Governance Framework", {
    x: 0.45, y: 1.85, w: 6.0, h: 0.85,
    fontFace: HEADER_FONT, fontSize: 34, bold: true,
    color: BRAND.redAccent, margin: 0,
  });

  slide.addText("Enhancement, Role Alignment & Risk Visibility", {
    x: 0.45, y: 2.82, w: 5.8, h: 0.45,
    fontFace: BODY_FONT, fontSize: 13,
    color: BRAND.medText, margin: 0,
  });

  slide.addShape(RECT, {
    x: 0.45, y: 3.45, w: 5.6, h: 1.25,
    fill: { color: BRAND.subtleBg },
    line: { color: BRAND.cardBorder, width: 0.5 },
  });
  slide.addShape(RECT, {
    x: 0.45, y: 3.45, w: 0.06, h: 1.25,
    fill: { color: BRAND.teal }, line: { type: "none" },
  });
  slide.addText("Strategic Context", {
    x: 0.65, y: 3.52, w: 5.2, h: 0.28,
    fontFace: HEADER_FONT, fontSize: 10, bold: true,
    color: BRAND.teal, margin: 0,
  });
  slide.addText(
    "Following the China Product & Process Enhancement Project, APAC transitions to an institutionalized governance model covering Product, Service and Risk alignment across all Branches.",
    {
      x: 0.65, y: 3.82, w: 5.2, h: 0.78,
      fontFace: BODY_FONT, fontSize: 9.5,
      color: BRAND.medText, margin: 0,
    }
  );
}

function addScopeSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "SCOPE OF GOVERNANCE");

  const cardW = 2.83, cardH = 3.5, gap = 0.255;
  const startX = 0.5, startY = 1.1;

  const cols = [
    {
      icon: icons.clipW, color: BRAND.redAccent,
      title: "Product & Enhancement",
      bullets: [
        "Annual Product Roadmap initiatives",
        "Ongoing client-driven enhancements",
        "Structural or cross-market product improvements",
      ],
    },
    {
      icon: icons.exchangeW, color: BRAND.blue,
      title: "Role & Service Alignment",
      bullets: [
        "Product vs Relationship Management review",
        "ECHO Service Team vs Branch Service alignment",
        "Operational responsibility clarification",
      ],
    },
    {
      icon: icons.shieldW, color: BRAND.teal,
      title: "Risk & Delivery Oversight",
      bullets: [
        "Delivery timeline risk monitoring",
        "Operational control exposure",
        "Regulatory alignment implications",
      ],
    },
  ];

  cols.forEach((col, i) => {
    const x = startX + i * (cardW + gap);

    slide.addShape(RECT, {
      x, y: startY, w: cardW, h: cardH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    addCardTopStrip(slide, { x, y: startY, w: cardW, color: col.color });

    const circleSize = 0.6;
    addIconCircle(slide, {
      x: x + (cardW - circleSize) / 2,
      y: startY + 0.18,
      size: circleSize,
      circleColor: col.color,
      iconData: col.icon,
      pad: 0.13,
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

    const bulletItems = col.bullets.map((text, bi) => ({
      text,
      options: {
        bullet: true,
        breakLine: bi < col.bullets.length - 1,
        fontSize: 10.5,
        color: BRAND.medText,
        fontFace: BODY_FONT,
        paraSpaceAfter: 8,
      },
    }));
    slide.addText(bulletItems, {
      x: x + 0.2, y: startY + 1.6, w: cardW - 0.4, h: cardH - 1.75,
      valign: "top", margin: 0,
    });
  });
}

function addFlowSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "END-TO-END GOVERNANCE FLOW");

  // 6 steps: 6*1.35 + 5*0.18 = 9.0 ✓
  const stepW = 1.35, stepH = 2.55, gapW = 0.18;
  const startX = 0.5, startY = 1.22;
  const colors = [BRAND.redAccent, BRAND.blue, BRAND.teal, BRAND.amber, BRAND.redAccent, BRAND.teal];

  const steps = [
    { icon: icons.usersW,   num: "01", title: "Front Office",         desc: "Client needs & sales input" },
    { icon: icons.clipW,    num: "02", title: "Branch Assessment",     desc: "Prioritize & document rationale" },
    { icon: icons.filterW,  num: "03", title: "Classification",        desc: "Local / Structural / Cross-functional" },
    { icon: icons.sitemapW, num: "04", title: "Leadership Allocation", desc: "Branch / Regional / Joint" },
    { icon: icons.checkW,   num: "05", title: "Execution",             desc: "Delivery & monitoring" },
    { icon: icons.dashW,    num: "06", title: "Dashboard",             desc: "Quarterly governance review" },
  ];

  steps.forEach((step, i) => {
    const x = startX + i * (stepW + gapW);

    slide.addShape(RECT, {
      x, y: startY, w: stepW, h: stepH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    slide.addShape(RECT, {
      x, y: startY, w: stepW, h: 0.06,
      fill: { color: colors[i] }, line: { type: "none" },
    });

    slide.addText(step.num, {
      x: x + 0.08, y: startY + 0.1, w: 0.4, h: 0.22,
      fontFace: BODY_FONT, fontSize: 8, bold: true,
      color: colors[i], margin: 0,
    });

    addIconCircle(slide, {
      x: x + (stepW - 0.52) / 2, y: startY + 0.2,
      size: 0.52, circleColor: colors[i], iconData: step.icon, pad: 0.11,
    });

    slide.addText(step.title, {
      x, y: startY + 0.86, w: stepW, h: 0.52,
      fontFace: HEADER_FONT, fontSize: 10.5, bold: true,
      color: BRAND.darkText, align: "center", margin: 0,
    });

    slide.addText(step.desc, {
      x: x + 0.06, y: startY + 1.42, w: stepW - 0.12, h: 0.9,
      fontFace: BODY_FONT, fontSize: 9,
      color: BRAND.medText, align: "center", margin: 0,
    });

    if (i < steps.length - 1) {
      slide.addShape(LINE, {
        x: x + stepW + 0.02, y: startY + stepH / 2,
        w: gapW - 0.04, h: 0,
        line: { color: BRAND.redAccent, width: 1.5 },
      });
    }
  });

  const notes = [
    "Priority Adjustment — Branch-level, validated by Product Head",
    "Second-Level Review — Solution alignment with Regional perspective",
    "Early Visibility — Long-lead structural cases notified in advance",
  ];
  slide.addShape(RECT, {
    x: 0.5, y: 3.95, w: 9.0, h: 0.72,
    fill: { color: BRAND.subtleBg },
    line: { color: BRAND.cardBorder, width: 0.5 },
  });
  slide.addText(notes.map((t, i) => ({
    text: t,
    options: {
      bullet: true,
      breakLine: i < notes.length - 1,
      fontSize: 9,
      color: BRAND.medText,
      fontFace: BODY_FONT,
      paraSpaceAfter: 2,
    },
  })), {
    x: 0.7, y: 4.02, w: 8.6, h: 0.6,
    valign: "top", margin: 0,
  });
}

function addDisciplineSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "GOVERNANCE DISCIPLINE & ALIGNMENT CONTROLS");

  const cardW = 4.35, cardH = 1.72, gapX = 0.30, gapY = 0.22;
  const startX = 0.5, startY = SLIDE.contentY;

  const cards = [
    {
      icon: icons.filterW, color: BRAND.redAccent, col: 0, row: 0,
      title: "Structured Entry Principle",
      bullets: [
        "Assessed & prioritized by Branch Product",
        "Documented business rationale required",
        "Internal alignment before Regional engagement",
      ],
    },
    {
      icon: icons.usersW, color: BRAND.blue, col: 1, row: 0,
      title: "Priority Adjustment",
      bullets: [
        "Reflects evolving client & sales needs",
        "Initiated by Front Office, validated by Branch Product Head",
        "Regional provides perspective in exceptional cases",
      ],
    },
    {
      icon: icons.sitemapW, color: BRAND.teal, col: 0, row: 1,
      title: "Second-Level Review",
      bullets: [
        "Triggered when Branch solution misaligns with client expectations",
        "Coordinated via Branch Product with documented rationale",
        "Regional provides independent perspective",
      ],
    },
    {
      icon: icons.bellW, color: BRAND.amber, col: 1, row: 1,
      title: "Early Visibility — Structural Cases",
      bullets: [
        "Required for structural product change or system development",
        "Cross-market impact triggers early Regional notification",
        "Enables parallel evaluation, avoids sequential delay",
      ],
    },
  ];

  cards.forEach((card) => {
    const x = startX + card.col * (cardW + gapX);
    const y = startY + card.row * (cardH + gapY);

    addCard(slide, { x, y, w: cardW, h: cardH, accentColor: card.color });

    addIconCircle(slide, {
      x: x + 0.10, y: y + 0.16, size: 0.42,
      circleColor: card.color, iconData: card.icon, pad: 0.09,
    });

    slide.addText(card.title, {
      x: x + 0.62, y: y + 0.16, w: cardW - 0.72, h: 0.34,
      fontFace: HEADER_FONT, fontSize: 11.5, bold: true,
      color: BRAND.darkText, valign: "middle", margin: 0,
    });

    const bulletItems = card.bullets.map((text, bi) => ({
      text,
      options: {
        bullet: true,
        breakLine: bi < card.bullets.length - 1,
        fontSize: 9.5,
        color: BRAND.medText,
        fontFace: BODY_FONT,
        paraSpaceAfter: 4,
      },
    }));
    slide.addText(bulletItems, {
      x: x + 0.62, y: y + 0.56, w: cardW - 0.75, h: cardH - 0.68,
      valign: "top", margin: 0,
    });
  });
}

function addDashboardSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "QUARTERLY GOVERNANCE DASHBOARD");

  const leftW = 5.5, rightW = 3.1, gap = 0.4;
  const startY = SLIDE.contentY;

  // Pipeline metrics — 2×2 mini-cards
  const metricW = 2.55, metricH = 0.72;
  const metrics = [
    { label: "Total Active Initiatives", val: "Pipeline",  color: BRAND.redAccent },
    { label: "New Additions (Quarter)",  val: "New",       color: BRAND.blue },
    { label: "Completed (Quarter)",      val: "Done",      color: BRAND.teal },
    { label: "Carry-Over Items",         val: "Carry-Over",color: BRAND.amber },
  ];
  metrics.forEach((m, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * (metricW + 0.2);
    const y = startY + row * (metricH + 0.15);
    addCard(slide, { x, y, w: metricW, h: metricH, accentColor: m.color });
    slide.addText(m.val, {
      x: x + 0.15, y: y + 0.06, w: metricW - 0.2, h: 0.3,
      fontFace: HEADER_FONT, fontSize: 11, bold: true,
      color: m.color, margin: 0,
    });
    slide.addText(m.label, {
      x: x + 0.15, y: y + 0.36, w: metricW - 0.2, h: 0.28,
      fontFace: BODY_FONT, fontSize: 9,
      color: BRAND.medText, margin: 0,
    });
  });

  // RAG risk indicators
  const ragY = startY + 1.74;
  slide.addText("EXECUTION RISK INDICATORS", {
    x: 0.5, y: ragY, w: leftW, h: 0.22,
    fontFace: HEADER_FONT, fontSize: 8.5, bold: true,
    color: BRAND.lightText, margin: 0,
  });
  const rags = [
    { color: "C0392B", label: "Red",   desc: "At risk / timeline breach" },
    { color: "E67E22", label: "Amber", desc: "Progress slower than planned" },
    { color: "27AE60", label: "Green", desc: "On track" },
  ];
  const ragW = (leftW - 0.4) / 3;
  rags.forEach((rag, i) => {
    const x = 0.5 + i * (ragW + 0.2);
    const y = ragY + 0.28;
    slide.addShape(RECT, {
      x, y, w: ragW, h: 0.52,
      fill: { color: rag.color, transparency: 88 },
      line: { color: rag.color, width: 0.5 },
    });
    slide.addShape(ELLIPSE, {
      x: x + 0.1, y: y + 0.12, w: 0.28, h: 0.28,
      fill: { color: rag.color }, line: { type: "none" },
    });
    slide.addText(`${rag.label} — ${rag.desc}`, {
      x: x + 0.44, y: y + 0.08, w: ragW - 0.5, h: 0.36,
      fontFace: BODY_FONT, fontSize: 8.5,
      color: BRAND.darkText, valign: "middle", margin: 0,
    });
  });

  // Category breakdown
  const catY = ragY + 1.05;
  slide.addText("CATEGORY BREAKDOWN", {
    x: 0.5, y: catY, w: leftW, h: 0.22,
    fontFace: HEADER_FONT, fontSize: 8.5, bold: true,
    color: BRAND.lightText, margin: 0,
  });
  const cats = ["Product Roadmap", "Client-driven Enhancements", "Role Boundary Review", "Service Model Alignment"];
  slide.addText(cats.map((text, i) => ({
    text,
    options: {
      bullet: true,
      breakLine: i < cats.length - 1,
      fontSize: 9.5,
      color: BRAND.medText,
      fontFace: BODY_FONT,
      paraSpaceAfter: 2,
    },
  })), {
    x: 0.5, y: catY + 0.26, w: leftW, h: 0.72,
    valign: "top", margin: 0,
  });

  // Right dark panel — Management Value
  const rightX = 0.5 + leftW + gap;
  const panelH = 3.6;
  slide.addShape(RECT, {
    x: rightX, y: startY, w: rightW, h: panelH,
    fill: { color: BRAND.charcoal },
    line: { type: "none" },
    shadow: cardShadow(),
  });
  slide.addShape(RECT, {
    x: rightX, y: startY, w: rightW, h: 0.06,
    fill: { color: BRAND.redAccent }, line: { type: "none" },
  });

  addIconCircle(slide, {
    x: rightX + (rightW - 0.52) / 2, y: startY + 0.18,
    size: 0.52, circleColor: BRAND.redAccent, iconData: icons.dashW, pad: 0.11,
  });

  slide.addText("Management Value", {
    x: rightX, y: startY + 0.84, w: rightW, h: 0.36,
    fontFace: HEADER_FONT, fontSize: 12, bold: true,
    color: "FFFFFF", align: "center", margin: 0,
  });

  slide.addShape(RECT, {
    x: rightX + 0.2, y: startY + 1.26, w: rightW - 0.4, h: 0.01,
    fill: { color: "4A4541" }, line: { type: "none" },
  });

  const valueItems = [
    "Transparent view of pipeline health",
    "Early identification of delivery risk",
    "Balanced prioritization across markets",
    "Prevention of backlog accumulation",
  ];
  valueItems.forEach((text, i) => {
    const y = startY + 1.42 + i * 0.53;
    slide.addShape(RECT, {
      x: rightX + 0.2, y: y + 0.1, w: 0.06, h: 0.25,
      fill: { color: BRAND.redAccent }, line: { type: "none" },
    });
    slide.addText(text, {
      x: rightX + 0.34, y, w: rightW - 0.45, h: 0.44,
      fontFace: BODY_FONT, fontSize: 9.5,
      color: "D4CFC9", valign: "middle", margin: 0,
    });
  });
}

function addClosingSlide(pres, icons) {
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

  slide.addText("Institutionalizing Governance", {
    x: 0.8, y: 1.1, w: 8.4, h: 0.8,
    fontFace: HEADER_FONT, fontSize: 34, bold: true,
    color: "FFFFFF", align: "center", margin: 0,
  });
  slide.addText("Across APAC", {
    x: 0.8, y: 1.9, w: 8.4, h: 0.7,
    fontFace: HEADER_FONT, fontSize: 34, bold: true,
    color: BRAND.redAccent, align: "center", margin: 0,
  });

  slide.addText(
    "From project initiative to institutional model — enabling structured demand governance, clear accountability, and delivery risk visibility.",
    {
      x: 1.5, y: 2.75, w: 7.0, h: 0.65,
      fontFace: BODY_FONT, fontSize: 12,
      color: "D4CFC9", align: "center", margin: 0,
    }
  );

  const summaryItems = [
    { icon: icons.clipW,  label: "Structured Demand" },
    { icon: icons.usersW, label: "Clear Accountability" },
    { icon: icons.chartW, label: "Risk Visibility" },
  ];
  const itemW = 2.5;
  const itemStartX = (10 - summaryItems.length * itemW) / 2;

  summaryItems.forEach((item, i) => {
    const x = itemStartX + i * itemW;
    const y = 3.9;
    addIconCircle(slide, {
      x: x + (itemW - 0.45) / 2, y,
      size: 0.45, circleColor: BRAND.redAccent, iconData: item.icon, pad: 0.1,
    });
    slide.addText(item.label, {
      x, y: y + 0.52, w: itemW, h: 0.28,
      fontFace: BODY_FONT, fontSize: 9.5,
      color: "A39E98", align: "center", margin: 0,
    });
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
