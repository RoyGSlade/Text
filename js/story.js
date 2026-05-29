/**
 * Infinite Ages: Genesis - Adventure Narrative Graph
 * File: js/story.js
 * Purpose: Defines the narrative scene nodes, options, option requirements,
 *          and scene effects for the adventure gamebook.
 */

window.IAG_STORY = (function() {
  const scenes = {
    arrival: {
      id: "arrival",
      title: "Outer Ring: Arrival Segment",
      text: `You awaken in a cold, dim chamber of Marrow Station. The emergency lights blink slowly, pulsing a pale amber warning code. 
      Your head throbs with static interference. Next to you, a terminal displays a warning: 
      <span class="warning-text">CRITICAL SYSTEM ERROR - COMLINK RELAY DE-SYNCHRONIZED.</span>`,
      options: [
        {
          label: "Exit to the station's main Town Square",
          next: "town_square",
          effects: [{ type: "log", value: "You stepped out into the bustling Town Square of Marrow Station." }]
        },
        {
          label: "Investigate the terminal console closer",
          next: "relay_exterior",
          effects: [{ type: "log", value: "You accessed terminal records pointing to the main relay tower outside." }]
        }
      ]
    },

    town_square: {
      id: "town_square",
      title: "Marrow Station: Town Square",
      text: `The central hub of Marrow Station is filled with the low hum of atmospheric purifiers. 
      Merchants huddle near glowing neon food stalls, and transport workers carry heavy cargo containers. 
      High above the market, the massive, dark structure of the main Relay Tower towers over the station, its beacon completely dark.
      Near a docking bay, you spot a weary mechanic working on a hover-chassis.`,
      options: [
        {
          label: "Approach and talk to the Mechanic",
          next: "mechanic_npc",
          effects: [{ type: "log", value: "You walked over to strike up a conversation with the mechanic." }]
        },
        {
          label: "Head towards the exterior landing pad of the Relay Tower",
          next: "relay_exterior",
          effects: [{ type: "log", value: "You navigated the metal walkways towards the base of the Relay Tower." }]
        }
      ]
    },

    relay_exterior: {
      id: "relay_exterior",
      title: "Relay Tower: Base Exterior",
      text: `The cold vacuum of deep space is separated only by a shimmering magnetic forcefield on this exterior platform. 
      The massive fiber-optic trunk line of the relay runs into a heavy reinforced security door. 
      A small terminal sits next to the door, showing a locked red icon. Without access permission or mechanics training, you cannot hope to force it.`,
      options: [
        {
          label: "Study the relay access panel",
          next: "relay_exterior",
          effects: [
            {
              type: "skillCheck",
              skill: "mechanics",
              challenge: 10,
              successFlag: "relay_panel_understood",
              failureFlag: "relay_panel_failed_once",
              successLog: "You successfully trace the power nodes and decipher the station's electrical flow grid.",
              failureLog: "The security interface locks you out briefly and the circuit schematic remains incomprehensible."
            }
          ]
        },
        {
          label: "Analyze the relay terminal firmware",
          next: "relay_exterior",
          effects: [
            {
              type: "skillCheck",
              skill: "technology",
              challenge: 11,
              successFlag: "relay_firmware_understood",
              failureFlag: "relay_firmware_failed_once",
              successLog: "You bypass the terminal's code encryption and view the system schematic.",
              failureLog: "The firmware is heavily obfuscated and your decryptor times out."
            }
          ]
        },
        {
          label: "Use your understanding to bypass the panel",
          next: "locked_door",
          requires: { worldFlagAny: ["relay_panel_understood", "relay_firmware_understood"], errorMsg: "You must first study and successfully understand the relay panel or analyze its firmware." },
          effects: [
            { type: "setQuestStatus", questId: "investigate_relay", value: "completed" },
            { type: "log", value: "Using your deep system understanding, you reroute the main diagnostics link and force the doors open!" }
          ]
        },
        {
          label: "Attempt to hack the Locked Relay Door",
          next: "locked_door",
          // Requirements preview
          requires: { worldFlag: "has_bypass_chip", errorMsg: "You need a bypass chip or mechanic credentials to interact with this locked system." },
          effects: [
            { type: "setQuestStatus", questId: "investigate_relay", value: "completed" },
            { type: "log", value: "You used the Cracked Data Chip as a bypass key!" }
          ]
        },
        {
          label: "Return to the central Town Square to search for answers",
          next: "town_square"
        }
      ]
    },
 
    mechanic_npc: {
      id: "mechanic_npc",
      title: "Void Mechanic: Garin",
      text: `The mechanic wipes grease onto a thermal rag. "Name's Garin," he grunts, sizing you up. 
      "If you're here about the comms blackout, save your breath. The relay tower's main processing door is locked tight. 
      I lost my primary data decryptor chip in the square. If you can find a chip and bring it to me, I might be able to reprogram a security bypass for you."`,
      options: [
        {
          label: "Offer him your 'Cracked Data Chip'",
          next: "town_square",
          requires: { item: "Cracked Data Chip", errorMsg: "You do not have a data chip in your inventory." },
          effects: [
            { type: "removeItem", value: "Cracked Data Chip" },
            { type: "setWorldFlag", flag: "has_bypass_chip", value: true },
            { type: "addCredits", value: 50 },
            { type: "log", value: "Garin repaired the chip, configured a security key, and rewarded you with 50 credits!" }
          ]
        },
        {
          label: "Leave the mechanic to his work",
          next: "town_square"
        }
      ]
    },
 
    locked_door: {
      id: "locked_door",
      title: "Relay Control Room",
      text: `With a heavy hydraulic hiss, the security door slides open. Inside, a console blinks with raw system logs. 
      You have successfully bypassed the station security perimeter! The core relay terminal stands ready for repair.
      <br><br>
      <span class="success-text">CONGRATULATIONS! You have completed the Milestone 1 playable demo.</span>`,
      options: [
        {
          label: "Restart your journey (New Seed)",
          next: "arrival",
          effects: [
            { type: "resetGame" }
          ]
        }
      ]
    }
  };
 
  // Helper to get scene by ID
  function getScene(id) {
    return scenes[id] || scenes.arrival;
  }
 
  // Applies side-effects when selecting a choice
  function applyEffect(state, effect) {
    if (!effect || !effect.type) {
      console.warn("Invalid effect applied: null or missing type attribute", effect);
      return;
    }

    // Keep track of last executed effect in state for dev drawer debug
    state.lastEffect = effect;

    switch (effect.type) {
      case "log":
        window.IAG_STATE.addHistoryLog(effect.value);
        break;
      case "setWorldFlag":
        if (!effect.flag) {
          console.error("setWorldFlag effect is missing 'flag' key:", effect);
          break;
        }
        state.worldFlags[effect.flag] = effect.value;
        break;
      case "setQuestStatus":
        if (!effect.questId) {
          console.error("setQuestStatus effect is missing 'questId' key:", effect);
          break;
        }
        state.questFlags[effect.questId] = effect.value;
        break;
      case "removeItem":
        const idx = state.inventory.indexOf(effect.value);
        if (idx !== -1) {
          state.inventory.splice(idx, 1);
        }
        break;
      case "addItem":
        state.inventory.push(effect.value);
        break;
      case "addCredits":
        state.character.credits += effect.value;
        break;
      case "skillCheck":
        if (!effect.skill || effect.challenge === undefined) {
          console.error("skillCheck effect is missing 'skill' or 'challenge' property:", effect);
          break;
        }
        
        // Execute the skill check d20 roll
        const checkResult = window.IAG_ENGINE.skillCheck(state, effect.skill, effect.challenge);
        
        // Store in state for richer inspector tracking
        state.lastSkillCheck = {
          skill: checkResult.skill,
          skillName: checkResult.skillName,
          challenge: checkResult.challengeRating,
          roll: checkResult.finalRoll,
          roll1: checkResult.roll1,
          roll2: checkResult.roll2,
          skillRank: checkResult.skillRank,
          attributeId: checkResult.attributeId,
          attributeBonus: checkResult.attributeBonus,
          modifier: checkResult.modifier,
          total: checkResult.total,
          success: checkResult.success,
          advantage: checkResult.advantage,
          disadvantage: checkResult.disadvantage,
          timestamp: Date.now()
        };

        const attrName = checkResult.attributeId ? (checkResult.attributeId.charAt(0).toUpperCase() + checkResult.attributeId.slice(1)) : "";
        const formula = `d20 ${checkResult.finalRoll} + skill ${checkResult.skillRank} + ${attrName} ${checkResult.attributeBonus} = ${checkResult.total}`;

        // Apply flags and history log push
        if (checkResult.success) {
          if (effect.successFlag) {
            state.worldFlags[effect.successFlag] = true;
          }
          const logMsg = `${checkResult.skillName} check vs DC ${effect.challenge}: ${formula}. SUCCESS! ${effect.successLog || ""}`;
          state.history.push(logMsg);
          if (state.history.length > 50) state.history.shift();

          // Increment successes and handle leveling
          state.character.skillSuccesses = state.character.skillSuccesses || {};
          const currentSuccesses = (state.character.skillSuccesses[effect.skill] || 0) + 1;
          state.character.skillSuccesses[effect.skill] = currentSuccesses;

          const currentRank = state.character.skills[effect.skill] || 0;
          const thresholds = window.IAG_DATA.success_thresholds || [0, 5, 10, 20, 30, 50];
          const nextRank = currentRank + 1;
          if (nextRank < thresholds.length) {
            const needed = thresholds[nextRank];
            if (currentSuccesses >= needed) {
              state.character.skills[effect.skill] = nextRank;
              state.history.push(`🏆 SKILL UP! Your ${checkResult.skillName} skill leveled up to Rank ${nextRank}!`);
              if (state.history.length > 50) state.history.shift();
              
              // Trigger character level calculation
              window.IAG_ENGINE.checkCharacterLevelUp(state);
            }
          }
        } else {
          if (effect.failureFlag) {
            state.worldFlags[effect.failureFlag] = true;
          }
          const logMsg = `${checkResult.skillName} check vs DC ${effect.challenge}: ${formula}. FAILURE. ${effect.failureLog || ""}`;
          state.history.push(logMsg);
          if (state.history.length > 50) state.history.shift();
        }
        break;
      case "resetGame":
        window.IAG_STATE.initializeNewGame();
        break;
      default:
        console.warn(`Unknown effect type encountered: ${effect.type}`, effect);
    }
  }
 
  // Evaluates if a choice option is selectable based on current state
  function checkRequirement(state, requires) {
    if (!requires) return { satisfied: true };
 
    if (requires.item) {
      const satisfied = state.inventory.includes(requires.item);
      return { satisfied, errorMsg: requires.errorMsg };
    }
 
    if (requires.worldFlag) {
      const satisfied = !!state.worldFlags[requires.worldFlag];
      return { satisfied, errorMsg: requires.errorMsg };
    }

    if (requires.worldFlagAny) {
      const satisfied = requires.worldFlagAny.some(flag => !!state.worldFlags[flag]);
      return { satisfied, errorMsg: requires.errorMsg };
    }
 
    if (requires.questStatus) {
      const { questId, status } = requires.questStatus;
      const satisfied = state.questFlags[questId] === status;
      return { satisfied, errorMsg: requires.errorMsg };
    }
 
    // Backwards compatibility fallback for generic "flag" requirement
    if (requires.flag) {
      const satisfied = !!state.questFlags[requires.flag] || !!state.worldFlags[requires.flag];
      return { satisfied, errorMsg: requires.errorMsg };
    }
 
    return { satisfied: true };
  }
 
  return {
    getScene,
    applyEffect,
    checkRequirement
  };
})();
