/**
 * Infinite Ages: Genesis - Deterministic Mechanics Engine
 * File: js/engine.js
 * Purpose: Handles seeded pseudorandom number generation, dice rolls, checks,
 *          advantage/disadvantage, and combat calculation logic.
 *          This engine is fully deterministic based on the active state seed.
 */

window.IAG_ENGINE = (function() {
  // Simple Mulberry32 seeded RNG generator
  // Returns a float from 0 (inclusive) to 1 (exclusive)
  function createRandomGenerator(seedString, initialCounter = 0) {
    // Generate a numeric hash from the seed string
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seedString.length; i++) {
      h = Math.imul(h ^ seedString.charCodeAt(i), 16777619);
    }
    
    let a = h >>> 0;
    // Pre-advance the RNG state by the initial counter
    for (let i = 0; i < initialCounter; i++) {
      a = (a + 0x6D2B79F5) >>> 0;
    }

    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Returns a random number in [min, max] inclusive using the state's generator
  function randomRange(state, min, max) {
    if (state.rngCounter === undefined) {
      state.rngCounter = 0;
    }
    if (!state.rng) {
      // Lazy-initialize RNG if state doesn't have it active
      state.rng = createRandomGenerator(state.seed || "DEFAULT-SEED", state.rngCounter);
    }
    const r = state.rng();
    state.rngCounter++;
    return Math.floor(r * (max - min + 1)) + min;
  }

  // Rolls a die with N sides (1 to N)
  function rollDie(state, sides) {
    return randomRange(state, 1, sides);
  }

  // Rolls 1d20
  function rollD20(state) {
    return rollDie(state, 20);
  }

  /**
   * Performs a standard d20 skill check.
   * @param {Object} state - Current game state
   * @param {string} skill - The skill ID
   * @param {number} challengeRating - The target number to meet or exceed
   * @param {Object} options - { advantage: boolean, disadvantage: boolean }
   * @returns {Object} Rich result details
   */
  function skillCheck(state, skill, challengeRating, options = {}) {
    const skillRank = getSkillRank(state, skill);
    const attributeId = getAttributeIdForSkill(skill);
    const attributeBonus = attributeId ? getAttributeBonus(state, attributeId) : 0;
    const modifier = skillRank + attributeBonus;
    
    // Advantage and Disadvantage cancellation rules
    let isAdvantage = !!options.advantage;
    let isDisadvantage = !!options.disadvantage;
    if (isAdvantage && isDisadvantage) {
      isAdvantage = false;
      isDisadvantage = false;
    }

    let roll1 = rollD20(state);
    let roll2 = null;
    let finalRoll = roll1;

    if (isAdvantage) {
      roll2 = rollD20(state);
      finalRoll = Math.max(roll1, roll2);
    } else if (isDisadvantage) {
      roll2 = rollD20(state);
      finalRoll = Math.min(roll1, roll2);
    }

    const total = finalRoll + modifier;
    const success = total >= challengeRating;
    const def = getSkillDefinition(skill);
    const skillName = def ? def.name : (skill.charAt(0).toUpperCase() + skill.slice(1));

    return {
      success,
      skill,
      skillName,
      challengeRating,
      roll1,
      roll2,
      finalRoll,
      skillRank,
      attributeId,
      attributeBonus,
      modifier,
      total,
      advantage: isAdvantage,
      disadvantage: isDisadvantage
    };
  }

  // Helper functions for attribute-aware calculations
  function getSkillDefinition(skillId) {
    if (!window.IAG_DATA || !window.IAG_DATA.skill_definitions) return null;
    return window.IAG_DATA.skill_definitions[skillId] || null;
  }

  function getSkillRank(state, skillId) {
    if (!state || !state.character || !state.character.skills) return 0;
    return state.character.skills[skillId] || 0;
  }

  function getAttributeIdForSkill(skillId) {
    const def = getSkillDefinition(skillId);
    return def ? def.attribute : null;
  }

  function getAttributeBonus(state, attributeId) {
    if (!state || !state.character || !state.character.attributes || !attributeId) return 0;
    return state.character.attributes[attributeId] || 0;
  }

  function getSkillCheckModifier(state, skillId) {
    const rank = getSkillRank(state, skillId);
    const attrId = getAttributeIdForSkill(skillId);
    const bonus = attrId ? getAttributeBonus(state, attrId) : 0;
    return rank + bonus;
  }

  function checkCharacterLevelUp(state) {
    if (!state || !state.character || !state.character.skills) return false;
    const totalSkillLevels = Object.values(state.character.skills).reduce((sum, rank) => sum + rank, 0);
    const levelingTable = window.IAG_DATA.leveling || [];
    let newLevel = 1;
    
    // Find the highest level achieved based on total skill levels
    for (let i = 0; i < levelingTable.length; i++) {
      if (totalSkillLevels >= levelingTable[i].total_skill_levels) {
        newLevel = levelingTable[i].level;
      } else {
        break;
      }
    }
    
    if (newLevel > state.character.level) {
      state.character.level = newLevel;
      state.history.push(`🎉 LEVEL UP! You reached Character Level ${newLevel}!`);
      if (state.history.length > 50) state.history.shift();
      
      // Look up and apply benefits for the new level
      const currentLevelData = levelingTable.find(l => l.level === newLevel);
      if (currentLevelData) {
        if (currentLevelData.hp) {
          state.character.maxHp = (state.character.maxHp || 10) + 10;
          state.character.hp = state.character.maxHp; // Fully heal on vital integrity upgrade
          state.history.push(`💖 Vital Integrity (Max HP) upgraded to ${state.character.maxHp}.`);
          if (state.history.length > 50) state.history.shift();
        }
        if (currentLevelData.attribute) {
          state.history.push(`💡 Gained +1 Attribute point upgrade authority.`);
          if (state.history.length > 50) state.history.shift();
        }
      }
      return true;
    }
    return false;
  }

  return {
    createRandomGenerator,
    randomRange,
    rollDie,
    rollD20,
    skillCheck,
    getSkillDefinition,
    getSkillRank,
    getAttributeIdForSkill,
    getAttributeBonus,
    getSkillCheckModifier,
    checkCharacterLevelUp
  };
})();
