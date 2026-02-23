"use strict";

// ============================================================
// examples/generate-template.js
// Working example deck — demonstrates every layout type.
// Run: node examples/generate-template.js
// Output: output/template-demo/cloud-platform-strategy-2026-v1.pptx
// ============================================================

const PptxGenJS = require("pptxgenjs");

const { BRAND, HEADER_FONT, BODY_FONT, SLIDE, cardShadow } = require("../lib/theme");
const { preRenderIcons }                                    = require("../lib/icons");
const { getOutputPath }                                     = require("../lib/output");
const {
  addBackground, addHeaderBar, addCard, addCardTopStrip,
  addIconCircle, addTitleDecorations, RECT, ELLIPSE, LINE,
} = require("../lib/shapes");

// Font Awesome icons — choose semantically matching icons per deck
const {
  FaRocket, FaChartBar, FaUsers, FaShieldAlt, FaCogs,
  FaCloud, FaLightbulb, FaCheckCircle, FaBullseye,
  FaDollarSign, FaClock, FaGlobe, FaDatabase,
} = require("react-icons/fa");

// ── Output path ───────────────────────────────────────────────
// All decks go to output/<topic>/<title>-vN.pptx
const OUT = getOutputPath("template demo", "Cloud Platform Strategy 2026");

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log("Rendering icons...");

  // Step 1: Pre-render ALL icons at the start — one await, all parallel.
  // Colors: "#FFFFFF" for icons on colored circles, "#XXXXXX" for colored icons on white.
  // Note: react-icons color prop DOES use # prefix (unlike pptxgenjs hex colors).
  const icons = await preRenderIcons({
    // White variants (for colored circle backgrounds)
    rocketW:  [FaRocket,      "#FFFFFF"],
    chartW:   [FaChartBar,    "#FFFFFF"],
    usersW:   [FaUsers,       "#FFFFFF"],
    shieldW:  [FaShieldAlt,   "#FFFFFF"],
    cogsW:    [FaCogs,        "#FFFFFF"],
    cloudW:   [FaCloud,       "#FFFFFF"],
    bulbW:    [FaLightbulb,   "#FFFFFF"],
    checkW:   [FaCheckCircle, "#FFFFFF"],
    targetW:  [FaBullseye,    "#FFFFFF"],
    dollarW:  [FaDollarSign,  "#FFFFFF"],
    clockW:   [FaClock,       "#FFFFFF"],
    globeW:   [FaGlobe,       "#FFFFFF"],
    dbW:      [FaDatabase,    "#FFFFFF"],
    // Colored variants (for icons directly on white/light backgrounds)
    rocketR:  [FaRocket,      "#C74634"],
    chartR:   [FaChartBar,    "#C74634"],
  });

  // Step 2: Create presentation
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  pres.title  = "Cloud Platform Strategy 2026";

  // Step 3: Add slides — vary layout types across slides
  console.log("Building slides...");
  addTitleSlide(pres, icons);            // Layout: Title Slide
  addAgendaSlide(pres, icons);           // Layout: Icon + Text Rows
  addCardGridSlide(pres, icons);         // Layout: Card Grid 2×2
  addColumnCardsSlide(pres, icons);      // Layout: 3-Column Cards
  addProcessFlowSlide(pres, icons);      // Layout: Horizontal Process Flow
  addMetricsSlide(pres, icons);          // Layout: Big Number Callouts
  addClosingSlide(pres, icons);          // Layout: Dark Closing

  // Step 4: Write
  await pres.writeFile({ fileName: OUT.filePath });
  console.log("✅  Generated:", OUT.displayPath);
  console.log("");
  console.log("Run QA:");
  console.log(`  Content: python -m markitdown ${OUT.filePath}`);
  console.log(`  Visual:  bash qa.sh ${OUT.filePath}`);
}

// ── Slide 1: Title Slide ──────────────────────────────────────
// Warm off-white bg + Oracle Red organic shapes + left-aligned title

function addTitleSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };

  // Decorative organic shapes (Redwood style — extend off slide intentionally)
  addTitleDecorations(slide, "light");

  // Left edge red accent bar
  slide.addShape(RECT, {
    x: 0, y: 1.1, w: 0.1, h: 2.6,
    fill: { color: BRAND.redAccent }, line: { type: "none" },
  });

  // Title line 1
  slide.addText("Cloud Platform", {
    x: 0.5, y: 1.1, w: 5.8, h: 0.85,
    fontFace: HEADER_FONT, fontSize: 36, bold: true,
    color: BRAND.darkText, margin: 0,
  });

  // Title line 2 (accent color)
  slide.addText("Strategy 2026", {
    x: 0.5, y: 1.95, w: 5.8, h: 0.85,
    fontFace: HEADER_FONT, fontSize: 36, bold: true,
    color: BRAND.redAccent, margin: 0,
  });

  // Subtitle
  slide.addText(
    "A unified approach to cloud infrastructure, security, and developer velocity",
    {
      x: 0.5, y: 2.9, w: 5.5, h: 0.55,
      fontFace: BODY_FONT, fontSize: 13,
      color: BRAND.medText, margin: 0,
    }
  );

  // Context callout box (above footer zone — bottom: 4.0+0.65=4.65 ✓)
  slide.addShape(RECT, {
    x: 0.5, y: 4.0, w: 5.0, h: 0.65,
    fill: { color: BRAND.subtleBg },
    line: { color: BRAND.cardBorder, width: 0.5 },
  });
  slide.addText("Confidential  |  Internal Distribution Only  |  Q1 2026", {
    x: 0.65, y: 4.07, w: 4.7, h: 0.51,
    fontFace: BODY_FONT, fontSize: 9.5,
    color: BRAND.lightText, valign: "middle", margin: 0,
  });
}

// ── Slide 2: Agenda — Icon + Text Rows ───────────────────────

function addAgendaSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "AGENDA");

  // 4 rows. Spacing: startY=1.25, rowH=0.92.
  // Last row bottom: 1.25 + 3*0.92 + 0.6 = 4.61 ✓ (< 5.075)
  const rows = [
    {
      icon: icons.rocketW, color: BRAND.redAccent,
      title: "Platform Vision",
      desc:  "Strategic goals and north star objectives for 2026",
    },
    {
      icon: icons.cogsW, color: BRAND.blue,
      title: "Core Capabilities",
      desc:  "Infrastructure, compute, storage, and network services",
    },
    {
      icon: icons.shieldW, color: BRAND.teal,
      title: "Security & Compliance",
      desc:  "Zero-trust architecture and regulatory readiness",
    },
    {
      icon: icons.chartW, color: BRAND.amber,
      title: "Success Metrics",
      desc:  "KPIs, adoption targets, and ROI projections",
    },
  ];

  const startY = 1.25;
  const rowH   = 0.92;

  rows.forEach((row, i) => {
    const y = startY + i * rowH;

    // Divider line (skip first)
    if (i > 0) {
      slide.addShape(RECT, {
        x: 0.5, y: y - 0.08, w: 9.0, h: 0.01,
        fill: { color: BRAND.cardBorder }, line: { type: "none" },
      });
    }

    // Icon circle
    addIconCircle(slide, { x: 0.5, y: y + 0.03, size: 0.55, circleColor: row.color, iconData: row.icon });

    // Title
    slide.addText(row.title, {
      x: 1.2, y: y + 0.03, w: 7.0, h: 0.32,
      fontFace: HEADER_FONT, fontSize: 13, bold: true,
      color: BRAND.darkText, margin: 0,
    });

    // Description
    slide.addText(row.desc, {
      x: 1.2, y: y + 0.35, w: 7.5, h: 0.28,
      fontFace: BODY_FONT, fontSize: 11,
      color: BRAND.medText, margin: 0,
    });

    // Step number (right side, decorative)
    slide.addText(String(i + 1).padStart(2, "0"), {
      x: 8.8, y: y + 0.03, w: 0.6, h: 0.55,
      fontFace: HEADER_FONT, fontSize: 20, bold: true,
      color: BRAND.cardBorder, align: "right", valign: "middle", margin: 0,
    });
  });
}

// ── Slide 3: Card Grid 2×2 ────────────────────────────────────

function addCardGridSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "CORE CAPABILITIES");

  // 2 cols × 2 rows. cardW=4.35, cardH=1.65, gapX=0.30, gapY=0.25
  // Col 2 right edge: 0.5 + 4.35 + 0.30 + 4.35 = 9.5 ✓
  // Row 2 bottom:    1.25 + 1.65 + 0.25 + 1.65 = 4.80 ✓
  const cardW = 4.35, cardH = 1.65, gapX = 0.30, gapY = 0.25;
  const startX = 0.5, startY = SLIDE.contentY;

  const cards = [
    {
      icon: icons.cloudW, color: BRAND.redAccent, col: 0, row: 0,
      title: "Cloud Infrastructure",
      bullets: ["Multi-cloud deployment", "Auto-scaling compute", "99.99% SLA"],
    },
    {
      icon: icons.shieldW, color: BRAND.blue, col: 1, row: 0,
      title: "Security & Compliance",
      bullets: ["Zero-trust network", "SOC 2 Type II certified", "Threat detection"],
    },
    {
      icon: icons.chartW, color: BRAND.teal, col: 0, row: 1,
      title: "Observability",
      bullets: ["Unified monitoring", "AI-powered alerting", "Distributed tracing"],
    },
    {
      icon: icons.bulbW, color: BRAND.amber, col: 1, row: 1,
      title: "Developer Platform",
      bullets: ["Self-service portal", "CI/CD pipelines", "API gateway & mesh"],
    },
  ];

  cards.forEach((card) => {
    const x = startX + card.col * (cardW + gapX);
    const y = startY + card.row * (cardH + gapY);

    // Card (left accent bar drawn by addCard)
    addCard(slide, { x, y, w: cardW, h: cardH, accentColor: card.color });

    // Icon circle — positioned inside card, over the accent bar
    // Accent bar is 0.06" wide; icon circle starts at x+0.10
    addIconCircle(slide, {
      x: x + 0.10, y: y + 0.13, size: 0.45,
      circleColor: card.color, iconData: card.icon, pad: 0.10,
    });

    // Card title
    slide.addText(card.title, {
      x: x + 0.65, y: y + 0.13, w: cardW - 0.75, h: 0.36,
      fontFace: HEADER_FONT, fontSize: 13, bold: true,
      color: BRAND.darkText, valign: "middle", margin: 0,
    });

    // Bullet list
    const bulletItems = card.bullets.map((text, bi) => ({
      text,
      options: {
        bullet: true,
        breakLine: bi < card.bullets.length - 1,
        fontSize: 10.5,
        color: BRAND.medText,
        fontFace: BODY_FONT,
        paraSpaceAfter: 5,
      },
    }));
    slide.addText(bulletItems, {
      x: x + 0.65, y: y + 0.55, w: cardW - 0.80, h: cardH - 0.70,
      valign: "top", margin: 0,
    });
  });
}

// ── Slide 4: 3-Column Cards ───────────────────────────────────

function addColumnCardsSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "PLATFORM WORKLOADS");

  // 3 equal cards. 3*cardW + 2*gap = 9.0 → cardW=2.83, gap=0.255
  // Card 3 right: 0.5 + 2*2.83 + 2*0.255 + 2.83 = 9.5 ✓
  // Card bottom:  1.1 + 3.7 = 4.8 ✓
  const cardW = 2.83, cardH = 3.7, gap = 0.255;
  const startX = 0.5, startY = 1.1;

  const cols = [
    {
      icon: icons.dbW, color: BRAND.redAccent,
      title: "Data & Analytics",
      bullets: [
        "Lakehouse architecture",
        "Real-time streaming",
        "ML pipeline support",
        "Self-service BI tools",
      ],
    },
    {
      icon: icons.cloudW, color: BRAND.blue,
      title: "Application Hosting",
      bullets: [
        "Container orchestration",
        "Serverless functions",
        "Auto-scaling policies",
        "Blue/green deploys",
      ],
    },
    {
      icon: icons.shieldW, color: BRAND.teal,
      title: "Security Services",
      bullets: [
        "Identity & access mgmt",
        "Secrets management",
        "Vulnerability scanning",
        "Compliance reporting",
      ],
    },
  ];

  cols.forEach((col, i) => {
    const x = startX + i * (cardW + gap);

    // Card background
    slide.addShape(RECT, {
      x, y: startY, w: cardW, h: cardH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    // Colored top strip
    addCardTopStrip(slide, { x, y: startY, w: cardW, color: col.color });

    // Icon circle (centered in card header area)
    const circleSize = 0.6;
    addIconCircle(slide, {
      x: x + (cardW - circleSize) / 2,
      y: startY + 0.2,
      size: circleSize,
      circleColor: col.color,
      iconData: col.icon,
      pad: 0.13,
    });

    // Card title
    slide.addText(col.title, {
      x, y: startY + 1.0, w: cardW, h: 0.4,
      fontFace: HEADER_FONT, fontSize: 13, bold: true,
      color: BRAND.darkText, align: "center", margin: 0,
    });

    // Divider line
    slide.addShape(RECT, {
      x: x + 0.2, y: startY + 1.45, w: cardW - 0.4, h: 0.01,
      fill: { color: BRAND.cardBorder }, line: { type: "none" },
    });

    // Bullet list
    const bulletItems = col.bullets.map((text, bi) => ({
      text,
      options: {
        bullet: true,
        breakLine: bi < col.bullets.length - 1,
        fontSize: 10.5,
        color: BRAND.medText,
        fontFace: BODY_FONT,
        paraSpaceAfter: 6,
      },
    }));
    slide.addText(bulletItems, {
      x: x + 0.15, y: startY + 1.6, w: cardW - 0.3, h: cardH - 1.75,
      valign: "top", margin: 0,
    });
  });
}

// ── Slide 5: Horizontal Process Flow ─────────────────────────

function addProcessFlowSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "MIGRATION JOURNEY");

  // 4 steps + 3 gaps = 9.0":  4*1.95 + 3*0.40 = 7.8 + 1.2 = 9.0 ✓
  // Step 4 right: 0.5 + 3*(1.95+0.40) + 1.95 = 0.5 + 7.05 + 1.95 = 9.5 ✓
  // Step bottom:  1.3 + 2.5 = 3.8 ✓   Detail bottom: 4.0 + 0.65 = 4.65 ✓
  const stepW = 1.95, stepH = 2.5, gapW = 0.40;
  const stepY = 1.3;
  const colors = BRAND.palette;

  const steps = [
    { icon: icons.targetW, color: colors[0], num: "01", title: "Assess",  desc: "Inventory current workloads & dependencies" },
    { icon: icons.cogsW,   color: colors[1], num: "02", title: "Design",  desc: "Architecture planning & migration patterns" },
    { icon: icons.cloudW,  color: colors[2], num: "03", title: "Migrate", desc: "Phased workload lift-and-shift" },
    { icon: icons.checkW,  color: colors[3], num: "04", title: "Optimize",desc: "Cost optimization & performance tuning" },
  ];

  steps.forEach((step, i) => {
    const x = 0.5 + i * (stepW + gapW);

    // Step card
    slide.addShape(RECT, {
      x, y: stepY, w: stepW, h: stepH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    // Colored top strip
    slide.addShape(RECT, {
      x, y: stepY, w: stepW, h: 0.07,
      fill: { color: step.color }, line: { type: "none" },
    });

    // Step number (top-left inside card)
    slide.addText(step.num, {
      x: x + 0.1, y: stepY + 0.12, w: 0.5, h: 0.28,
      fontFace: BODY_FONT, fontSize: 9, bold: true,
      color: step.color, margin: 0,
    });

    // Icon circle (centered)
    addIconCircle(slide, {
      x: x + (stepW - 0.6) / 2, y: stepY + 0.22,
      size: 0.6, circleColor: step.color, iconData: step.icon, pad: 0.13,
    });

    // Step title
    slide.addText(step.title, {
      x, y: stepY + 1.0, w: stepW, h: 0.38,
      fontFace: HEADER_FONT, fontSize: 14, bold: true,
      color: BRAND.darkText, align: "center", margin: 0,
    });

    // Step description
    slide.addText(step.desc, {
      x: x + 0.1, y: stepY + 1.42, w: stepW - 0.2, h: 0.85,
      fontFace: BODY_FONT, fontSize: 10,
      color: BRAND.medText, align: "center", margin: 0,
    });

    // Connector line to next step
    if (i < steps.length - 1) {
      const lineX = x + stepW + 0.05;
      slide.addShape(LINE, {
        x: lineX, y: stepY + stepH / 2,
        w: gapW - 0.1, h: 0,
        line: { color: BRAND.redAccent, width: 1.5 },
      });
    }
  });

  // Detail callout below steps
  slide.addShape(RECT, {
    x: 0.5, y: 4.0, w: 9.0, h: 0.65,
    fill: { color: BRAND.subtleBg },
    line: { color: BRAND.cardBorder, width: 0.5 },
  });
  slide.addText(
    "Each phase includes stakeholder sign-off, runbook validation, and rollback readiness testing before proceeding.",
    {
      x: 0.7, y: 4.08, w: 8.6, h: 0.49,
      fontFace: BODY_FONT, fontSize: 10.5,
      color: BRAND.medText, valign: "middle", margin: 0,
    }
  );
}

// ── Slide 6: Big Number / Stat Callouts ──────────────────────

function addMetricsSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.slideBg };
  addHeaderBar(slide, "SUCCESS METRICS", "TARGET STATE 2026");

  // 4 stat cards in a row.  4*2.1 + 3*0.2 = 8.4 + 0.6 = 9.0 ✓
  // Card bottom: 1.4 + 3.0 = 4.4 ✓
  const cardW = 2.1, cardH = 3.0, gap = 0.2;
  const startX = 0.5, startY = 1.4;

  const stats = [
    { icon: icons.dollarW, color: BRAND.redAccent, number: "40%",   label: "Cost Reduction",  desc: "vs. on-premise TCO" },
    { icon: icons.rocketW, color: BRAND.blue,       number: "99.99%",label: "Platform SLA",    desc: "Guaranteed uptime" },
    { icon: icons.usersW,  color: BRAND.teal,       number: "500+",  label: "Dev Teams",       desc: "Self-service adoption" },
    { icon: icons.clockW,  color: BRAND.amber,      number: "3×",    label: "Deploy Speed",    desc: "Feature delivery velocity" },
  ];

  stats.forEach((stat, i) => {
    const x = startX + i * (cardW + gap);

    // Card
    slide.addShape(RECT, {
      x, y: startY, w: cardW, h: cardH,
      fill: { color: BRAND.cardBg },
      line: { color: BRAND.cardBorder, width: 0.5 },
      shadow: cardShadow(),
    });

    // Colored top strip
    slide.addShape(RECT, {
      x, y: startY, w: cardW, h: 0.07,
      fill: { color: stat.color }, line: { type: "none" },
    });

    // Icon circle (centered)
    addIconCircle(slide, {
      x: x + (cardW - 0.55) / 2, y: startY + 0.25,
      size: 0.55, circleColor: stat.color, iconData: stat.icon,
    });

    // Big number
    slide.addText(stat.number, {
      x, y: startY + 1.0, w: cardW, h: 0.8,
      fontFace: HEADER_FONT, fontSize: 34, bold: true,
      color: stat.color, align: "center", margin: 0,
    });

    // Label
    slide.addText(stat.label, {
      x, y: startY + 1.82, w: cardW, h: 0.38,
      fontFace: HEADER_FONT, fontSize: 11, bold: true,
      color: BRAND.darkText, align: "center", margin: 0,
    });

    // Description
    slide.addText(stat.desc, {
      x: x + 0.1, y: startY + 2.22, w: cardW - 0.2, h: 0.55,
      fontFace: BODY_FONT, fontSize: 9.5,
      color: BRAND.medText, align: "center", margin: 0,
    });
  });
}

