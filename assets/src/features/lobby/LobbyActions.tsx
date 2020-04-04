export const lobbyActions = {
  NEW_MSG: "NEW_MSG",
  USER_JOIN: "USER_JOIN",
  USER_LEAVE: "USER_LEAVE",
  UPDATE_PRESENCE_STATE: "UPDATE_PRESENCE_STATE",
  SYNC_PRESENCE: "SYNC_PRESENCE"
};

// export type lobbyActions = {
//   type: keyof typeof lobbyActions;
//   payload: any;
// };

// Typescript has challenges with specific object types
//   | { type: typeof lobbyActions.NEW_MSG; payload: any }
//   | { type: typeof lobbyActions.USER_JOIN; payload: any };
