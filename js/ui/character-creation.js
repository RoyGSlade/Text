window.IAG_UI.renderStarterSkills = function(skillOptions) {
    const container = document.getElementById("starter-skill-selection-container");
    if (!container || !window.IAG_UI.elements.starterSkillCardList) return;

    if (!skillOptions || skillOptions.length === 0) {
      container.style.display = "none";
      window.IAG_UI.elements.starterSkillCardList.innerHTML = "";
      return;
    }

    container.style.display = "block";
    window.IAG_UI.elements.starterSkillCardList.innerHTML = "";

    skillOptions.forEach(skillId => {
      const card = document.createElement("div");
      card.className = "selection-card skill-card";
      card.dataset.id = skillId;
      const def = window.IAG_DATA && window.IAG_DATA.skill_definitions && window.IAG_DATA.skill_definitions[skillId];
      const desc = def ? def.description : `Specialized expertise in the ${window.IAG_UI.formatSkillName(skillId)} discipline, granting advanced capability modifiers.`;
      card.innerHTML = `
        <div class="card-header">
          <h4>${window.IAG_UI.formatSkillName(skillId)}</h4>
          <span class="badge badge-skill">Rank 1</span>
        </div>
        <p class="card-desc">${desc}</p>
      `;
      card.addEventListener("click", () => {
        window.IAG_UI.state.selectedStarterSkillId = skillId;
        document.querySelectorAll("#starter-skill-card-list .selection-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        window.IAG_UI.updateCreationPreview();
        window.IAG_UI.validateCharacterCreation();
      });
      window.IAG_UI.elements.starterSkillCardList.appendChild(card);
    });
  }

window.IAG_UI.initializeCreationWizard = function() {
    const races = window.IAG_DATA.races;
    const professions = window.IAG_DATA.professions;

    window.IAG_UI.state.selectedRaceId = "";
    window.IAG_UI.state.selectedProfessionId = "";
    window.IAG_UI.state.selectedStarterSkillId = "";

    // Hide skill selection container initially
    const container = document.getElementById("starter-skill-selection-container");
    if (container) container.style.display = "none";

    // Render biological species selection grid
    if (window.IAG_UI.elements.raceCardList) {
      window.IAG_UI.elements.raceCardList.innerHTML = "";
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
            <div class="bonus-highlight"><strong>Bonus:</strong> ${window.IAG_UI.formatBonus(race.attribute_bonus)}</div>
          </div>
        `;
        card.addEventListener("click", () => {
          window.IAG_UI.state.selectedRaceId = raceId;
          window.IAG_UI.state.selectedStarterSkillId = ""; // Reset starter skill on species change
          document.querySelectorAll("#race-card-list .selection-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          
          // Render skill selections based on the new race selection
          window.IAG_UI.renderStarterSkills(race.skill_options);
          
          window.IAG_UI.updateCreationPreview();
          window.IAG_UI.validateCharacterCreation();
        });
        window.IAG_UI.elements.raceCardList.appendChild(card);
      });
    }

    // Render professions selection grid
    if (window.IAG_UI.elements.professionCardList) {
      window.IAG_UI.elements.professionCardList.innerHTML = "";
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
          window.IAG_UI.state.selectedProfessionId = profId;
          document.querySelectorAll("#profession-card-list .selection-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          window.IAG_UI.updateCreationPreview();
          window.IAG_UI.validateCharacterCreation();
        });
        window.IAG_UI.elements.professionCardList.appendChild(card);
      });
    }

    // Bind listeners to inputs
    if (window.IAG_UI.elements.characterNameInput) {
      window.IAG_UI.elements.characterNameInput.value = "";
      window.IAG_UI.elements.characterNameInput.addEventListener("input", () => {
        window.IAG_UI.updateCreationPreview();
        window.IAG_UI.validateCharacterCreation();
      });
    }

    if (window.IAG_UI.elements.confirmCharacterBtn) {
      // Clean up previous event listeners by cloning
      const oldBtn = window.IAG_UI.elements.confirmCharacterBtn;
      const newBtn = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(newBtn, oldBtn);
      window.IAG_UI.elements.confirmCharacterBtn = newBtn;
      
      window.IAG_UI.elements.confirmCharacterBtn.addEventListener("click", () => {
        window.IAG_UI.confirmCharacterSelection();
      });
    }

    window.IAG_UI.updateCreationPreview();
    window.IAG_UI.validateCharacterCreation();
  }

window.IAG_UI.updateCreationPreview = function() {
    if (!window.IAG_UI.elements.characterPreview) return;

    const name = window.IAG_UI.elements.characterNameInput ? window.IAG_UI.elements.characterNameInput.value.trim() : "";
    const races = window.IAG_DATA.races;
    const professions = window.IAG_DATA.professions;

    const race = races[window.IAG_UI.state.selectedRaceId];
    const profession = professions[window.IAG_UI.state.selectedProfessionId];

    // Compute base + bonus attributes (default starts at 0)
    const attrs = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    if (window.IAG_UI.state.selectedRaceId === "human") {
      attrs[window.IAG_UI.state.selectedHumanBonusAttr] = 2;
    } else if (race && race.attribute_bonus) {
      for (const [attr, val] of Object.entries(race.attribute_bonus)) {
        attrs[attr] = val;
      }
    }

    let humanSelectorHtml = "";
    if (window.IAG_UI.state.selectedRaceId === "human") {
      humanSelectorHtml = `
        <div class="human-bonus-container">
          <label for="human-bonus-select">Human Attribute Bonus (+2):</label>
          <select id="human-bonus-select" class="creation-select">
            <option value="strength" ${window.IAG_UI.state.selectedHumanBonusAttr === "strength" ? "selected" : ""}>Strength</option>
            <option value="dexterity" ${window.IAG_UI.state.selectedHumanBonusAttr === "dexterity" ? "selected" : ""}>Dexterity</option>
            <option value="constitution" ${window.IAG_UI.state.selectedHumanBonusAttr === "constitution" ? "selected" : ""}>Constitution</option>
            <option value="intelligence" ${window.IAG_UI.state.selectedHumanBonusAttr === "intelligence" ? "selected" : ""}>Intelligence</option>
            <option value="wisdom" ${window.IAG_UI.state.selectedHumanBonusAttr === "wisdom" ? "selected" : ""}>Wisdom</option>
            <option value="charisma" ${window.IAG_UI.state.selectedHumanBonusAttr === "charisma" ? "selected" : ""}>Charisma</option>
          </select>
        </div>
      `;
    }

    window.IAG_UI.elements.characterPreview.innerHTML = `
      <div class="preview-grid">
        <div class="preview-column">
          <h4>Identity Profile</h4>
          <div class="preview-item"><span class="lbl">Codename:</span> <span class="val highlighted">${name || "(Requires Codename)"}</span></div>
          <div class="preview-item"><span class="lbl">Species:</span> <span class="val">${race ? race.name : "Unchosen"}</span></div>
          <div class="preview-item"><span class="lbl">Profession:</span> <span class="val">${profession ? profession.name : "Unchosen"}</span></div>
          <div class="preview-item"><span class="lbl">Starter Skill:</span> <span class="val highlighted">${window.IAG_UI.state.selectedStarterSkillId ? window.IAG_UI.formatSkillName(window.IAG_UI.state.selectedStarterSkillId) : "Unchosen"}</span></div>
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
        window.IAG_UI.state.selectedHumanBonusAttr = e.target.value;
        window.IAG_UI.updateCreationPreview();
      });
    }
  }

