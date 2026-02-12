import { useState, useEffect } from "react";
import socket from "../socket";

function Lobby({ setRoom, setScreen }) {
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    socket.on("room_update", (room) => {
      setRoom(room);
      setScreen("game");
    });

    return () => socket.off("room_update");
  }, []);

  const createRoom = () => {
    socket.emit("create_room");
  };

  const joinRoom = () => {
    socket.emit("join_room", roomCode);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Founder’s Faceoff</h1>

      <button onClick={createRoom}>
        Create Room
      </button>

      <br /><br />

      <input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <button onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
}

export default Lobby;