// ── Slide 7: Dark Closing ─────────────────────────────────────

function addClosingSlide(pres, icons) {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.charcoal };

  // Decorative red shapes (dimmer — Redwood dark mode bookend)
  slide.addShape(ELLIPSE, {
    x: -1.5, y: 3.2, w: 4.5, h: 4.5,
    fill: { color: BRAND.redAccent, transparency: 65 }, line: { type: "none" },
  });
  slide.addShape(ELLIPSE, {
    x: 7.5, y: -1.2, w: 3.5, h: 3.5,
    fill: { color: BRAND.redAccent, transparency: 60 }, line: { type: "none" },
  });

  // Heading
  slide.addText("Ready to Transform?", {
    x: 0.8, y: 1.2, w: 8.4, h: 0.9,
    fontFace: HEADER_FONT, fontSize: 36, bold: true,
    color: "FFFFFF", align: "center", margin: 0,
  });

  // Subtext
  slide.addText(
    "Partner with us to accelerate your cloud journey and unlock new possibilities.",
    {
      x: 1.5, y: 2.2, w: 7.0, h: 0.6,
      fontFace: BODY_FONT, fontSize: 13,
      color: "D4CFC9", align: "center", margin: 0,
    }
  );

  // CTA button
  slide.addShape(RECT, {
    x: 3.5, y: 3.15, w: 3.0, h: 0.62,
    fill: { color: BRAND.redAccent }, line: { type: "none" },
  });
  slide.addText("Request a Demo", {
    x: 3.5, y: 3.15, w: 3.0, h: 0.62,
    fontFace: HEADER_FONT, fontSize: 13, bold: true,
    color: "FFFFFF", align: "center", valign: "middle", margin: 0,
  });

  // Bottom 3-column summary icons
  const summaryItems = [
    { icon: icons.rocketW, label: "Fast Onboarding" },
    { icon: icons.shieldW, label: "Enterprise Security" },
    { icon: icons.chartW,  label: "Measurable ROI" },
  ];
  const itemW = 2.5;
  const itemStartX = (10 - summaryItems.length * itemW) / 2;  // centered

  summaryItems.forEach((item, i) => {
    const x = itemStartX + i * itemW;
    const y = 4.05;  // bottom of items: 4.05 + 0.55 + 0.25 = 4.85 < 5.075 ✓

    addIconCircle(slide, {
      x: x + (itemW - 0.45) / 2, y,
      size: 0.45, circleColor: BRAND.redAccent, iconData: item.icon, pad: 0.1,
    });

    slide.addText(item.label, {
      x, y: y + 0.5, w: itemW, h: 0.28,
      fontFace: BODY_FONT, fontSize: 9.5,
      color: "A39E98", align: "center", margin: 0,
    });
  });
}

// ── Run ───────────────────────────────────────────────────────

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
