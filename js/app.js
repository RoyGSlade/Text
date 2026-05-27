/**
 * Infinite Ages: Genesis - Project Startup
 * File: js/app.js
 * Purpose: Initializes the game application, loads active saved games,
 *          configures primary seeds, and triggers UI bootstrap.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Infinite Ages: Genesis - Text Adventure Prototype v0.1.0...");

  // Try to load an existing autosave
  const hasSave = window.IAG_STATE.loadFromLocalStorage();

  if (!hasSave) {
    // If no save found, initialize a completely new game with a default seed
    console.log("No previous save found. Generating fresh timeline sector...");
    window.IAG_STATE.initializeNewGame();
    window.IAG_STATE.addHistoryLog("Initialized a new sector timeline.");
  } else {
    console.log("Found previous autosave state. Restoring timeline data...");
    window.IAG_STATE.addHistoryLog("Restored timeline state from autosave.");
  }

  // Ignite the UI layout layer and bind inputs
  window.IAG_UI.start();
  
  console.log("Infinite Ages: Genesis Milestone 1 ready.");
});
