/**
 * Infinite Ages: Genesis - Static Game Data
 * File: js/data.js
 * Purpose: Contains all static lookups, constants, races, starter professions,
 *          skills, powers, items, and tables that dictate game mechanics and lore rules.
 *          This is the static "rulebook" of the game.
 */

window.IAG_DATA = {
  RACES: {
    human: {
      id: "human",
      name: "Human",
      movement: 30,
      vision: "Normal 20/20 vision",
      resistance: "Can survive empty space unprotected for 3 rounds",
      attributeBonus: { strength: 0, intelligence: 1, agility: 1 },
      description: "Adaptable, resilient, and ubiquitous across the star systems."
    },
    synthetic: {
      id: "synthetic",
      name: "Synthetic",
      movement: 28,
      vision: "Infrared / Digital Spectrum",
      resistance: "Immune to vacuum and toxins, susceptible to EMP",
      attributeBonus: { strength: 1, intelligence: 1, agility: 0 },
      description: "Artificial entities engineered for precision, endurance, and deep-space operations."
    }
  },

  PROFESSIONS: {
    mechanic: {
      id: "mechanic",
      name: "Void Mechanic",
      hpBonus: 2,
      startingCredits: 150,
      skills: ["mechanics", "hacking"],
      description: "Masters of metal, circuitry, and keeping tin cans sealed in the cold dark."
    },
    operative: {
      id: "operative",
      name: "Neural Operative",
      hpBonus: 0,
      startingCredits: 200,
      skills: ["hacking", "influence"],
      description: "Infiltration specialists skilled in digital subversion and mind manipulation."
    }
  },

  SKILLS: {
    mechanics: {
      name: "Mechanics",
      attribute: "intelligence",
      description: "The repair, modification, and understanding of mechanical devices."
    },
    hacking: {
      name: "Hacking",
      attribute: "intelligence",
      description: "Bypassing firewalls, writing code, and hotwiring security terminals."
    },
    influence: {
      name: "Influence",
      attribute: "charisma",
      description: "Bending others to your will, negotiating contracts, or pacifying hostile targets."
    }
  },

  POWERS: {
    influence: {
      name: "Mind Manipulation: Influence",
      cost: "1 AP",
      duration: "1 scene",
      range: "15 meters",
      usesPerDay: 1,
      effect: "Calm or anger a single biological target.",
      description: "Whisper neural commands into the bio-electrical fields of nearby minds."
    }
  }
};
