import Header from "../components/Header";
import Footer from "../components/Footer";

function Result({ board, setScreen }) {
  return (
    <>
      <Header/>

      <div className="result-page">
        <div className="result-card">
          <h1 className="result-title">🏆 Game Over</h1>

          {board?.map((p,i)=>(
            <div className="result-player" key={i}>
              <span className="rank">#{i+1}</span>
              <span className="name">{p.name || p.id}</span>
              <span className="money">💰 {p.score?.toFixed(4)}</span>
            </div>
          ))}

          <br/>
          <button onClick={()=>setScreen("lobby")}>Play Again</button>
        </div>
      </div>

      <Footer/>
    </>
  );
}

export default Result;
