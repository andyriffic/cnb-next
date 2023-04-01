import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { Server as SocketIOServer, Socket } from "socket.io";
import {
  getAllInMemoryAiOverlordGames,
  updateInMemoryAiOverlordGame,
} from "../../utils/data/in-memory";
import { sendClientMessage } from "../socket";
import { createAiOverlord } from "./openAi";
import { AiOverlordOpponent } from "./types";
import { createAiOverlordGame } from ".";

export enum AI_OVERLORD_ACTIONS {
  AI_OVERLORD_GAME_UPDATE = "AI_OVERLORD_GAME_UPDATE",
  AI_OVERLORD_CREATE_GAME = "AI_OVERLORD_CREATE_GAME",
  AI_OVERLORD_NEW_OPPONENT = "AI_OVERLORD_NEW_OPPONENT",
  AI_OVERLORD_MAKE_ROBOT_MOVE = "AI_OVERLORD_MAKE_ROBOT_MOVE",
  AI_OVERLORD_MAKE_OPPONENT_MOVE = "AI_OVERLORD_MAKE_OPPONENT_MOVE",
  AI_OVERLORD_RESOLVE_OPPONENT_BATTLE = "AI_OVERLORD_RESOLVE_OPPONENT_BATTLE",
}

export type CreateAiOverlordGameHandler = (
  id: string,
  opponents: AiOverlordOpponent[],
  onCreated: (gameId: string) => void
) => void;

export function initialiseAiOverlordSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const createAiOverlordGameHandler: CreateAiOverlordGameHandler = async (
    id,
    opponents,
    onCreated
  ) => {
    console.log("Create Ai Overlord game", opponents);
    const game = await createAiOverlordGame(id, createAiOverlord, opponents)();

    pipe(
      game,
      E.fold(
        (err) => {
          console.error(err);
          sendClientMessage(socket, err);
        },
        (game) => {
          console.log("Created game", game);
          updateInMemoryAiOverlordGame(game);
          io.emit(
            AI_OVERLORD_ACTIONS.AI_OVERLORD_GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
          onCreated(game.gameId);
        }
      )
    );
  };

  console.log("Registering AiOverlord SocketIo 🔌");

  socket.on(
    AI_OVERLORD_ACTIONS.AI_OVERLORD_CREATE_GAME,
    createAiOverlordGameHandler
  );
  sendClientMessage(socket, "Welcome to AiOverlord 🤖");
}
