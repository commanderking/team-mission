import { useEffect, useContext, useReducer, useState } from "react";
import useChannel from "hooks/useChannel";
import { activityActions } from "features/activity/ActivityActions";
import { Presence } from "phoenix";
import { SocketContext } from "context/socketContext";
import { Channel } from "phoenix";

const useActivityChannel = <T>(
  topic: string,
  reducer: (state: any, action: any) => any,
  initialState: T,
  params: Object
) => {
  const socket = useContext(SocketContext);
  const [state, dispatch]: [T, any] = useReducer(reducer, initialState);

  // @ts-ignore
  const [channel, setChannel]: [Channel | null, any] = useState(null);

  useEffect(() => {
    const channel: Channel = socket.channel(topic, {
      params,
    });

    channel
      .join()
      .receive("ok", (resp) => {
        setChannel(channel);
      })
      .receive("error", ({ reason }) => {
        console.error("failed to join channel", reason);
      });

    const presence = new Presence(channel);
    channel.on("new_msg", (response) => {
      dispatch({
        type: activityActions.NEW_MESSAGE,
        payload: response,
      });
    });

    channel.on("get_room_messages", (payload) => {
      console.log("get_room_messages payload", payload);
      dispatch({
        type: activityActions.GET_ROOM_MESSAGES,
        payload,
      });
    });
    presence.onSync(() => {
      presence.list((presenceId, { metas }) => {
        if (presenceId === "team") {
          dispatch({
            type: activityActions.SYNC_ACTIVITY_PRESENCE,
            payload: metas,
          });
        }
      });
    });
  }, [topic, socket]);

  return { channelState: state, channel };
};

export default useActivityChannel;
