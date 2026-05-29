window.IAG_DATA = window.IAG_DATA || {};
window.IAG_DATA.skill_definitions = {
  mechanics: {
    id: "mechanics",
    name: "Mechanics",
    attribute: "intelligence",
    description: "Repair, sabotage, machines, jury-rigging, and mechanical diagnosis."
  },
  technology: {
    id: "technology",
    name: "Technology",
    attribute: "intelligence",
    description: "Terminals, software, devices, signals, code, and electronic systems."
  },
  science: {
    id: "science",
    name: "Science",
    attribute: "intelligence",
    description: "Research, analysis, chemistry, physics, and technical reasoning."
  },
  medical: {
    id: "medical",
    name: "Medical",
    attribute: "wisdom",
    description: "Triage, diagnosis, treatment, stabilization, and biological knowledge."
  },
  operator: {
    id: "operator",
    name: "Operator",
    attribute: "dexterity",
    description: "Piloting, vehicle handling, machine operation, and control systems."
  },
  unarmed: {
    id: "unarmed",
    name: "Unarmed",
    attribute: "strength",
    description: "Grappling, strikes, physical control, and close-quarters force."
  },
  melee: {
    id: "melee",
    name: "Melee",
    attribute: "strength",
    description: "Handheld weapons, close combat, and weapon handling."
  },
  athlete: {
    id: "athlete",
    name: "Athlete",
    attribute: "strength",
    description: "Climbing, jumping, lifting, sprinting, and physical exertion."
  }
};

window.IAG_DATA.skills_progression = {
  athlete: {
    1: "Climb speed equals movement speed.",
    2: "Double jump height.",
    3: "Double sprint speed.",
    4: "+1 to group initiative.",
    5: "+2 to armor rating."
  },
  mechanics: {
    1: "Repair from blueprint without rolling.",
    2: "Install common upgrades with no roll.",
    3: "Replicate known machines faster.",
    4: "Craft unique upgrades with advantage.",
    5: "Create entirely new machines with advantage."
  },
  medical: {
    1: "Heal 1d4 + Wisdom with a kit.",
    2: "Stop Bleeding status.",
    3: "Heal 1d12 + Wisdom.",
    4: "Remove Injured status.",
    5: "Reproduce medicines at half cost."
  },
  technology: {
    1: "Add +2 to any roll involving coding or learning tech.",
    2: "Disable equipment with tools if you understand it.",
    3: "Upgrade devices to Splicers/Data Pads or tweak tech.",
    4: "Create blueprints for any tech you have access to.",
    5: "Advantage shutting down/dismantling systems on vehicles."
  },
  science: {
    1: "Gain +2 when studying or inspecting new science topics.",
    2: "Advantage identifying new technology.",
    3: "Sabotage technology you understand.",
    4: "Add a scientific academy to your training and gain its bonuses.",
    5: "Apply your Science level to any roll in Technology, Medical, Mechanics, or Nutrition."
  },
  operator: {
    1: "Operate vehicles without a skill check.",
    2: "Advantage on stealth with vehicles or ships.",
    3: "Spot wear and tear and use solid checklists for vehicle maintenance.",
    4: "Advantage on challenging vehicle maneuvers.",
    5: "You and your vehicle become one: repair it without a mechanic check."
  },
  melee: {
    1: "You have 1/2 cover when wielding a melee weapon within 10ft of an enemy.",
    2: "Deflect incoming shots, gaining +3 Armor Rating; costs one reaction.",
    3: "Your melee weapon damage is increased by +3.",
    4: "Using an action, you can accurately read a target’s Hitpoints.",
    5: "Attempt to finish a target below 25% HP with an opposed roll."
  },
  unarmed: {
    1: "Advantage on physical contests; unarmed damage 1d4+Constitution.",
    2: "Unarmed strikes deal 1d6+Constitution.",
    3: "Master submissions: one success can KO a startled target, or two rounds otherwise.",
    4: "While unarmed, gain extra attack (Flick).",
    5: "If dropped to 0 HP in combat, regain half HP once/day."
  }
};
