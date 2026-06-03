/**
 * Infinite Ages: Genesis - UI Render and Controller Bridge
 * File: js/ui.js
 * Purpose: Direct interface layer between the JavaScript state logic and
 *          the index.html DOM structure. Repopulates stats, panels, and choice buttons.
 */


  // Cache DOM element selections
  window.IAG_UI = window.IAG_UI || {};
  window.IAG_UI.elements = window.IAG_UI.elements || {};
  window.IAG_UI.state = window.IAG_UI.state || {
    selectedRaceId: "",
    selectedProfessionId: "",
    selectedHumanBonusAttr: "intelligence",
    selectedStarterSkillId: ""
  };
  window.IAG_UI.activeBackpackCategory = "all";
  

  // Renders the entire dashboard panel based on current state
  

  // Helper to format attributes bonus
  

  // Formatting helper for skill IDs
  

  // Renders the available starter skills based on chosen species
  

  // Initializes the character creation layout (renders cards and binds onboarding events)
  

  // Updates the live preview panel inside character creation
  

  // Validates character creation onboarding inputs
  

  // Saves finalized choices and completes character creation
  

  // Renders the specific scene and dynamically builds options buttons
  

  // Processes choice selection, updates state, executes effects, and changes scene
  

  // Backpack active category initialized at top level

  

  

  

  

  

  

  

  // Configures UI action bindings (buttons, save controls, RNG checks)
  

  

  window.IAG_UI.switchBackpackCategory = (cat) => window.IAG_UI.openBackpackModal(cat);
  window.IAG_UI.backpackEquip = (name) => window.IAG_UI.handleEquipItem(name);
  window.IAG_UI.backpackUnequip = (slot) => window.IAG_UI.handleUnequipItem(slot);
  window.IAG_UI.backpackUse = (name) => window.IAG_UI.handleUseItem(name);
  window.IAG_UI.backpackDrop = (name) => window.IAG_UI.handleDropItem(name);


window.IAG_UI.initCache = function() {
    window.IAG_UI.elements = {
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
      starterSkillCardList: document.getElementById("starter-skill-card-list"),
      characterPreview: document.getElementById("character-preview"),
      confirmCharacterBtn: document.getElementById("confirm-character-btn"),
      
      // Specialized Skills elements
      charSkillsContainer: document.getElementById("char-skills-container"),
      charSkillsEmpty: document.getElementById("char-skills-empty"),
      
      topStatusBar: document.getElementById("top-status-bar"),
      inventoryTriggerBtn: document.getElementById("inventory-trigger-btn"),
      questsTriggerBtn: document.getElementById("quests-trigger-btn"),
      gameModalOverlay: document.getElementById("game-modal-overlay"),
      modalCloseBtn: document.getElementById("modal-close-btn"),
      gameModalBody: document.getElementById("game-modal-body"),

      slotHead: document.getElementById("slot-head"),
      slotNeck: document.getElementById("slot-neck"),
      slotEars: document.getElementById("slot-ears"),
      slotTorso: document.getElementById("slot-torso"),
      slotWrists: document.getElementById("slot-wrists"),
      slotHands: document.getElementById("slot-hands"),
      slotPants: document.getElementById("slot-pants"),
      slotShoes: document.getElementById("slot-shoes"),
      slotPockets: document.getElementById("slot-pockets"),

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
      devLastSkillCheck: document.getElementById("dev-last-skill-check"),
      devWorldFlags: document.getElementById("dev-world-flags"),
      devQuestFlags: document.getElementById("dev-quest-flags")
    };
  }

