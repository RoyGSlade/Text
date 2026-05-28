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
   * @returns {Object} { success: boolean, roll1: number, roll2: number, finalRoll: number, modifier: number, total: number }
   */
  function skillCheck(state, skill, challengeRating, options = {}) {
    const modifier = state.character.skills?.[skill] || 0;
    
    let roll1 = rollD20(state);
    let roll2 = null;
    let finalRoll = roll1;

    if (options.advantage) {
      roll2 = rollD20(state);
      finalRoll = Math.max(roll1, roll2);
    } else if (options.disadvantage) {
      roll2 = rollD20(state);
      finalRoll = Math.min(roll1, roll2);
    }

    const total = finalRoll + modifier;
    const success = total >= challengeRating;

    return {
      success,
      roll1,
      roll2,
      finalRoll,
      modifier,
      total,
      challengeRating
    };
  }

  return {
    createRandomGenerator,
    randomRange,
    rollDie,
    rollD20,
    skillCheck
  };
})();
