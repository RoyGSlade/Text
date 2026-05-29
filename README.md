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

### Milestone 2.1: Starter Skill Selection & Deterministic Checks (Completed)
- **Wizard Skill Selections**: Added dynamic Starter Skill selection cards rendering directly from `window.IAG_DATA.races[selectedRaceId].skill_options`.
- **Validation Constraints**: Upgraded verification gating; character naming, species selection, profession selection, and starter skill specialization must all be active before identity confirmation.
- **Active Skills HUD**: Populated selected skills and their corresponding ranks inside the left sidebar character dashboard under a newly styled "Specialized Skills" sub-panel.
- **Seeded d20 Engine Checks**: Integrated the gamebook engine `{ type: "skillCheck" }` narrative effect executing d20 rolls against challenge rating DC 10 with full dynamic modifier lookups.
- **Quest Branching Options**: Rewrote the Relay Exterior platform choices to support Mechanics checks that log roll totals deterministically, set success/failure world flags, and unlock bypass paths.
- **Inspector Debugger**: Added d20 check history display panels to the developer notes drawer for quick testing.

### Milestone 3A: Attribute-Aware Skill Checks & Cleaner Check Logging (Completed)
- **Attribute-Aware Skill Checks**: Integrated character attribute bonuses directly into d20 calculations (Total = d20 roll + skill rank + attribute bonus) dynamically looked up from `window.IAG_DATA.skill_definitions`.
- **Seeded d20 Roll Cancellation**: Implemented Advantage/Disadvantage cancellation rules (if both are active, they cancel out, returning to a standard 1d20 roll) while preserving Mulberry32 deterministic counter progress.
- **Richer narrative check logging**: Refactored `{ type: "skillCheck" }` narrative effects to log detailed roll formulas directly to the action history (e.g., `Mechanics check vs DC 10: d20 [Roll] + skill [Rank] + [Attribute] [Bonus] = [Total]. SUCCESS!`).
- **Interactive Alternate Checks**: Added a technology-based firmware-decryption check Option (`Analyze the relay terminal firmware`, Technology DC 11) alongside the Mechanics check.
- **Multi-Flag Choice Gating**: Added support for `worldFlagAny` in choice requirements to allow alternate bypass paths (e.g., bypass the door if either `relay_panel_understood` OR `relay_firmware_understood` is true).
- **Richer Developer Inspector Drawer**: Expanded `#dev-last-skill-check` to print complete dice pools, attribute modifiers, advantage/disadvantage statuses, and final formula breakdowns.
- **Dynamic Descriptions**: Pulled localized skill descriptions directly from the static rulebook into onboarding cards.

### Milestone 3B: Progression & Inventory Systems (Completed)
- **Visual Equipment Slots**: Added visual grid representing body slots (`Head`, `Neck`, `Ears`, `Torso`, `Wrists`, `Hands`, `Pants`, `Shoes`, `Pockets`) in the left sidebar HUD.
- **Categorized Expandable Backpack**: Designed an expandable backpack menu grouped into logical supply categories (`Gear`, `Utilities`, `Consumables`, `Materials`, `All`) with glowing rarity borders and detailed item properties.
- **Interactive Equipment Actions**: Implemented context-sensitive actions (`Equip`, `Unequip`, `Use`, `Drop`) that transfer items seamlessly between backpack and slots, dynamically recalculating attributes and movement speed buffs.
- **Skill Experience Popouts**: Bound click handlers to specialized skills in the HUD sidebar to launch glassmorphic detail popout panels tracking successes to the next rank (`0 / 10 successes`) with visual progress indicators and Level 1-5 perk trees.
- **Profession & Leveling Popouts**: Integrated profession leveling and character progression popouts clickable from the sidebar HUD. Profession perks unlock dynamically based on leveling parameters.
- **Deterministic Level-Up Triggers**: Programmed character level-ups to auto-recalculate upon skill upgrades, dynamically enhancing max HP vital integrity and outputting detailed notifications.

### Upcoming Milestones
- **Milestone 4**: Interactive gamebook story effects and quest flags.
- **Milestone 5**: Full turn-based action grid combat.
- **Milestone 6**: Superpowers integration (e.g. Neural Influence Mind Manipulation).

