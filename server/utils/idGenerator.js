// Generates a 4-letter room code like AB12
function generateRoomId() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Generates player name from socket id
function generatePlayerName(socketId) {
  return "Founder-" + socketId.slice(0, 4);
}

module.exports = {
  generateRoomId,
  generatePlayerName,
};
