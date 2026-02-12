import { useState } from "react";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Result from "./pages/Result";

function App() {
  const [screen, setScreen] = useState("lobby");
  const [room, setRoom] = useState(null);
  const [finalBoard, setFinalBoard] = useState(null);

  if (screen === "game") {
    return (
      <Game
        room={room}
        setScreen={setScreen}
        setFinalBoard={setFinalBoard}
      />
    );
  }

  if (screen === "result") {
    return <Result board={finalBoard} />;
  }

  return (
    <Lobby
      setRoom={setRoom}
      setScreen={setScreen}
    />
  );
}

export default App;
