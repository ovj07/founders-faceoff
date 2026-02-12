import { io } from "socket.io-client";

const URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://founders-faceoff.onrender.com";

const socket = io(URL, {
  transports: ["websocket"],
});

export default socket;
