import { useEffect } from "react";
import useChannel from "hooks/useChannel";
import { lobbyActions } from "features/lobby/LobbyActions";
import { Presence } from "phoenix";

const useLobbyChannel = <T>(
  reducer: (state: any, action: any) => any,
  initialState: T,
  name: string
) => {
  const { channelState, channel, dispatch } = useChannel(
    "room:lobby",
    reducer,
    initialState,
    { name }
  );

  useEffect(() => {
    if (channel) {
      const presence = new Presence(channel);

      channel.on("join_team", (payload) => {
        dispatch({
          type: lobbyActions.JOIN_TEAM,
          payload,
        });
      });

      channel.on("start_activity", () => {
        dispatch({
          type: lobbyActions.CHANGE_ACTIVITY_STATUS,
          payload: true,
        });
      });

      presence.onSync(() => {
        presence.list((presenceId, { metas }) => {
          if (presenceId === "students") {
            dispatch({
              type: lobbyActions.SYNC_STUDENT_PRESENCE,
              payload: metas,
            });
          }
        });
      });
    }
  }, [channel]);

  return { channelState, channel };
};

export default useLobbyChannel;
