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

export type ChannelState = {
  messages: Message[];
  attendees: Attendee[];
  userLobbyActions: UserLobbyAction[];
};

export const initialState = {
  messages: [],
  attendees: [],
  userLobbyActions: []
};

const lobbyReducer = (state: ChannelState, action: any): ChannelState => {
  switch (action.type) {
    case lobbyActions.NEW_MSG:
      return { ...state, messages: [...state.messages, action.payload] };
    case lobbyActions.USER_JOIN:
      return {
        ...state,
        userLobbyActions: [...state.userLobbyActions, action.payload]
      };
    case lobbyActions.USER_LEAVE:
      return {
        ...state,
        userLobbyActions: [...state.userLobbyActions, ...action.payload]
      };
    case lobbyActions.UPDATE_PRESENCE_STATE:
      return { ...state, attendees: action.payload };
    case lobbyActions.SYNC_PRESENCE:
      return { ...state, attendees: action.payload };
    default:
      throw new Error("Non valid Action");
  }
};

export default lobbyReducer;
