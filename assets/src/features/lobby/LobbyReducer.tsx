import { ChannelState } from "features/lobby/LobbyTypes";
import { lobbyActions } from "./LobbyActions";

export const initialState: ChannelState = {
  currentUser: { id: null, name: null },
  messages: [],
  students: [],
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
};

const lobbyReducer = (state: ChannelState, action: any): ChannelState => {
  switch (action.type) {
    case lobbyActions.USER_JOIN:
      return {
        ...state,
        userLobbyActions: [...state.userLobbyActions, action.payload],
      };
    case lobbyActions.AFTER_JOIN:
      return {
        ...state,
        currentUser: action.payload.current_user,
      };
    case lobbyActions.USER_LEAVE:
      return {
        ...state,
        userLobbyActions: [...state.userLobbyActions, ...action.payload],
      };
    case lobbyActions.SYNC_STUDENT_PRESENCE:
      return { ...state, students: action.payload };

    default:
      throw new Error("Non valid Action");
  }
};

export default lobbyReducer;
