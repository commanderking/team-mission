import { ActivityState } from "features/activity/ActivityTypes";
import { activityActions } from "features/activity/ActivityActions";

export const initialState: ActivityState = {
  messages: [],
  votes: [],
  members: [],
};

const activityReducer = (state: ActivityState, action: any): ActivityState => {
  switch (action.type) {
    case activityActions.NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case activityActions.VOTE:
      return {
        ...state,
        votes: [...state.votes, action.payload],
      };

    case activityActions.SYNC_ACTIVITY_PRESENCE:
      return {
        ...state,
        members: action.payload,
      };

    case activityActions.GET_ROOM_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages,
      };

    default:
      throw new Error("Non valid Action");
  }
};

export default activityReducer;