window.IAG_UI.renderAll = function() {
    const state = window.IAG_STATE.get();
    if (!state) return;

    // Render Time & Location Top Header
    window.IAG_UI.renderTopStatusBar();

    // 0. Character Creation Wizard Gating
    if (window.IAG_UI.elements.characterCreationPanel) {
      if (!state.characterCreationComplete) {
        window.IAG_UI.elements.characterCreationPanel.style.display = "block";
      } else {
        window.IAG_UI.elements.characterCreationPanel.style.display = "none";
      }
    }

    // 1. Character Sidebar Profile Details
    if (window.IAG_UI.elements.charName) window.IAG_UI.elements.charName.textContent = state.character.name;
    if (window.IAG_UI.elements.charRace) window.IAG_UI.elements.charRace.textContent = state.character.race;
    
    if (window.IAG_UI.elements.charProfession) {
      window.IAG_UI.elements.charProfession.textContent = state.character.profession;
      window.IAG_UI.elements.charProfession.onclick = () => window.IAG_UI.openProfessionModal();
    }
    if (window.IAG_UI.elements.charLevel) {
      window.IAG_UI.elements.charLevel.textContent = state.character.level || 1;
      window.IAG_UI.elements.charLevel.onclick = () => window.IAG_UI.openProfessionModal();
    }
    
    if (window.IAG_UI.elements.charCredits) window.IAG_UI.elements.charCredits.textContent = state.character.credits;
    
    if (window.IAG_UI.elements.charHpVal && window.IAG_UI.elements.charHpBar) {
      window.IAG_UI.elements.charHpVal.textContent = `${state.character.hp} / ${state.character.maxHp}`;
      const hpPercentage = (state.character.hp / state.character.maxHp) * 100;
      window.IAG_UI.elements.charHpBar.style.width = `${hpPercentage}%`;
    }

    // Render stats attributes
    if (state.character.attributes) {
      if (window.IAG_UI.elements.charStr) window.IAG_UI.elements.charStr.textContent = state.character.attributes.strength || 0;
      if (window.IAG_UI.elements.charDex) window.IAG_UI.elements.charDex.textContent = state.character.attributes.dexterity || 0;
      if (window.IAG_UI.elements.charCon) window.IAG_UI.elements.charCon.textContent = state.character.attributes.constitution || 0;
      if (window.IAG_UI.elements.charInt) window.IAG_UI.elements.charInt.textContent = state.character.attributes.intelligence || 0;
      if (window.IAG_UI.elements.charWis) window.IAG_UI.elements.charWis.textContent = state.character.attributes.wisdom || 0;
      if (window.IAG_UI.elements.charCha) window.IAG_UI.elements.charCha.textContent = state.character.attributes.charisma || 0;
    }

    // Render Capabilities (dynamic Work Boots movement buff)
    const isWorkBootsEquipped = state.character.equipped && state.character.equipped.shoes === "Work Boots";
    const finalMovement = (state.character.movement || 0) + (isWorkBootsEquipped ? 5 : 0);
    if (window.IAG_UI.elements.charMovement) window.IAG_UI.elements.charMovement.textContent = finalMovement;
    
    if (window.IAG_UI.elements.charVision) window.IAG_UI.elements.charVision.textContent = state.character.vision || "Unchosen";
    if (window.IAG_UI.elements.charResistance) window.IAG_UI.elements.charResistance.textContent = state.character.resistance || "Unchosen";
    
    if (window.IAG_UI.elements.charSpecial && window.IAG_UI.elements.charSpecialContainer) {
      if (state.character.special) {
        window.IAG_UI.elements.charSpecial.textContent = state.character.special;
        window.IAG_UI.elements.charSpecialContainer.style.display = "flex";
      } else {
        window.IAG_UI.elements.charSpecialContainer.style.display = "none";
      }
    }

    // Render active skills in the sidebar Profile
    if (window.IAG_UI.elements.charSkillsContainer) {
      // Remove previously appended skill items
      const previousSkills = window.IAG_UI.elements.charSkillsContainer.querySelectorAll(".skill-item-line");
      previousSkills.forEach(el => el.remove());
      
      const skills = state.character.skills || {};
      const skillEntries = Object.entries(skills);
      
      if (skillEntries.length === 0) {
        if (window.IAG_UI.elements.charSkillsEmpty) window.IAG_UI.elements.charSkillsEmpty.style.display = "block";
      } else {
        if (window.IAG_UI.elements.charSkillsEmpty) window.IAG_UI.elements.charSkillsEmpty.style.display = "none";
        skillEntries.forEach(([skillId, level]) => {
          const item = document.createElement("div");
          item.className = "stat-item skill-item-line";
          item.innerHTML = `
            <span class="stat-label">${window.IAG_UI.formatSkillName(skillId)}</span>
            <span class="stat-val stat-val-cyan">Rank ${level}</span>
          `;
          item.onclick = () => window.IAG_UI.openSkillModal(skillId);
          window.IAG_UI.elements.charSkillsContainer.appendChild(item);
        });
      }
    }

    // 2. Equipment Slots Render
    const slots = ["head", "neck", "ears", "torso", "wrists", "hands", "pants", "shoes", "pockets"];
    slots.forEach(slot => {
      const slotEl = window.IAG_UI.elements[`slot${slot.charAt(0).toUpperCase() + slot.slice(1)}`];
      if (slotEl) {
        const equippedItem = state.character.equipped ? state.character.equipped[slot] : null;
        if (equippedItem) {
          slotEl.textContent = equippedItem;
          slotEl.className = "equip-slot-box filled";
          slotEl.onclick = () => {
            window.IAG_UI.handleUnequipItem(slot);
            window.IAG_UI.renderAll();
          };
        } else {
          slotEl.textContent = "Empty";
          slotEl.className = "equip-slot-box";
          slotEl.onclick = null;
        }
      }
    });    // 3. Quest Log
    if (window.IAG_UI.elements.questList) {
      window.IAG_UI.elements.questList.innerHTML = "";
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
        window.IAG_UI.elements.questList.appendChild(questEl);
      }
      if (!hasQuests) {
        window.IAG_UI.elements.questList.innerHTML = `<div class="empty-card">No Active Quests</div>`;
      }
    }

    // 4. Seed and system panel
    if (window.IAG_UI.elements.systemSeed) {
      window.IAG_UI.elements.systemSeed.textContent = state.seed;
    }

    // 5. Action History Log
    if (window.IAG_UI.elements.actionLogs) {
      window.IAG_UI.elements.actionLogs.innerHTML = "";
      state.history.slice().reverse().forEach(log => {
        const logEl = document.createElement("div");
        logEl.className = "log-line";
        logEl.innerHTML = `<span class="log-timestamp">[SYSTEM]</span> ${log}`;
        window.IAG_UI.elements.actionLogs.appendChild(logEl);
      });
    }

    // 6. Dev Notes drawer values
    if (window.IAG_UI.elements.devSceneId) window.IAG_UI.elements.devSceneId.textContent = state.sceneId;
    if (window.IAG_UI.elements.devSeed) window.IAG_UI.elements.devSeed.textContent = state.seed;
    if (window.IAG_UI.elements.devRngCounter) window.IAG_UI.elements.devRngCounter.textContent = state.rngCounter !== undefined ? state.rngCounter : 0;
    if (window.IAG_UI.elements.devLastEffect) {
      window.IAG_UI.elements.devLastEffect.textContent = state.lastEffect ? JSON.stringify(state.lastEffect) : "None";
    }
    if (window.IAG_UI.elements.devLastSkillCheck) {
      if (!state.lastSkillCheck) {
        window.IAG_UI.elements.devLastSkillCheck.textContent = "None";
      } else {
        const c = state.lastSkillCheck;
        const attrName = c.attributeId ? (c.attributeId.charAt(0).toUpperCase() + c.attributeId.slice(1)) : "None";
        const advDis = c.advantage ? " (Advantage)" : (c.disadvantage ? " (Disadvantage)" : "");
        const rollStr = (c.advantage || c.disadvantage) ? `${c.roll} [rolled ${c.roll1}, ${c.roll2}]` : `${c.roll}`;
        window.IAG_UI.elements.devLastSkillCheck.textContent = `${c.skillName} Check vs DC ${c.challenge} | Roll: ${rollStr}${advDis} | Modifier: +${c.modifier} (Rank ${c.skillRank} + ${attrName} ${c.attributeBonus}) | Total: ${c.total} [${c.success ? "SUCCESS" : "FAILURE"}]`;
      }
    }
    if (window.IAG_UI.elements.devWorldFlags) {
      window.IAG_UI.elements.devWorldFlags.textContent = JSON.stringify(state.worldFlags || {}, null, 2);
    }
    if (window.IAG_UI.elements.devQuestFlags) {
      window.IAG_UI.elements.devQuestFlags.textContent = JSON.stringify(state.questFlags || {}, null, 2);
    }

    // 7. Story narrative core scene
    window.IAG_UI.renderStoryScene(state.sceneId);
  }

