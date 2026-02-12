import { useEffect, useState } from "react";
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
    <>
      <header>
        <h2>Founder's FaceOff</h2>
        <nav>
          <a>Home</a>
          <a>About</a>
          <a>Projects</a>
          <a>Contact</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Welcome to Founder's FaceOff</h1>

        <button className="btn" onClick={createRoom}>
          Create Room
        </button>

        <br /><br />

        <input
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e)=>setRoomCode(e.target.value)}
        />

        <button className="btn" onClick={joinRoom}>
          Join
        </button>
      </section>

      <footer>
        © 2026 Founder's FaceOff
      </footer>
    </>
  );
}

export default Lobby;
