import { useEffect, useState } from "react";
import socket from "../socket";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Lobby({ setRoom, setScreen }) {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    socket.on("room_update", (room) => {
      setRoom(room);

      socket.emit("set_name", {
        roomId: room.roomId,
        name
      });

      setScreen("waiting");   // 🔴 IMPORTANT
    });

    return () => socket.off("room_update");
  }, [name]);

  const createRoom = () => {
    if (!name) return alert("Enter name");
    socket.emit("create_room");
  };

  const joinRoom = () => {
    if (!name) return alert("Enter name");
    socket.emit("join_room", roomCode);
  };

  return (
    <>
      <Header/>

      <div className="sparkle-bg">
        {Array.from({length:30}).map((_,i)=>(
          <span key={i}
            style={{
              left:`${Math.random()*100}%`,
              top:`${Math.random()*100}%`,
              animationDelay:`${Math.random()*6}s`
            }}
          />
        ))}
      </div>

      <section className="hero">
        <h1 className="hero-title">Founder's FaceOff</h1>

        <input
          className="room-input"
          placeholder="Enter name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <button onClick={createRoom}>Create Room</button>

        <input
          className="room-input"
          placeholder="Room code"
          value={roomCode}
          onChange={(e)=>setRoomCode(e.target.value)}
        />

        <button onClick={joinRoom}>Join</button>
      </section>

      <Footer/>
    </>
  );
}

export default Lobby;
