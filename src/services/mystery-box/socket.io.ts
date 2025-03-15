import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { Socket, Server as SocketIOServer } from "socket.io";
import { sendClientMessage } from "../socket";
import { ErrorMessage } from "../../types/common";
import { generateRandomInt } from "../../utils/random";
import { Player } from "../../types/Player";
import { MysteryBoxGame } from "./types";
import { createMysteryBoxGame } from ".";

export enum MYSTERY_BOX_ACTIONS {
  GAME_UPDATE = "MYSTERY_BOX_GAME_UPDATE",
  CREATE_GAME = "MYSTERY_BOX_CREATE_GAME",
  MAKE_PLAYER_GUESS = "MYSTERY_BOX_PLAYER_SELECT_BOX",
}

export type CreateMysteryBoxGameHandler = (
  id: string,
  players: Player[],
  onCreated: (game: MysteryBoxGame) => void
) => void;

export type PlayerSelectMysteryBoxHandler = (
  gameId: string,
  playerId: string,
  guess: number
) => void;

let inMemoryGames: MysteryBoxGame[] = [];

const updateInMemoryGame = (game: MysteryBoxGame): MysteryBoxGame[] => {
  inMemoryGames = inMemoryGames.map((g) => (g.id === game.id ? game : g));
  return inMemoryGames;
};

const emitUpdatedGamesToAllClients = (io: SocketIOServer) => {
  // console.info("Emitting updated games to all clients", getGameViews());
  io.emit(MYSTERY_BOX_ACTIONS.GAME_UPDATE, inMemoryGames);
};

const getGame = (
  gameId: string,
  allGames: MysteryBoxGame[]
): E.Either<ErrorMessage, MysteryBoxGame> => {
  const game = allGames.find((g) => g.id === gameId);
  return game ? E.right(game) : E.left("Game not found");
};

export function initialiseNumberCrunchSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const createGameHandler: CreateMysteryBoxGameHandler = (
    id,
    players,
    onCreated
  ) => {
    console.log("Got to creating game socket");
    pipe(
      createMysteryBoxGame({
        id,
        players,
      }),
      E.match(
        (e) => {
          console.error(e), sendClientMessage(socket, e);
        },
        (game) => {
          console.info("mystery box game created", game);
          updateInMemoryGame(game);
          onCreated(game);
          emitUpdatedGamesToAllClients(io);
        }
      )
    );
  };

  // const makePlayerGuessHandler: MakeNumberCrunchPlayerGuessGameHandler = (
  //   gameId,
  //   playerId,
  //   guess
  // ) => {
  //   pipe(
  //     getGame(gameId, inMemoryGames),
  //     E.chain(setPlayerGuessOnLatestRound(playerId, guess)),
  //     E.match(
  //       (e) => {
  //         console.error(e), sendClientMessage(socket, e);
  //       },
  //       (updatedGame) => {
  //         updateInMemoryGame(updatedGame);
  //         emitUpdatedGamesToAllClients(io);
  //       }
  //     )
  //   );
  // };

  // const newNumberCrunchRoundHandler: NewNumberCrunchRoundHandler = (gameId) => {
  //   pipe(
  //     getGame(gameId, inMemoryGames),
  //     E.chain(newRound),
  //     E.match(
  //       (e) => {
  //         console.error(e), sendClientMessage(socket, e);
  //       },
  //       (updatedGame) => {
  //         updateInMemoryGame(updatedGame);
  //         emitUpdatedGamesToAllClients(io);
  //       }
  //     )
  //   );
  // };

  console.log("Registering Mystery Box SocketIo 🔌");

  socket.on(MYSTERY_BOX_ACTIONS.CREATE_GAME, createGameHandler);
  // socket.on(NUMBER_CRUNCH_ACTIONS.MAKE_PLAYER_GUESS, makePlayerGuessHandler);
  // socket.on(NUMBER_CRUNCH_ACTIONS.NEW_ROUND, newNumberCrunchRoundHandler);
  socket.emit(MYSTERY_BOX_ACTIONS.GAME_UPDATE, inMemoryGames);
  sendClientMessage(socket, "Welcome to Mystery Box ❓🎁");
}
