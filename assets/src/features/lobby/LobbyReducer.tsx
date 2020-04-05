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
      image: "https://nookipedia.com/w/images/e/e3/Tom_Nook_NH.png",
    },
    {
      id: "2",
      name: "Team Isabelle",
      image: "https://nookipedia.com/w/images/9/95/Isabelle_NH.png",
    },
    {
      id: "3",
      name: "Team Villager",
      image:
        "https://vignette.wikia.nocookie.net/animalcrossing/images/a/ac/Villager_SSBU.png/revision/latest?cb=20190614181042",
    },
    {
      id: "4",
      name: "Team Blathers",
      image: "https://nookipedia.com/w/images/7/7e/Blathers_NH_-_alt.png",
    },
    {
      id: "5",
      name: "Team Mabel",
      image: "https://nookipedia.com/w/images/8/80/Mabel_NH.png",
    },
    {
      id: "6",
      name: "Team K.K.",
      image: "https://nookipedia.com/w/images/8/81/K.K._Slider_NH.png",
    },
    {
      id: "7",
      name: "Team Celeste",
      image: "https://nookipedia.com/w/images/f/f6/Celeste_NH.png",
    },
    {
      id: "8",
      name: "Team Rover",
      image: "https://nookipedia.com/w/images/0/0e/Rover_AF.png",
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
