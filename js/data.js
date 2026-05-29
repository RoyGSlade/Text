/**
 * Infinite Ages: Genesis - Normalized Runtime Game Data
 * File: js/data.js
 * Purpose: Exposes the standardized, normalized runtime data layer (window.IAG_DATA)
 *          conforming to lower_snake_case IDs and unified naming conventions.
 */

window.IAG_DATA = {
  races: {
    android: {
      id: "android",
      name: "Android",
      movement: 40,
      vision: "Night vision and superior vision",
      resistance: "Don't require food or air, but must charge every 17 hours or they will power down",
      age: {
        adult: 5,
        max: 150
      },
      attribute_bonus: {
        intelligence: 2
      },
      skill_options: [
        "medical",
        "mechanics",
        "science",
        "technology"
      ],
      description: "Androids are synthetic beings created by humans to solve complex problems. Over time, they develop their own personalities and independence. They require no sustenance but must recharge regularly."
    },
    human: {
      id: "human",
      name: "Human",
      movement: 30,
      vision: "Normal 20/20 vision",
      resistance: "Can survive unprotected in space for 3 rounds",
      age: {
        adult: 18,
        max: 80
      },
      attribute_bonus: {
        choice: 2,
        count: 1
      },
      skill_options: [
        "medical",
        "mechanics",
        "science",
        "technology"
      ],
      description: "Humans are adaptive and resilient, with a history of innovation and survival. They’ve evolved to survive briefly in the vacuum of space and are known for their versatility and creativity."
    },
    kilmerian: {
      id: "kilmerian",
      name: "Kilmerian",
      movement: 45,
      vision: "Dark Vision",
      resistance: "Toxic Fumes",
      age: {
        adult: 20,
        max: 140
      },
      attribute_bonus: {
        constitution: 2
      },
      skill_options: [
        "operator",
        "unarmed",
        "melee",
        "athlete"
      ],
      description: "Kilmerians are muscular, resilient warriors from Titan. They are deeply tied to their traditions, often serve as mercenaries, and thrive in harsh environments thanks to their physical endurance."
    },
    saronian: {
      id: "saronian",
      name: "Saronian",
      movement: 30,
      vision: "Normal 20/20 vision",
      resistance: "Cold",
      age: {
        adult: 100,
        max: 500
      },
      attribute_bonus: {
        wisdom: 2
      },
      skill_options: [
        "operator",
        "unarmed",
        "melee",
        "athlete"
      ],
      special: "Can speak telepathically",
      description: "Saronians are ancient, empathetic, and flexible beings with vast knowledge and wisdom. With telepathic abilities and access to advanced technology, they are respected for intellect and emotional insight."
    }
  },

  professions: {
    astronomer: {
      id: "astronomer",
      name: "Astronomer",
      starting_credits: 7500,
      passive: "Gain advantage when using a map to locate items",
      level_benefits: [
        "Always know the direction of north",
        "Retrace your steps to find the path",
        "Gain advantage when navigating spacecraft or seacraft",
        "Gain advantage on dexterity checks in unexplored places",
        "Once per month, your sense of direction draws you toward fortune"
      ],
      description: "Blackridge's observatory scholars read the fractured skies and guide caravans through the Rift, turning starlight into hidden roads to fortune."
    },
    doctor: {
      id: "doctor",
      name: "Doctor",
      starting_credits: 7500,
      passive: "Famed for a signature cure known across Blackridge",
      level_benefits: [
        "Party members regain double HP when recovering",
        "Gain advantage when stabilizing unconscious individuals",
        "Gain advantage when finding cures for familiar people",
        "Never misdiagnose a patient",
        "Once per month, find a cure without a roll"
      ],
      description: "In the clinic wards of Blackridge, doctors are revered lifesavers whose breakthroughs keep miners and militia on their feet."
    },
    software_engineer_mathematician: {
      id: "software_engineer_mathematician",
      name: "Software Engineer / Mathematician",
      starting_credits: 10000,
      passive: "Gain advantage when crafting algorithms or code",
      level_benefits: [
        "Make skill rolls with objects without spending actions",
        "Create and sell functional apps and algorithms",
        "Gain advantage when identifying issues with puzzles or machines",
        "Double successes on Intelligence-based skills",
        "Encode and decode secret messages with math and code"
      ],
      description: "Behind Blackridge's data vaults, these tech masters weave algorithms that safeguard secrets and decode ancient tech."
    },
    engineer: {
      id: "engineer",
      name: "Engineer",
      starting_credits: 10000,
      passive: "Engineering credentials grant access to Blackridge corporate labs",
      level_benefits: [
        "Builds cost half the normal amount",
        "Patent and sell your own builds",
        "Armor repairs add an extra d4 armor points",
        "Gain advantage when crafting a specialized item",
        "Specialized item builds take half the time and successes"
      ],
      description: "From the workshops of Blackridge, engineers forge siege engines and civic marvels that keep the city running."
    },
    bounty_hunter: {
      id: "bounty_hunter",
      name: "Bounty Hunter",
      starting_credits: 15000,
      passive: "Detect high-value bounties when entering establishments",
      bounty_detection_roll: "1d20>=19",
      level_benefits: [
        "Gain advantage when tracking living targets",
        "Ignore called shot penalties against bounties",
        "Gain advantage on speech checks with law enforcement",
        "Immune to stun status",
        "Rates are doubled and bounty gear costs 25% less"
      ],
      description: "Blackridge's bounty hunters prowl alleyways and spacelanes, licensed to haul in the city's most wanted."
    },
    mechanic: {
      id: "mechanic",
      name: "Mechanic",
      starting_credits: 10000,
      passive: "Fix any item once per day without parts or tools",
      level_benefits: [
        "Gain advantage on repairs in high-stakes situations",
        "Repair rolls may enhance or weaken the item",
        "Gain advantage when modifying repaired items",
        "+3 bonus to crafting table rolls",
        "Take an extra roll on the crafting table once per day"
      ],
      description: "Blackridge mechanics resurrect rusted relics and keep the city's convoy fleets rolling."
    }
  },

  leveling: [
    {
      level: 1,
      total_skill_levels: 0,
      power_points: 2,
      hp: true,
      actions: "1A 1R",
      profession: 1
    },
    {
      level: 2,
      total_skill_levels: 8,
      power_points: 4,
      attribute: 1,
      actions: "1A 1R"
    },
    {
      level: 3,
      total_skill_levels: 12,
      power_points: 6,
      actions: "1A 1R"
    },
    {
      level: 4,
      total_skill_levels: 16,
      power_points: 8,
      hp: true,
      attribute: 1,
      actions: "1A 1R"
    },
    {
      level: 5,
      total_skill_levels: 20,
      power_points: 10,
      profession: 2,
      actions: "1A 1R"
    }
  ],

  powers: {
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
  },

  towns: {
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
  },

  quests: {
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
  },

  scenes: {
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
  }
};
