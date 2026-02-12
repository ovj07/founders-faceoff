function Result({ board }) {
  return (
    <div style={{ padding:40, color:"white" }}>
      <h1>🏆 Game Over</h1>

      {board.map((p,i)=>(
        <div key={i}>
          {p.id} — {p.valuation}
        </div>
      ))}
    </div>
  );
}

export default Result;
