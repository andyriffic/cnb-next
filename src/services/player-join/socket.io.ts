import { Socket, Server as SocketIOServer } from "socket.io";
import { createPlayerJoinGroup } from ".";
import { sendClientMessage } from "../socket";
import { PlayerGroup } from "./types";

export enum PLAYER_JOIN_ACTIONS {
  JOIN_GROUP_UPDATE = "JOIN_GROUP_UPDATE",
  CREATE_JOIN_GROUP = "CREATE_JOIN_GROUP",
  PLAYER_JOIN_GROUP = "PLAYER_JOIN_GROUP",
}

const inMemoryGroups: PlayerGroup[] = [];

export function initialiseGroupJoinSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  function createGroupHandler(
    groupId: string,
    onCreated?: (groupId: string) => void
  ): void {
    const newGroup = createPlayerJoinGroup(groupId);
    inMemoryGroups.push(newGroup);
    io.emit(PLAYER_JOIN_ACTIONS.JOIN_GROUP_UPDATE, inMemoryGroups);
    onCreated && onCreated(groupId);
  }

  console.log("Registering Player Join SocketIo 🔌");

  socket.on(PLAYER_JOIN_ACTIONS.CREATE_JOIN_GROUP, createGroupHandler);
  socket.emit(PLAYER_JOIN_ACTIONS.JOIN_GROUP_UPDATE, inMemoryGroups);
  sendClientMessage(socket, "Welcome to Player Join service 👨‍👩‍👧‍👦");
}
