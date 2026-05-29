/**
 * Infinite Ages: Genesis - UI Render and Controller Bridge
 * File: js/ui.js
 * Purpose: Direct interface layer between the JavaScript state logic and
 *          the index.html DOM structure. Repopulates stats, panels, and choice buttons.
 */

window.IAG_UI = (function() {
  // Cache DOM element selections
  let elements = {};

  // Local creation wizard state variables
  let selectedRaceId = "";
  let selectedProfessionId = "";
  let selectedHumanBonusAttr = "intelligence"; // Default attribute bonus for humans

  function initCache() {
    elements = {
      charName: document.getElementById("char-name"),
      charRace: document.getElementById("char-race"),
      charProfession: document.getElementById("char-profession"),
      charLevel: document.getElementById("char-level"),
      charHpVal: document.getElementById("char-hp-val"),
      charHpBar: document.getElementById("char-hp-bar"),
      charCredits: document.getElementById("char-credits"),
      
      // Expanded sidebar elements
      charStr: document.getElementById("char-str"),
      charDex: document.getElementById("char-dex"),
      charCon: document.getElementById("char-con"),
      charInt: document.getElementById("char-int"),
      charWis: document.getElementById("char-wis"),
      charCha: document.getElementById("char-cha"),
      charMovement: document.getElementById("char-movement"),
      charVision: document.getElementById("char-vision"),
      charResistance: document.getElementById("char-resistance"),
      charSpecial: document.getElementById("char-special"),
      charSpecialContainer: document.getElementById("char-special-container"),
      
      // Onboarding Wizard elements
      characterCreationPanel: document.getElementById("character-creation-panel"),
      characterNameInput: document.getElementById("character-name-input"),
      raceCardList: document.getElementById("race-card-list"),
      professionCardList: document.getElementById("profession-card-list"),
      characterPreview: document.getElementById("character-preview"),
      confirmCharacterBtn: document.getElementById("confirm-character-btn"),
      
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

    // 0. Character Creation Wizard Gating
    if (elements.characterCreationPanel) {
      if (!state.characterCreationComplete) {
        elements.characterCreationPanel.style.display = "block";
      } else {
        elements.characterCreationPanel.style.display = "none";
      }
    }

    // 1. Character Sidebar Profile Details
    if (elements.charName) elements.charName.textContent = state.character.name;
    if (elements.charRace) elements.charRace.textContent = state.character.race;
    if (elements.charProfession) elements.charProfession.textContent = state.character.profession;
    if (elements.charLevel) elements.charLevel.textContent = state.character.level || 1;
    if (elements.charCredits) elements.charCredits.textContent = state.character.credits;
    
    if (elements.charHpVal && elements.charHpBar) {
      elements.charHpVal.textContent = `${state.character.hp} / ${state.character.maxHp}`;
      const hpPercentage = (state.character.hp / state.character.maxHp) * 100;
      elements.charHpBar.style.width = `${hpPercentage}%`;
    }

    // Render stats attributes
    if (state.character.attributes) {
      if (elements.charStr) elements.charStr.textContent = state.character.attributes.strength || 0;
      if (elements.charDex) elements.charDex.textContent = state.character.attributes.dexterity || 0;
      if (elements.charCon) elements.charCon.textContent = state.character.attributes.constitution || 0;
      if (elements.charInt) elements.charInt.textContent = state.character.attributes.intelligence || 0;
      if (elements.charWis) elements.charWis.textContent = state.character.attributes.wisdom || 0;
      if (elements.charCha) elements.charCha.textContent = state.character.attributes.charisma || 0;
    }

    // Render Capabilities
    if (elements.charMovement) elements.charMovement.textContent = state.character.movement || 0;
    if (elements.charVision) elements.charVision.textContent = state.character.vision || "Unchosen";
    if (elements.charResistance) elements.charResistance.textContent = state.character.resistance || "Unchosen";
    
    if (elements.charSpecial && elements.charSpecialContainer) {
      if (state.character.special) {
        elements.charSpecial.textContent = state.character.special;
        elements.charSpecialContainer.style.display = "flex";
      } else {
        elements.charSpecialContainer.style.display = "none";
      }
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

  // Helper to format attributes bonus
  function formatBonus(bonus) {
    if (!bonus) return "None";
    if (bonus.choice) {
      return `+${bonus.choice} to Chosen Attribute`;
    }
    return Object.entries(bonus)
      .map(([attr, val]) => `+${val} ${attr.charAt(0).toUpperCase() + attr.slice(1)}`)
      .join(", ");
  }

  // Initializes the character creation layout (renders cards and binds onboarding events)
  function initializeCreationWizard() {
    const races = window.IAG_DATA.races;
    const professions = window.IAG_DATA.professions;

    // Render biological species selection grid
    if (elements.raceCardList) {
      elements.raceCardList.innerHTML = "";
      Object.entries(races).forEach(([raceId, race]) => {
        const card = document.createElement("div");
        card.className = "selection-card";
        card.dataset.id = raceId;
        card.innerHTML = `
          <div class="card-header">
            <h4>${race.name}</h4>
            <span class="badge">${race.movement} ft</span>
          </div>
          <p class="card-desc">${race.description}</p>
          <div class="card-details">
            <div><strong>Vision:</strong> ${race.vision}</div>
            <div><strong>Resistance:</strong> ${race.resistance}</div>
            ${race.special ? `<div><strong>Special:</strong> ${race.special}</div>` : ""}
            <div class="bonus-highlight"><strong>Bonus:</strong> ${formatBonus(race.attribute_bonus)}</div>
          </div>
        `;
        card.addEventListener("click", () => {
          selectedRaceId = raceId;
          document.querySelectorAll("#race-card-list .selection-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          updateCreationPreview();
          validateCharacterCreation();
        });
        elements.raceCardList.appendChild(card);
      });
    }

    // Render professions selection grid
    if (elements.professionCardList) {
      elements.professionCardList.innerHTML = "";
      Object.entries(professions).forEach(([profId, prof]) => {
        const card = document.createElement("div");
        card.className = "selection-card";
        card.dataset.id = profId;
        card.innerHTML = `
          <div class="card-header">
            <h4>${prof.name}</h4>
            <span class="badge badge-credits">${prof.starting_credits} cr</span>
          </div>
          <p class="card-desc">${prof.description}</p>
          <div class="card-details">
            <div><strong>Passive:</strong> ${prof.passive}</div>
            <div class="level-benefits">
              <strong>Rank Benefits:</strong>
              <ul>
                ${prof.level_benefits.slice(0, 2).map(b => `<li>${b}</li>`).join("")}
                ${prof.level_benefits.length > 2 ? `<li>...and more</li>` : ""}
              </ul>
            </div>
          </div>
        `;
        card.addEventListener("click", () => {
          selectedProfessionId = profId;
          document.querySelectorAll("#profession-card-list .selection-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          updateCreationPreview();
          validateCharacterCreation();
        });
        elements.professionCardList.appendChild(card);
      });
    }

    // Bind listeners to inputs
    if (elements.characterNameInput) {
      elements.characterNameInput.value = "";
      elements.characterNameInput.addEventListener("input", () => {
        updateCreationPreview();
        validateCharacterCreation();
      });
    }

    if (elements.confirmCharacterBtn) {
      // Clean up previous event listeners by cloning
      const oldBtn = elements.confirmCharacterBtn;
      const newBtn = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(newBtn, oldBtn);
      elements.confirmCharacterBtn = newBtn;
      
      elements.confirmCharacterBtn.addEventListener("click", () => {
        confirmCharacterSelection();
      });
    }

    updateCreationPreview();
    validateCharacterCreation();
  }

  // Updates the live preview panel inside character creation
  function updateCreationPreview() {
    if (!elements.characterPreview) return;

    const name = elements.characterNameInput ? elements.characterNameInput.value.trim() : "";
    const races = window.IAG_DATA.races;
    const professions = window.IAG_DATA.professions;

    const race = races[selectedRaceId];
    const profession = professions[selectedProfessionId];

    // Compute base + bonus attributes (default starts at 0)
    const attrs = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    if (selectedRaceId === "human") {
      attrs[selectedHumanBonusAttr] = 2;
    } else if (race && race.attribute_bonus) {
      for (const [attr, val] of Object.entries(race.attribute_bonus)) {
        attrs[attr] = val;
      }
    }

    let humanSelectorHtml = "";
    if (selectedRaceId === "human") {
      humanSelectorHtml = `
        <div class="human-bonus-container">
          <label for="human-bonus-select">Human Attribute Bonus (+2):</label>
          <select id="human-bonus-select" class="creation-select">
            <option value="strength" ${selectedHumanBonusAttr === "strength" ? "selected" : ""}>Strength</option>
            <option value="dexterity" ${selectedHumanBonusAttr === "dexterity" ? "selected" : ""}>Dexterity</option>
            <option value="constitution" ${selectedHumanBonusAttr === "constitution" ? "selected" : ""}>Constitution</option>
            <option value="intelligence" ${selectedHumanBonusAttr === "intelligence" ? "selected" : ""}>Intelligence</option>
            <option value="wisdom" ${selectedHumanBonusAttr === "wisdom" ? "selected" : ""}>Wisdom</option>
            <option value="charisma" ${selectedHumanBonusAttr === "charisma" ? "selected" : ""}>Charisma</option>
          </select>
        </div>
      `;
    }

    elements.characterPreview.innerHTML = `
      <div class="preview-grid">
        <div class="preview-column">
          <h4>Identity Profile</h4>
          <div class="preview-item"><span class="lbl">Codename:</span> <span class="val highlighted">${name || "(Requires Codename)"}</span></div>
          <div class="preview-item"><span class="lbl">Species:</span> <span class="val">${race ? race.name : "Unchosen"}</span></div>
          <div class="preview-item"><span class="lbl">Profession:</span> <span class="val">${profession ? profession.name : "Unchosen"}</span></div>
          <div class="preview-item"><span class="lbl">Starting Credits:</span> <span class="val">${profession ? profession.starting_credits : 0} cr</span></div>
          <div class="preview-item"><span class="lbl">Movement Speed:</span> <span class="val">${race ? race.movement : 0} ft</span></div>
          <div class="preview-item"><span class="lbl">Vision capabilities:</span> <span class="val">${race ? race.vision : "Unchosen"}</span></div>
          <div class="preview-item"><span class="lbl">Resistances:</span> <span class="val">${race ? race.resistance : "Unchosen"}</span></div>
        </div>
        <div class="preview-column">
          <h4>Attribute Distribution</h4>
          <div class="preview-attrs-grid">
            <div class="preview-attr-box ${attrs.strength > 0 ? "bonus-active" : ""}">
              <span class="attr-lbl">STR</span>
              <span class="attr-val">${attrs.strength}</span>
            </div>
            <div class="preview-attr-box ${attrs.dexterity > 0 ? "bonus-active" : ""}">
              <span class="attr-lbl">DEX</span>
              <span class="attr-val">${attrs.dexterity}</span>
            </div>
            <div class="preview-attr-box ${attrs.constitution > 0 ? "bonus-active" : ""}">
              <span class="attr-lbl">CON</span>
              <span class="attr-val">${attrs.constitution}</span>
            </div>
            <div class="preview-attr-box ${attrs.intelligence > 0 ? "bonus-active" : ""}">
              <span class="attr-lbl">INT</span>
              <span class="attr-val">${attrs.intelligence}</span>
            </div>
            <div class="preview-attr-box ${attrs.wisdom > 0 ? "bonus-active" : ""}">
              <span class="attr-lbl">WIS</span>
              <span class="attr-val">${attrs.wisdom}</span>
            </div>
            <div class="preview-attr-box ${attrs.charisma > 0 ? "bonus-active" : ""}">
              <span class="attr-lbl">CHA</span>
              <span class="attr-val">${attrs.charisma}</span>
            </div>
          </div>
          ${humanSelectorHtml}
        </div>
      </div>
    `;

    // Bind event handler if human selector is present
    const humanSelect = document.getElementById("human-bonus-select");
    if (humanSelect) {
      humanSelect.addEventListener("change", (e) => {
        selectedHumanBonusAttr = e.target.value;
        updateCreationPreview();
      });
    }
  }

  // Validates character creation onboarding inputs
  function validateCharacterCreation() {
    const name = elements.characterNameInput ? elements.characterNameInput.value.trim() : "";
    const isValid = name.length > 0 && selectedRaceId !== "" && selectedProfessionId !== "";
    if (elements.confirmCharacterBtn) {
      elements.confirmCharacterBtn.disabled = !isValid;
    }
  }

  // Saves finalized choices and completes character creation
  function confirmCharacterSelection() {
    const name = elements.characterNameInput ? elements.characterNameInput.value.trim() : "";
    if (name.length === 0 || selectedRaceId === "" || selectedProfessionId === "") return;

    const races = window.IAG_DATA.races;
    const professions = window.IAG_DATA.professions;

    const race = races[selectedRaceId];
    const profession = professions[selectedProfessionId];

    window.IAG_STATE.update(state => {
      state.character.name = name;
      state.character.raceId = selectedRaceId;
      state.character.race = race.name;
      state.character.movement = race.movement;
      state.character.vision = race.vision;
      state.character.resistance = race.resistance;
      state.character.special = race.special || "";
      state.character.skillOptions = race.skill_options || [];

      // Apply attribute scores starting at 0 + race bonus
      state.character.attributes = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
      if (selectedRaceId === "human") {
        state.character.attributes[selectedHumanBonusAttr] = 2;
      } else if (race.attribute_bonus) {
        for (const [attr, val] of Object.entries(race.attribute_bonus)) {
          state.character.attributes[attr] = val;
        }
      }

      // Apply profession
      state.character.professionId = selectedProfessionId;
      state.character.profession = profession.name;
      state.character.credits = profession.starting_credits;
      state.character.professionPassive = profession.passive;
      state.character.professionBenefits = profession.level_benefits;

      // Completion flag
      state.characterCreationComplete = true;

      // History log
      state.history.push(`Character created: ${name}, ${race.name} ${profession.name}.`);
    });

    // Reset temporary selections
    selectedRaceId = "";
    selectedProfessionId = "";
    if (elements.characterNameInput) elements.characterNameInput.value = "";

    // Redraw interface
    renderAll();
  }

  // Renders the specific scene and dynamically builds options buttons
  function renderStoryScene(sceneId) {
    const state = window.IAG_STATE.get();
    const scene = window.IAG_STORY.getScene(sceneId);

    if (elements.storyTitle) elements.storyTitle.textContent = scene.title;
    if (elements.storyText) elements.storyText.innerHTML = scene.text;

    if (elements.storyChoices) {
      elements.storyChoices.innerHTML = "";
      
      // If character creation is in-progress, gate story interactions
      if (!state.characterCreationComplete) {
        const notice = document.createElement("div");
        notice.className = "gating-notice";
        notice.innerHTML = `
          <div class="gating-warning-icon">⚠</div>
          <div class="gating-text">Create and verify your character profile above to enter the story timeline.</div>
        `;
        elements.storyChoices.appendChild(notice);
      } else {
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
            // Reset character wizard local properties if loaded save is active
            selectedRaceId = "";
            selectedProfessionId = "";
            if (elements.characterNameInput) elements.characterNameInput.value = "";
            initializeCreationWizard();
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
        
        // Reset local selection parameters
        selectedRaceId = "";
        selectedProfessionId = "";
        if (elements.characterNameInput) elements.characterNameInput.value = "";
        
        initializeCreationWizard();
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
    initializeCreationWizard();
    renderAll();
  }

  return {
    start,
    renderAll
  };
})();
