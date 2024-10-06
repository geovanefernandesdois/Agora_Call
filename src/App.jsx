import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import VideoRoom from "./components/VideoRoom/VideoRoom";

function App() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="App">
      <Header />
      {!joined && <button onClick={() => setJoined(true)}>JOIN ROOM</button>}
      {joined && <VideoRoom />}
    </div>
  );
}

export default App;
