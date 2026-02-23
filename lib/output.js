"use strict";

// ============================================================
// Output path management
// All generated decks go to: ./output/<topic>/<title>-vN.pptx
// Version is auto-incremented so nothing is overwritten.
// ============================================================

const fs   = require("fs");
const path = require("path");

const OUTPUT_ROOT = path.join(__dirname, "..", "output");

/**
 * Convert free text to a safe filesystem slug (lowercase, hyphens, max 40 chars).
 */
function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/**
 * Resolve the output file path for a new PPTX, auto-incrementing the version.
 *
 * @param {string} briefTitle  - Short topic label → becomes the subfolder
 *                               e.g. "cloud strategy" → output/cloud-strategy/
 * @param {string} deckTitle   - Full deck title → becomes the filename
 *                               e.g. "Cloud Platform Strategy 2026"
 *                               → cloud-platform-strategy-2026-v1.pptx
 * @returns {{ filePath, fileName, dir, version, displayPath }}
 *
 * @example
 *   const out = getOutputPath("cloud strategy", "Cloud Platform Strategy 2026");
 *   await pres.writeFile({ fileName: out.filePath });
 *   console.log("Saved:", out.displayPath);  // output/cloud-strategy/cloud-platform-strategy-2026-v1.pptx
 */
function getOutputPath(briefTitle, deckTitle) {
  const folderSlug = toSlug(briefTitle);
  const fileSlug   = toSlug(deckTitle);
  const dir        = path.join(OUTPUT_ROOT, folderSlug);

  fs.mkdirSync(dir, { recursive: true });

  let version = 1;
  while (fs.existsSync(path.join(dir, `${fileSlug}-v${version}.pptx`))) {
    version++;
  }

  const fileName = `${fileSlug}-v${version}.pptx`;
  return {
    filePath:    path.join(dir, fileName),
    fileName,
    dir,
    version,
    displayPath: `output/${folderSlug}/${fileName}`,
  };
}

module.exports = { getOutputPath, toSlug, OUTPUT_ROOT };
