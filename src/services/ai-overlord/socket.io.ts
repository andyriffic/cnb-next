import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { Server as SocketIOServer, Socket } from "socket.io";
import {
  getAllInMemoryAiOverlordGames,
  getInMemoryAiOverlordGame,
  updateInMemoryAiOverlordGame,
} from "../../utils/data/in-memory";
import { sendClientMessage } from "../socket";
import { RPSMoveName } from "../rock-paper-scissors/types";
import { createAiOverlord } from "./openAi";
import { AiOverlordOpponent } from "./types";
import {
  createAiOverlordGame,
  makeAiOpponentMove,
  preparePlayerForBattle,
} from ".";

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

export type NewAiOverlordOpponentHandler = (
  gameId: string,
  opponentId: string
) => void;

export type makeAiOpponentMoveHandler = (
  gameId: string,
  opponentId: string,
  move: RPSMoveName
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

  const newAiOverlordOpponentHandler: NewAiOverlordOpponentHandler = async (
    gameId,
    opponentId
  ) => {
    const game = getInMemoryAiOverlordGame(gameId);
    if (!game) {
      console.error("Game not found", gameId);
      return;
    }

    const battle = await preparePlayerForBattle(opponentId, game)();
    pipe(
      battle,
      E.fold(
        (err) => {
          console.error(err);
          sendClientMessage(socket, err);
        },
        (game) => {
          updateInMemoryAiOverlordGame(game);
          io.emit(
            AI_OVERLORD_ACTIONS.AI_OVERLORD_GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
        }
      )
    );
  };

  const makeAiOpponentMoveHandler: makeAiOpponentMoveHandler = async (
    gameId,
    opponentId,
    move
  ) => {
    const game = getInMemoryAiOverlordGame(gameId);
    if (!game) {
      console.error("Game not found", gameId);
      return;
    }
    const result = await makeAiOpponentMove(opponentId, move, game)();
    pipe(
      result,
      E.fold(
        (err) => {
          console.error(err);
          sendClientMessage(socket, err);
        },
        (game) => {
          updateInMemoryAiOverlordGame(game);
          io.emit(
            AI_OVERLORD_ACTIONS.AI_OVERLORD_GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
        }
      )
    );
  };

  console.log("Registering AiOverlord SocketIo 🔌");

  socket.on(
    AI_OVERLORD_ACTIONS.AI_OVERLORD_CREATE_GAME,
    createAiOverlordGameHandler
  );
  socket.on(
    AI_OVERLORD_ACTIONS.AI_OVERLORD_NEW_OPPONENT,
    newAiOverlordOpponentHandler
  );
  socket.on(
    AI_OVERLORD_ACTIONS.AI_OVERLORD_MAKE_OPPONENT_MOVE,
    makeAiOpponentMoveHandler
  );
  sendClientMessage(socket, "Welcome to AiOverlord 🤖");
}
