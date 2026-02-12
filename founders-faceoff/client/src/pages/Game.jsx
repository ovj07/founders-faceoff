import Header from "../components/Header";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import socket from "../socket";

function Game({ room, setScreen, setFinalBoard }) {
  const [product, setProduct] = useState(0);
  const [marketing, setMarketing] = useState(0);
  const [hiring, setHiring] = useState(0);
  const [infra, setInfra] = useState(0);
  const [ai, setAi] = useState(0);

  const [board, setBoard] = useState([]);
  const [crisis, setCrisis] = useState(null);
  const [round, setRound] = useState(1);

  useEffect(() => {
    socket.on("leaderboard_update", (players) => {
      setBoard(players);
    });

    socket.on("crisis_event", (msg) => {
      setCrisis(msg);
      setTimeout(() => setCrisis(null), 3000);
    });

    socket.on("round_update", (r) => {
      setRound(r);
    });

    socket.on("game_over", (data) => {
      setFinalBoard(data.players);
      setScreen("result");
    });

    return () => {
      socket.off("leaderboard_update");
      socket.off("crisis_event");
      socket.off("round_update");
      socket.off("game_over");
    };
  }, []);

  const submit = () => {
    socket.emit("submit_strategy", {
      roomId: room.roomId,
      allocation: { product, marketing, hiring, infra, ai },
    });
  };

  return (
    <>
      <Header />

      <div className="game-container">

        {/* ⭐ GOLDEN FLOATING DOTS */}
        <div className="sparkle-bg">
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`
              }}
            ></span>
          ))}
        </div>

        <h2>Room Code: {room.roomId}</h2>
        <h3>Round {round}/5</h3>

        {crisis && <div className="crisis">🚨 {crisis}</div>}

        <div className="inputs">
          <input type="number" placeholder="Product" onChange={(e)=>setProduct(+e.target.value)} />
          <input type="number" placeholder="Marketing" onChange={(e)=>setMarketing(+e.target.value)} />
          <input type="number" placeholder="Hiring" onChange={(e)=>setHiring(+e.target.value)} />
          <input type="number" placeholder="Infra" onChange={(e)=>setInfra(+e.target.value)} />
          <input type="number" placeholder="AI" onChange={(e)=>setAi(+e.target.value)} />
        </div>

        <button className="submit-btn" onClick={submit}>
          Submit Strategy
        </button>

        <h3>Leaderboard</h3>
        {board.map((p,i)=>(
          <div className="player" key={i}>
            <span>{p.id}</span>
            <span>💰 {p.valuation}</span>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}

export default Game;
