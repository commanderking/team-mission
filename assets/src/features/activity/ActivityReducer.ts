import { ActivityState } from "features/activity/ActivityTypes";
import { activityActions } from "features/activity/ActivityActions";

export const initialState: ActivityState = {
  messages: [],
  answers: [],
};

const activityReducer = (state: ActivityState, action: any): ActivityState => {
  switch (action.type) {
    case activityActions.NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    default:
      throw new Error("Non valid Action");
  }
};

export default activityReducer;
