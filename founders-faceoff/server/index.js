const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { generateRoomId } = require("./utils/idGenerator");
const roomManager = require("./managers/roomManager");
const gameEngine = require("./engines/gameEngine");
const crisisEngine = require("./engines/crisisEngine");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ---------------------------
  // CREATE ROOM
  // ---------------------------
  socket.on("create_room", () => {
    const roomId = generateRoomId();

    roomManager.createRoom(roomId, socket);
    socket.join(roomId);

    const room = roomManager.getRoom(roomId);

    io.to(roomId).emit("room_update", room);

    console.log("Room created:", roomId);
  });

  // ---------------------------
  // JOIN ROOM
  // ---------------------------
  socket.on("join_room", (roomId) => {
    const room = roomManager.getRoom(roomId);

    if (!room) {
      console.log("Room not found:", roomId);
      return;
    }

    roomManager.addPlayer(roomId, socket);
    socket.join(roomId);

    io.to(roomId).emit("room_update", room);

    console.log("Player joined room:", roomId);
  });

  // ---------------------------
  // SUBMIT STRATEGY
  // ---------------------------
  socket.on("submit_strategy", ({ roomId, allocation }) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return;

    // store player's allocation
    room.allocations[socket.id] = allocation;

    console.log("Strategy received from", socket.id);

    // if all players submitted
    if (Object.keys(room.allocations).length === room.players.length) {
      console.log("All players submitted. Calculating round...");

      const crisis = crisisEngine.getRandomCrisis();

      const leaderboard = gameEngine.calculateRound(
        room,
        room.allocations,
        crisis
      );

      // reset allocations
      room.allocations = {};
      room.round++;

      // send results
      io.to(roomId).emit("round_result", {
        leaderboard,
        crisis,
        round: room.round,
      });

      console.log("Round completed for room", roomId);

      // GAME OVER after 3 rounds
      if (room.round > 3) {
        io.to(roomId).emit("game_over", leaderboard);
        console.log("Game over:", roomId);
      }
    }
  });

  // ---------------------------
  // DISCONNECT
  // ---------------------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🔥 Founder’s Faceoff server running on port 5000");
});
