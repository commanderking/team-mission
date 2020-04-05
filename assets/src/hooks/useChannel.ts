import { useContext, useReducer, useEffect, useState } from "react";
import { SocketContext } from "context/socketContext";
import { Channel } from "phoenix";

type Meta = {
  id: string;
  phx_ref: string;
  name: string;
};

const useChannel = <T>(
  channelTopic: string,
  reducer: (state: any, action: any) => any,
  initialState: T,
  name: string
): { channelState: T; channel: Channel | null; dispatch: any } => {
  const socket = useContext(SocketContext);
  const [state, dispatch]: [T, any] = useReducer(reducer, initialState);

  // @ts-ignore
  const [channel, setChannel]: [Channel | null, any] = useState(null);

  useEffect(() => {
    socket.connect();

    const channel: Channel = socket.channel(channelTopic, {
      params: { name },
    });

    channel
      .join()
      .receive("ok", (resp) => {
        setChannel(channel);
      })
      .receive("error", ({ reason }) => {
        console.error("failed to join channel", reason);
      });

    return () => {
      channel.leave();
    };
  }, [channelTopic, socket]);

  return { channelState: state, channel, dispatch };
};

export default useChannel;
