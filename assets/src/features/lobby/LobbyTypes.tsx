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
  activityInProgress: boolean;
  messages: Message[];
  students: TeamMember[];
  teams: Team[];
};
