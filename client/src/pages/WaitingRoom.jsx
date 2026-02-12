import { useEffect, useState } from "react";
import socket from "../socket";
import Header from "../components/Header";
import Footer from "../components/Footer";

function WaitingRoom({ room, setScreen }) {

  const [players,setPlayers] = useState(room.players || []);
  const [cooldown,setCooldown] = useState(null);

  useEffect(()=>{

    socket.on("room_update",(r)=>setPlayers(r.players));

    socket.on("game_starting",(sec)=>{
      setCooldown(sec);
      const i = setInterval(()=>{
        setCooldown(v=>{
          if(v<=1){clearInterval(i);return null;}
          return v-1;
        });
      },1000);
    });

    socket.on("round_start",()=>{
      setScreen("game");
    });

    return ()=>{
      socket.off("room_update");
      socket.off("game_starting");
      socket.off("round_start");
    };

  },[]);

  const start = ()=>{
    socket.emit("start_game", room.roomId);
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

      <div className="hero">
        <h2>Room: {room.roomId}</h2>

        <h3>Players</h3>
        {players.map(p=>(
          <div key={p.id}>{p.name}</div>
        ))}

        {socket.id === room.host && (
          <button onClick={start}>Start Game</button>
        )}

        {cooldown !== null && (
          <h1>Starting in {cooldown}</h1>
        )}
      </div>

      <Footer/>
    </>
  );
}

export default WaitingRoom;
