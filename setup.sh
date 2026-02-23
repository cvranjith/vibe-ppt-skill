#!/usr/bin/env bash
# setup.sh — One-command setup for the Vibe PPT skill
# Run this once after cloning/copying to a new machine.
# Usage: bash setup.sh

set -euo pipefail

echo "════════════════════════════════════════"
echo "  Vibe PPT Skill — Setup"
echo "════════════════════════════════════════"
echo ""

# ── Node.js ─────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌  Node.js not found."
  echo "    Install from https://nodejs.org  (v18+ recommended)"
  exit 1
fi
NODE_VER=$(node --version)
echo "✅  Node.js $NODE_VER"

# ── npm packages ─────────────────────────────────────────────
echo ""
echo "Installing npm packages..."
npm install
echo ""

# ── Verify ──────────────────────────────────────────────────
node scripts/verify-setup.js

echo ""
echo "════════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  Open this folder in Claude Code and"
echo "  paste your presentation content to begin."
echo "════════════════════════════════════════"
echo ""
echo "Optional QA tools (install for visual verification):"
echo "  pip install 'markitdown[pptx]' --break-system-packages"
echo "  brew install --cask libreoffice"
echo "  brew install poppler"
