window.IAG_DATA = window.IAG_DATA || {};
window.IAG_DATA.professions = {
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
};
