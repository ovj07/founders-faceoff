import Header from "../components/Header";
import Footer from "../components/Footer";

function Result({ board }) {
  return (
    <>
      <Header />

      <div className="result-page">

        {/* 🎉 Celebration Animation */}
        <div className="celebration">
          {[...Array(50)].map((_, i) => (
            <span
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`
              }}
            ></span>
          ))}
        </div>

        <div className="result-card">
          <h1 className="result-title">🏆 Game Over</h1>

          {board && board.length > 0 ? (
            <div className="result-list">
              {board.map((p, i) => (
                <div className="result-player" key={i}>
                  <span className="rank">#{i + 1}</span>
                  <span className="name">{p.id}</span>
                  <span className="money">💰 {p.valuation}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="result-empty">
              No results available
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Result;
