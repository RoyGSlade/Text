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
    window.IAG_UI.openInventoryModal("backpack", category);
};

window.IAG_UI.openInventoryModal = function(subTab = "backpack", category = "all") {
    window.IAG_UI.activeBackpackCategory = category;
    const state = window.IAG_STATE.get();
    if (!state) return;

    const inventory = state.inventory || [];
    const itemDefs = window.IAG_DATA.item_definitions || {};

    // Header tabs
    const mainTabsHtml = `
      <div class="inventory-main-tabs">
        <button class="backpack-tab-btn ${subTab === 'backpack' ? 'active' : ''}" onclick="window.IAG_UI.openInventoryModal('backpack', '${category}')">
          🎒 Backpack Storage
        </button>
        <button class="backpack-tab-btn ${subTab === 'equipped' ? 'active' : ''}" onclick="window.IAG_UI.openInventoryModal('equipped', '${category}')">
          🛡️ Equipped Gear
        </button>
      </div>
    `;

    let contentHtml = "";

    if (subTab === "backpack") {
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
          <button class="backpack-tab-btn ${activeClass}" onclick="window.IAG_UI.openInventoryModal('backpack', '${cat.id}')">
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
          
          if (d.equip) {
            actionsHtml += `
              <button class="action-btn-sm equip-btn" onclick="window.IAG_UI.backpackEquip('${item.originalName}')">
                Equip
              </button>
            `;
          }
          
          if (d.itemCategory === "consumable" || (d.tags && d.tags.includes("consumable"))) {
            actionsHtml += `
              <button class="action-btn-sm use-btn" onclick="window.IAG_UI.backpackUse('${item.originalName}')">
                Use
              </button>
            `;
          }
          
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

      contentHtml = `
        ${tabsHtml}
        ${listHtml}
      `;
    } else {
      // subTab === "equipped"
      const slots = ["head", "neck", "ears", "torso", "wrists", "hands", "pants", "shoes", "pockets"];
      let slotsHtml = `<div class="equipment-grid" style="margin-top: 1rem;">`;
      
      slots.forEach(slot => {
        const equippedItem = state.character.equipped ? state.character.equipped[slot] : null;
        const filledClass = equippedItem ? "filled" : "";
        const actionHtml = equippedItem ? 
          `<button class="action-btn-sm drop-btn" style="margin-top: 0.5rem; width: 100%;" onclick="window.IAG_UI.backpackUnequip('${slot}')">Unequip</button>` : 
          `<span style="font-size: 0.75rem; color: var(--text-muted);">Empty Slot</span>`;

        slotsHtml += `
          <div class="equip-slot-container" data-slot="${slot}" style="border: 1px solid var(--border-neon); border-radius: 6px; padding: 0.8rem; background: rgba(0,0,0,0.25); display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-height: 90px; box-sizing: border-box;">
            <span class="equip-slot-label" style="font-family: var(--font-header); font-size: 0.7rem; color: var(--text-cyan); text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 1px;">${slot}</span>
            <div class="item-card-name" style="font-size: 0.85rem; font-weight: 600; text-align: center; color: ${equippedItem ? 'var(--text-main)' : 'var(--text-muted)'}; margin: 0.2rem 0;">
              ${equippedItem || "Empty"}
            </div>
            ${actionHtml}
          </div>
        `;
      });
      slotsHtml += `</div>`;

      contentHtml = slotsHtml;
    }

    const bodyHtml = `
      <h2 style="font-family: var(--font-header); letter-spacing: 1px; color: var(--text-cyan); margin-bottom: 0.5rem;">
        🎒 Personal Inventory Management
      </h2>
      <p class="modal-desc" style="margin-bottom: 1.5rem;">Access and configure active loadout gear, weapons, and backpack storage.</p>
      ${mainTabsHtml}
      ${contentHtml}
    `;

    if (window.IAG_UI.elements.gameModalBody && window.IAG_UI.elements.gameModalOverlay) {
      window.IAG_UI.elements.gameModalBody.innerHTML = bodyHtml;
      window.IAG_UI.elements.gameModalOverlay.style.display = "flex";
    }
};

window.IAG_UI.expandedQuestId = null;

