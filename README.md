# Vibe PPT Skill

A Claude Code skill for generating visually engaging, professionally designed PowerPoint presentations. Produces custom-designed `.pptx` files — not cookie-cutter templates.

---

## Philosophy

> **Vibe PPT, not Template PPT.** Every deck is custom-designed. Layout choices are made per slide based on content type, not forced from a fixed grid.

---

## Setup on a New Machine

### Prerequisites
- Node.js v18+
- Claude Code (claude.ai/code)

### Step 1 — Extract the skill

Place the skill folder anywhere on your machine. Recommended location for use as a persistent Claude Code skill:

```bash
mkdir -p ~/.claude/skills
# extract vibe-ppt-skill.zip here:
unzip vibe-ppt-skill.zip -d ~/.claude/skills/vibe-ppt
cd ~/.claude/skills/vibe-ppt
```

Or just extract to any working folder:
```bash
unzip vibe-ppt-skill.zip -d ~/vibe-ppt
cd ~/vibe-ppt
```

### Step 2 — Install dependencies

```bash
bash setup.sh
```

This installs all npm packages (`pptxgenjs`, `react-icons`, `sharp`) and verifies the environment.

### Step 3 — Open in Claude Code

```bash
claude .
```

Claude Code reads `CLAUDE.md` automatically and understands the skill. Paste your presentation content and say "create a deck for this".

### Optional QA tools

```bash
pip install "markitdown[pptx]" --break-system-packages   # content QA
brew install --cask libreoffice                            # visual QA (macOS)
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
    ├── work/
    │   └── gen.js            ← runtime script (gitignored)
    ├── <deck-title>-v1.pptx
    ├── <deck-title>-v2.pptx  ← iterations
    └── <deck-title>-v3.pptx
```

---

## Project Structure

```
vibe-ppt/
├── CLAUDE.md                   # Claude Code instructions (skill brain)
├── SKILL.md                    # Design philosophy, layouts, colour system
├── pptxgenjs-reference.md      # PptxGenJS API reference
├── setup.sh                    # One-command install
├── qa.sh                       # Visual QA helper
├── package.json                # npm dependencies
├── lib/
│   ├── theme.js                # Brand colours, SLIDE dimensions, fonts
│   ├── icons.js                # Font Awesome → base64 PNG rendering
│   ├── shapes.js               # addHeaderBar, addCard, addIconCircle, etc.
│   ├── branding.js             # addBrandingBg, addBrandingFooter (Oracle branding)
│   ├── output.js               # Versioned output path management
│   └── layouts/
│       ├── index.js            # Re-exports all layout modules
│       ├── title-slide.js
│       ├── three-column.js
│       ├── card-grid.js
│       ├── process-flow.js
│       ├── icon-rows.js
│       ├── stat-callouts.js
│       ├── split-layout.js
│       └── dark-closing.js
├── scripts/
│   └── verify-setup.js         # Dependency verification
├── examples/
│   └── generate-template.js    # Working example — all layout types
└── assets/
    └── background/
        ├── logo.png            # Company logo (title slide)
        ├── o-tag.png           # Footer icon
        ├── left-margin-01.png  # Left strip decoration
        ├── left-margin-02.png
        ├── light-abstract-01.png  # Abstract title slide backgrounds
        ├── light-abstract-02.png
        └── light-abstract-03.jpg
```

---

## Corporate Branding

- **Logo**: `assets/background/logo.png` — displayed on title slides
- **Footer icon**: `assets/background/o-tag.png` — bottom-right on every slide
- **Left strip**: `assets/background/left-margin-NN.png` — decorative left edge
- **Abstract bg**: `assets/background/light-abstract-NN.png` — title slide background
- **Colours / fonts**: `lib/theme.js`

---

## Default Theme

Oracle Redwood Light by default. Dark mode available per-slide or full-deck when requested.
