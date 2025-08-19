export type Files = { html: string; css: string; js: string };
export type ClientInfo = { socketId: string; username: string };
export const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  DISCONNECTED: "disconnected"
} as const;
export type ActionType = keyof typeof ACTIONS;