window.IAG_UI.toggleQuestDetail = function(questId) {
  if (window.IAG_UI.expandedQuestId === questId) {
    window.IAG_UI.expandedQuestId = null;
  } else {
    window.IAG_UI.expandedQuestId = questId;
  }
  window.IAG_UI.openQuestsModal();
};

window.IAG_UI.openQuestsModal = function() {
  const state = window.IAG_STATE.get();
  if (!state) return;

  const questFlags = state.questFlags || {};
  const questEntries = Object.entries(questFlags);

  let questsHtml = "";

  if (questEntries.length === 0) {
    questsHtml = `<div class="empty-backpack-msg">Sector directives log is currently empty.</div>`;
  } else {
    questsHtml = `<div class="quests-journal-list" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">`;
    
    questEntries.forEach(([questId, status]) => {
      // Find structured data
      let def = window.IAG_DATA.quests && window.IAG_DATA.quests[questId];
      
      // Fallback details if not statically defined
      if (!def) {
        const beautifiedTitle = questId.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        def = {
          id: questId,
          title: beautifiedTitle,
          description: "Active timeline directive.",
          stages: [
            {
              id: "primary",
              text: `Investigate and resolve sector directive: ${beautifiedTitle}.`,
              completion_check: {
                flags_any: [
                  `${questId}_completed`
                ]
              }
            }
          ]
        };
      }

      const isCompleted = status === "completed";
      const badgeClass = isCompleted ? "completed" : "active";
      const badgeText = isCompleted ? "Completed" : "Active";
      const expandedClass = window.IAG_UI.expandedQuestId === questId ? "expanded" : "";
      const chevron = window.IAG_UI.expandedQuestId === questId ? "▲" : "▼";

      // Render stages
      let stagesHtml = "";
      if (def.stages && def.stages.length > 0) {
        stagesHtml += `<div class="quest-objectives-title">Directives Checkpoints</div>`;
        stagesHtml += `<div class="quest-objectives-list">`;
        
        def.stages.forEach(stage => {
          // Helper check
          let stageDone = false;
          if (isCompleted) {
            stageDone = true;
          } else if (stage.completion_check) {
            const check = stage.completion_check;
            if (check.flags_any) {
              stageDone = check.flags_any.some(flag => !!state.worldFlags[flag]);
            }
            if (check.have) {
              stageDone = check.have.every(itemReq => {
                const qty = state.inventory.filter(i => {
                  if (i === itemReq.item_id) return true;
                  const itemDef = window.IAG_DATA.item_definitions[i];
                  return itemDef && itemDef.id === itemReq.item_id;
                }).length;
                return qty >= (itemReq.qty || 1);
              });
            }
          }

          const itemClass = stageDone ? "completed" : "";
          const chkChar = stageDone ? "☑" : "☐";
          const chkClass = stageDone ? "completed" : "";

          stagesHtml += `
            <div class="quest-objective-item ${itemClass}">
              <span class="quest-objective-chk ${chkClass}">${chkChar}</span>
              <span>${stage.text}</span>
            </div>
          `;
        });
        
        stagesHtml += `</div>`;
      }

      questsHtml += `
        <div class="quest-detail-card">
          <div class="quest-detail-header" onclick="window.IAG_UI.toggleQuestDetail('${questId}')">
            <h3 class="${isCompleted ? 'completed' : ''}">${def.title}</h3>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="quest-status-badge ${badgeClass}">${badgeText}</span>
              <span style="font-size: 0.7rem; color: var(--text-muted);">${chevron}</span>
            </div>
          </div>
          <div class="quest-detail-body ${expandedClass}">
            <div class="quest-detail-desc">${def.description}</div>
            ${stagesHtml}
          </div>
        </div>
      `;
    });
    
    questsHtml += `</div>`;
  }

  const bodyHtml = `
    <h2 style="font-family: var(--font-header); letter-spacing: 1px; color: var(--text-cyan); margin-bottom: 0.5rem;">
      📜 Systems Directives Journal
    </h2>
    <p class="modal-desc" style="margin-bottom: 1.5rem;">Review sector directives, primary parameters, and active mission checkmarks.</p>
    ${questsHtml}
  `;

  if (window.IAG_UI.elements.gameModalBody && window.IAG_UI.elements.gameModalOverlay) {
    window.IAG_UI.elements.gameModalBody.innerHTML = bodyHtml;
    window.IAG_UI.elements.gameModalOverlay.style.display = "flex";
  }
};