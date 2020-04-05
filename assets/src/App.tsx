import React from "react";
import "./App.css";
// import LobbyContainer from "features/lobby/LobbyContainer";
import LobbyLogin from "features/lobby/LobbyLogin";
import SocketProvider from "context/socketContext";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <LobbyLogin />
      </SocketProvider>
    </div>
  );
}

export default App;
