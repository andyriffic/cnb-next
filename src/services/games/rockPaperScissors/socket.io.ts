import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import { Socket, Server as SocketIOServer } from "socket.io";
import { createGame } from ".";
import { RPSCreateGameProps, RPSGame } from "./types";

let inMemoryGames: RPSGame[] = [
  { id: "game2", playerIds: ["t1", "t2"], rounds: [] },
];

export enum RPS_ACTIONS {
  CREATE_GAME = "CREATE_GAME",
  GAME_UPDATE = "GAME_UPDATE",
}

export default function initialise(io: SocketIOServer, socket: Socket) {
  function createGameHandler(
    props: RPSCreateGameProps,
    onCreated: (gameId: string) => void
  ) {
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

  console.log("Registering RockPaperScissors SocketIo 🔌");

  socket.on(RPS_ACTIONS.CREATE_GAME, createGameHandler);
  socket.emit(RPS_ACTIONS.GAME_UPDATE, inMemoryGames);
  socket.emit("server_message", "Welcome to Rock/Paper/Scissors 🎉");
}
