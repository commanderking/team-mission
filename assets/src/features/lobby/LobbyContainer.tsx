import React, { useEffect } from "react";
import { Card, Button, Row, Col } from "antd";
import _ from "lodash";
import useChannel from "hooks/useChannel";
import lobbyReducer, { initialState } from "features/lobby/LobbyReducer";
import useLobbyChannel from "features/lobby/useLobbyChannel";
import { Team, CurrentUser, TeamMember } from "features/lobby/LobbyTypes";
import { Channel } from "phoenix";
import ActivityContainer from "features/activity/ActivityContainer";

type Props = {
  displayName: string;
};

const hasJoinedTeam = (currentUser: CurrentUser, teamMembers: TeamMember[]) => {
  const userTeamMember = teamMembers.find(
    (member) => member.id === currentUser.id && member.teamId !== null
  );

  return Boolean(userTeamMember);
};

const isOnThisTeam = (
  currentUser: CurrentUser,
  teamMembers: TeamMember[],
  teamId: string
) => {
  const userTeamMember = teamMembers.find(
    (member) => member.id === currentUser.id
  );

  if (!userTeamMember) {
    return false;
  }

  return userTeamMember.teamId === teamId;
};

const findCurrentUserTeam = (
  currentUser: CurrentUser,
  teamMembers: TeamMember[]
) => {
  const user = teamMembers.find((member) => member.id === currentUser.id);
  if (!user) {
    return null;
  }

  return user.teamId;
};

const mapMembersToTeams = (teamMembers: TeamMember[], teams: Team[]) => {
  const teamMembersByTeamId = _.groupBy(teamMembers, "teamId");

  return teams.map((team) => {
    return {
      ...team,
      members: teamMembersByTeamId[team.id] || [],
    };
  });
};

const handleStartActivity = (channel: Channel | null) => {
  channel?.push("start_activity", {});
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

  // const test = useChannel("team:lobby", (state, action) => {}, {}, "Team Jeff");

  const formattedTeams = mapMembersToTeams(students, teams);

  const currentUserTeam = findCurrentUserTeam(currentUser, students);

  return (
    <div>
      {activityInProgress && currentUserTeam && (
        <ActivityContainer
          teamId={findCurrentUserTeam(currentUser, students)}
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

          const teamFull = members.length >= 4;
          return (
            <Card key={id} title={team.name}>
              {image && (
                <img src={image} style={{ width: "150px", height: "200px" }} />
              )}
              <ul>
                {members.map((member) => {
                  return <li>{member.name}</li>;
                })}
              </ul>
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
      <Button
        type="primary"
        onClick={() => {
          handleStartActivity(channel);
        }}
      >
        Start Activity
      </Button>
    </div>
  );
};

export default LobbyContainer;
