import { useEffect } from "react";
import useChannel from "hooks/useChannel";
import { activityActions } from "features/activity/ActivityActions";
import { Presence } from "phoenix";

const useActivityChannel = <T>(
  reducer: (state: any, action: any) => any,
  initialState: T,
  name: string,
  teamId: string
) => {
  const { channelState, channel, dispatch } = useChannel(
    `room:${teamId}`,
    reducer,
    initialState,
    name
  );

  useEffect(() => {
    if (channel) {
      const presence = new Presence(channel);
      channel.on("new_msg", (response) => {
        dispatch({
          type: activityActions.NEW_MESSAGE,
          payload: response,
        });
      });
    }
  }, [channel]);

  return { channelState, channel };
};

export default useActivityChannel;
