"use strict";

const PptxGenJS = require("pptxgenjs");
const { BRAND } = require("./lib/theme");
const { preRenderIcons } = require("./lib/icons");
const { getOutputPath } = require("./lib/output");
const {
  addTitleSlide, addThreeColumnCards, addProcessFlow,
  addCardGrid, addSplitLayout, addDarkClosing,
} = require("./lib/layouts");

const {
  FaSitemap, FaClipboardList, FaUsers, FaShieldAlt,
  FaExchangeAlt, FaChartLine, FaFilter, FaCheckSquare,
  FaBell, FaTachometerAlt,
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
    dashW:     [FaTachometerAlt,  "#FFFFFF"],
  });

  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  pres.title  = "APAC Product & Service Governance Framework";

  addTitleSlide(pres, {
    line1: "APAC Product & Service",
    line2: "Governance Framework",
    subtitle: "Enhancement, Role Alignment & Risk Visibility",
    context: {
      title: "Strategic Context",
      text: "Following the China Product & Process Enhancement Project, APAC transitions to an institutionalized governance model covering Product, Service and Risk alignment across all Branches.",
      accentColor: BRAND.teal,
    },
  });

  addThreeColumnCards(pres, {
    header: "SCOPE OF GOVERNANCE",
    cols: [
      {
        iconKey: "clipW", color: BRAND.redAccent,
        title: "Product & Enhancement",
        bullets: [
          "Annual Product Roadmap initiatives",
          "Ongoing client-driven enhancements",
          "Structural or cross-market product improvements",
        ],
      },
      {
        iconKey: "exchangeW", color: BRAND.blue,
        title: "Role & Service Alignment",
        bullets: [
          "Product vs Relationship Management review",
          "ECHO Service Team vs Branch Service alignment",
          "Operational responsibility clarification",
        ],
      },
      {
        iconKey: "shieldW", color: BRAND.teal,
        title: "Risk & Delivery Oversight",
        bullets: [
          "Delivery timeline risk monitoring",
          "Operational control exposure",
          "Regulatory alignment implications",
        ],
      },
    ],
  }, icons);

  addProcessFlow(pres, {
    header: "END-TO-END GOVERNANCE FLOW",
    steps: [
      { iconKey: "usersW",   num: "01", title: "Front Office",         desc: "Client needs & sales input",            color: BRAND.redAccent },
      { iconKey: "clipW",    num: "02", title: "Branch Assessment",     desc: "Prioritize & document rationale",       color: BRAND.blue },
      { iconKey: "filterW",  num: "03", title: "Classification",        desc: "Local / Structural / Cross-functional", color: BRAND.teal },
      { iconKey: "sitemapW", num: "04", title: "Leadership Allocation", desc: "Branch / Regional / Joint",             color: BRAND.amber },
      { iconKey: "checkW",   num: "05", title: "Execution",             desc: "Delivery & monitoring",                 color: BRAND.redAccent },
      { iconKey: "dashW",    num: "06", title: "Dashboard",             desc: "Quarterly governance review",           color: BRAND.teal },
    ],
    notes: [
      "Priority Adjustment — Branch-level, validated by Product Head",
      "Second-Level Review — Solution alignment with Regional perspective",
      "Early Visibility — Long-lead structural cases notified in advance",
    ],
  }, icons);

  addCardGrid(pres, {
    header: "GOVERNANCE DISCIPLINE & ALIGNMENT CONTROLS",
    cards: [
      {
        iconKey: "filterW", color: BRAND.redAccent,
        title: "Structured Entry Principle",
        bullets: [
          "Assessed & prioritized by Branch Product",
          "Documented business rationale required",
          "Internal alignment before Regional engagement",
        ],
      },
      {
        iconKey: "usersW", color: BRAND.blue,
        title: "Priority Adjustment",
        bullets: [
          "Reflects evolving client & sales needs",
          "Initiated by Front Office, validated by Branch Product Head",
          "Regional provides perspective in exceptional cases",
        ],
      },
      {
        iconKey: "sitemapW", color: BRAND.teal,
        title: "Second-Level Review",
        bullets: [
          "Triggered when Branch solution misaligns with client expectations",
          "Coordinated via Branch Product with documented rationale",
          "Regional provides independent perspective",
        ],
      },
      {
        iconKey: "bellW", color: BRAND.amber,
        title: "Early Visibility — Structural Cases",
        bullets: [
          "Required for structural product change or system development",
          "Cross-market impact triggers early Regional notification",
          "Enables parallel evaluation, avoids sequential delay",
        ],
      },
    ],
  }, icons);

  // Dashboard slide — bespoke enough to stay hand-coded for now
  addDashboardSlide(pres, icons);

  addDarkClosing(pres, {
    line1: "Institutionalizing Governance",
    line2: "Across APAC",
    subtext: "From project initiative to institutional model — enabling structured demand governance, clear accountability, and delivery risk visibility.",
    items: [
      { iconKey: "clipW",  label: "Structured Demand" },
      { iconKey: "usersW", label: "Clear Accountability" },
      { iconKey: "chartW", label: "Risk Visibility" },
    ],
  }, icons);

  await pres.writeFile({ fileName: OUT.filePath });
  console.log("Generated:", OUT.displayPath);
}

