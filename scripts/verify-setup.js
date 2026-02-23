#!/usr/bin/env node
"use strict";

// ============================================================
// verify-setup.js
// Checks that all required packages are resolvable.
// Run: node scripts/verify-setup.js
// ============================================================

const required = [
  "pptxgenjs",
  "react",
  "react-dom",
  "react-icons/fa",
  "sharp",
];

let allOk = true;

for (const pkg of required) {
  try {
    require(pkg);
    console.log(`  ✅  ${pkg}`);
  } catch {
    console.error(`  ❌  ${pkg}  ← missing`);
    allOk = false;
  }
}

if (!allOk) {
  console.error("\nRun: npm install");
  process.exit(1);
}

// Verify output directory is writable
const fs   = require("fs");
const path = require("path");
const outDir = path.join(__dirname, "..", "output");
fs.mkdirSync(outDir, { recursive: true });

console.log("\n✅  All packages OK.");
console.log("✅  Output directory ready:", outDir);
console.log("\nOptional QA tools:");
checkCommand("python3 -m markitdown --version", "markitdown (content QA)");
checkCommand("soffice --version",               "LibreOffice (visual QA)");
checkCommand("pdftoppm -v",                     "pdftoppm/poppler (visual QA)");

function checkCommand(cmd, label) {
  const { execSync } = require("child_process");
  try {
    execSync(cmd + " 2>/dev/null", { stdio: "pipe" });
    console.log(`  ✅  ${label}`);
  } catch {
    console.log(`  ⚠️   ${label} — not installed (optional)`);
  }
}
