import { io } from "socket.io-client";

const socket = io("https://founders-faceoff.onrender.com", {
  transports: ["websocket"],
});

export default socket;
