window.IAG_UI.openSkillModal = function(skillId) {
    const state = window.IAG_STATE.get();
    if (!state) return;

    const def = window.IAG_DATA.skill_definitions[skillId];
    const progression = window.IAG_DATA.skills_progression[skillId];
    const thresholds = window.IAG_DATA.success_thresholds || [0, 5, 10, 20, 30, 50];
    
    if (!def) return;
    
    const rank = state.character.skills[skillId] || 0;
    const successes = state.character.skillSuccesses ? (state.character.skillSuccesses[skillId] || 0) : 0;
    
    let progressHtml = "";
    if (rank >= 5) {
      progressHtml = `
        <div class="progress-container">
          <div class="progress-label-row">
            <span>Rank MAX achieved</span>
            <span>100% Mastery</span>
          </div>
          <div class="progress-bar-outer">
            <div class="progress-bar-inner" style="width: 100%;"></div>
          </div>
        </div>
      `;
    } else {
      const needed = thresholds[rank + 1] || 5;
      const percent = Math.min((successes / needed) * 100, 100);
      progressHtml = `
        <div class="progress-container">
          <div class="progress-label-row">
            <span>Progress to Rank ${rank + 1}</span>
            <span>${successes} / ${needed} successes</span>
          </div>
          <div class="progress-bar-outer">
            <div class="progress-bar-inner" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    }

    let levelsHtml = "";
    for (let r = 1; r <= 5; r++) {
      const perkDesc = progression ? (progression[r] || "Standard rank enhancement perk.") : "Standard rank perk.";
      const statusClass = r <= rank ? "active" : "locked";
      const statusLabel = r <= rank ? "Active" : "Locked";
      
      levelsHtml += `
        <div class="modal-list-item ${statusClass}">
          <strong>Rank ${r} (${statusLabel}):</strong> ${perkDesc}
        </div>
      `;
    }

    const bodyHtml = `
      <h2 style="font-family: var(--font-header); letter-spacing: 1px; color: var(--text-cyan); margin-bottom: 0.5rem;">
        ${def.name} Specialized Discipline
      </h2>
      <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 1px;">
        Core Attribute: <span style="color: var(--text-main); font-weight: 600;">${def.attribute.charAt(0).toUpperCase() + def.attribute.slice(1)}</span>
      </div>
      <p class="modal-desc">${def.description}</p>
      
      <div class="modal-section-title">Current Progression</div>
      ${progressHtml}
      
      <div class="modal-section-title">Discipline Rank Perks</div>
      <div class="modal-list">
        ${levelsHtml}
      </div>
    `;

    if (window.IAG_UI.elements.gameModalBody && window.IAG_UI.elements.gameModalOverlay) {
      window.IAG_UI.elements.gameModalBody.innerHTML = bodyHtml;
      window.IAG_UI.elements.gameModalOverlay.style.display = "flex";
    }
  }

window.IAG_UI.openProfessionModal = function() {
    const state = window.IAG_STATE.get();
    if (!state) return;

    const profId = state.character.professionId;
    const prof = window.IAG_DATA.professions[profId];
    if (!prof) return;

    const totalSkillLevels = Object.values(state.character.skills).reduce((sum, rank) => sum + rank, 0);
    const levelingTable = window.IAG_DATA.leveling || [];
    
    // Find progress to next level
    const currentLevel = state.character.level || 1;
    let progressHtml = "";
    if (currentLevel >= 30) {
      progressHtml = `
        <div class="progress-container">
          <div class="progress-label-row">
            <span>Level 30 (MAX)</span>
            <span>${totalSkillLevels} Total Skill Levels</span>
          </div>
          <div class="progress-bar-outer">
            <div class="progress-bar-inner" style="width: 100%;"></div>
          </div>
        </div>
      `;
    } else {
      const nextLevelData = levelingTable.find(l => l.level === currentLevel + 1);
      const currentLevelData = levelingTable.find(l => l.level === currentLevel);
      if (nextLevelData && currentLevelData) {
        const base = currentLevelData.total_skill_levels;
        const target = nextLevelData.total_skill_levels;
        const numerator = totalSkillLevels - base;
        const denominator = target - base;
        const percent = Math.max(0, Math.min((numerator / denominator) * 100, 100));
        
        progressHtml = `
          <div class="progress-container">
            <div class="progress-label-row">
              <span>Level ${currentLevel} &rarr; Level ${currentLevel + 1}</span>
              <span>Total Skill Levels: ${totalSkillLevels} / ${target}</span>
            </div>
            <div class="progress-bar-outer">
              <div class="progress-bar-inner" style="width: ${percent}%;"></div>
            </div>
          </div>
        `;
      }
    }

    // Determine active profession tier benefits
    const benefitsTierThresholds = [1, 5, 10, 15, 25];
    let benefitsHtml = "";
    prof.level_benefits.forEach((benefit, index) => {
      const unlockLevel = benefitsTierThresholds[index];
      const isActive = currentLevel >= unlockLevel;
      const statusClass = isActive ? "active" : "locked";
      const statusLabel = isActive ? "Active" : `Unlocks at lvl ${unlockLevel}`;
      
      benefitsHtml += `
        <div class="modal-list-item ${statusClass}">
          <strong>Tier ${index + 1} (${statusLabel}):</strong> ${benefit}
        </div>
      `;
    });

    // List "Skills in my profession"
    let skillsHtml = "";
    const activeSkills = Object.entries(state.character.skills).filter(([_, rank]) => rank > 0);
    if (activeSkills.length === 0) {
      skillsHtml = `<div style="grid-column: span 2; font-size: 0.85rem; font-style: italic; color: var(--text-muted);">No trained skills active in profile.</div>`;
    } else {
      activeSkills.forEach(([skillId, rank]) => {
        skillsHtml += `
          <div style="background: hsla(180, 100%, 45%, 0.05); border: 1px solid var(--border-neon); border-radius: 4px; padding: 0.4rem 0.8rem; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: var(--text-main);">${window.IAG_UI.formatSkillName(skillId)}</span>
            <span style="color: var(--text-cyan); font-weight: 700;">Rank ${rank}</span>
          </div>
        `;
      });
    }

    const bodyHtml = `
      <h2 style="font-family: var(--font-header); letter-spacing: 1px; color: var(--text-cyan); margin-bottom: 0.5rem;">
        ${prof.name} Critical Subsystem
      </h2>
      <p class="modal-desc">${prof.description}</p>
      
      <div class="modal-section-title">Subsystem Passive</div>
      <div style="background: hsla(28, 100%, 50%, 0.06); border-left: 3px solid var(--accent-orange); padding: 0.6rem 0.8rem; font-size: 0.85rem; border-radius: 0 4px 4px 0; margin-bottom: 1.5rem; line-height: 1.4;">
        <strong>Active Subsystem Authority:</strong> ${prof.passive}
      </div>

      <div class="modal-section-title">Character Integrity Progress</div>
      ${progressHtml}

      <div class="modal-section-title">Profession Tier Benefits</div>
      <div class="modal-list" style="margin-bottom: 1.5rem;">
        ${benefitsHtml}
      </div>

      <div class="modal-section-title">Discipline Skill Signature Matrix</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
        ${skillsHtml}
      </div>
    `;

    if (window.IAG_UI.elements.gameModalBody && window.IAG_UI.elements.gameModalOverlay) {
      window.IAG_UI.elements.gameModalBody.innerHTML = bodyHtml;
      window.IAG_UI.elements.gameModalOverlay.style.display = "flex";
    }
  }

window.IAG_UI.openBackpackModal = function(category = "all") {
    window.IAG_UI.activeBackpackCategory = category;
    const state = window.IAG_STATE.get();
    if (!state) return;

    const inventory = state.inventory || [];
    const itemDefs = window.IAG_DATA.item_definitions || {};

    const categories = [
      { id: "all", label: "🎒 All" },
      { id: "weapon_armor", label: "⚔️ Gear" },
      { id: "utility", label: "🔧 Utilities" },
      { id: "consumable", label: "🧪 Consumables" },
      { id: "material", label: "🧱 Materials" }
    ];

    let tabsHtml = `<div class="backpack-tabs">`;
    categories.forEach(cat => {
      const activeClass = cat.id === window.IAG_UI.activeBackpackCategory ? "active" : "";
      tabsHtml += `
        <button class="backpack-tab-btn ${activeClass}" onclick="window.IAG_UI.switchBackpackCategory('${cat.id}')">
          ${cat.label}
        </button>
      `;
    });
    tabsHtml += `</div>`;

    // Filter and group items
    let filteredItems = [];
    inventory.forEach(itemName => {
      const def = itemDefs[itemName] || { name: itemName, itemCategory: "misc", description: "Standard adventure item." };
      
      // Category filter check
      let matches = false;
      if (window.IAG_UI.activeBackpackCategory === "all") {
        matches = true;
      } else if (window.IAG_UI.activeBackpackCategory === "weapon_armor") {
        matches = def.itemCategory === "weapon" || def.itemCategory === "armor";
      } else {
        matches = def.itemCategory === window.IAG_UI.activeBackpackCategory;
      }

      if (matches) {
        filteredItems.push({ originalName: itemName, def });
      }
    });

    let listHtml = "";
    if (filteredItems.length === 0) {
      listHtml = `<div class="empty-backpack-msg">Backpack has no items in this category.</div>`;
    } else {
      listHtml = `<div class="backpack-list">`;
      filteredItems.forEach(item => {
        const d = item.def;
        const rarityColor = d.rarity === "rare" ? "var(--accent-orange)" : (d.rarity === "uncommon" ? "var(--text-cyan)" : "var(--text-main)");
        
        let actionsHtml = "";
        
        // Equip button
        if (d.equip) {
          actionsHtml += `
            <button class="action-btn-sm equip-btn" onclick="window.IAG_UI.backpackEquip('${item.originalName}')">
              Equip
            </button>
          `;
        }
        
        // Use button
        if (d.itemCategory === "consumable" || (d.tags && d.tags.includes("consumable"))) {
          actionsHtml += `
            <button class="action-btn-sm use-btn" onclick="window.IAG_UI.backpackUse('${item.originalName}')">
              Use
            </button>
          `;
        }
        
        // Drop button
        actionsHtml += `
          <button class="action-btn-sm drop-btn" onclick="window.IAG_UI.backpackDrop('${item.originalName}')">
            Drop
          </button>
        `;

        listHtml += `
          <div class="backpack-item-card">
            <div class="item-left">
              <span class="item-card-name" style="color: ${rarityColor};">${d.name}</span>
              <span class="item-card-desc">${d.description || "No description."}</span>
              <div class="item-card-meta">
                <span>Value: ${d.value || 0} cr</span>
                <span>Weight: ${d.weight || 0} kg</span>
                ${d.equip ? `<span>Slot: ${d.equip.slot.toUpperCase()}</span>` : ""}
              </div>
            </div>
            <div class="item-right-actions">
              ${actionsHtml}
            </div>
          </div>
        `;
      });
      listHtml += `</div>`;
    }

    const bodyHtml = `
      <h2 style="font-family: var(--font-header); letter-spacing: 1px; color: var(--text-cyan); margin-bottom: 0.5rem;">
        🎒 Storage Container Backpack
      </h2>
      <p class="modal-desc" style="margin-bottom: 0.5rem;">Grouped inventory of unequipped supplies, blueprints, and weapons.</p>
      
      ${tabsHtml}
      ${listHtml}
    `;

    if (window.IAG_UI.elements.gameModalBody && window.IAG_UI.elements.gameModalOverlay) {
      window.IAG_UI.elements.gameModalBody.innerHTML = bodyHtml;
      window.IAG_UI.elements.gameModalOverlay.style.display = "flex";
    }
  }