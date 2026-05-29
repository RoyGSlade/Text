window.IAG_DATA = window.IAG_DATA || {};
window.IAG_DATA.races = {
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
};
