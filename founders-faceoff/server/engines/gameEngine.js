function calculateRound(room, allocations, crisis) {
  const results = [];

  room.players.forEach((player) => {
    const alloc = allocations[player.id];
    if (!alloc) return;

    let product = alloc.product || 0;
    let marketing = alloc.marketing || 0;
    let hiring = alloc.hiring || 0;
    let infra = alloc.infra || 0;
    let ai = alloc.ai || 0;

    // Apply crisis effects
    if (crisis.aiMultiplier) ai *= crisis.aiMultiplier;
    if (crisis.marketingMultiplier) marketing *= crisis.marketingMultiplier;
    if (crisis.infraPenalty) infra -= crisis.infraPenalty;
    if (crisis.hiringPenalty) hiring -= crisis.hiringPenalty;

    // Revenue
    let revenue =
      product * 1.4 +
      marketing * 1.2 +
      ai * 1.6;

    if (crisis.revenueMultiplier) {
      revenue *= crisis.revenueMultiplier;
    }

    // Burn
    const burn =
      hiring * 0.8 +
      infra * 0.6;

    // Risk
    let risk = 0;
    if (product > 50 || marketing > 50 || ai > 50) risk += 15;
    if (infra < 10) risk += 20;
    if (hiring < 10) risk += 10;

    const change = revenue - burn - risk;

    // Update valuation
    room.valuations[player.id] += change;

    results.push({
      name: player.name,
      valuation: Math.round(room.valuations[player.id]),
    });
  });

  // Sort leaderboard
  results.sort((a, b) => b.valuation - a.valuation);

  return results;
}

module.exports = {
  calculateRound,
};
    