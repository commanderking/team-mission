import React, { useEffect } from "react";
import { Card, Button, Tag } from "antd";
import _ from "lodash";
import lobbyReducer, { initialState } from "features/lobby/LobbyReducer";
import useLobbyChannel from "features/lobby/useLobbyChannel";
import ActivityContainer from "features/activity/ActivityContainer";
import {
  hasJoinedTeam,
  isOnThisTeam,
  findCurrentUserTeam,
  mapMembersToTeams,
} from "features/lobby/lobbyUtils";
import StartActivityButton from "features/lobby/components/StartActivityButton";
type Props = {
  displayName: string;
};

const LobbyContainer = ({ displayName }: Props) => {
  const { channelState, channel } = useLobbyChannel(
    lobbyReducer,
    initialState,
    displayName
  );

  const { teams, currentUser, students, activityInProgress } = channelState;

  const handleJoinTeam = (
    teamId: string,
    userName: string | null,
    userId: string | null
  ) => {
    if (userName && userId) {
      channel?.push("join_team", { teamId, userName, userId });
    }
  };

  const handleLeaveTeam = (
    teamId: string,
    userName: string | null,
    userId: string | null
  ) => {
    channel?.push("leave_team", { teamId, userName, userId });
  };

  const formattedTeams = mapMembersToTeams(students, teams);

  const currentUserTeam = findCurrentUserTeam(currentUser, students);

  return (
    <div>
      {activityInProgress && currentUserTeam && (
        <ActivityContainer
          teamId={findCurrentUserTeam(currentUser, students)}
          userId={currentUser.id}
          displayName={displayName}
        />
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridColumnGap: "10px",
          gridRowGap: "15px",
        }}
      >
        {formattedTeams.map((team) => {
          const { id, members, image } = team;

          const teamFull = members.length >= 6;
          return (
            <Card key={id} title={team.name}>
              {image && (
                <img src={image} style={{ width: "150px", height: "200px" }} />
              )}
              <div style={{ padding: "10px" }}>
                {members.map((member) => {
                  return (
                    <Tag
                      style={{
                        padding: "10px",
                        fontSize: "20px",
                        borderRadius: "30px",
                      }}
                    >
                      {member.name}
                    </Tag>
                  );
                })}
              </div>
              {!teamFull && !hasJoinedTeam(currentUser, students) && (
                <Button
                  onClick={() => {
                    handleJoinTeam(id, currentUser.name, currentUser.id);
                  }}
                  type="primary"
                >
                  Join Team
                </Button>
              )}
              {isOnThisTeam(currentUser, students, id) && (
                <Button
                  danger
                  type="primary"
                  onClick={() => {
                    handleLeaveTeam(id, currentUser.name, currentUser.id);
                  }}
                >
                  Leave Team
                </Button>
              )}
            </Card>
          );
        })}
      </div>
      <StartActivityButton channel={channel} />
    </div>
  );
};

export default LobbyContainer;
