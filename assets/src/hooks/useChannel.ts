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
  const [lobbyChannel, setLobbyChannel]: [Channel | null, any] = useState(null);

  useEffect(() => {
    socket.connect();

    const channel: Channel = socket.channel(channelTopic, {
      params: { name }
    });

    channel
      .join()
      .receive("ok", resp => {
        channel.push("new_join", { body: { name } });
        // @ts-ignore
        setLobbyChannel(channel);
      })
      .receive("error", ({ reason }) => {
        console.error("failed to join channel", reason);
      });

    return () => {
      channel.leave();
    };
  }, [channelTopic, socket]);

  return { channelState: state, channel: lobbyChannel, dispatch };
};

export default useChannel;