window.IAG_UI.formatBonus = function(bonus) {
    if (!bonus) return "None";
    if (bonus.choice) {
      return `+${bonus.choice} to Chosen Attribute`;
    }
    return Object.entries(bonus)
      .map(([attr, val]) => `+${val} ${attr.charAt(0).toUpperCase() + attr.slice(1)}`)
      .join(", ");
  }

window.IAG_UI.formatSkillName = function(skillId) {
    if (!skillId) return "Unknown";
    if (window.IAG_DATA && window.IAG_DATA.skill_definitions && window.IAG_DATA.skill_definitions[skillId]) {
      return window.IAG_DATA.skill_definitions[skillId].name;
    }
    return skillId
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

window.IAG_UI.start = function() {
    window.IAG_UI.initCache();
    window.IAG_UI.bindEvents();
    window.IAG_UI.initializeCreationWizard();
    window.IAG_UI.renderAll();
  }

window.IAG_UI.bindEvents = function() {
    // Bind Dev Drawer toggle controls
    if (window.IAG_UI.elements.devToggleBtn) {
      window.IAG_UI.elements.devToggleBtn.addEventListener("click", () => {
        if (window.IAG_UI.elements.devDrawer) {
          window.IAG_UI.elements.devDrawer.classList.toggle("active");
        }
      });
    }

    if (window.IAG_UI.elements.closeDevBtn) {
      window.IAG_UI.elements.closeDevBtn.addEventListener("click", () => {
        if (window.IAG_UI.elements.devDrawer) {
          window.IAG_UI.elements.devDrawer.classList.remove("active");
        }
      });
    }

    if (window.IAG_UI.elements.exportBtn) {
      window.IAG_UI.elements.exportBtn.addEventListener("click", () => {
        window.IAG_STATE.exportSaveToFile();
      });
    }

    if (window.IAG_UI.elements.importFile) {
      window.IAG_UI.elements.importFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
          const imported = window.IAG_STATE.importSaveFromString(evt.target.result);
          if (imported) {
            // Reset character wizard local properties if loaded save is active
            window.IAG_UI.state.selectedRaceId = "";
            window.IAG_UI.state.selectedProfessionId = "";
            if (window.IAG_UI.elements.characterNameInput) window.IAG_UI.elements.characterNameInput.value = "";
            window.IAG_UI.initializeCreationWizard();
            window.IAG_UI.renderAll();
          } else {
            alert("Failed to parse save file. Check format.");
          }
        };
        reader.readAsText(file);
      });
    }

    if (window.IAG_UI.elements.newGameBtn) {
      window.IAG_UI.elements.newGameBtn.addEventListener("click", () => {
        const customSeed = window.IAG_UI.elements.customSeedInput ? window.IAG_UI.elements.customSeedInput.value.trim() : "";
        window.IAG_STATE.initializeNewGame(customSeed || null);
        if (window.IAG_UI.elements.customSeedInput) window.IAG_UI.elements.customSeedInput.value = "";
        window.IAG_STATE.addHistoryLog("Started a new timeline sector.");
        
        // Reset local selection parameters
        window.IAG_UI.state.selectedRaceId = "";
        window.IAG_UI.state.selectedProfessionId = "";
        if (window.IAG_UI.elements.characterNameInput) window.IAG_UI.elements.characterNameInput.value = "";
        
        window.IAG_UI.initializeCreationWizard();
        window.IAG_UI.renderAll();
      });
    }

    // Interactive Seeded dice rolling panel
    if (window.IAG_UI.elements.diceRollBtn) {
      window.IAG_UI.elements.diceRollBtn.addEventListener("click", () => {
        const state = window.IAG_STATE.get();
        const roll = window.IAG_ENGINE.rollD20(state);
        
        if (window.IAG_UI.elements.diceResult) {
          window.IAG_UI.elements.diceResult.textContent = `D20: [${roll}]`;
          window.IAG_UI.elements.diceResult.classList.remove("flash");
          void window.IAG_UI.elements.diceResult.offsetWidth; // Trigger reflow
          window.IAG_UI.elements.diceResult.classList.add("flash");
        }
        
        window.IAG_STATE.addHistoryLog(`Rolled D20 and got a deterministic result of ${roll}.`);
      });
    }

    // Inventory & Gear modal trigger
    if (window.IAG_UI.elements.inventoryTriggerBtn) {
      window.IAG_UI.elements.inventoryTriggerBtn.addEventListener("click", () => {
        window.IAG_UI.openInventoryModal("backpack", "all");
      });
    }

    // Directives Journal modal trigger
    if (window.IAG_UI.elements.questsTriggerBtn) {
      window.IAG_UI.elements.questsTriggerBtn.addEventListener("click", () => {
        window.IAG_UI.openQuestsModal();
      });
    }

    // Close button for popup modal
    if (window.IAG_UI.elements.modalCloseBtn) {
      window.IAG_UI.elements.modalCloseBtn.addEventListener("click", () => {
        if (window.IAG_UI.elements.gameModalOverlay) {
          window.IAG_UI.elements.gameModalOverlay.style.display = "none";
        }
      });
    }

    // Close modal on click outside boundary
    if (window.IAG_UI.elements.gameModalOverlay) {
      window.IAG_UI.elements.gameModalOverlay.addEventListener("click", (e) => {
        if (e.target === window.IAG_UI.elements.gameModalOverlay) {
          window.IAG_UI.elements.gameModalOverlay.style.display = "none";
        }
      });
    }

    // Bind state changes to redraw the UI automatically
    window.addEventListener("iag-state-updated", () => {
      window.IAG_UI.renderAll();
    });
  }

