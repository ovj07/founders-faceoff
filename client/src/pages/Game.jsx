import { useEffect, useState } from "react";
import socket from "../socket";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Game({ room, setScreen, setFinalBoard }) {

  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(15);
  const [board, setBoard] = useState([]);
  const [crisis, setCrisis] = useState(null);

  const [alloc, setAlloc] = useState({
    product:0,
    marketing:0,
    hiring:0,
    infra:0,
    ai:0
  });

  // ---------------- SOCKET LISTENERS ----------------
  useEffect(()=>{

    socket.on("round_start", (data)=>{
      setRound(data.round);
      setTimer(data.time);
    });

    socket.on("timer_update",(t)=>{
      setTimer(t);
    });

    socket.on("leaderboard_update",(players)=>{
      setBoard(players);
    });

    socket.on("crisis_event",(msg)=>{
      setCrisis(msg);
      setTimeout(()=>setCrisis(null),3000);
    });

    socket.on("game_over",(data)=>{
      setFinalBoard(data.players);
      setScreen("result");
    });

    return ()=>{
      socket.off("round_start");
      socket.off("timer_update");
      socket.off("leaderboard_update");
      socket.off("crisis_event");
      socket.off("game_over");
    };

  },[]);


  // ---------------- SUBMIT ----------------
  const submit = ()=>{

    const total =
      alloc.product +
      alloc.marketing +
      alloc.hiring +
      alloc.infra +
      alloc.ai;

    if(total !== 100){
      alert("Total must be 100");
      return;
    }

    socket.emit("submit_strategy",{
      roomId: room.roomId,
      alloc
    });
  };


  return (
    <>
      <Header/>

      {/* SPARKLES */}
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

      <div className="game-container">

        <h2>Room Code: {room.roomId}</h2>

        <h2>Round {round}/5</h2>

        <h3>⏱ {timer}</h3>

        {crisis && (
          <div className="crisis">
            🚨 {crisis}
          </div>
        )}

        <div className="inputs">

          <input type="number"
            placeholder="Product"
            onChange={(e)=>setAlloc({...alloc,product:+e.target.value})}
          />

          <input type="number"
            placeholder="Marketing"
            onChange={(e)=>setAlloc({...alloc,marketing:+e.target.value})}
          />

          <input type="number"
            placeholder="Hiring"
            onChange={(e)=>setAlloc({...alloc,hiring:+e.target.value})}
          />

          <input type="number"
            placeholder="Infra"
            onChange={(e)=>setAlloc({...alloc,infra:+e.target.value})}
          />

          <input type="number"
            placeholder="AI"
            onChange={(e)=>setAlloc({...alloc,ai:+e.target.value})}
          />

        </div>

        <button className="submit-btn" onClick={submit}>
          Submit Strategy
        </button>

        <h3>Leaderboard</h3>

        {board.map((p,i)=>(
          <div className="player" key={i}>
            {p.name || p.id} — {p.score?.toFixed(4)}
          </div>
        ))}

      </div>

      <Footer/>
    </>
  );
}

export default Game;
