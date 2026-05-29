/**
 * Infinite Ages: Genesis - Game State Management
 * File: js/state.js
 * Purpose: Manages current reactive game state (character details, seed, scene details,
 *          inventory items, completed quests, action logs) and handles autosave,
 *          JSON import, and JSON export systems.
 */

window.IAG_STATE = (function() {
  const SAVE_KEY = "infinite_ages_genesis_v0.1_save";
  
  // Default fresh state
  const defaultState = {
    version: "0.1.0",
    characterCreationComplete: false,
    seed: "",
    character: {
      name: "Unnamed Wanderer",
      raceId: "",
      race: "Unchosen",
      professionId: "",
      profession: "Unchosen",
      level: 1,
      attributes: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      },
      movement: 0,
      vision: "",
      resistance: "",
      special: "",
      skillOptions: [],
      hp: 10,
      maxHp: 10,
      credits: 0,
      skills: {}, // e.g. { mechanics: 1, hacking: 0 }
      skillSuccesses: {},
      equipped: {
        shoes: null,
        pants: null,
        torso: null,
        head: null,
        neck: null,
        ears: null,
        hands: null,
        wrists: null,
        pockets: null
      },
      powers: [],
      professionPassive: "",
      professionBenefits: []
    },
    sceneId: "arrival",
    inventory: [
      "Worn Utility Knife",
      "Cracked Data Chip",
      "Standard Jumpsuit",
      "Work Boots"
    ],
    questFlags: {
      investigate_relay: "active" // active, completed, failed
    },
    worldFlags: {},
    rngCounter: 0,
    combat: null,
    lastSkillCheck: null,
    history: [
      "Awakened in the outer ring sector."
    ]
  };

  // Active game state
  let currentGameState = JSON.parse(JSON.stringify(defaultState));

  // Generates a simple text seed
  function generateSeed() {
    return "IA-" + Math.floor(100000 + Math.random() * 900000);
  }

  // Normalizes and migrates older/partial save objects to the new structure
  function normalizeState(rawState) {
    if (!rawState) return null;

    // Ensure baseline game version
    rawState.version = rawState.version || defaultState.version;

    // Ensure characterCreationComplete exists
    if (rawState.characterCreationComplete === undefined) {
      // Smart check: if the save already had a chosen race/profession, mark creation as completed
      const hasChosenRace = rawState.character && rawState.character.race && rawState.character.race !== "Unchosen" && rawState.character.race !== "";
      const hasChosenProf = rawState.character && rawState.character.profession && rawState.character.profession !== "Unchosen" && rawState.character.profession !== "";
      rawState.characterCreationComplete = !!(hasChosenRace && hasChosenProf);
    }

    // Ensure baseline top-level structures exist
    rawState.seed = rawState.seed || generateSeed();
    rawState.rngCounter = rawState.rngCounter || 0;
    rawState.worldFlags = rawState.worldFlags || {};
    rawState.questFlags = rawState.questFlags || {};
    rawState.inventory = rawState.inventory || [];
    rawState.history = rawState.history || [];
    rawState.combat = rawState.combat || null;
    rawState.sceneId = rawState.sceneId || "arrival";
    rawState.lastSkillCheck = rawState.lastSkillCheck !== undefined ? rawState.lastSkillCheck : null;

    // Normalize and expand character object
    if (!rawState.character) {
      rawState.character = JSON.parse(JSON.stringify(defaultState.character));
    } else {
      const defChar = defaultState.character;
      
      rawState.character.name = rawState.character.name || defChar.name;
      rawState.character.raceId = rawState.character.raceId || "";
      rawState.character.race = rawState.character.race || defChar.race;
      rawState.character.professionId = rawState.character.professionId || "";
      rawState.character.profession = rawState.character.profession || defChar.profession;
      
      if (rawState.character.level === undefined) rawState.character.level = defChar.level;
      if (rawState.character.hp === undefined) rawState.character.hp = defChar.hp;
      if (rawState.character.maxHp === undefined) rawState.character.maxHp = defChar.maxHp;
      if (rawState.character.credits === undefined) rawState.character.credits = defChar.credits;
      
      rawState.character.movement = rawState.character.movement !== undefined ? rawState.character.movement : defChar.movement;
      rawState.character.vision = rawState.character.vision !== undefined ? rawState.character.vision : defChar.vision;
      rawState.character.resistance = rawState.character.resistance !== undefined ? rawState.character.resistance : defChar.resistance;
      rawState.character.special = rawState.character.special !== undefined ? rawState.character.special : defChar.special;
      rawState.character.skillOptions = rawState.character.skillOptions || [];
      rawState.character.skills = rawState.character.skills || {};
      rawState.character.skillSuccesses = rawState.character.skillSuccesses || {};
      rawState.character.equipped = rawState.character.equipped || JSON.parse(JSON.stringify(defChar.equipped));
      rawState.character.powers = rawState.character.powers || [];
      rawState.character.professionPassive = rawState.character.professionPassive !== undefined ? rawState.character.professionPassive : defChar.professionPassive;
      rawState.character.professionBenefits = rawState.character.professionBenefits || [];

      // Ensure attributes sub-object and its keys exist
      if (!rawState.character.attributes) {
        rawState.character.attributes = JSON.parse(JSON.stringify(defChar.attributes));
      } else {
        for (const attr in defChar.attributes) {
          if (rawState.character.attributes[attr] === undefined) {
            rawState.character.attributes[attr] = defChar.attributes[attr];
          }
        }
      }
    }

    return rawState;
  }

  // Initialize fresh new game state
  function initializeNewGame(customSeed) {
    currentGameState = JSON.parse(JSON.stringify(defaultState));
    currentGameState.seed = customSeed || generateSeed();
    currentGameState.rngCounter = 0;
    currentGameState.worldFlags = {};
    
    // Normalize to guarantee complete new structure compatibility
    currentGameState = normalizeState(currentGameState);

    // Initialize RNG engine
    currentGameState.rng = window.IAG_ENGINE.createRandomGenerator(currentGameState.seed, currentGameState.rngCounter);
    
    saveToLocalStorage();
    return currentGameState;
  }

  // Persists to localStorage
  function saveToLocalStorage() {
    // Avoid circular structure issues, serialize a pure clone
    const stateToSave = JSON.parse(JSON.stringify(currentGameState));
    delete stateToSave.rng; // RNG function cannot be JSON-serialized
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
  }

  // Attempts to load from localStorage
  function loadFromLocalStorage() {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
      try {
        let parsed = JSON.parse(data);
        // Normalize loaded state to safely support older version saves
        parsed = normalizeState(parsed);
        currentGameState = parsed;
        
        // Rebuild RNG engine with loaded seed and counter
        currentGameState.rng = window.IAG_ENGINE.createRandomGenerator(currentGameState.seed, currentGameState.rngCounter);
        return true;
      } catch (e) {
        console.error("Failed to parse localStorage save data:", e);
      }
    }
    return false;
  }

  // Exports state as file download
  function exportSaveToFile() {
    const stateToSave = JSON.parse(JSON.stringify(currentGameState));
    delete stateToSave.rng;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateToSave, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `infinite_ages_${currentGameState.seed}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addHistoryLog("Game state exported successfully.");
  }

  // Imports state from uploaded JSON content string
  function importSaveFromString(jsonString) {
    try {
      let parsed = JSON.parse(jsonString);
      if (parsed.version && parsed.seed && parsed.character) {
        // Normalize imported state
        parsed = normalizeState(parsed);
        currentGameState = parsed;
        
        // Rebuild RNG engine
        currentGameState.rng = window.IAG_ENGINE.createRandomGenerator(currentGameState.seed, currentGameState.rngCounter);
        saveToLocalStorage();
        addHistoryLog("Game state imported successfully.");
        return true;
      }
    } catch (e) {
      console.error("Failed to parse imported save:", e);
    }
    return false;
  }

  // Appends a new line to bottom action log
  function addHistoryLog(message) {
    currentGameState.history.push(message);
    if (currentGameState.history.length > 50) {
      currentGameState.history.shift(); // Cap history to prevent bloat
    }
    saveToLocalStorage();
    
    // Dispatch state updated event
    const event = new CustomEvent("iag-state-updated", { detail: currentGameState });
    window.dispatchEvent(event);
  }

  // Returns active state object
  function get() {
    return currentGameState;
  }

  // Manually update active state field
  function update(callback) {
    callback(currentGameState);
    saveToLocalStorage();
    const event = new CustomEvent("iag-state-updated", { detail: currentGameState });
    window.dispatchEvent(event);
  }

  return {
    get,
    update,
    initializeNewGame,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportSaveToFile,
    importSaveFromString,
    addHistoryLog,
    generateSeed
  };
})();