window.IAG_UI.renderTopStatusBar = function() {
  const container = document.getElementById("top-status-bar");
  if (!container) return;

  const state = window.IAG_STATE.get();
  if (!state) return;

  const seed = state.seed || "IA-000000";
  const sceneId = state.sceneId || "arrival";
  
  const scene = window.IAG_STORY.getScene(sceneId);
  const locationName = scene ? scene.title : "Marrow Station Outer Ring";

  // Deterministically hash the sceneId to grid coordinates (0 to 2)
  let sum = 0;
  for (let i = 0; i < sceneId.length; i++) {
    sum += sceneId.charCodeAt(i);
  }
  const gridX = sum % 3;
  const gridY = (sum >> 2) % 3;

  // Deterministically hash seed to get a sector descriptor
  let seedSum = 0;
  for (let i = 0; i < seed.length; i++) {
    seedSum += seed.charCodeAt(i);
  }
  const sectors = ["Alpha", "Beta", "Gamma", "Epsilon", "Sigma", "Omega"];
  const sectorName = sectors[seedSum % sectors.length];
  const sectorNum = (seedSum * 7) % 99 + 1;
  const quadrantLabel = `Quadrant ${sectorName}-${sectorNum} (Grid [${gridX}, ${gridY}])`;

  // Draw 3x3 quadrant mini map
  let mapHtml = `<div class="map-quadrant-mini" title="${quadrantLabel}">`;
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const activeClass = (x === gridX && y === gridY) ? "active" : "";
      mapHtml += `<div class="map-cell ${activeClass}"></div>`;
    }
  }
  mapHtml += `</div>`;

  const baseCycle = 3842.10;
  const currentCycle = (baseCycle + (state.rngCounter || 0) * 0.15).toFixed(2);

  container.innerHTML = `
    <div class="status-item">
      <span class="status-lbl">📍 Location:</span>
      <span class="status-val">${locationName}</span>
    </div>
    <div class="status-item">
      <span class="status-lbl">🌍 Spatial Sector:</span>
      <span class="status-val" style="margin-right: 0.5rem;">${sectorName}-${sectorNum}</span>
      ${mapHtml}
    </div>
    <div class="status-item">
      <span class="status-lbl">⏳ System Cycle:</span>
      <span class="status-val">${currentCycle}</span>
    </div>
  `;
};

