import { useState } from "react";
import Lobby from "./pages/Lobby";
import WaitingRoom from "./pages/WaitingRoom";
import Game from "./pages/Game";
import Result from "./pages/Result";

function App(){
  const [screen,setScreen]=useState("lobby");
  const [room,setRoom]=useState(null);
  const [board,setBoard]=useState(null);

  if(screen==="lobby")
    return <Lobby setRoom={setRoom} setScreen={setScreen}/>;

  if(screen==="waiting")
    return <WaitingRoom room={room} setScreen={setScreen}/>;

  if(screen==="game")
    return <Game room={room} setScreen={setScreen} setFinalBoard={setBoard}/>;

  if(screen==="result")
    return <Result board={board} setScreen={setScreen}/>;

  return null;
}

export default App;
