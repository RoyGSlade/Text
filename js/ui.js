/**
 * Infinite Ages: Genesis - UI Render and Controller Bridge
 * File: js/ui.js
 * Purpose: Direct interface layer between the JavaScript state logic and
 *          the index.html DOM structure. Repopulates stats, panels, and choice buttons.
 */

window.IAG_UI = (function() {
  // Cache DOM element selections
  let elements = {};

  function initCache() {
    elements = {
      charName: document.getElementById("char-name"),
      charRace: document.getElementById("char-race"),
      charProfession: document.getElementById("char-profession"),
      charHpVal: document.getElementById("char-hp-val"),
      charHpBar: document.getElementById("char-hp-bar"),
      charCredits: document.getElementById("char-credits"),
      
      inventoryList: document.getElementById("inventory-list"),
      questList: document.getElementById("quest-list"),
      
      storyTitle: document.getElementById("story-title"),
      storyText: document.getElementById("story-text"),
      storyChoices: document.getElementById("story-choices"),
      
      actionLogs: document.getElementById("action-logs"),
      systemSeed: document.getElementById("system-seed"),
      
      exportBtn: document.getElementById("export-btn"),
      importFile: document.getElementById("import-file"),
      newGameBtn: document.getElementById("new-game-btn"),
      customSeedInput: document.getElementById("custom-seed-input"),
      
      diceRollBtn: document.getElementById("dice-roll-btn"),
      diceResult: document.getElementById("dice-result"),

      // Dev notes elements
      devDrawer: document.getElementById("dev-drawer"),
      devToggleBtn: document.getElementById("dev-toggle-btn"),
      closeDevBtn: document.getElementById("close-dev-btn"),
      devSceneId: document.getElementById("dev-scene-id"),
      devSeed: document.getElementById("dev-seed"),
      devRngCounter: document.getElementById("dev-rng-counter"),
      devLastEffect: document.getElementById("dev-last-effect"),
      devWorldFlags: document.getElementById("dev-world-flags"),
      devQuestFlags: document.getElementById("dev-quest-flags")
    };
  }

  // Renders the entire dashboard panel based on current state
  function renderAll() {
    const state = window.IAG_STATE.get();
    if (!state) return;

    // 1. Character Info
    if (elements.charName) elements.charName.textContent = state.character.name;
    if (elements.charRace) elements.charRace.textContent = state.character.race;
    if (elements.charProfession) elements.charProfession.textContent = state.character.profession;
    if (elements.charCredits) elements.charCredits.textContent = state.character.credits;
    
    if (elements.charHpVal && elements.charHpBar) {
      elements.charHpVal.textContent = `${state.character.hp} / ${state.character.maxHp}`;
      const hpPercentage = (state.character.hp / state.character.maxHp) * 100;
      elements.charHpBar.style.width = `${hpPercentage}%`;
    }

    // 2. Inventory Cards
    if (elements.inventoryList) {
      elements.inventoryList.innerHTML = "";
      if (state.inventory.length === 0) {
        elements.inventoryList.innerHTML = `<div class="empty-card">Empty Inventory</div>`;
      } else {
        state.inventory.forEach(item => {
          const itemEl = document.createElement("div");
          itemEl.className = "inventory-card";
          itemEl.innerHTML = `<span class="item-name">${item}</span>`;
          elements.inventoryList.appendChild(itemEl);
        });
      }
    }

    // 3. Quest Log
    if (elements.questList) {
      elements.questList.innerHTML = "";
      let hasQuests = false;
      for (const [key, value] of Object.entries(state.questFlags)) {
        hasQuests = true;
        const questEl = document.createElement("div");
        questEl.className = `quest-item ${value}`;
        // Beautify/normalize the quest key for display
        const displayTitle = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        questEl.innerHTML = `
          <div class="quest-title">${displayTitle}</div>
          <div class="quest-status">${value.toUpperCase()}</div>
        `;
        elements.questList.appendChild(questEl);
      }
      if (!hasQuests) {
        elements.questList.innerHTML = `<div class="empty-card">No Active Quests</div>`;
      }
    }

    // 4. Seed and system panel
    if (elements.systemSeed) {
      elements.systemSeed.textContent = state.seed;
    }

    // 5. Action History Log
    if (elements.actionLogs) {
      elements.actionLogs.innerHTML = "";
      state.history.slice().reverse().forEach(log => {
        const logEl = document.createElement("div");
        logEl.className = "log-line";
        logEl.innerHTML = `<span class="log-timestamp">[SYSTEM]</span> ${log}`;
        elements.actionLogs.appendChild(logEl);
      });
    }

    // 6. Dev Notes drawer values
    if (elements.devSceneId) elements.devSceneId.textContent = state.sceneId;
    if (elements.devSeed) elements.devSeed.textContent = state.seed;
    if (elements.devRngCounter) elements.devRngCounter.textContent = state.rngCounter !== undefined ? state.rngCounter : 0;
    if (elements.devLastEffect) {
      elements.devLastEffect.textContent = state.lastEffect ? JSON.stringify(state.lastEffect) : "None";
    }
    if (elements.devWorldFlags) {
      elements.devWorldFlags.textContent = JSON.stringify(state.worldFlags || {}, null, 2);
    }
    if (elements.devQuestFlags) {
      elements.devQuestFlags.textContent = JSON.stringify(state.questFlags || {}, null, 2);
    }

    // 7. Story narrative core scene
    renderStoryScene(state.sceneId);
  }

  // Renders the specific scene and dynamically builds options buttons
  function renderStoryScene(sceneId) {
    const state = window.IAG_STATE.get();
    const scene = window.IAG_STORY.getScene(sceneId);

    if (elements.storyTitle) elements.storyTitle.textContent = scene.title;
    if (elements.storyText) elements.storyText.innerHTML = scene.text;

    if (elements.storyChoices) {
      elements.storyChoices.innerHTML = "";
      scene.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "action-btn";
        
        // Evaluate requirements
        const req = window.IAG_STORY.checkRequirement(state, option.requires);
        
        if (!req.satisfied) {
          btn.classList.add("disabled");
          btn.disabled = true;
          btn.innerHTML = `<span>${option.label}</span> <span class="requirement-tag">(Locked)</span>`;
          btn.title = req.errorMsg || "Requirement not met.";
        } else {
          btn.textContent = option.label;
          btn.addEventListener("click", () => {
            handleChoiceClick(option);
          });
        }
        elements.storyChoices.appendChild(btn);
      });
    }
  }

  // Processes choice selection, updates state, executes effects, and changes scene
  function handleChoiceClick(option) {
    window.IAG_STATE.update(state => {
      // Apply effects
      if (option.effects) {
        option.effects.forEach(eff => {
          window.IAG_STORY.applyEffect(state, eff);
        });
      }
      
      // Update scene ID
      state.sceneId = option.next;
    });
  }

  // Configures UI action bindings (buttons, save controls, RNG checks)
  function bindEvents() {
    // Bind Dev Drawer toggle controls
    if (elements.devToggleBtn) {
      elements.devToggleBtn.addEventListener("click", () => {
        if (elements.devDrawer) {
          elements.devDrawer.classList.toggle("active");
        }
      });
    }

    if (elements.closeDevBtn) {
      elements.closeDevBtn.addEventListener("click", () => {
        if (elements.devDrawer) {
          elements.devDrawer.classList.remove("active");
        }
      });
    }

    if (elements.exportBtn) {
      elements.exportBtn.addEventListener("click", () => {
        window.IAG_STATE.exportSaveToFile();
      });
    }

    if (elements.importFile) {
      elements.importFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
          const imported = window.IAG_STATE.importSaveFromString(evt.target.result);
          if (imported) {
            renderAll();
          } else {
            alert("Failed to parse save file. Check format.");
          }
        };
        reader.readAsText(file);
      });
    }

    if (elements.newGameBtn) {
      elements.newGameBtn.addEventListener("click", () => {
        const customSeed = elements.customSeedInput ? elements.customSeedInput.value.trim() : "";
        window.IAG_STATE.initializeNewGame(customSeed || null);
        if (elements.customSeedInput) elements.customSeedInput.value = "";
        window.IAG_STATE.addHistoryLog("Started a new timeline sector.");
        renderAll();
      });
    }

    // Interactive Seeded dice rolling panel
    if (elements.diceRollBtn) {
      elements.diceRollBtn.addEventListener("click", () => {
        const state = window.IAG_STATE.get();
        const roll = window.IAG_ENGINE.rollD20(state);
        
        if (elements.diceResult) {
          elements.diceResult.textContent = `D20: [${roll}]`;
          elements.diceResult.classList.remove("flash");
          void elements.diceResult.offsetWidth; // Trigger reflow
          elements.diceResult.classList.add("flash");
        }
        
        window.IAG_STATE.addHistoryLog(`Rolled D20 and got a deterministic result of ${roll}.`);
      });
    }

    // Bind state changes to redraw the UI automatically
    window.addEventListener("iag-state-updated", () => {
      renderAll();
    });
  }

  function start() {
    initCache();
    bindEvents();
    renderAll();
  }

  return {
    start,
    renderAll
  };
})();
