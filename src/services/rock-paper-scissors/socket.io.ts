import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { Socket, Server as SocketIOServer } from "socket.io";
import { sendClientMessage } from "../socket";
import {
  RPSCreateGameProps,
  RPSGame,
  RPSPlayerMove,
  RPSSpectatorRoundView,
} from "./types";
import {
  addRoundToGame,
  createGame,
  createGameView,
  makePlayerMove,
  resolveRound,
} from ".";

let inMemoryGames: RPSGame[] = [];

export type RPSCreateGameHandler = (
  props: RPSCreateGameProps,
  onCreated: (gameId: string) => void
) => void;

export type RPSResolveRoundHandler = (
  gameId: string,
  onResolved?: (previousRound: RPSSpectatorRoundView) => void
) => void;

export type RPSNewRoundHandler = (
  gameId: string,
  onResolved?: () => void
) => void;

export enum RPS_ACTIONS {
  CREATE_GAME = "CREATE_GAME",
  GAME_UPDATE = "GAME_UPDATE",
  MAKE_MOVE = "MAKE_MOVE",
  RESOLVE_ROUND = "RESOLVE_ROUND",
  NEW_ROUND = "NEW_ROUND",
}

export function initialiseRockPaperScissorsSocket(
  io: SocketIOServer,
  socket: Socket
) {
  const createGameHandler: RPSCreateGameHandler = (
    props: RPSCreateGameProps,
    onCreated: (gameId: string) => void
  ) => {
    console.log("Creating game", props);
    pipe(
      createGame(props),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (game) => {
          inMemoryGames = [
            ...inMemoryGames.filter((g) => g.id !== game.id),
            game,
          ];
          console.log("updated games", inMemoryGames);
          io.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));
          onCreated(game.id);
        }
      )
    );
  };

  function makePlayerMoveHandler(move: RPSPlayerMove, gameId: string): void {
    pipe(
      inMemoryGames,
      A.findFirst((game: RPSGame) => game.id === gameId),
      E.fromOption(() => "no game found"),
      E.chain((game) => makePlayerMove(move, game)),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (game) => {
          inMemoryGames = [
            ...inMemoryGames.filter((g) => g.id !== game.id),
            game,
          ];
          console.log("Player moved", move, gameId);
          io.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));
        }
      )
    );
  }

  const resolveRoundHandler: RPSResolveRoundHandler = (gameId, onResolved) => {
    pipe(
      inMemoryGames,
      A.findFirst((game: RPSGame) => game.id === gameId),
      E.fromOption(() => "no game found"),
      E.chain(resolveRound),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (game) => {
          inMemoryGames = [
            ...inMemoryGames.filter((g) => g.id !== game.id),
            game,
          ];
          console.log("Round resolved", gameId);
          io.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));

          const gameView = createGameView(game);
          onResolved &&
            onResolved(
              gameView.roundHistory[gameView.roundHistory.length - 1]!
            );
        }
      )
    );
  };

  const newRoundHandler: RPSNewRoundHandler = (gameId, onResolved) => {
    pipe(
      inMemoryGames,
      A.findFirst((game: RPSGame) => game.id === gameId),
      E.fromOption(() => "no game found"),
      E.chain(addRoundToGame),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (game) => {
          inMemoryGames = [
            ...inMemoryGames.filter((g) => g.id !== game.id),
            game,
          ];
          console.log("New round added", gameId);
          io.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));
          onResolved && onResolved();
        }
      )
    );
  };

  console.log("Registering RockPaperScissors SocketIo 🔌");

  socket.on(RPS_ACTIONS.CREATE_GAME, createGameHandler);
  socket.on(RPS_ACTIONS.MAKE_MOVE, makePlayerMoveHandler);
  socket.on(RPS_ACTIONS.RESOLVE_ROUND, resolveRoundHandler);
  socket.on(RPS_ACTIONS.NEW_ROUND, newRoundHandler);

  socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));
  sendClientMessage(socket, "Welcome to Rock/Paper/Scissors 🎉");
}
