import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import { Socket, Server as SocketIOServer } from "socket.io";
import { createBettingGame } from ".";
import { sendClientMessage } from "../socket";
import { BettingOption, GroupBettingGame, PlayerWallet } from "./types";

export enum BETTING_ACTIONS {
  CREATE_BETTING_GAME = "CREATE_BETTING_GAME",
  CREATE_BETTING_ROUND = "CREATE_BETTING_ROUND",
  MAKE_PLAYER_BET = "MAKE_PLAYER_BET",
  GET_BETTING_RESULTS = "GET_BETTING_RESULTS",
  BETTING_UPDATE = "BETTING_UPDATE",
}

export type CreateBettingGameHandler = (
  id: string,
  options: BettingOption[],
  playerWallets: PlayerWallet[],
  onCreated: (id: string) => void
) => void;

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

  console.log("Registering Betting SocketIo 🔌");

  socket.on(BETTING_ACTIONS.CREATE_BETTING_GAME, createBettingGameHandler);
  socket.emit(BETTING_ACTIONS.BETTING_UPDATE, inMemoryBettingGames);
  sendClientMessage(socket, "Welcome to Betting 💰");
}