window.IAG_DEV_SMOKE = {
  run() {
    const checks = [
      { name: "window.IAG_DATA exists", pass: !!window.IAG_DATA },
      { name: "window.IAG_ENGINE exists", pass: !!window.IAG_ENGINE },
      { name: "window.IAG_STATE exists", pass: !!window.IAG_STATE },
      { name: "window.IAG_STORY exists", pass: !!window.IAG_STORY },
      { name: "window.IAG_UI exists", pass: !!window.IAG_UI },
      { name: "window.IAG_UI.start is a function", pass: typeof (window.IAG_UI && window.IAG_UI.start) === "function" },
      { name: "window.IAG_UI.renderAll is a function", pass: typeof (window.IAG_UI && window.IAG_UI.renderAll) === "function" },
      { name: "window.IAG_UI.elements exists", pass: !!(window.IAG_UI && window.IAG_UI.elements) },
      { name: "DOM #char-name exists", pass: !!document.getElementById("char-name") },
      { name: "DOM #character-creation-panel exists", pass: !!document.getElementById("character-creation-panel") },
      { name: "DOM #story-title exists", pass: !!document.getElementById("story-title") },
      { name: "DOM #story-choices exists", pass: !!document.getElementById("story-choices") },
      { name: "DOM #action-logs exists", pass: !!document.getElementById("action-logs") },
      { name: "DOM #dev-last-skill-check exists", pass: !!document.getElementById("dev-last-skill-check") },
      { name: "DOM #inventory-trigger-btn exists", pass: !!document.getElementById("inventory-trigger-btn") },
      { name: "DOM #quests-trigger-btn exists", pass: !!document.getElementById("quests-trigger-btn") },
      { name: "DOM #game-modal-overlay exists", pass: !!document.getElementById("game-modal-overlay") }
    ];

    console.table(checks);
    const allPassed = checks.every(c => c.pass);
    console.log(`Smoke test execution: ${allPassed ? "PASSED" : "FAILED"}`);
    return allPassed;
  }
};