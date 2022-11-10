import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { Socket, Server as SocketIOServer } from "socket.io";
import {
  addRoundToGame,
  createGame,
  createGameView,
  makePlayerMove,
  resolveRound,
} from ".";
import { RPSCreateGameProps, RPSGame, RPSPlayerMove } from "./types";
import { sendClientMessage } from "../../socket";

let inMemoryGames: RPSGame[] = [
  {
    id: "1234",
    playerIds: ["andy", "alex"],
    rounds: [{ index: 0, moves: [] }],
  },
];

export enum RPS_ACTIONS {
  CREATE_GAME = "CREATE_GAME",
  GAME_UPDATE = "GAME_UPDATE",
  MAKE_MOVE = "MAKE_MOVE",
  RESOLVE_ROUND = "RESOLVE_ROUND",
  NEW_ROUND = "NEW_ROUND",
}

export default function initialise(io: SocketIOServer, socket: Socket) {
  function createGameHandler(
    props: RPSCreateGameProps,
    onCreated: (gameId: string) => void
  ): void {
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
  }

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

  function resolveRoundHandler(gameId: string): void {
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
        }
      )
    );
  }
  function newRoundHandler(gameId: string): void {
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
        }
      )
    );
  }

  console.log("Registering RockPaperScissors SocketIo 🔌");

  socket.on(RPS_ACTIONS.CREATE_GAME, createGameHandler);
  socket.on(RPS_ACTIONS.MAKE_MOVE, makePlayerMoveHandler);
  socket.on(RPS_ACTIONS.RESOLVE_ROUND, resolveRoundHandler);
  socket.on(RPS_ACTIONS.NEW_ROUND, newRoundHandler);

  socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames.map(createGameView));
  sendClientMessage(socket, "Welcome to Rock/Paper/Scissors 🎉");
}
