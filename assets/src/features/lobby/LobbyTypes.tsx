import { lobbyActions } from "./LobbyActions";

export type Message = {
  text: string;
  name: string;
};

export type Attendee = {
  name: string;
  phx_ref: string;
  uuid: string;
};

export type UserLobbyAction = {
  name: string;
  uuid: string;
  actionType: typeof lobbyActions.USER_JOIN | typeof lobbyActions.USER_LEAVE;
};

export type TeamMember = {
  teamId: string;
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  image: string;
};

export type CurrentUser = {
  id: string | null;
  name: string | null;
};

export type ChannelState = {
  currentUser: CurrentUser;
  messages: Message[];
  students: TeamMember[];
  userLobbyActions: UserLobbyAction[];
  teams: Team[];
};
