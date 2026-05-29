window.IAG_UI.handleEquipItem = function(itemName) {
    window.IAG_STATE.update(state => {
      const itemDefs = window.IAG_DATA.item_definitions || {};
      const def = itemDefs[itemName];
      if (!def || !def.equip) return;
      
      const slot = def.equip.slot;
      state.character.equipped = state.character.equipped || {};
      const previouslyEquipped = state.character.equipped[slot];
      
      // Remove from inventory
      const idx = state.inventory.indexOf(itemName);
      if (idx !== -1) {
        state.inventory.splice(idx, 1);
      }
      
      // Equip new item
      state.character.equipped[slot] = itemName;
      state.history.push(`🛡️ Equipped ${itemName} to your ${slot.toUpperCase()} slot.`);
      if (state.history.length > 50) state.history.shift();
      
      // Return previous item to inventory
      if (previouslyEquipped) {
        state.inventory.push(previouslyEquipped);
        state.history.push(`🔄 Unequipped ${previouslyEquipped} and returned it to backpack.`);
        if (state.history.length > 50) state.history.shift();
      }
    });
    
    // Refresh modal and hud
    window.IAG_UI.openBackpackModal(window.IAG_UI.activeBackpackCategory);
    window.IAG_UI.renderAll();
  }

window.IAG_UI.handleUnequipItem = function(slot) {
    window.IAG_STATE.update(state => {
      if (!state.character.equipped || !state.character.equipped[slot]) return;
      const itemName = state.character.equipped[slot];
      state.character.equipped[slot] = null;
      state.inventory.push(itemName);
      state.history.push(`🔄 Unequipped ${itemName} and returned it to backpack.`);
      if (state.history.length > 50) state.history.shift();
    });
    window.IAG_UI.renderAll();
  }

window.IAG_UI.handleUseItem = function(itemName) {
    window.IAG_STATE.update(state => {
      const idx = state.inventory.indexOf(itemName);
      if (idx !== -1) {
        state.inventory.splice(idx, 1);
      }
      
      // Simple heal effect
      const currentHp = state.character.hp || 10;
      const maxHp = state.character.maxHp || 10;
      const healedHp = Math.min(currentHp + 5, maxHp);
      state.character.hp = healedHp;
      state.history.push(`🧪 Consumed ${itemName} and restored vital integrity. (+5 HP)`);
      if (state.history.length > 50) state.history.shift();
    });
    
    // Refresh modal and hud
    window.IAG_UI.openBackpackModal(window.IAG_UI.activeBackpackCategory);
    window.IAG_UI.renderAll();
  }

window.IAG_UI.handleDropItem = function(itemName) {
    window.IAG_STATE.update(state => {
      const idx = state.inventory.indexOf(itemName);
      if (idx !== -1) {
        state.inventory.splice(idx, 1);
      }
      state.history.push(`🗑️ Discarded ${itemName} from storage backpack.`);
      if (state.history.length > 50) state.history.shift();
    });
    
    // Refresh modal and hud
    window.IAG_UI.openBackpackModal(window.IAG_UI.activeBackpackCategory);
    window.IAG_UI.renderAll();
  }