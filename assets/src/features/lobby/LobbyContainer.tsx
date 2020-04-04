import React, { useEffect } from "react";
import { Card } from "antd";
import useChannel from "hooks/useChannel";
import lobbyReducer, { initialState } from "features/lobby/LobbyReducer";
import useLobbyChannel from "features/lobby/useLobbyChannel";
const teams = [
  {
    title: "Team 1"
  },
  {
    title: "Team 2"
  },
  {
    title: "Team 3"
  }
];

const LobbyContainer = () => {
  const { channelState, channel } = useLobbyChannel(
    lobbyReducer,
    initialState,
    "Jeff"
  );

  const test = useChannel("team:lobby", (state, action) => {}, {}, "Team Jeff");

  console.log("channelState", channelState);
  return (
    <div>
      <h1>Team Mission</h1>
      {teams.map(team => {
        return <Card title={team.title}></Card>;
      })}
    </div>
  );
};

export default LobbyContainer;