// Dashboard kept bespoke — composite layout not yet in library
function addDashboardSlide(pres, icons) {
  const PptxGenJS = require("pptxgenjs");
  const { BRAND, HEADER_FONT, BODY_FONT, SLIDE, cardShadow } = require("./lib/theme");
  const { addHeaderBar, addCard, addIconCircle, RECT, ELLIPSE } = require("./lib/shapes");

  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "QUARTERLY GOVERNANCE DASHBOARD");

  const leftW = 5.5, rightW = 3.1, gap = 0.4;
  const startY = SLIDE.contentY;
  const metricW = 2.55, metricH = 0.72;

  const metrics = [
    { label: "Total Active Initiatives", val: "Pipeline",   color: BRAND.redAccent },
    { label: "New Additions (Quarter)",  val: "New",        color: BRAND.blue },
    { label: "Completed (Quarter)",      val: "Done",       color: BRAND.teal },
    { label: "Carry-Over Items",         val: "Carry-Over", color: BRAND.amber },
  ];
  metrics.forEach((m, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * (metricW + 0.2);
    const y = startY + row * (metricH + 0.15);
    addCard(slide, { x, y, w: metricW, h: metricH, accentColor: m.color });
    slide.addText(m.val,   { x: x + 0.15, y: y + 0.06, w: metricW - 0.2, h: 0.3,  fontFace: HEADER_FONT, fontSize: 11, bold: true, color: m.color, margin: 0 });
    slide.addText(m.label, { x: x + 0.15, y: y + 0.36, w: metricW - 0.2, h: 0.28, fontFace: BODY_FONT,   fontSize: 9,  color: BRAND.medText, margin: 0 });
  });

  const ragY = startY + 1.74;
  slide.addText("EXECUTION RISK INDICATORS", { x: 0.5, y: ragY, w: leftW, h: 0.22, fontFace: HEADER_FONT, fontSize: 8.5, bold: true, color: BRAND.lightText, margin: 0 });
  const rags = [
    { color: "C0392B", label: "Red",   desc: "At risk / timeline breach" },
    { color: "E67E22", label: "Amber", desc: "Progress slower than planned" },
    { color: "27AE60", label: "Green", desc: "On track" },
  ];
  const ragW = (leftW - 0.4) / 3;
  rags.forEach((rag, i) => {
    const x = 0.5 + i * (ragW + 0.2), y = ragY + 0.28;
    slide.addShape(RECT, { x, y, w: ragW, h: 0.52, fill: { color: rag.color, transparency: 88 }, line: { color: rag.color, width: 0.5 } });
    slide.addShape(ELLIPSE, { x: x + 0.1, y: y + 0.12, w: 0.28, h: 0.28, fill: { color: rag.color }, line: { type: "none" } });
    slide.addText(`${rag.label} — ${rag.desc}`, { x: x + 0.44, y: y + 0.08, w: ragW - 0.5, h: 0.36, fontFace: BODY_FONT, fontSize: 8.5, color: BRAND.darkText, valign: "middle", margin: 0 });
  });

  const catY = ragY + 1.05;
  slide.addText("CATEGORY BREAKDOWN", { x: 0.5, y: catY, w: leftW, h: 0.22, fontFace: HEADER_FONT, fontSize: 8.5, bold: true, color: BRAND.lightText, margin: 0 });
  const cats = ["Product Roadmap", "Client-driven Enhancements", "Role Boundary Review", "Service Model Alignment"];
  slide.addText(cats.map((text, i) => ({ text, options: { bullet: true, breakLine: i < cats.length - 1, fontSize: 9.5, color: BRAND.medText, fontFace: BODY_FONT, paraSpaceAfter: 2 } })), { x: 0.5, y: catY + 0.26, w: leftW, h: 0.72, valign: "top", margin: 0 });

  const rightX = 0.5 + leftW + gap, panelH = 3.6;
  slide.addShape(RECT, { x: rightX, y: startY, w: rightW, h: panelH, fill: { color: BRAND.charcoal }, line: { type: "none" }, shadow: cardShadow() });
  slide.addShape(RECT, { x: rightX, y: startY, w: rightW, h: 0.06, fill: { color: BRAND.redAccent }, line: { type: "none" } });
  addIconCircle(slide, { x: rightX + (rightW - 0.52) / 2, y: startY + 0.18, size: 0.52, circleColor: BRAND.redAccent, iconData: icons.dashW, pad: 0.11 });
  slide.addText("Management Value", { x: rightX, y: startY + 0.84, w: rightW, h: 0.36, fontFace: HEADER_FONT, fontSize: 12, bold: true, color: "FFFFFF", align: "center", margin: 0 });
  slide.addShape(RECT, { x: rightX + 0.2, y: startY + 1.26, w: rightW - 0.4, h: 0.01, fill: { color: "4A4541" }, line: { type: "none" } });
  const valueItems = ["Transparent view of pipeline health", "Early identification of delivery risk", "Balanced prioritization across markets", "Prevention of backlog accumulation"];
  valueItems.forEach((text, i) => {
    const y = startY + 1.42 + i * 0.53;
    slide.addShape(RECT, { x: rightX + 0.2, y: y + 0.1, w: 0.06, h: 0.25, fill: { color: BRAND.redAccent }, line: { type: "none" } });
    slide.addText(text, { x: rightX + 0.34, y, w: rightW - 0.45, h: 0.44, fontFace: BODY_FONT, fontSize: 9.5, color: "D4CFC9", valign: "middle", margin: 0 });
  });
}

main().catch((err) => { console.error(err.message); process.exit(1); });
