import { Team, CurrentUser, TeamMember } from "features/lobby/LobbyTypes";

export const hasJoinedTeam = (
  currentUser: CurrentUser,
  teamMembers: TeamMember[]
) => {
  const userTeamMember = teamMembers.find(
    (member) => member.id === currentUser.id && member.teamId !== null
  );

  return Boolean(userTeamMember);
};

export const isOnThisTeam = (
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

export const findCurrentUserTeam = (
  currentUser: CurrentUser,
  teamMembers: TeamMember[]
) => {
  const user = teamMembers.find((member) => member.id === currentUser.id);
  if (!user) {
    return null;
  }

  return user.teamId;
};

export const mapMembersToTeams = (teamMembers: TeamMember[], teams: Team[]) => {
  const teamMembersByTeamId = _.groupBy(teamMembers, "teamId");

  return teams.map((team) => {
    return {
      ...team,
      members: teamMembersByTeamId[team.id] || [],
    };
  });
};
