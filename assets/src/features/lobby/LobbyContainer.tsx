import React, { useEffect } from "react";
import { Card, Button } from "antd";
import _ from "lodash";
import useChannel from "hooks/useChannel";
import lobbyReducer, { initialState } from "features/lobby/LobbyReducer";
import useLobbyChannel from "features/lobby/useLobbyChannel";
import { Team, CurrentUser, TeamMember } from "features/lobby/LobbyTypes";
const hasJoinedTeam = (currentUser: CurrentUser, teamMembers: TeamMember[]) => {
  const userTeamMember = teamMembers.find(
    (member) => member.userId === currentUser.id
  );

  return Boolean(userTeamMember);
};

const mapMembersToTeams = (teamMembers: TeamMember[], teams: Team[]) => {
  const teamMembersByTeamId = _.groupBy(teamMembers, "teamId");
  console.log("teamMemebrsByTeamId", teamMembersByTeamId);

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

  const { teams, currentUser, teamMembers } = channelState;

  const handleJoinTeam = (
    teamId: string,
    userName: string | null,
    userId: string | null
  ) => {
    if (userName && userId) {
      channel?.push("join_team", { teamId, userName, userId });
    }
  };

  console.log("channelState", channelState);
  // console.log("hasJoinedTeam", hasJoinedTeam(currentUser, teams));
  // const test = useChannel("team:lobby", (state, action) => {}, {}, "Team Jeff");

  const formattedTeams = mapMembersToTeams(teamMembers, teams);

  console.log("formattedTEams", formattedTeams);

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
                return <li>{member.userName}</li>;
              })}
            </ul>
            {!teamFull && !hasJoinedTeam(currentUser, teamMembers) && (
              <Button
                onClick={() => {
                  handleJoinTeam(id, currentUser.name, currentUser.id);
                }}
                type="primary"
              >
                Join Team
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default LobbyContainer;
