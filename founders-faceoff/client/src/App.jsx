import { useState } from "react";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {
  const [room, setRoom] = useState(null);

  if (room) {
    return <Game room={room} />;
  }

  return <Lobby setRoom={setRoom} />;
}

export default App;
