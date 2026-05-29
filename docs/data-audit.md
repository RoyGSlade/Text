# Data Audit & Runtime Normalization Report

This document reports on the audit and normalization of the Infinite Ages raw configuration dataset to establish a robust, standardized, and clean runtime data layer under `window.IAG_DATA` within [data.js](file:///home/roygslade/Desktop/Text/js/data.js).

---

## 1. Raw Files Reviewed
The following raw source configuration files from `data/raw/` were thoroughly inspected:
- **`data/raw/races.json`**: Initial attributes, skills, and profiles for Android, Human, Kilmerian, and Saronian character templates.
- **`data/raw/professions.json`**: Starting credit balances, passive abilities, and 5-level unlocks across various professions.
- **`data/raw/data/leveling.json`**: Global leveling matrix containing XP/points growth pathways, attribute increases, and action budgets.
- **`data/raw/data/powers/manifest.json`**: Manifest referencing school modules.
- **`data/raw/data/powers/mind_manipulation.json`**: Module detailing the Mind Manipulation spell/powers dataset.
- **`data/raw/blackridge/locations/towns.json`**: Grid mappings, entries, and building keys for towns.
- **`data/raw/blackridge/quests/guild/quest.guild.tutorial-commission.json`**: Stage objective guidelines, checks, and completions for tutorial quests.
- **`data/raw/blackridge/locations/town_scenes.json`**: Narrative choices, conditional branching requirements, and action impacts for regional zones.

---

## 2. Normalized Runtime Subset
To keep memory usage minimal and prevent clutter, only a curated subset of critical components has been normalized and loaded into `window.IAG_DATA`:
- **Races (4)**: `android`, `human`, `kilmerian`, `saronian`.
- **Professions (6)**: `astronomer`, `doctor`, `software_engineer_mathematician`, `engineer`, `bounty_hunter`, `mechanic`.
- **Leveling Table**: Levels 1 through 5 only.
- **Powers (2)**: `mind_manipulation.telepathy`, `mind_manipulation.pacify`.
- **Towns (1)**: `blackridge`.
- **Quests (1)**: `quest.guild.tutorial-commission`.
- **Scenes (3)**: `town:blackridge:well`, `town:blackridge:well_package_found`, `town:blackridge:forest_outskirts`.

---

## 3. Quarantine Strategy (Unused Raw Folders)
For stability and strict scope control, several folders containing complex narrative graphs and advanced mechanical definitions have been kept **quarantined** and excluded from the runtime memory footprint for now:
- **`data/raw/blackridge/quests/espionage/`**: Hidden narrative and quest definitions related to espionage (e.g., `the_lever` quest logic).
- **`data/raw/blackridge/buildings/`**: Full interior building properties, sub-shops, and custom building NPCs.
- **`data/raw/data/powers/` (all except mind_manipulation)**: Modules such as air manipulation, superspeed, force projection, burn control, and teleportation are safely isolated until character levels exceed 5.
- **`data/raw/blackridge/locations/` (all except towns and selected town_scenes)**: Regional wild zone grids and deep forest sector cells.

---

## 4. Known Schema Problems & Actions Taken
During the audit, several schema discrepancies and code smell issues were identified in the raw JSON files. We corrected these in our normalization pipeline:

| Original Issue | Corrective Normalization Action taken in `js/data.js` |
| :--- | :--- |
| **Inconsistent Case Casing**: Property names mixed `camelCase` (e.g., `startingCredits`, `activationCost`) and dot notation inside IDs. | Standardized all structural keys, property names, and object indexes strictly to `lower_snake_case`. |
| **Stringified Movement Units**: Movement values were formatted as strings with custom unit suffixes (e.g. `"40ft"`, `"45ft"`). | Extracted and parsed all strings, storing movement strictly as clean numeric values (`40`, `45`) to facilitate future grid calculations. |
| **Inconsistent Skill Array Casing**: Race skills used TitleCase arrays (`["Medical", "Mechanics"]`). | Standardized all skill options array entries to unified `lower_snake_case` (e.g., `["medical", "mechanics"]`). |
| **Dictionary-based abilities**: Profession level benefits were structured as dictionary strings indexed by string levels `"1"`, `"2"`, etc. | Flattened dictionary lists into a streamlined 0-indexed `level_benefits` array where benefit at index `i` maps to `Level i+1`. |

---

## 5. Recommended Next Milestone
For **Milestone 2.0B**, we recommend:
1. **Character Creation Integration**: Design a premium, highly-styled character selection interface letting users select from the newly normalized races and professions.
2. **Stat Engine Connection**: Connect the leveling, credit balances, and race attribute adjustments directly into `js/state.js` so that choosing a template dynamically adjusts structural integrity, credit reserves, and abilities on the dashboard panels.
