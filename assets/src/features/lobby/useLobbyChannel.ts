import { useEffect } from "react";
import useChannel from "hooks/useChannel";
import { lobbyActions } from "features/lobby/LobbyActions";
const useLobbyChannel = <T>(
  reducer: (state: any, action: any) => any,
  initialState: T,
  name: string
) => {
  const { channelState, channel, dispatch } = useChannel(
    "room:lobby",
    reducer,
    initialState,
    name
  );

  useEffect(() => {
    if (channel) {
      channel.on("new_join", (payload) => {
        console.log("new join payload", payload);
        const { user_data } = payload;
        dispatch({
          type: "USER_JOIN",
          payload: { ...user_data, actionType: "USER_JOIN" },
        });
      });

      channel.on("after_join", (payload) => {
        console.log("after join payload", payload);
        dispatch({
          type: "AFTER_JOIN",
          payload,
        });
      });

      channel.on("join_team", (payload) => {
        console.log("payload", payload);
        dispatch({
          type: lobbyActions.JOIN_TEAM,
          payload,
        });
      });
    }
  }, [channel]);

  return { channelState, channel };
};

export default useLobbyChannel;
