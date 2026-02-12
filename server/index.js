const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET","POST"] }
});

const PORT = 5000;

const rooms = {};

const MAX_ROUNDS = 5;
const ROUND_TIME = 15;
const START_COOLDOWN = 5;

// ================= CONNECTION =================
io.on("connection", (socket) => {

  console.log("User:", socket.id);

  // -------- CREATE ROOM --------
  socket.on("create_room", () => {

    const roomId = Math.random().toString(36).substring(2,6).toUpperCase();

    rooms[roomId] = {
      roomId,
      host: socket.id,
      started: false,
      round: 1,
      players: [],
      timer: null,
      timeLeft: ROUND_TIME
    };

    socket.join(roomId);

    rooms[roomId].players.push({
      id: socket.id,
      name: "",
      score: 0,
      submitted: false,
      alloc: {}
    });

    io.to(roomId).emit("room_update", rooms[roomId]);
  });

  // -------- JOIN ROOM --------
  socket.on("join_room", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    socket.join(roomId);

    room.players.push({
      id: socket.id,
      name: "",
      score: 0,
      submitted: false,
      alloc: {}
    });

    io.to(roomId).emit("room_update", room);
  });

  // -------- SET NAME --------
  socket.on("set_name", ({roomId, name}) => {
    const room = rooms[roomId];
    if (!room) return;

    const p = room.players.find(x=>x.id===socket.id);
    if (p) p.name = name;

    io.to(roomId).emit("room_update", room);
  });

  // -------- START GAME --------
  socket.on("start_game", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    if (socket.id !== room.host) return;

    room.started = true;

    // send cooldown screen
    io.to(roomId).emit("game_starting", START_COOLDOWN);

    setTimeout(()=>{
      startRound(roomId);
    }, START_COOLDOWN * 1000);
  });

  // -------- SUBMIT --------
  socket.on("submit_strategy", ({roomId, alloc})=>{
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p=>p.id===socket.id);
    if (!player || player.submitted) return;

    player.submitted = true;
    player.alloc = alloc;

    calculateScore(player);

    checkRoundEnd(roomId);
  });

});


// ================= START ROUND =================
function startRound(roomId){
  const room = rooms[roomId];
  if (!room) return;

  room.players.forEach(p=>p.submitted=false);
  room.timeLeft = ROUND_TIME;

  io.to(roomId).emit("round_start", {
    round: room.round,
    time: ROUND_TIME
  });

  runTimer(roomId);
}


// ================= TIMER =================
function runTimer(roomId){
  const room = rooms[roomId];
  if (!room) return;

  io.to(roomId).emit("timer_update", room.timeLeft);

  room.timer = setInterval(()=>{

    room.timeLeft--;

    io.to(roomId).emit("timer_update", room.timeLeft);

    if(room.timeLeft <= 0){
      clearInterval(room.timer);
      endRound(roomId);
    }

  },1000);
}


// ================= CHECK END =================
function checkRoundEnd(roomId){
  const room = rooms[roomId];
  if (!room) return;

  const allSubmitted = room.players.every(p=>p.submitted);

  if(allSubmitted){
    clearInterval(room.timer);
    endRound(roomId);
  }
}


// ================= END ROUND =================
function endRound(roomId){
  const room = rooms[roomId];
  if (!room) return;

  io.to(roomId).emit("leaderboard_update", room.players);

  room.round++;

  if(room.round > MAX_ROUNDS){
    io.to(roomId).emit("game_over", {
      players: room.players
    });
    return;
  }

  setTimeout(()=>{
    startRound(roomId);
  },2000);
}


// ================= SCORE =================
function calculateScore(player){

  const a = player.alloc;

  const total =
    (a.product||0)+
    (a.marketing||0)+
    (a.hiring||0)+
    (a.infra||0)+
    (a.ai||0);

  if(total !== 100){
    player.score -= 5;
    return;
  }

  let revenue =
    a.product*0.4 +
    a.marketing*0.3 +
    a.ai*0.5;

  let stability =
    a.hiring*0.3 +
    a.infra*0.4;

  let risk =
    Math.abs(a.product-a.marketing)*0.2;

  let score =
    revenue*1.3 +
    stability*1.1 -
    risk*1.2;

  if(score<0) score=0;

  player.score += Number(score.toFixed(4));
}


// ================= SERVER =================
server.listen(PORT, ()=>{
  console.log("Server running on", PORT);
});
