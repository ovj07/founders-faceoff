const crises = [
  {
    name: "AI_COST_UP",
    description: "AI tools became expensive",
    aiMultiplier: 0.5,
  },
  {
    name: "MARKETING_BOOST",
    description: "Marketing performing well",
    marketingMultiplier: 1.5,
  },
  {
    name: "SERVER_CRASH",
    description: "Infrastructure failure",
    infraPenalty: 20,
  },
  {
    name: "RECESSION",
    description: "Market slowdown",
    revenueMultiplier: 0.7,
  },
  {
    name: "HIRING_STRIKE",
    description: "Employees unhappy",
    hiringPenalty: 15,
  },
];

function getRandomCrisis() {
  const random = Math.floor(Math.random() * crises.length);
  return crises[random];
}

module.exports = {
  getRandomCrisis,
};
