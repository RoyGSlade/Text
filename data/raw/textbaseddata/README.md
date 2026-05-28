# Raw Data Inspection & Analysis Report

This report provides an in-depth analysis of the raw JSON files copied into the repository, identifying key schemas, suitability for upcoming development milestones, inconsistencies, and recommended normalization paths.

---

## 1. List of Every Copied JSON File & Content Summary

The raw files are grouped by logical components. Below is the mapping of every copied JSON file and what it appears to contain:

### Core Rules & Mechanics
*   **[rpg_rules.json](file:///home/roygslade/Desktop/Text/data/raw/rpg_rules.json)**: Global configuration limits and thresholds. Defines action economy, stamina/focus regeneration, standard status enums, skill-to-attribute mappings, and absolute stat ceilings (e.g., `levelMax: 30`, `creditsMax: 1000000`).
*   **[data/leveling.json](file:///home/roygslade/Desktop/Text/data/raw/data/leveling.json)**: A 30-level progression matrix specifying exactly when players receive attribute bumps, HP increases, new trainings, actions/reactions (`1A 1R`, `2A 1R`, `3A 2R`), or profession breakthroughs.

### Character Creation Data
*   **[races.json](file:///home/roygslade/Desktop/Text/data/raw/races.json)**: Standard races (Android, Human, Kilmerians, Saronians) containing movement speeds, unique vision types, elemental/environmental resistances, age boundaries, hard attribute bonuses, and permitted skill-choice categories.
*   **[professions.json](file:///home/roygslade/Desktop/Text/data/raw/professions.json)**: Defines 12 playable classes (Astronomer, Software Engineer, Doctor, Bounty Hunter, etc.) complete with starting credits, professional passives, narrative descriptions, and an tier-based (1–5) list of progression abilities.
*   **[trainings.json](file:///home/roygslade/Desktop/Text/data/raw/trainings.json)**: Educational backgrounds/specializations (e.g., Aviator School, Interpersonal Studies, Scientific Academy) providing a baseline Armor Rating, Initiative bonus, HP modifier, and several optional "Majors" which map skill progression directly to attribute growth.
*   **[persona_presets.json](file:///home/roygslade/Desktop/Text/data/raw/persona_presets.json)**: Large list of descriptive presets including personality archetypes, motivations, life hardships, long-term goals, empathy indices, and appearance traits to enrich background generation.

### Skills & Combat Abilities
*   **[skills.json](file:///home/roygslade/Desktop/Text/data/raw/skills.json)**: The master list of 24 player skills, assigning their controlling attribute, basic descriptions, and level-by-level unlock details (levels 1 to 5).
*   **[data/skills.json](file:///home/roygslade/Desktop/Text/data/raw/data/skills.json)**: Mechanical data adjustments / overrides for combat skills at higher levels (`Melee`, `Gunning`, `Navigation`, `Perception`).
*   **[data/skill_aliases.json](file:///home/roygslade/Desktop/Text/data/raw/data/skill_aliases.json)**: A mapping of legacy or alternative names (e.g. `Ranged`, `Speech`, `Business`) to standard canonical skill references.
*   **[talents.json](file:///home/roygslade/Desktop/Text/data/raw/talents.json)**: Active combat talents (e.g., `quick_strike`, `block`, `focus_mind`) detailing stamina cost, cooldown turns, and numeric status effects.
*   **[data/statuses.json](file:///home/roygslade/Desktop/Text/data/raw/data/statuses.json)**: Buffs/Debuffs (Stunned, Poisoned, Energized, Bleed, etc.) specifying durational limits and direct mathematical modifiers (`actions: -1`, `hpRegen: -1`).

### Powers & Superpowers
*   **[data/powers/manifest.json](file:///home/roygslade/Desktop/Text/data/raw/data/powers/manifest.json)**: Index list of active power-school JSON resource files.
*   **Individual Power Files (12 files)**:
    *   `air_manipulation.json`, `burn.json`, `burn_control.json`, `dimensional_manipulation.json`, `force_projection.json`, `mind.json`, `mind_manipulation.json`, `power_drain.json`, `precognition.json`, `sherlock.json`, `superspeed.json`, `teleportation.json`.
    *   Each contains power schools, mechanical requirements (tier, cost, duration), active/passive designations, and combat or dialogue utility.

### Gear, Economy & Crafting
*   **[items.json](file:///home/roygslade/Desktop/Text/data/raw/items.json)**: Base weapon, tool, and utility catalog.
*   **[armor.json](file:///home/roygslade/Desktop/Text/data/raw/armor.json)**: Basic armor items (jumpsuit, flak vest, custom guard armor) detailing armor ratings, speed penalties, and price tags.
*   **[recipes.json](file:///home/roygslade/Desktop/Text/data/raw/recipes.json)**: Crafting instructions linking output items to station requirements, component lists, times, and difficulty metrics.
*   **[vendors.json](file:///home/roygslade/Desktop/Text/data/raw/vendors.json)**: Pricing modifiers, reputation scaling matrices, and regional inventories.
*   **[packs/SYS-CRAFT-CORE-001/](file:///home/roygslade/Desktop/Text/data/raw/packs/SYS-CRAFT-CORE-001/) (5 files)**: Blueprints, crafting stations, raw materials, and material merchants.

### World, Story & Environments
*   **[world.json](file:///home/roygslade/Desktop/Text/data/raw/world.json)** / **[biomes.json](file:///home/roygslade/Desktop/Text/data/raw/biomes.json)**: Structural settings for world states, time scales, and regional nodes (cities, deserts, coasts).
*   **[story.json](file:///home/roygslade/Desktop/Text/data/raw/story.json)** / **[home.json](file:///home/roygslade/Desktop/Text/data/raw/home.json)**: Text scripts for narrative passages, home upgrades, and kitchen/forgework expansions.
*   **[enemies.json](file:///home/roygslade/Desktop/Text/data/raw/enemies.json)**: Monsters/threats stats (HP, speed, base attacks, loot drops).
*   **[encounters/](file:///home/roygslade/Desktop/Text/data/raw/encounters/) (5 files)**: Random encounter step-tables for various zones (`storm_coast.json`, etc.).
*   **[blackridge/](file:///home/roygslade/Desktop/Text/data/raw/blackridge/) (Deep subdirectory, 50+ files)**: A heavy narrative module with localized quests, NPC schedules, custom merchant items, and scripted sequences specific to the Blackridge city.

---

## 2. Utility for Milestone 2.0 Character Creation

The following files are **essential** for implementing a robust character creation wizard in Milestone 2.0:
1.  **`races.json`**: Primary selection. Determines base attribute modifiers (e.g., `wisdom +2`), movement capabilities, passive immunities/resistances, and sets lists of allowed skills.
2.  **`professions.json`**: Core class/starting role selection. Sets initial credit balances, active passive perks, starting items, and provides the baseline 1–5 level ability pool.
3.  **`trainings.json`**: Educational history selection. Provides baseline Armor Rating, Initiative bonuses, HP starting values, and establishes the "Major" which structures the character's early skill progression.
4.  **`persona_presets.json`**: Flavor builder. Used to randomly generate or pick personality traits, hardships, empathy ratings, and visual aesthetics to breathe roleplay depth into characters.
5.  **`rpg_rules.json`**: Boundary definitions. Provides starting limits, stat ceilings, and matches specific skills directly to their active attributes.

---

## 3. Utility for Later Milestones (Skills, Powers, Combat, Leveling)

*   **Skills**: `skills.json` and `data/skills.json` detail the level progression. `data/skill_aliases.json` is critical for ensuring inputs are standard when integrating old components.
*   **Superpowers / Active Powers**: The `data/powers/` directory (specifically files listed in `manifest.json`) defines high-impact skills that will consume power points during combat.
*   **Combat**: `talents.json` (active melee/defense cards), `data/statuses.json` (combat status conditions and modifiers), `armor.json`, `items.json`, and `enemies.json` are primary engines for fighting.
*   **Leveling**: `data/leveling.json` maps exactly what rewards and points are given at levels 1 through 30.

---

## 4. Schema Inconsistencies & Problems Identified

Several major inconsistencies and mismatches were discovered between schemas:

1.  **The "Speech & Business vs. Barter & Diplomacy" Mismatch (Critical)**
    *   **In `skills.json`**: Skills are defined as `"Speech"` and `"Business"`. There are *no* entries for `"Barter"` or `"Diplomacy"`.
    *   **In `data/skill_aliases.json`**: `"Speech"` maps to `"Diplomacy"` and `"Business"` maps to `"Barter"`.
    *   **In `rpg_rules.json`**: The `skillAttributes` map contains `"Speech"`, `"Business"`, and *no* mentions of `"Barter"` or `"Diplomacy"`.
    *   **In `trainings.json`**: Training Interpersonal Studies refers to `"Speech"` and `"Business"`.
    *   *Result*: This means that several parts of the system use `Speech` and `Business`, but aliases try to map them to non-existent skills (`Diplomacy` / `Barter`). We need to unify these concepts under standard naming.

2.  **Inconsistent Skill Level Formats**
    *   In `skills.json`, most level entries are plain text descriptions (e.g. `Artist` level 1: `"Choose 2 art forms..."`).
    *   However, some skills contain complex object definitions for specific levels (e.g., `Athlete` Level 4/5: `{"description": "+1 to group initiative.", "metadata": {"level": 4, "bonus": "+1", "type": "group_initiative"}}`).
    *   This discrepancy will break a generic parser that expects all levels to share a common string or object schema.

3.  **Ambiguous Leveling Flags**
    *   In `data/leveling.json`, fields like `hp` and `training` are defined as boolean `true` (e.g. `hp: true`, `training: true`) to signify a level reward. However, standard statistics are numeric values. This requires bespoke conditional parsing.

---

## 5. Recommendation for Normalization into `js/data.js`

To lay the foundation for Milestone 2.0 without introducing raw JSON fetching, the following datasets should be imported and normalized directly into `js/data.js` in this order:

1.  **`rpg_rules` (Configuration & Constants)**: Establishes base attribute limits and skill mappings before processing other records.
2.  **`races` (Base Attributes & Bonuses)**: Sets the skeleton structure of character modifiers.
3.  **`professions` & `trainings`**: Normalized into standard object maps to populate the wizard choices.
4.  **`skills` & canonical aliases**: Unify `"Speech"` / `"Diplomacy"` and `"Business"` / `"Barter"` into one clean canonical format to prevent schema bugs during character creation.
