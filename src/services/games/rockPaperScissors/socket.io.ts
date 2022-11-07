import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { Socket, Server as SocketIOServer } from "socket.io";
import { createGame, makePlayerMove, resolveRound } from ".";
import { RPSCreateGameProps, RPSGame, RPSPlayerMove } from "./types";

let inMemoryGames: RPSGame[] = [
  { id: "game2", playerIds: ["t1", "t2"], rounds: [] },
];

export enum RPS_ACTIONS {
  CREATE_GAME = "CREATE_GAME",
  GAME_UPDATE = "GAME_UPDATE",
  MAKE_MOVE = "MAKE_MOVE",
  RESOLVE_ROUND = "RESOLVE_ROUND",
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
        (error) => console.error(error),
        (game) => {
          inMemoryGames = [
            ...inMemoryGames.filter((g) => g.id !== game.id),
            game,
          ];
          console.log("updated games", inMemoryGames);
          socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames);
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
        (e) => console.error(e),
        (game) => {
          inMemoryGames = [
            ...inMemoryGames.filter((g) => g.id !== game.id),
            game,
          ];
          console.log("Player moved", move, gameId);
          socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames);
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
        (e) => console.error(e),
        (game) => {
          inMemoryGames = [
            ...inMemoryGames.filter((g) => g.id !== game.id),
            game,
          ];
          console.log("Round resolved", gameId);
          socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames);
        }
      )
    );
  }

  console.log("Registering RockPaperScissors SocketIo 🔌");

  socket.on(RPS_ACTIONS.CREATE_GAME, createGameHandler);
  socket.on(RPS_ACTIONS.MAKE_MOVE, makePlayerMoveHandler);
  socket.on(RPS_ACTIONS.RESOLVE_ROUND, resolveRoundHandler);

  socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames);
  socket.emit("server_message", "Welcome to Rock/Paper/Scissors 🎉");
}
