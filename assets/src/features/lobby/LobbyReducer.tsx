import { ChannelState } from "features/lobby/LobbyTypes";
import { lobbyActions } from "./LobbyActions";

export const initialState: ChannelState = {
  currentUser: { id: null, name: null },
  messages: [],
  attendees: [],
  userLobbyActions: [],
  teams: [
    {
      id: "1",
      name: "Team Nook",
    },
    {
      id: "2",
      name: "Team Isabelle",
    },
    {
      id: "3",
      name: "Team Villager",
    },
  ],
  teamMembers: [],
};

const lobbyReducer = (state: ChannelState, action: any): ChannelState => {
  console.log("action", action);
  switch (action.type) {
    case lobbyActions.NEW_MSG:
      return { ...state, messages: [...state.messages, action.payload] };
    case lobbyActions.USER_JOIN:
      return {
        ...state,
        userLobbyActions: [...state.userLobbyActions, action.payload],
      };
    case lobbyActions.AFTER_JOIN:
      return {
        ...state,
        currentUser: action.payload,
      };
    case lobbyActions.USER_LEAVE:
      return {
        ...state,
        userLobbyActions: [...state.userLobbyActions, ...action.payload],
      };
    case lobbyActions.UPDATE_PRESENCE_STATE:
      return { ...state, attendees: action.payload };
    case lobbyActions.SYNC_PRESENCE:
      return { ...state, attendees: action.payload };
    case lobbyActions.JOIN_TEAM:
      return {
        ...state,
        teamMembers: [...state.teamMembers, action.payload],
      };

    default:
      throw new Error("Non valid Action");
  }
};

export default lobbyReducer;
