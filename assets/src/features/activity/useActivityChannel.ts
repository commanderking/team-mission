import { useEffect } from "react";
import useChannel from "hooks/useChannel";
import { activityActions } from "features/activity/ActivityActions";
import { Presence } from "phoenix";

const useActivityChannel = <T>(
  reducer: (state: any, action: any) => any,
  initialState: T,
  params: Object,
  teamId: string
) => {
  const { channelState, channel, dispatch } = useChannel(
    `room:${teamId}`,
    reducer,
    initialState,
    params
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
      presence.onSync(() => {
        presence.list((presenceId, { metas }) => {
          console.log("presenceId", presenceId);
          console.log("metas", metas);
          if (presenceId === "team") {
            dispatch({
              type: activityActions.SYNC_ACTIVITY_PRESENCE,
              payload: metas,
            });
          }
        });
      });
    }
  }, [channel]);

  return { channelState, channel };
};

export default useActivityChannel;
