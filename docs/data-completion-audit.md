# Database Completion Audit & Requirements Verification

This document audits the integration state of the structured JSON assets located under `/Text/data/` to track requirements for full game completion.

---

## Directory Schema Mapping

The raw database assets from `data/raw/` have been organized into the following production folders under `data/` for clean modular mapping:

| Target Directory | Asset Purpose | Organized Database Files |
| :--- | :--- | :--- |
| **`data/system/`** | Core engine metrics, enums, limits, and progression paths | `leveling.json`, `rpg_rules.json`, `talents.json`, `trainings.json`, `skill_aliases.json`, `statuses.json` |
| **`data/characters/`** | Rules governing species, profession tiers, and skill trees | `races.json`, `professions.json`, `skills.json` |
| **`data/gear_crafting/`** | Catalog of armors, weapons, materials, blueprints, and build paths | `items.json`, `armor.json`, `recipes.json`, `packs/` |
| **`data/world_narrative/`** | Story nodes, maps, vendors, enemies, and regional expansions | `story.json`, `world.json`, `biomes.json`, `vendors.json`, `home.json`, `enemies.json`, `encounters/`, `blackridge/` |

---

## Complete Audit Matrix & Integration Progress

To achieve 100% full game completion, all modular raw databases must be fully integrated. Below is the active tracking matrix mapping what is currently integrated, partially in use, or staged for upcoming milestones:

### 1. Core RPG System Configurations (`data/system/`)

| Database File | Status | Runtime Integration Details | Completion Gaps |
| :--- | :--- | :--- | :--- |
| **`leveling.json`** | **Fully Integrated** | Full 30 levels mapped inside `window.IAG_DATA.leveling` and evaluated dynamically in `IAG_ENGINE.checkCharacterLevelUp()`. | None. |
| **`rpg_rules.json`** | **Partially Integrated** | Success thresholds `[0, 5, 10, 20, 30, 50]` actively bound to skill levels. Attribute min/max values are configured. | Action economy and stamina/focus rules staged for Milestone 5 (Combat). |
| **`skill_aliases.json`** | **Staged** | Mapping database of legacy skill definitions. | Staged for custom skill training expansions. |
| **`statuses.json`** | **Staged** | Buffs/Debuffs (Stunned, Poisoned, Bleeding) and durational limits. | Staged for Milestone 5 turn-based combat. |
| **`talents.json`** | **Staged** | Active combat talents and stamina/focus matrices. | Staged for Milestone 5 turn-based combat. |
| **`trainings.json`** | **Staged** | Academy majors and skill-to-attribute progression trees. | Staged for Milestone 4 quest/training upgrades. |

### 2. Player Characters & Skills (`data/characters/`)

| Database File | Status | Runtime Integration Details | Completion Gaps |
| :--- | :--- | :--- | :--- |
| **`races.json`** | **Fully Integrated** | Species bonuses (e.g. Android +2 INT, Saronian +2 WIS), movement, vision, special traits, and starter skill matrices. | None. |
| **`professions.json`** | **Fully Integrated** | All 12 classes start with customized credits, professional passives, descriptions, and 5-level passive tiers that unlock dynamically with Character Level. | None. |
| **`skills.json`** | **Fully Integrated** | Ranks 1-5 detailed unlock perks for active starter skills mapped dynamically to user progress popouts. | Other non-starter skills staged for quest milestones. |

### 3. Inventory & Gear Mechanics (`data/gear_crafting/`)

| Database File | Status | Runtime Integration Details | Completion Gaps |
| :--- | :--- | :--- | :--- |
| **`items.json`** | **Partially Integrated** | Core starter weapons (`Worn Utility Knife`), keys (`Cracked Data Chip`), and specialized kits (`Rooftop Kit`) mapped. | Crafting and remaining items staged for Milestone 4 (Exploration). |
| **`armor.json`** | **Partially Integrated** | Standard clothing and armors (`Standard Jumpsuit`, `Work Boots`, `Flak Vest`, `Security Helmet`) active, supporting stats changes. | Heavy armor and speed penalty matrices staged for Combat. |
| **`recipes.json`** | **Staged** | Material lists and craft times for building blueprints. | Staged for Milestone 4 (Exploration/Home upgrades). |
| **`packs/`** | **Staged** | Blueprint inputs and resources packs definitions. | Staged for Crafting milestones. |

### 4. World & Narrative Matrices (`data/world_narrative/`)

| Database File | Status | Runtime Integration Details | Completion Gaps |
| :--- | :--- | :--- | :--- |
| **`story.json`** | **Partially Integrated** | Baseline 5-scene timeline (Arrival, Town Square, Relay Exterior, NPC, Locked Door) integrated inside `story.js`. | Expanding narrative paths for external sectors. |
| **`world.json`** | **Staged** | Planetary settings and galactic time cycles. | Staged for space/exploration segments. |
| **`biomes.json`** | **Staged** | regional settings for outer wilderness nodes. | Staged for travel/biome modules. |
| **`vendors.json`** | **Staged** | Pricing scaling matrices and regional shops. | Staged for trade milestones. |
| **`home.json`** | **Staged** | Kitchen expansions and player home upgrades. | Staged for Home base upgrades. |
| **`enemies.json`** | **Staged** | NPC threat sheets, baseline speed, damage profiles, and loot. | Staged for Milestone 5 turn-based combat. |
| **`encounters/`** | **Staged** | Random step-tables for biomes exploration. | Staged for traveling exploration tables. |
| **`blackridge/`** | **Staged** | Massive 50-file quest, NPC schedules, and story matrix module. | Staged for full Blackridge city timeline integration. |

---

## Summary of Integration & Path to Game Completion

To complete the full Infinite Ages text game loop, we must transition the **Staged** modules into **Integrated** status across subsequent releases:
1. **Milestone 4 (Exploration & Upgrades)**: Integrate `recipes.json`, `home.json`, `vendors.json`, `trainings.json` and expand `items.json` lists to fully populate player trade and crafting.
2. **Milestone 5 (Turn-Based Combat)**: Integrate `enemies.json`, `statuses.json`, `talents.json`, and `rpg_rules.json` combat subsystems to build the grid-action simulation.
3. **Milestone 6 (Superpowers & Blackridge Expansion)**: Integrate `blackridge/` directory and `powers/` manifest files to complete the deep adventure quest line and telepathy mechanics.
