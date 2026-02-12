const rooms = require("../data/rooms");
const { generatePlayerName } = require("../utils/idGenerator");

// Create a new room
function createRoom(roomId, socket) {
  rooms[roomId] = {
    roomId: roomId,
    players: [],
    round: 1,
    started: false,
    allocations: {},   // stores each player's strategy
    valuations: {},    // stores each player's valuation
  };

  // Add host as first player
  return addPlayer(roomId, socket);
}

// Add player to room
function addPlayer(roomId, socket) {
  const room = rooms[roomId];
  if (!room) return null;

  const player = {
    id: socket.id,
    name: generatePlayerName(socket.id),
  };

  room.players.push(player);

  // starting valuation
  room.valuations[socket.id] = 100;

  return player;
}

// Get room
function getRoom(roomId) {
  return rooms[roomId];
}

// Debug helper
function getAllRooms() {
  return rooms;
}

module.exports = {
  createRoom,
  addPlayer,
  getRoom,
  getAllRooms,
};
