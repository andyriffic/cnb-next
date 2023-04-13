import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { Server as SocketIOServer, Socket } from "socket.io";
import { sendClientMessage } from "../socket";
import { RPSMoveName } from "../rock-paper-scissors/types";
import { createAiOverlord, createAiOverlordGameSummary } from "./openAi";
import { AiOverlordGame, AiOverlordOpponent } from "./types";
import {
  createAiOpponents,
  createAiOverlordGame,
  finaliseAiGame,
  makeAiMove,
  makeAiOpponentMove,
  prepareAllPlayerTaunts,
  preparePlayerForBattle,
} from ".";

let aiOverlordGames: AiOverlordGame[] = [];

const getInMemoryAiOverlordGame = (
  gameId: string
): AiOverlordGame | undefined => {
  return aiOverlordGames.find((game) => game.gameId === gameId);
};

const updateInMemoryAiOverlordGame = (game: AiOverlordGame): void => {
  aiOverlordGames = [
    ...aiOverlordGames.filter((g) => g.gameId !== game.gameId),
    game,
  ];
};

const getAllInMemoryAiOverlordGames = (): AiOverlordGame[] => {
  return aiOverlordGames;
};

export enum AI_OVERLORD_ACTIONS {
  GAME_UPDATE = "AI_OVERLORD_GAME_UPDATE",
  CREATE_GAME = "AI_OVERLORD_CREATE_GAME",
  NEW_OPPONENT = "AI_OVERLORD_NEW_OPPONENT",
  MAKE_ROBOT_MOVE = "AI_OVERLORD_MAKE_ROBOT_MOVE",
  MAKE_OPPONENT_MOVE = "AI_OVERLORD_MAKE_OPPONENT_MOVE",
  RESOLVE_OPPONENT_BATTLE = "AI_OVERLORD_RESOLVE_OPPONENT_BATTLE",
  MAKE_FINAL_ROBOT_SUMMARY = "AI_OVERLORD_MAKE_FINAL_ROBOT_SUMMARY",
  ROBOT_MESSAGE = "AI_OVERLORD_ROBOT_MESSAGE",
}

export type CreateAiOverlordGameHandler = (
  id: string,
  playerIds: string[],
  onCreated: (gameId: string) => void
) => void;

export type NewAiOverlordOpponentHandler = (
  gameId: string,
  opponentId: string
) => void;

export type MakeAiOpponentMoveHandler = (
  gameId: string,
  opponentId: string,
  move: RPSMoveName
) => void;

export type MakeAiRobotMoveHandler = (
  gameId: string,
  opponentId: string
) => void;

export type MakeFinalRobotSummaryHandler = (gameId: string) => void;

export function initialiseAiOverlordSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const sendRobotMessage = (message: string): void => {
    socket.emit(AI_OVERLORD_ACTIONS.ROBOT_MESSAGE, message);
  };

  const createAiOverlordGameHandler: CreateAiOverlordGameHandler = async (
    id,
    playerIds,
    onCreated
  ) => {
    console.log("Create Ai Overlord game", playerIds);

    const game = await pipe(
      createAiOpponents(playerIds),
      TE.chain((opponents) =>
        createAiOverlordGame(id, createAiOverlord, opponents)
      )
    )();

    pipe(
      game,
      E.fold(
        (err) => {
          console.error(err);
          sendClientMessage(socket, `🤖‼️: ${err}`);
          sendRobotMessage(`🤖‼️: ${err}`);
        },
        async (game) => {
          console.log("Created game", game);
          updateInMemoryAiOverlordGame(game);
          io.emit(
            AI_OVERLORD_ACTIONS.GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
          onCreated(game.gameId);

          const result = await prepareAllPlayerTaunts(game)();
          pipe(
            result,
            E.fold(
              (err) => {
                console.error(err);
                sendClientMessage(socket, `🤖‼️: ${err}`);
                sendRobotMessage(`🤖‼️: ${err}`);
              },
              (taunts) => {
                console.log("Created all taunts!", taunts);
                // updateInMemoryAiOverlordGame(game);
                // io.emit(
                //   AI_OVERLORD_ACTIONS.GAME_UPDATE,
                //   getAllInMemoryAiOverlordGames()
                // );
              }
            )
          );
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
          sendClientMessage(socket, `🤖‼️: ${err}`);
          sendRobotMessage(`🤖‼️: ${err}`);
        },
        (game) => {
          updateInMemoryAiOverlordGame(game);
          io.emit(
            AI_OVERLORD_ACTIONS.GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
        }
      )
    );
  };

  const makeAiOpponentMoveHandler: MakeAiOpponentMoveHandler = async (
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
          sendClientMessage(socket, `🤖‼️: ${err}`);
          sendRobotMessage(`🤖‼️: ${err}`);
        },
        (game) => {
          updateInMemoryAiOverlordGame(game);
          io.emit(
            AI_OVERLORD_ACTIONS.GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
        }
      )
    );
  };

  const makeAiRobotMoveHandler: MakeAiRobotMoveHandler = async (
    gameId,
    opponentId
  ) => {
    const game = getInMemoryAiOverlordGame(gameId);
    if (!game) {
      console.error("Game not found", gameId);
      return;
    }
    const result = await makeAiMove(opponentId, game)();
    pipe(
      result,
      E.fold(
        (err) => {
          console.error(err);
          sendClientMessage(socket, `🤖‼️: ${err}`);
          sendRobotMessage(`🤖‼️: ${err}`);
        },
        (game) => {
          updateInMemoryAiOverlordGame(game);
          io.emit(
            AI_OVERLORD_ACTIONS.GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
        }
      )
    );
  };

  const makeFinalRobotSummaryHandler: MakeFinalRobotSummaryHandler = async (
    gameId
  ) => {
    const game = getInMemoryAiOverlordGame(gameId);
    if (!game) {
      console.error("Game not found", gameId);
      return;
    }
    const result = await finaliseAiGame(game)();

    pipe(
      result,
      E.fold(
        (err) => {
          console.error(err);
          sendClientMessage(socket, `🤖‼️: ${err}`);
          sendRobotMessage(`🤖‼️: ${err}`);
        },
        (updatedGame) => {
          updateInMemoryAiOverlordGame(updatedGame);
          io.emit(
            AI_OVERLORD_ACTIONS.GAME_UPDATE,
            getAllInMemoryAiOverlordGames()
          );
        }
      )
    );
  };

  console.log("Registering AiOverlord SocketIo 🔌");

  socket.on(AI_OVERLORD_ACTIONS.CREATE_GAME, createAiOverlordGameHandler);
  socket.on(AI_OVERLORD_ACTIONS.NEW_OPPONENT, newAiOverlordOpponentHandler);
  socket.on(AI_OVERLORD_ACTIONS.MAKE_OPPONENT_MOVE, makeAiOpponentMoveHandler);
  socket.on(AI_OVERLORD_ACTIONS.MAKE_ROBOT_MOVE, makeAiRobotMoveHandler);
  socket.on(
    AI_OVERLORD_ACTIONS.MAKE_FINAL_ROBOT_SUMMARY,
    makeFinalRobotSummaryHandler
  );
  socket.emit(AI_OVERLORD_ACTIONS.GAME_UPDATE, aiOverlordGames);
  sendClientMessage(socket, "Welcome to AiOverlord 🤖");
}
