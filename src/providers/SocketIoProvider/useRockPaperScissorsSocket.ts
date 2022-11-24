import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { useSocketIo } from ".";
import {
  RPSCreateGameHandler,
  RPSResolveRoundHandler,
  RPS_ACTIONS,
} from "../../services/rock-paper-scissors/socket.io";
import {
  RPSPlayerMove,
  RPSSpectatorGameView,
  RPSSpectatorRoundView,
} from "../../services/rock-paper-scissors/types";

export type RPSSocketService = {
  activeRPSGames: RPSSpectatorGameView[];
  createRPSGame: RPSCreateGameHandler;
  makeGameMove: (move: RPSPlayerMove, gameId: string) => void;
  resolveGameRound: RPSResolveRoundHandler;
  newGameRound: (gameId: string) => void;
};

export function useRockPaperScissorsSocket(socket: Socket): RPSSocketService {
  const [activeRPSGames, setActiveRPSGames] = useState<RPSSpectatorGameView[]>(
    []
  );

  const createRPSGame = useCallback<RPSCreateGameHandler>(
    (createGameProps, onCreated) =>
      socket.emit(RPS_ACTIONS.CREATE_GAME, createGameProps, onCreated),
    [socket]
  );

  const makeGameMove = useCallback(
    (move: RPSPlayerMove, gameId: string) =>
      socket.emit(RPS_ACTIONS.MAKE_MOVE, move, gameId),
    [socket]
  );

  const resolveGameRound = useCallback<RPSResolveRoundHandler>(
    (gameId, onResolved) =>
      socket.emit(RPS_ACTIONS.RESOLVE_ROUND, gameId, onResolved),
    [socket]
  );

  const newGameRound = useCallback(
    (gameId: string) => socket.emit(RPS_ACTIONS.NEW_ROUND, gameId),
    [socket]
  );

  useEffect(() => {
    console.log("Setting up RockPaperScissors socket connection");

    socket.on(RPS_ACTIONS.GAME_UPDATE, (games: RPSSpectatorGameView[]) => {
      console.log("Socket useEffect", RPS_ACTIONS.GAME_UPDATE, games);
      setActiveRPSGames(games);
    });

    return () => {
      console.log("Disconnecting RockPaperScissors Socket");
      socket.off(RPS_ACTIONS.GAME_UPDATE);
    };
  }, [socket]);

  return {
    activeRPSGames,
    createRPSGame,
    makeGameMove,
    resolveGameRound,
    newGameRound,
  };
}

// Helper for individual game
export function useRPSGame(gameId: string): {
  game: RPSSpectatorGameView | undefined;
  makeMove: (move: RPSPlayerMove) => void;
  resolveRound: (
    onResolved?: (resolvedRound: RPSSpectatorRoundView) => void
  ) => void;
  newRound: () => void;
  currentRound: RPSSpectatorRoundView | undefined;
} {
  const {
    rockPaperScissors: {
      activeRPSGames,
      makeGameMove,
      resolveGameRound,
      newGameRound,
    },
  } = useSocketIo();

  const game = useMemo(() => {
    console.log("useRPSGame", activeRPSGames, gameId);

    return activeRPSGames.find((g) => g.id === gameId);
  }, [gameId, activeRPSGames]);

  const makeMove = useCallback(
    (move: RPSPlayerMove) => {
      return makeGameMove(move, gameId);
    },
    [gameId, makeGameMove]
  );

  const resolveRound = useCallback(
    (onResolved?: (resolvedRound: RPSSpectatorRoundView) => void) => {
      return resolveGameRound(gameId, onResolved);
    },
    [gameId, resolveGameRound]
  );

  const newRound = useCallback(() => {
    return newGameRound(gameId);
  }, [gameId, newGameRound]);

  return {
    game,
    makeMove,
    resolveRound,
    newRound,
    currentRound: game && game.rounds[game.rounds.length - 1],
  };
}
