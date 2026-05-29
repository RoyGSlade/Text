window.IAG_DATA = window.IAG_DATA || {};

window.IAG_DATA.powers = {
  "mind_manipulation.telepathy": {
    name: "Telepathy",
    level: 1,
    activation_cost: "1 Action or At Will",
    duration: "Instant",
    range: "1000 ft",
    uses: "Unlimited",
    source: {
      title: "Infinite Ages Genesis",
      pages: [42, 162]
    },
    description: "Mentally communicate a message to a number of willing targets equal to your powers in Mind-Manipulation. If in combat, you may not go over the allotted amount of words given with free speech. Note: The targets cannot respond in any way mentally."
  },
  "mind_manipulation.pacify": {
    name: "Pacify",
    level: 1,
    activation_cost: "1 Action",
    duration: "1 minute",
    range: "100 ft",
    uses: "Twice per day",
    source: {
      title: "Infinite Ages Genesis",
      pages: [42, 162]
    },
    description: "You can target a number of aggressive people equal to the amount of powers you have in Mind-Manipulation. You may pacify these people for one minute, making them neutral towards you and your party. If the targets are attacked by you or your party, this power ends, and they become aggressive again and are aware they were messed with. If you are in combat, they may make an opposed wisdom check against you."
  }
};

window.IAG_DATA.towns = {
  blackridge: {
    id: "blackridge",
    zone: "forest",
    entry_cell: "cell:forest:1,0",
    buildings: [
      "grimy_anvil",
      "warm_loaf_bakery",
      "city_hall",
      "clinic",
      "tavern",
      "guard_post",
      "merchant_guild",
      "adventurer_guild",
      "barracks",
      "library",
      "arcanum_tower"
    ]
  }
};

window.IAG_DATA.quests = {
  "quest.guild.tutorial-commission": {
    id: "quest.guild.tutorial-commission",
    title: "How To Not Die: Commissions & Permits",
    tags: [
      "adventurer_guild",
      "tutorial",
      "legal"
    ],
    description: "Learn the Guild flow: permit, commission, verification, and payout rules.",
    stages: [
      {
        id: "approach-desk",
        text: "Speak to the Head Clerk at the Adventurer Guild.",
        completion_check: {
          flags_any: [
            "br:spokeToHeadClerk"
          ]
        }
      },
      {
        id: "obtain-permit",
        text: "Obtain a Novice Permit from the Guild.",
        completion_check: {
          flags_any: [
            "br:permitTier>=1"
          ]
        }
      },
      {
        id: "accept-commission",
        text: "Take a legal commission from the job board.",
        completion_check: {
          have: [
            {
              item_id: "item.guild.commission",
              qty: 1
            }
          ]
        }
      },
      {
        id: "verify-stamp",
        text: "Get your commission stamped by City Hall or the on-duty inspector.",
        completion_check: {
          have: [
            {
              item_id: "item.guild.stamp-cityhall",
              qty: 1
            }
          ]
        }
      },
      {
        id: "briefing-complete",
        text: "Return to the Head Clerk for final briefing.",
        completion_check: {
          flags_any: [
            "br:tutorialGuildBriefed"
          ]
        },
        rewards: [
          {
            type: "incCredits",
            value: 25
          }
        ]
      }
    ]
  }
};

window.IAG_DATA.scenes = {
  "town:blackridge:well": {
    text: "The town well gapes. One brick on the north rim sits loose.",
    choices: [
      {
        text: "[Quest] Pry the loose brick",
        requires: {
          quest_active: "espionage:the_lever"
        },
        actions: [
          {
            type: "addItem",
            item_id: "blackmail_package",
            qty: 1
          },
          {
            type: "setFlag",
            flag: "espionage_package_acquired",
            value: true
          },
          {
            type: "completeQuestObjective",
            quest_id: "espionage:the_lever",
            objective_id: 0
          }
        ],
        leads_to: "town:blackridge:well_package_found"
      },
      {
        text: "Draw water",
        leads_to: "town:blackridge"
      },
      {
        text: "Return to town square",
        leads_to: "town:blackridge"
      }
    ]
  },
  "town:blackridge:well_package_found": {
    text: "Oilskin bundle in hand: deeds, confessions, perfume. The town’s throat, in paper.",
    choices: [
      {
        text: "Confront Mayor Sel",
        leads_to: "scene:confront_mayor"
      },
      {
        text: "Confront Director Cale",
        leads_to: "scene:confront_cale"
      },
      {
        text: "Show Captain Rel",
        leads_to: "bldg:blackridge:guard_post"
      }
    ]
  },
  "town:blackridge:forest_outskirts": {
    text: "Trees crowd the path outside Blackridge; birdcalls cut through distant axes.",
    choices: [
      {
        text: "Forage for herbs",
        leads_to: "town:blackridge:forest_outskirts"
      },
      {
        text: "Head deeper into the forest",
        leads_to: "cell:forest:1,0"
      },
      {
        text: "Return to town",
        leads_to: "town:blackridge"
      }
    ]
  }
};
