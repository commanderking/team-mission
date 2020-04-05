export const lobbyActions = {
  USER_LEAVE: "USER_LEAVE",
  SYNC_STUDENT_PRESENCE: "SYNC_STUDENT_PRESENCE",
  AFTER_JOIN: "AFTER_JOIN",
  JOIN_TEAM: "JOIN_TEAM",
  CHANGE_ACTIVITY_STATUS: "CHANGE_ACTIVITY_STATUS",
};

// export type lobbyActions = {
//   type: keyof typeof lobbyActions;
//   payload: any;
// };

// Typescript has challenges with specific object types
//   | { type: typeof lobbyActions.NEW_MSG; payload: any }
//   | { type: typeof lobbyActions.USER_JOIN; payload: any };
