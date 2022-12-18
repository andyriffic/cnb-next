import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import {
  AddNewBettingRoundHandler,
  BETTING_ACTIONS,
  CreateBettingGameHandler,
  MakePlayerBetHandler,
  ResolveBettingRoundHandler,
} from "../../services/betting/socket.io";
import {
  GroupBettingGame,
  GroupPlayerBettingRound,
  PlayerBet,
} from "../../services/betting/types";
import { useSocketIo } from ".";

export type GroupBettingSocketService = {
  bettingGames: GroupBettingGame[];
  createGroupBettingGame: CreateBettingGameHandler;
  makePlayerBet: MakePlayerBetHandler;
  resolveBettingRound: ResolveBettingRoundHandler;
  addNewBettingRound: AddNewBettingRoundHandler;
};

export function useGroupBetting(socket: Socket): GroupBettingSocketService {
  const [bettingGames, setBettingGames] = useState<GroupBettingGame[]>([]);

  const createGroupBettingGame = useCallback<CreateBettingGameHandler>(
    (gameId, options, playerIds, onCreated) =>
      socket.emit(
        BETTING_ACTIONS.CREATE_BETTING_GAME,
        gameId,
        options,
        playerIds,
        onCreated
      ),
    [socket]
  );

  const makePlayerBet = useCallback<MakePlayerBetHandler>(
    (gameId, playerBet) =>
      socket.emit(BETTING_ACTIONS.MAKE_PLAYER_BET, gameId, playerBet),
    [socket]
  );

  const resolveBettingRound = useCallback<ResolveBettingRoundHandler>(
    (gameId, winningOptionId) =>
      socket.emit(BETTING_ACTIONS.GET_BETTING_RESULTS, gameId, winningOptionId),
    [socket]
  );

  const addNewBettingRound = useCallback<AddNewBettingRoundHandler>(
    (gameId) => socket.emit(BETTING_ACTIONS.ADD_BETTING_ROUND, gameId),
    [socket]
  );

  useEffect(() => {
    console.log("Setting up Betting Games socket connection");
    socket.on(
      BETTING_ACTIONS.BETTING_UPDATE,
      (bettingGames: GroupBettingGame[]) => {
        setBettingGames(bettingGames);
      }
    );

    return () => {
      console.log("Disconnecting Betting Games Socket");
      socket.off(BETTING_ACTIONS.BETTING_UPDATE);
      socket.off(BETTING_ACTIONS.MAKE_PLAYER_BET);
    };
  }, [socket]);

  return {
    bettingGames,
    createGroupBettingGame,
    makePlayerBet,
    resolveBettingRound,
    addNewBettingRound,
  };
}

// Helper for individual betting game
export function useBettingGame(gameId: string): {
  bettingGame: GroupBettingGame | undefined;
  currentBettingRound: GroupPlayerBettingRound | undefined;
  makePlayerBet: (playerBet: PlayerBet) => void;
  resolveBettingRound: (winningOptionId: string) => void;
  newBettingRound: () => void;
} {
  const {
    groupBetting: {
      bettingGames,
      makePlayerBet,
      resolveBettingRound,
      addNewBettingRound,
    },
  } = useSocketIo();

  const bettingGame = useMemo(() => {
    return bettingGames.find((g) => g.id === gameId);
  }, [gameId, bettingGames]);

  const currentBettingRound = useMemo(() => {
    return bettingGame && bettingGame.rounds[bettingGame.rounds.length - 1];
  }, [bettingGame]);

  const makeBet = useCallback(
    (playerBet: PlayerBet) => {
      return makePlayerBet(gameId, playerBet);
    },
    [gameId, makePlayerBet]
  );

  const resolveRound = useCallback(
    (winningOptionId: string) => {
      return resolveBettingRound(gameId, winningOptionId);
    },
    [gameId, resolveBettingRound]
  );

  const newRound = useCallback(() => {
    return addNewBettingRound(gameId);
  }, [gameId, addNewBettingRound]);

  return {
    bettingGame,
    currentBettingRound,
    makePlayerBet: makeBet,
    resolveBettingRound: resolveRound,
    newBettingRound: newRound,
  };
}
