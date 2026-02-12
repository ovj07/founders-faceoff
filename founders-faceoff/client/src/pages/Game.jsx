import { useState, useEffect } from "react";
import socket from "../socket";

function Game({ room }) {
  const [product, setProduct] = useState(0);
  const [marketing, setMarketing] = useState(0);
  const [hiring, setHiring] = useState(0);
  const [infra, setInfra] = useState(0);
  const [ai, setAi] = useState(0);

  const [board, setBoard] = useState([]);
  const [crisis, setCrisis] = useState(null);

  useEffect(() => {
    socket.on("leaderboard_update", (players) => {
      setBoard(players);
    });

    socket.on("crisis_event", (msg) => {
      setCrisis(msg);
      setTimeout(() => setCrisis(null), 4000);
    });

    return () => {
      socket.off("leaderboard_update");
      socket.off("crisis_event");
    };
  }, []);

  const submit = () => {
    socket.emit("submit_strategy", {
      roomId: room.roomId,
      allocation: { product, marketing, hiring, infra, ai },
    });
  };

  return (
    <div className="game-container">

      {/* Crisis popup */}
      {crisis && (
        <div className="crisis">
          🚨 CRISIS: {crisis}
        </div>
      )}

      <h2>Allocate Budget</h2>

      <div className="inputs">
        <input type="number" placeholder="Product" onChange={e=>setProduct(+e.target.value)} />
        <input type="number" placeholder="Marketing" onChange={e=>setMarketing(+e.target.value)} />
        <input type="number" placeholder="Hiring" onChange={e=>setHiring(+e.target.value)} />
        <input type="number" placeholder="Infra" onChange={e=>setInfra(+e.target.value)} />
        <input type="number" placeholder="AI" onChange={e=>setAi(+e.target.value)} />
      </div>

      <button className="submit-btn" onClick={submit}>
        Submit Strategy
      </button>

      <hr />

      <h3>📊 Leaderboard</h3>

      {board.length === 0 && <p>No data yet</p>}

      {board.map((p,i)=>(
        <div key={i} className="player">
          <strong>{p.id}</strong>
          <span>💰 {p.valuation || 0}</span>
        </div>
      ))}
    </div>
  );
}

export default Game;
