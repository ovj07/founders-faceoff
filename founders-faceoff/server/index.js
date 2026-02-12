const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET","POST"]
  },
});


const rooms = {};
const MAX_ROUNDS = 5;

io.on("connection", (socket) => {
  console.log("FRONTEND CONNECTED:", socket.id);

  // CREATE ROOM
  socket.on("create_room", () => {
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();

    rooms[roomId] = {
      roomId,
      players: [],
      round: 1,
    };

    socket.join(roomId);

    rooms[roomId].players.push({
      id: socket.id,
      valuation: 0,
    });

    io.to(roomId).emit("room_update", rooms[roomId]);
  });

  // JOIN ROOM
  socket.on("join_room", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    socket.join(roomId);

    room.players.push({
      id: socket.id,
      valuation: 0,
    });

    io.to(roomId).emit("room_update", room);
  });

  // SUBMIT STRATEGY
  socket.on("submit_strategy", ({ roomId, allocation }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    // SCORING
    const revenue =
      allocation.product * 2 +
      allocation.marketing * 1.5 +
      allocation.ai * 3;

    const risk =
      allocation.marketing * 0.5 -
      allocation.infra * 0.3;

    const valuation = Math.max(0, revenue - risk);
    player.valuation += valuation;

    // LEADERBOARD
    io.to(roomId).emit("leaderboard_update", room.players);

    // CRISIS
    const crises = [
      "AI costs doubled!",
      "Marketing banned!",
      "Investor pulled funding!",
      "Server crash!",
      "Recession!"
    ];

    const crisis = crises[Math.floor(Math.random() * crises.length)];
    io.to(roomId).emit("crisis_event", crisis);

    // 🔥 ROUND UPDATE
    room.round += 1;

    io.to(roomId).emit("round_update", room.round);

    // GAME OVER
    if (room.round > MAX_ROUNDS) {
      const winner = [...room.players].sort((a,b)=>b.valuation-a.valuation)[0];

      io.to(roomId).emit("game_over", {
        winner,
        players: room.players
      });

      return;
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🔥 Founder’s Faceoff server running on port 5000");
});
