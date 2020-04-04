import { useEffect } from "react";
import useChannel from "hooks/useChannel";

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
      channel.on("new_join", payload => {
        console.log("new join payload", payload);
        const { user_data } = payload;
        dispatch({
          type: "USER_JOIN",
          payload: { ...user_data, actionType: "USER_JOIN" }
        });
      });
    }
  }, [channel]);

  return { channelState, channel };
};

export default useLobbyChannel;
