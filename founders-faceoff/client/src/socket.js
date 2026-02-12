import { io } from "socket.io-client";

console.log("Connecting to backend...");

const socket = io("http://127.0.0.1:5000");

socket.on("connect", () => {
  console.log("Connected to backend:", socket.id);
});

export default socket;
