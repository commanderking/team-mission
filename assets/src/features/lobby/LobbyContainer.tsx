import React from "react";
import { Card } from "antd";

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
