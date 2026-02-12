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
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(null);

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
      setGameOver(data);
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
      allocation: {
        product,
        marketing,
        hiring,
        infra,
        ai,
      },
    });
  };

  // 🔹 FINAL WINNER SCREEN
  if (gameOver) {
    return (
      <div style={{ background:"#000", minHeight:"100vh", color:"white", padding:40 }}>
        <h1>🏆 WINNER</h1>
        <h2>{gameOver.winner.id}</h2>

        <h3>Final Leaderboard</h3>
        {gameOver.players.map((p,i)=>(
          <div key={i}>
            {p.id} — {p.valuation}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ background:"#000", minHeight:"100vh", color:"white", padding:40 }}>
      
      {/* HEADER */}
      <h2>Founder’s FaceOff</h2>
      <h3>Room Code: {room.roomId}</h3>
      <h3>Round: {round}/5</h3>

      {/* CRISIS POPUP */}
      {crisis && (
        <div style={{
          position:"fixed",
          top:20,
          left:"50%",
          transform:"translateX(-50%)",
          background:"red",
          padding:"15px 30px",
          borderRadius:10,
          fontWeight:"bold"
        }}>
          🚨 {crisis}
        </div>
      )}

      <h3>Allocate Budget</h3>

      <div style={{ display:"flex", gap:10 }}>
        <input type="number" placeholder="Product" onChange={(e)=>setProduct(+e.target.value)} />
        <input type="number" placeholder="Marketing" onChange={(e)=>setMarketing(+e.target.value)} />
        <input type="number" placeholder="Hiring" onChange={(e)=>setHiring(+e.target.value)} />
        <input type="number" placeholder="Infra" onChange={(e)=>setInfra(+e.target.value)} />
        <input type="number" placeholder="AI" onChange={(e)=>setAi(+e.target.value)} />
      </div>

      <br/>
      <button onClick={submit}>Submit Strategy</button>

      <hr style={{ margin:"40px 0" }} />

      <h3>Leaderboard</h3>
      {board.map((p,i)=>(
        <div key={i}>
          {p.id} — {p.valuation}
        </div>
      ))}
    </div>
  );
}

export default Game;
