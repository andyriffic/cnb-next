import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Player } from "../../types/Player";
import { sendClientMessage } from "../socket";
import { ErrorMessage } from "../../types/common";
import { NumberCrunchGame } from "./types";
import { createNumberCrunchGame, setPlayerGuessOnLatestRound } from ".";

export enum NUMBER_CRUNCH_ACTIONS {
  GAME_UPDATE = "NUMBER_CRUNCH_GAME_UPDATE",
  CREATE_GAME = "NUMBER_CRUNCH_CREATE_GAME",
  MAKE_PLAYER_GUESS = "NUMBER_CRUNCH_MAKE_PLAYER_GUESS",
}

export type CreateNumberCrunchGameHandler = (
  id: string,
  players: Player[],
  onCreated: (game: NumberCrunchGame) => void
) => void;

export type MakeNumberCrunchPlayerGuessGameHandler = (
  gameId: string,
  playerId: string,
  guess: number
) => void;

let inMemoryGames: NumberCrunchGame[] = [];

const updateInMemoryGame = (game: NumberCrunchGame): NumberCrunchGame[] => {
  inMemoryGames = [...inMemoryGames.filter((g) => g.id !== game.id), game];
  return inMemoryGames;
};

const getGame = (
  gameId: string,
  allGames: NumberCrunchGame[]
): E.Either<ErrorMessage, NumberCrunchGame> => {
  const game = allGames.find((g) => g.id === gameId);
  return game ? E.right(game) : E.left("Game not found");
};

export function initialiseNumberCrunchSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const createGameHandler: CreateNumberCrunchGameHandler = (
    id,
    players,
    onCreated
  ) => {
    console.log("Got to creating game socket");
    pipe(
      createNumberCrunchGame({ gameId: id, players }),
      E.match(
        (e) => {
          console.error(e), sendClientMessage(socket, e);
        },
        (game) => {
          updateInMemoryGame(game);
          onCreated(game);
          io.emit(NUMBER_CRUNCH_ACTIONS.GAME_UPDATE, inMemoryGames);
        }
      )
    );
  };

  const makePlayerGuessHandler: MakeNumberCrunchPlayerGuessGameHandler = (
    gameId,
    playerId,
    guess
  ) => {
    pipe(
      getGame(gameId, inMemoryGames),
      E.chain(setPlayerGuessOnLatestRound(playerId, guess)),
      E.match(
        (e) => {
          console.error(e), sendClientMessage(socket, e);
        },
        (updatedGame) => {
          const updateGames = updateInMemoryGame(updatedGame);
          io.emit(NUMBER_CRUNCH_ACTIONS.GAME_UPDATE, updateGames);
        }
      )
    );
  };

  console.log("Registering Number Crunch SocketIo 🔌");

  socket.on(NUMBER_CRUNCH_ACTIONS.CREATE_GAME, createGameHandler);
  socket.on(NUMBER_CRUNCH_ACTIONS.MAKE_PLAYER_GUESS, makePlayerGuessHandler);
  socket.emit(NUMBER_CRUNCH_ACTIONS.GAME_UPDATE, inMemoryGames);
  sendClientMessage(socket, "Welcome to Number Crunch 💯");
}
