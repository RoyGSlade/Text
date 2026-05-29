# Infinite Ages: Genesis - Text Adventure Prototype

A browser-based, interactive sci-fi text adventure RPG engine built with pure HTML5, CSS3, and modern Vanilla JS. Designed with an immersive, responsive information dashboard layout inspired by premium sci-fi games like EVE Online.

## Architecture

This project is built using a decoupled modular structure that separates skeleton presentation, visual layouts, game rules, seeded mechanics, state reactivity, and story content.

```
/infinite-ages-text/
  ├── index.html        # App presentation structure (skeleton)
  ├── styles.css        # Immersive glassmorphism and sci-fi layouts
  ├── README.md         # Developer guide and overview
  └── js/
      ├── app.js        # Engine bootstrap and ignition
      ├── data.js       # Static rulebook rules (Races, Professions, Skills)
      ├── engine.js     # Seeded RNG, d20 checks, and dice rolls
      ├── state.js      # Game state reactive model and autosave systems
      ├── story.js      # Choose-your-own-adventure story graph node database
      └── ui.js         # Reactive DOM rendering and input bindings
```

---

## Technical Features

### 1. Zero Dependency Design
No React, no bundlers, no npm, and no external libraries. Built using standard browser APIs:
- **CSS Grid & Flexbox**: Native mobile-responsive, dual-layout dashboards.
- **Mulberry32 RNG Engine**: Fully deterministic seeded random number generators. All dice rolls remain consistent and provably transparent per seed.
- **localStorage Autosave**: Seamless session saving on every state update.
- **Import/Export Save**: Back up or load progress via standalone `.json` files.

---

## How to Run Locally

You can launch and play the game using any standard local web server or directly by opening the file in your browser:

### Option A: Open directly in your browser
Simply locate `/Text/index.html` on your filesystem and open it in Google Chrome, Firefox, Safari, or Microsoft Edge.

### Option B: Run a quick local development server
If you have Python installed, run this terminal command from your workspace directory:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## Milestone Roadmaps & Releases

### Milestone 1: Core Shell (Completed)
- **Playable Story Shell**: Interactive choice progression across 5 starter scenes.
- **Seeded RNG & Dice Roller**: Seed generation and reactive rolling.
- **Robust Save Systems**: Auto-saving to browser storage + explicit JSON export/import.
- **Interactive Cyberpunk Dashboard**: Immersive glassmorphic aesthetics.

### Milestone 2.0B: Character Creation Onboarding & Migration (Completed)
- **Rules Integration**: Fully dynamic Character Creation wizard reading live species and profession data from `window.IAG_DATA` in `js/data.js`.
- **Character Attributes Grid**: Dynamic calculation of attributes, including Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma, with live species-based bonuses.
- **Human Specialization**: Polished attribute selector panel letting human players specialize by picking where their custom `+2` attribute bonus goes.
- **Resilient Save Migration**: Robust `normalizeState(rawState)` middleware that automatically repairs, expands, and updates older saves or exported JSONs to the expanded character format upon load/import.
- **Interactive Timeline Gating**: Strict story-choice locking and gating mechanism that blocks entry into the station story stream until the player verifies and confirms their character profile.
- **Expanded Character HUD**: Re-designed left sidebar HUD displaying Level, Credits, HP, Attributes, Movement Speed, Vision Type, Resistance, and Special Traits.

### Upcoming Milestones
- **Milestone 3**: Skill checks based on attributes, advantage/disadvantage modifier calculations.
- **Milestone 4**: Interactive gamebook story effects and quest flags.
- **Milestone 5**: Full turn-based action grid combat.
- **Milestone 6**: Superpowers integration (e.g. Neural Influence Mind Manipulation).
