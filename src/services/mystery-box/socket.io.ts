import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { Socket, Server as SocketIOServer } from "socket.io";
import { sendClientMessage } from "../socket";
import { ErrorMessage } from "../../types/common";
import { generateRandomInt } from "../../utils/random";
import { Player } from "../../types/Player";
import { MysteryBoxGame } from "./types";
import {
  createMysteryBoxGame,
  createMysteryBoxGameView,
  newRound,
  playerSelectBox,
} from ".";

export enum MYSTERY_BOX_ACTIONS {
  GAME_UPDATE = "MYSTERY_BOX_GAME_UPDATE",
  CREATE_GAME = "MYSTERY_BOX_CREATE_GAME",
  MAKE_PLAYER_GUESS = "MYSTERY_BOX_PLAYER_SELECT_BOX",
  NEW_ROUND = "MYSTERY_BOX_NEW_ROUND",
}

export type CreateMysteryBoxGameHandler = (
  id: string,
  players: Player[],
  onCreated: (game: MysteryBoxGame) => void
) => void;

export type PlayerSelectMysteryBoxHandler = (
  gameId: string,
  playerId: string,
  roundId: number,
  boxId: number
) => void;

export type NewRoundMysteryBoxHandler = (gameId: string) => void;

let inMemoryGames: MysteryBoxGame[] = [];

const updateInMemoryGame = (game: MysteryBoxGame): MysteryBoxGame[] => {
  inMemoryGames = [...inMemoryGames.filter((g) => g.id !== game.id), game];
  return inMemoryGames;
};

const emitUpdatedGameViewsToAllClients = (io: SocketIOServer) => {
  // console.info("Emitting updated games to all clients", getGameViews());
  io.emit(
    MYSTERY_BOX_ACTIONS.GAME_UPDATE,
    inMemoryGames.map(createMysteryBoxGameView)
  );
};

const getGame = (
  gameId: string,
  allGames: MysteryBoxGame[]
): E.Either<ErrorMessage, MysteryBoxGame> => {
  const game = allGames.find((g) => g.id === gameId);
  return game ? E.right(game) : E.left("Game not found");
};

export function initialiseMysteryBoxSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const createGameHandler: CreateMysteryBoxGameHandler = (
    id,
    players,
    onCreated
  ) => {
    console.log("Got to creating mystery box game socket");
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
          emitUpdatedGameViewsToAllClients(io);
        }
      )
    );
  };

  const playerSelectMysteryBoxHandler: PlayerSelectMysteryBoxHandler = (
    gameId,
    playerId,
    roundId,
    boxId
  ) => {
    pipe(
      getGame(gameId, inMemoryGames),
      E.chain(playerSelectBox(playerId, roundId, boxId)),
      E.match(
        (e) => {
          console.error(e), sendClientMessage(socket, e);
        },
        (updatedGame) => {
          updateInMemoryGame(updatedGame);
          emitUpdatedGameViewsToAllClients(io);
        }
      )
    );
  };

  const newRoundMysteryBoxHandler: NewRoundMysteryBoxHandler = (gameId) => {
    pipe(
      getGame(gameId, inMemoryGames),
      E.chain(newRound),
      E.match(
        (e) => {
          console.error(e), sendClientMessage(socket, e);
        },
        (updatedGame) => {
          updateInMemoryGame(updatedGame);
          emitUpdatedGameViewsToAllClients(io);
        }
      )
    );
  };

  console.log("Registering Mystery Box SocketIo 🔌");

  socket.on(MYSTERY_BOX_ACTIONS.CREATE_GAME, createGameHandler);
  socket.on(
    MYSTERY_BOX_ACTIONS.MAKE_PLAYER_GUESS,
    playerSelectMysteryBoxHandler
  );
  socket.on(MYSTERY_BOX_ACTIONS.NEW_ROUND, newRoundMysteryBoxHandler);
  socket.emit(
    MYSTERY_BOX_ACTIONS.GAME_UPDATE,
    inMemoryGames.map(createMysteryBoxGameView)
  );
  sendClientMessage(socket, "Welcome to Mystery Box ❓🎁");
}
