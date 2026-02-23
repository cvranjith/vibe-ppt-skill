# Vibe PPT Skill

A Claude Code skill for generating visually engaging, professionally designed PowerPoint presentations. Produces custom-designed `.pptx` files — not cookie-cutter templates.

---

## Philosophy

> **Vibe PPT, not Template PPT.** Every deck is custom-designed. Layout choices are made per slide based on content type, not forced from a fixed grid.

---

## Installation

### Prerequisites
- Node.js v18+
- Claude Code (claude.ai/code)

### One-command setup
```bash
bash setup.sh
```

This installs all npm packages and verifies the environment.

### Optional QA tools (recommended)
```bash
pip install "markitdown[pptx]" --break-system-packages   # content QA
brew install --cask libreoffice                            # visual QA
brew install poppler                                       # slide image rendering
```

---

## Usage

Open this folder in Claude Code, then paste your presentation content:

```
Create a presentation about [your topic]:

[Your content here — bullet points, paragraphs, data, whatever you have]
```

Claude will:
1. **Plan** — propose slides, layouts, and structure
2. **Confirm** — wait for your approval or edits
3. **Generate** — produce the `.pptx` file
4. **QA** — run a visual quality check loop
5. **Deliver** — output to `./output/<topic>/<title>-v1.pptx`

When you iterate ("make slide 3 bigger", "change the colour"), Claude increments the version automatically — `v1`, `v2`, `v3` — so nothing is overwritten.

---

## Output Location

All decks are saved to:
```
output/
└── <topic-slug>/
    ├── <deck-title>-v1.pptx
    ├── <deck-title>-v2.pptx   ← iterations
    └── <deck-title>-v3.pptx
```

---

## Project Structure

```
ppt-gen/
├── CLAUDE.md                   # Claude Code instructions (skill brain)
├── SKILL.md                    # Design philosophy, layouts, colour system
├── pptxgenjs-reference.md      # PptxGenJS API reference
├── setup.sh                    # One-command install
├── package.json                # npm dependencies
├── lib/
│   ├── theme.js                # Colour constants, dimensions, shadows
│   ├── icons.js                # Font Awesome → base64 PNG rendering
│   ├── shapes.js               # Reusable layout helpers
│   └── output.js               # Versioned output path management
├── scripts/
│   └── verify-setup.js         # Dependency verification
├── examples/
│   └── generate-template.js    # Working example — all layout types
├── assets/                     # Drop logo.png here for footer branding
└── output/                     # Generated decks (auto-created)
```

---

## Corporate Branding

Drop your company logo at `assets/logo.png`. Branding customisation (colours, fonts, logo placement) is configured in `lib/theme.js`.

---

## Default Theme

Oracle Redwood Light by default. Dark mode available per-slide or full-deck when requested.
