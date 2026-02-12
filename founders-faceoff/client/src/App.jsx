import { useState } from "react";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Result from "./pages/Result";

function App() {
  const [screen, setScreen] = useState("lobby");
  const [room, setRoom] = useState(null);
  const [finalBoard, setFinalBoard] = useState(null);

  return (
    <>
      {screen === "lobby" && (
        <Lobby setRoom={setRoom} setScreen={setScreen} />
      )}

      {screen === "game" && (
        <Game
          room={room}
          setScreen={setScreen}
          setFinalBoard={setFinalBoard}
        />
      )}

      {screen === "result" && (
        <Result board={finalBoard} />
      )}
    </>
  );
}

export default App;
