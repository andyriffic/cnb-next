import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  CREATE_GAS_GAME,
  GAS_GAMES_UPDATE,
  GUESS_NEXT_PLAYER_OUT,
  NEXT_GAS_PAYER,
  PLAYER_TIMED_OUT,
  PLAY_EFFECT,
  PLAY_GAS_CARD,
  PRESS_GAS,
} from "../../services/migrated/gas-out/socket";
import { GasGame, GlobalEffect } from "../../services/migrated/gas-out/types";

export type GasGameSocketService = {
  gasGames: GasGame[];
  createGasGame: (
    playerIds: string[],
    gameId: string,
    onCreated: (id: string) => void
  ) => void;
  playCard: (gameId: string, playerId: string, cardIndex: number) => void;
  pressGas: (gameId: string) => void;
  nextPlayer: (gameId: string) => void;
  timeoutPlayer: (gameId: string, playerId: string) => void;
  playEffect: (gameId: string, effect: GlobalEffect) => void;
  guessNextOutPlayer: (
    gameId: string,
    playerId: string,
    guessPlayerId: string
  ) => void;
};

export function useGasGame(socket: Socket): GasGameSocketService {
  const [gasGames, setGasGames] = useState<GasGame[]>([]);

  const createGasGame = useCallback(
    (playerIds: string[], gameId: string, onCreated: (id: string) => void) => {
      socket.emit(CREATE_GAS_GAME, playerIds, gameId, onCreated);
    },
    [socket]
  );

  const playCard = useCallback(
    (gameId: string, playerId: string, cardIndex: number) => {
      socket.emit(PLAY_GAS_CARD, gameId, playerId, cardIndex);
    },
    [socket]
  );

  const pressGas = useCallback(
    (gameId: string) => {
      socket.emit(PRESS_GAS, gameId);
    },
    [socket]
  );

  const nextPlayer = useCallback(
    (gameId: string) => {
      socket.emit(NEXT_GAS_PAYER, gameId);
    },
    [socket]
  );

  const timeoutPlayer = useCallback(
    (gameId: string, playerId: string) => {
      socket.emit(PLAYER_TIMED_OUT, gameId, playerId);
    },
    [socket]
  );

  const playEffect = useCallback(
    (gameId: string, effect: GlobalEffect) => {
      socket.emit(PLAY_EFFECT, gameId, effect);
    },
    [socket]
  );

  const guessNextOutPlayer = useCallback(
    (gameId: string, playerId: string, guessPlayerId: string) => {
      socket.emit(GUESS_NEXT_PLAYER_OUT, gameId, playerId, guessPlayerId);
    },
    [socket]
  );

  useEffect(() => {
    console.log("Setting up Gas Game socket connection");
    socket.on(GAS_GAMES_UPDATE, (games: GasGame[]) => {
      console.log("GAS GAMES", games);
      setGasGames(games);
    });

    return () => {
      console.log("Disconnecting Gas Game Socket");
      socket.off(GAS_GAMES_UPDATE);
    };
  }, [socket]);

  return {
    gasGames,
    createGasGame,
    playCard,
    pressGas,
    nextPlayer,
    timeoutPlayer,
    playEffect,
    guessNextOutPlayer,
  };
}