window.IAG_UI.validateCharacterCreation = function() {
    const name = window.IAG_UI.elements.characterNameInput ? window.IAG_UI.elements.characterNameInput.value.trim() : "";
    const isValid = name.length > 0 && window.IAG_UI.state.selectedRaceId !== "" && window.IAG_UI.state.selectedProfessionId !== "" && window.IAG_UI.state.selectedStarterSkillId !== "";
    if (window.IAG_UI.elements.confirmCharacterBtn) {
      window.IAG_UI.elements.confirmCharacterBtn.disabled = !isValid;
    }
  }

window.IAG_UI.confirmCharacterSelection = function() {
    const name = window.IAG_UI.elements.characterNameInput ? window.IAG_UI.elements.characterNameInput.value.trim() : "";
    if (name.length === 0 || window.IAG_UI.state.selectedRaceId === "" || window.IAG_UI.state.selectedProfessionId === "" || window.IAG_UI.state.selectedStarterSkillId === "") return;

    const races = window.IAG_DATA.races;
    const professions = window.IAG_DATA.professions;

    const race = races[window.IAG_UI.state.selectedRaceId];
    const profession = professions[window.IAG_UI.state.selectedProfessionId];

    window.IAG_STATE.update(state => {
      state.character.name = name;
      state.character.raceId = window.IAG_UI.state.selectedRaceId;
      state.character.race = race.name;
      state.character.movement = race.movement;
      state.character.vision = race.vision;
      state.character.resistance = race.resistance;
      state.character.special = race.special || "";
      
      // Apply skills setup
      state.character.skills = {};
      if (window.IAG_UI.state.selectedStarterSkillId) {
        state.character.skills[window.IAG_UI.state.selectedStarterSkillId] = 1;
      }
      state.character.skillOptions = race.skill_options || [];

      // Apply attribute scores starting at 0 + race bonus
      state.character.attributes = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
      if (window.IAG_UI.state.selectedRaceId === "human") {
        state.character.attributes[window.IAG_UI.state.selectedHumanBonusAttr] = 2;
      } else if (race.attribute_bonus) {
        for (const [attr, val] of Object.entries(race.attribute_bonus)) {
          state.character.attributes[attr] = val;
        }
      }

      // Apply profession
      state.character.professionId = window.IAG_UI.state.selectedProfessionId;
      state.character.profession = profession.name;
      state.character.credits = profession.starting_credits;
      state.character.professionPassive = profession.passive;
      state.character.professionBenefits = profession.level_benefits;

      // Completion flag
      state.characterCreationComplete = true;

      // History log entries
      state.history.push(`Character created: ${name}, ${race.name} ${profession.name}.`);
      if (window.IAG_UI.state.selectedStarterSkillId) {
        state.history.push(`Starter skill selected: ${window.IAG_UI.formatSkillName(window.IAG_UI.state.selectedStarterSkillId)} Level 1.`);
      }
    });

    // Reset temporary selections
    window.IAG_UI.state.selectedRaceId = "";
    window.IAG_UI.state.selectedProfessionId = "";
    window.IAG_UI.state.selectedStarterSkillId = "";
    if (window.IAG_UI.elements.characterNameInput) window.IAG_UI.elements.characterNameInput.value = "";

    // Redraw interface
    window.IAG_UI.renderAll();
  }