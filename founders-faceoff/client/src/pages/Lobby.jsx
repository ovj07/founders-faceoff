import { useEffect, useState } from "react";
import socket from "../socket";

function Lobby({ setRoom, setScreen }) {
  const [roomCode, setRoomCode] = useState("");

  // Listen for room update from backend
  useEffect(() => {
    socket.on("room_update", (room) => {
      console.log("Joined room:", room);
      setRoom(room);
    });

    return () => socket.off("room_update");
  }, [setRoom, setScreen]);

  const createRoom = () => {
    socket.emit("create_room");
  };

  const joinRoom = () => {
    socket.emit("join_room", roomCode);
  };

  return (
    <div style={{
      backgroundColor: "#000",
      minHeight: "100vh",
      color: "white",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* HEADER */}
      <header style={{
        padding: "15px 50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>Founder’s FaceOff</h2>

        <nav>
          <span style={{ marginRight: 20 }}>Home</span>
          <span style={{ marginRight: 20 }}>About</span>
          <span style={{ marginRight: 20 }}>Projects</span>
          <span>Contact</span>
        </nav>
      </header>

      {/* HERO */}
      <div style={{
        flex: 1,
        textAlign: "center",
        paddingTop: 150
      }}>
        <h1 style={{ fontSize: 48 }}>
          Welcome to Founder’s FaceOff
        </h1>

        <br /><br />

        {/* CREATE ROOM BUTTON */}
        <button
          onClick={createRoom}
          style={{
            padding: "12px 30px",
            borderRadius: 30,
            border: "none",
            background: "#111",
            color: "white",
            cursor: "pointer",
            fontSize: 16
          }}
        >
          Get Started
        </button>

        <br /><br /><br />

        {/* JOIN ROOM */}
        <input
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          style={{
            padding: 10,
            marginRight: 10
          }}
        />

        <button
          onClick={joinRoom}
          style={{
            padding: "10px 20px"
          }}
        >
          Join Room
        </button>
      </div>

      {/* FOOTER */}
      <footer style={{
        textAlign: "center",
        padding: 20
      }}>
        © 2026 Founder’s FaceOff. All rights reserved.
      </footer>

    </div>
  );
}

export default Lobby;
