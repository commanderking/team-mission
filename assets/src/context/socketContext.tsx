import React, { useEffect } from "react";

import { createContext } from "react";

import { Socket } from "phoenix";

const isDevEnvironment = process.env.NODE_ENV === "development";

const getSocketUrl = () =>
  isDevEnvironment ? "ws://localhost:4000/socket" : "/socket";

const socket = new Socket(getSocketUrl(), {
  params: { token: "abc" }
});
export const SocketContext = createContext(socket);

const SocketProvider = ({ wsUrl, options, children }: any) => {
  useEffect(() => {}, [options, wsUrl]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
