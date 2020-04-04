import React from "react";
import "./App.css";
import LobbyContainer from "features/lobby/LobbyContainer";
import SocketProvider from "context/socketContext";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <LobbyContainer />
      </SocketProvider>
    </div>
  );
}

export default App;
