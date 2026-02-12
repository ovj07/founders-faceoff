import { io } from "socket.io-client";

console.log("Connecting to backend...");

const socket = io("https://founders-faceoff.onrender.com");

socket.on("connect", () => {
  console.log("Connected to backend:", socket.id);
});

export default socket;
