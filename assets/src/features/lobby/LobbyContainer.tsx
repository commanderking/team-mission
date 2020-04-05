import React, { useEffect } from "react";
import { Card, Button } from "antd";
import _ from "lodash";
import useChannel from "hooks/useChannel";
import lobbyReducer, { initialState } from "features/lobby/LobbyReducer";
import useLobbyChannel from "features/lobby/useLobbyChannel";
import { Team, CurrentUser, TeamMember } from "features/lobby/LobbyTypes";

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

const mapMembersToTeams = (teamMembers: TeamMember[], teams: Team[]) => {
  const teamMembersByTeamId = _.groupBy(teamMembers, "teamId");

  return teams.map((team) => {
    return {
      ...team,
      members: teamMembersByTeamId[team.id] || [],
    };
  });
};

const LobbyContainer = () => {
  const { channelState, channel } = useLobbyChannel(
    lobbyReducer,
    initialState,
    "Jeff"
  );

  const { teams, currentUser, students } = channelState;

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

  return (
    <div>
      <h1>Team Mission</h1>
      {formattedTeams.map((team) => {
        const { id, members } = team;

        const teamFull = members.length >= 4;
        return (
          <Card key={id} title={team.name}>
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
  );
};

export default LobbyContainer;
