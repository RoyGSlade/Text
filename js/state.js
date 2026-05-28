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
    seed: "",
    character: {
      name: "Unnamed Wanderer",
      race: "Unchosen",
      profession: "Unchosen",
      hp: 10,
      maxHp: 10,
      credits: 0,
      skills: {}, // e.g. { mechanics: 1, hacking: 0 }
      powers: []
    },
    sceneId: "arrival",
    inventory: [
      "Worn Utility Knife",
      "Cracked Data Chip"
    ],
    questFlags: {
      investigate_relay: "active" // active, completed, failed
    },
    worldFlags: {},
    rngCounter: 0,
    combat: null,
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

  // Initialize fresh new game state
  function initializeNewGame(customSeed) {
    currentGameState = JSON.parse(JSON.stringify(defaultState));
    currentGameState.seed = customSeed || generateSeed();
    currentGameState.rngCounter = 0;
    currentGameState.worldFlags = {};
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
        const parsed = JSON.parse(data);
        if (parsed.version === defaultState.version) {
          currentGameState = parsed;
          currentGameState.rngCounter = currentGameState.rngCounter || 0;
          currentGameState.worldFlags = currentGameState.worldFlags || {};
          // Rebuild RNG engine with loaded seed and counter
          currentGameState.rng = window.IAG_ENGINE.createRandomGenerator(currentGameState.seed, currentGameState.rngCounter);
          return true;
        }
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
      const parsed = JSON.parse(jsonString);
      if (parsed.version && parsed.seed && parsed.character) {
        currentGameState = parsed;
        currentGameState.rngCounter = currentGameState.rngCounter || 0;
        currentGameState.worldFlags = currentGameState.worldFlags || {};
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
