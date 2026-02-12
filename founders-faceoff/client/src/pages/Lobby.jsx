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
      {/* ✨ Sparkle Background */}
      <div className="sparkle-bg">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          ></span>
        ))}
      </div>

      <header className="navbar">
        <div className="navbar-inner">
          <div
            className="nav-logo"
            onClick={() => setScreen("lobby")}
            style={{ cursor: "pointer" }}
          >
            Founder's FaceOff
          </div>

          <nav className="nav-links">
            <a>About</a>
            <a>Projects</a>
            <a>Contact</a>
          </nav>
        </div>
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
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button className="btn" onClick={joinRoom}>
          Join
        </button>
      </section>

      <footer className="footer">
        © 2026 Founder’s FaceOff
      </footer>
    </>
  );
}

export default Lobby;
