#!/usr/bin/env bash
# qa.sh — QA helpers for PPTX output
# Usage: bash qa.sh [output.pptx] [slide_number]
#
# Examples:
#   bash qa.sh output.pptx           # Full QA (content + visual)
#   bash qa.sh output.pptx 3         # Visual QA of slide 3 only

set -euo pipefail

FILE="${1:-output.pptx}"
SLIDE_NUM="${2:-}"
BASE="${FILE%.pptx}"
QA_DIR="qa_images"

if [[ ! -f "$FILE" ]]; then
  echo "❌  File not found: $FILE"
  exit 1
fi

echo "════════════════════════════════════════"
echo "  PPT QA: $FILE"
echo "════════════════════════════════════════"

# ── Content QA ──────────────────────────────────────────────────
echo ""
echo "── Content QA (text extraction) ────────"
if python3 -m markitdown "$FILE" 2>/dev/null; then
  echo ""
  echo "✅  Content extracted. Check above for: missing text, typos, wrong order."
else
  echo "⚠️   markitdown not available."
  echo "    Install: pip install 'markitdown[pptx]' --break-system-packages"
fi

# ── Visual QA ───────────────────────────────────────────────────
echo ""
echo "── Visual QA (slide images) ─────────────"

if ! command -v soffice &>/dev/null; then
  echo "⚠️   LibreOffice not found — visual QA unavailable."
  echo "    Install: brew install --cask libreoffice"
  echo ""
  echo "── Manual coordinate check (fallback) ──"
  echo "    Verify: no element y+h > 5.075 (footer zone)"
  echo "    Verify: no element x+w > 9.5  (right margin)"
  exit 0
fi

if ! command -v pdftoppm &>/dev/null; then
  echo "⚠️   pdftoppm not found."
  echo "    Install: brew install poppler"
  exit 0
fi

# Convert PPTX → PDF
echo "Converting $FILE → PDF..."
soffice --headless --convert-to pdf "$FILE" 2>/dev/null
PDF="${BASE}.pdf"

# Convert PDF → JPG images
mkdir -p "$QA_DIR"

if [[ -n "$SLIDE_NUM" ]]; then
  # Single slide
  echo "Rendering slide $SLIDE_NUM..."
  pdftoppm -jpeg -r 150 -f "$SLIDE_NUM" -l "$SLIDE_NUM" "$PDF" "$QA_DIR/slide"
  echo "✅  Image saved: $QA_DIR/slide-$(printf '%02d' "$SLIDE_NUM").jpg"
else
  # All slides
  echo "Rendering all slides..."
  pdftoppm -jpeg -r 150 "$PDF" "$QA_DIR/slide"
  COUNT=$(ls "$QA_DIR"/slide-*.jpg 2>/dev/null | wc -l | tr -d ' ')
  echo "✅  $COUNT slide images saved in $QA_DIR/"
  ls "$QA_DIR"/slide-*.jpg
fi

echo ""
echo "── Visual checklist ────────────────────"
echo "  Look for these issues in each image:"
echo "  □  Overlapping elements"
echo "  □  Text cut off at box edges"
echo "  □  Content below y:5.075\" (footer zone)"
echo "  □  Content above y:0.55\" (top margin)"
echo "  □  Elements closer than 0.3\" apart"
echo "  □  Process flow steps clipped at right edge"
echo "  □  Low-contrast text (light on light, dark on dark)"
echo "  □  Misaligned columns or cards"
