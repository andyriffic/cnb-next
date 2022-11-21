import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { Socket, Server as SocketIOServer } from "socket.io";
import {
  addNewBettingRound,
  applyBetResultToCurrentRound,
  createBettingGame,
  makePlayerBet,
} from ".";
import { sendClientMessage } from "../socket";
import {
  BettingOption,
  GroupBettingGame,
  PlayerBet,
  PlayerWallet,
} from "./types";

export enum BETTING_ACTIONS {
  CREATE_BETTING_GAME = "CREATE_BETTING_GAME",
  MAKE_PLAYER_BET = "MAKE_PLAYER_BET",
  GET_BETTING_RESULTS = "GET_BETTING_RESULTS",
  ADD_BETTING_ROUND = "ADD_BETTING_ROUND",
  BETTING_UPDATE = "BETTING_UPDATE",
}

export type CreateBettingGameHandler = (
  id: string,
  options: BettingOption[],
  playerWallets: PlayerWallet[],
  onCreated: (id: string) => void
) => void;

export type MakePlayerBetHandler = (
  gameId: string,
  playerBet: PlayerBet
) => void;

export type ResolveBettingRoundHandler = (
  gameId: string,
  winningOptionId: string
) => void;

export type AddNewBettingRoundHandler = (gameId: string) => void;

let inMemoryBettingGames: GroupBettingGame[] = [];

export function initialiseGroupBettingSocket(
  io: SocketIOServer,
  socket: Socket
): void {
  const createBettingGameHandler: CreateBettingGameHandler = (
    id,
    options,
    playerWallets,
    onCreated
  ) => {
    pipe(
      createBettingGame(id, options, playerWallets),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (groupGame) => {
          inMemoryBettingGames = [
            ...inMemoryBettingGames.filter((g) => g.id !== groupGame.id),
            groupGame,
          ];
          console.log("updated bets", groupGame);
          io.emit(BETTING_ACTIONS.BETTING_UPDATE, inMemoryBettingGames);
          onCreated(groupGame.id);
        }
      )
    );
  };

  const makePlayerBetHandler: MakePlayerBetHandler = (gameId, playerBet) => {
    console.log("Player made bet", gameId, playerBet);

    return pipe(
      inMemoryBettingGames,
      A.findFirst((g) => g.id === gameId),
      E.fromOption(() => "no game found"),
      E.chain((game) => makePlayerBet(game, playerBet)),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (groupGame) => {
          inMemoryBettingGames = [
            ...inMemoryBettingGames.filter((g) => g.id !== groupGame.id),
            groupGame,
          ];
          console.log("updated bets", groupGame);
          io.emit(BETTING_ACTIONS.BETTING_UPDATE, inMemoryBettingGames);
        }
      )
    );
  };

  const resolveBettingRoundHandler: ResolveBettingRoundHandler = (
    gameId,
    winningOptionId
  ) => {
    console.log("Resolving betting round", gameId);

    return pipe(
      inMemoryBettingGames,
      A.findFirst((g) => g.id === gameId),
      E.fromOption(() => "no game found"),
      E.chain((game) => applyBetResultToCurrentRound(game, winningOptionId)),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (groupGame) => {
          inMemoryBettingGames = [
            ...inMemoryBettingGames.filter((g) => g.id !== groupGame.id),
            groupGame,
          ];
          console.log("updated bets", groupGame);
          io.emit(BETTING_ACTIONS.BETTING_UPDATE, inMemoryBettingGames);
        }
      )
    );
  };

  const addNewBettingRoundHandler: AddNewBettingRoundHandler = (gameId) => {
    console.log("Adding betting round", gameId);

    return pipe(
      inMemoryBettingGames,
      A.findFirst((g) => g.id === gameId),
      E.fromOption(() => "no game found"),
      E.chain((game) => addNewBettingRound(game)),
      E.match(
        (error) => {
          console.error(error);
          sendClientMessage(socket, error);
        },
        (groupGame) => {
          inMemoryBettingGames = [
            ...inMemoryBettingGames.filter((g) => g.id !== groupGame.id),
            groupGame,
          ];
          console.log("updated bets", groupGame);
          io.emit(BETTING_ACTIONS.BETTING_UPDATE, inMemoryBettingGames);
        }
      )
    );
  };

  console.log("Registering Betting SocketIo 🔌");

  socket.on(BETTING_ACTIONS.CREATE_BETTING_GAME, createBettingGameHandler);
  socket.on(BETTING_ACTIONS.MAKE_PLAYER_BET, makePlayerBetHandler);
  socket.on(BETTING_ACTIONS.GET_BETTING_RESULTS, resolveBettingRoundHandler);
  socket.on(BETTING_ACTIONS.ADD_BETTING_ROUND, addNewBettingRoundHandler);
  socket.emit(BETTING_ACTIONS.BETTING_UPDATE, inMemoryBettingGames);
  sendClientMessage(socket, "Welcome to Betting 💰");
}
