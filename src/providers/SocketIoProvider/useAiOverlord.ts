import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import {
  AI_OVERLORD_ACTIONS,
  CreateAiOverlordGameHandler,
  MakeAiOpponentMoveHandler,
  MakeAiRobotMoveHandler,
  NewAiOverlordOpponentHandler,
} from "../../services/ai-overlord/socket.io";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { RPSMoveName } from "../../services/rock-paper-scissors/types";
import { useSocketIo } from ".";

export type AiOverlordSocketService = {
  aiOverlordGames: AiOverlordGame[];
  thinkingAis: string[];
  createAiOverlordGame: CreateAiOverlordGameHandler;
  newOpponent: NewAiOverlordOpponentHandler;
  makeOpponentMove: MakeAiOpponentMoveHandler;
  makeRobotMove: MakeAiRobotMoveHandler;
  startThinking: (gameId: string) => void;
  stopThinking: (gameId: string) => void;
};

export function useAiOverlord(socket: Socket): AiOverlordSocketService {
  const [aiOverlordGames, setAiOverlordGames] = useState<AiOverlordGame[]>([]);
  const [thinkingAis, setThinkingAis] = useState<string[]>([]);

  const createAiOverlordGame = useCallback<CreateAiOverlordGameHandler>(
    (id, opponents, onCreated) =>
      socket.emit(AI_OVERLORD_ACTIONS.CREATE_GAME, id, opponents, onCreated),
    [socket]
  );

  const newOpponent = useCallback<NewAiOverlordOpponentHandler>(
    (gameId, opponentId) =>
      socket.emit(AI_OVERLORD_ACTIONS.NEW_OPPONENT, gameId, opponentId),
    [socket]
  );

  const makeOpponentMove = useCallback<MakeAiOpponentMoveHandler>(
    (gameId, opponentId, move) =>
      socket.emit(
        AI_OVERLORD_ACTIONS.MAKE_OPPONENT_MOVE,
        gameId,
        opponentId,
        move
      ),
    [socket]
  );

  const makeRobotMove = useCallback<MakeAiRobotMoveHandler>(
    (gameId, opponentId) =>
      socket.emit(AI_OVERLORD_ACTIONS.MAKE_ROBOT_MOVE, gameId, opponentId),
    [socket]
  );

  const startThinking = useCallback(
    (gameId) => {
      setThinkingAis([...thinkingAis.filter((id) => id !== gameId), gameId]);
    },
    [thinkingAis]
  );

  const stopThinking = useCallback(
    (gameId) => {
      setThinkingAis(thinkingAis.filter((id) => id !== gameId));
    },
    [thinkingAis]
  );

  useEffect(() => {
    console.log("Setting up Ai Overlord socket connection");
    socket.on(
      AI_OVERLORD_ACTIONS.GAME_UPDATE,
      (aiOverlordGames: AiOverlordGame[]) => {
        setThinkingAis([]);
        setAiOverlordGames(aiOverlordGames);
      }
    );

    return () => {
      console.log("Disconnecting Ai Overlord Socket");
      socket.off(AI_OVERLORD_ACTIONS.GAME_UPDATE);
    };
  }, [socket]);

  return {
    aiOverlordGames,
    createAiOverlordGame,
    newOpponent,
    makeOpponentMove,
    makeRobotMove,
    startThinking,
    stopThinking,
    thinkingAis,
  };
}

//Helper for working with a single AiOverlord game
export const useAiOverlordGame = (
  gameId: string
): {
  aiOverlordGame: AiOverlordGame | undefined;
  newOpponent: (opponentId: string) => void;
  makeOpponentMove: (opponentId: string, move: RPSMoveName) => void;
  makeRobotMove: (opponentId: string) => void;
  startThinking: () => void;
  stopThinking: () => void;
  isThinking: boolean;
} => {
  const { aiOverlord } = useSocketIo();

  const aiOverlordGame = useMemo(
    () => aiOverlord.aiOverlordGames.find((game) => game.gameId === gameId),
    [aiOverlord.aiOverlordGames, gameId]
  );

  const newOpponent = useCallback(
    (opponentId: string) => {
      aiOverlord.newOpponent(gameId, opponentId);
    },
    [aiOverlord, gameId]
  );

  const makeOpponentMove = useCallback(
    (opponentId: string, move: RPSMoveName) => {
      aiOverlord.makeOpponentMove(gameId, opponentId, move);
    },
    [aiOverlord, gameId]
  );

  const makeRobotMove = useCallback(
    (opponentId: string) => {
      aiOverlord.makeRobotMove(gameId, opponentId);
    },
    [aiOverlord, gameId]
  );

  const startThinking = useCallback(() => {
    aiOverlord.startThinking(gameId);
  }, [aiOverlord, gameId]);

  const stopThinking = useCallback(() => {
    aiOverlord.stopThinking(gameId);
  }, [aiOverlord, gameId]);

  const isThinking = useMemo(() => {
    return aiOverlord.thinkingAis.includes(gameId);
  }, [aiOverlord, gameId]);

  return {
    aiOverlordGame,
    newOpponent,
    makeOpponentMove,
    makeRobotMove,
    startThinking,
    stopThinking,
    isThinking,
  };
};
