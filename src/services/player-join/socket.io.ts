import { Socket, Server as SocketIOServer } from "socket.io";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { sendClientMessage } from "../socket";
import { getPlayerTE } from "../../utils/data/aws-dynamodb";
import { PlayerGroup } from "./types";
import { addPlayerToGroup, createPlayerJoinGroup } from ".";

export enum PLAYER_JOIN_ACTIONS {
  JOIN_GROUP_UPDATE = "JOIN_GROUP_UPDATE",
  CREATE_JOIN_GROUP = "CREATE_JOIN_GROUP",
  PLAYER_JOIN_GROUP = "PLAYER_JOIN_GROUP",
}

export type CreatePlayerGroupSocketHandler = (
  groupId: string,
  onCreated?: (groupId: string) => void
) => void;

export type PlayerJoinGroupSocketHandler = (
  playerId: string,
  groupId: string,
  onJoined?: (groupId: string) => void
) => void;

let inMemoryGroups: PlayerGroup[] = [createPlayerJoinGroup("1234")];

export function initialiseGroupJoinSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const createGroupHandler: CreatePlayerGroupSocketHandler = (
    groupId,
    onCreated?
  ) => {
    const newGroup = createPlayerJoinGroup(groupId);
    inMemoryGroups.push(newGroup);
    io.emit(PLAYER_JOIN_ACTIONS.JOIN_GROUP_UPDATE, inMemoryGroups);
    onCreated && onCreated(groupId);
  };

  const playerJoinGroupHandler: PlayerJoinGroupSocketHandler = async (
    playerId,
    groupId,
    onJoined
  ) => {
    console.log("JOINING GROUP", playerId, groupId);

    const player = await getPlayerTE(playerId)();

    pipe(
      player,
      E.match(
        (error) => console.log(error),
        (maybePlayer) =>
          pipe(
            maybePlayer,
            O.fold(
              () => console.log("Player not found", playerId),
              (player) => {
                console.log("Success...adding", playerId, groupId);

                const group = inMemoryGroups.find((g) => g.id === groupId);
                if (!group) {
                  console.error("Group not found", groupId);
                  return;
                }

                const updatedGroup = addPlayerToGroup(player, group);
                inMemoryGroups = inMemoryGroups.map((g) =>
                  g.id === groupId ? updatedGroup : g
                );
                io.emit(PLAYER_JOIN_ACTIONS.JOIN_GROUP_UPDATE, inMemoryGroups);
                onJoined && onJoined(groupId);
              }
            )
          )
      )
    );
  };

  console.log("Registering Player Join SocketIo 🔌");

  socket.on(PLAYER_JOIN_ACTIONS.CREATE_JOIN_GROUP, createGroupHandler);
  socket.on(PLAYER_JOIN_ACTIONS.PLAYER_JOIN_GROUP, playerJoinGroupHandler);
  socket.emit(PLAYER_JOIN_ACTIONS.JOIN_GROUP_UPDATE, inMemoryGroups);
  sendClientMessage(socket, "Welcome to Player Join service 👨‍👩‍👧‍👦");
}
