const crises = [
  "AI BAN",
  "MARKET CRASH",
  "SERVER DOWN",
  "HIRING FREEZE",
  "BUDGET CUT",
  "MARKETING COST x2",
  "INVESTOR PRESSURE",
  "TECH DEBT SURGE"
];

function getRandomCrises() {
  const count = Math.floor(Math.random() * 3) + 1; // 1–3 crises
  const shuffled = crises.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

module.exports = { getRandomCrises };
