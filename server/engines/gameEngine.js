function calculateScore(player, crisisList) {
  const a = player.alloc;

  const total =
    a.product +
    a.marketing +
    a.hiring +
    a.infra +
    a.ai;

  // must use exactly 100
  if (total !== 100) {
    player.score -= 10;
    return;
  }

  let revenue =
    a.product * 0.5 +
    a.marketing * 0.4 +
    a.ai * 0.6;

  let stability =
    a.hiring * 0.3 +
    a.infra * 0.5;

  // risk if imbalance
  const maxInvest = Math.max(...Object.values(a));
  const minInvest = Math.min(...Object.values(a));

  let risk = (maxInvest - minInvest) * 0.4;

  // penalties for ignoring areas
  Object.values(a).forEach(v => {
    if (v < 10) risk += 3;
  });

  // apply crises
  crisisList.forEach(c => {
    if (c === "AI BAN") revenue -= a.ai * 0.7;
    if (c === "MARKET CRASH") revenue *= 0.6;
    if (c === "SERVER DOWN") stability *= 0.6;
    if (c === "HIRING FREEZE") stability -= a.hiring * 0.5;
    if (c === "BUDGET CUT") revenue *= 0.7;
  });

  let score =
    revenue * 1.2 +
    stability * 1.1 -
    risk * 1.3;

  if (score < 0) score = 0;

  player.score += Number(score.toFixed(4));
}
