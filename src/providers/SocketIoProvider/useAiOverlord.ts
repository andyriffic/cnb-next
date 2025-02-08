import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import {
  AI_OVERLORD_ACTIONS,
  CreateAiOverlordGameHandler,
  InitialiseAiOpponentHandler,
  InitialiseAiOverlordHandler,
  MakeAiOpponentMoveHandler,
  MakeAiRobotMoveHandler,
  MakeFinalRobotSummaryHandler,
  NewAiOverlordOpponentHandler,
} from "../../services/ai-overlord/socket.io";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { RPSMoveName } from "../../services/rock-paper-scissors/types";
import { useSocketIo } from ".";

export type AiOverlordSocketService = {
  aiOverlordGames: AiOverlordGame[];
  thinkingAis: string[];
  createAiOverlordGame: CreateAiOverlordGameHandler;
  initialiseAiOverlord: InitialiseAiOverlordHandler;
  initialiseOpponent: InitialiseAiOpponentHandler;
  newOpponent: NewAiOverlordOpponentHandler;
  makeOpponentMove: MakeAiOpponentMoveHandler;
  makeRobotMove: MakeAiRobotMoveHandler;
  finaliseGame: MakeFinalRobotSummaryHandler;
  startThinking: (gameId: string) => void;
  stopThinking: (gameId: string) => void;
  lastRobotDebugMessage: string;
  clearRobotDebugMessage: () => void;
};

export function useAiOverlord(socket: Socket): AiOverlordSocketService {
  const [aiOverlordGames, setAiOverlordGames] = useState<AiOverlordGame[]>([]);
  const [thinkingAis, setThinkingAis] = useState<string[]>([]);
  const [lastRobotMessage, setLastRobotMessage] = useState(""); // TODO: can store history of messages as string[]

  const createAiOverlordGame = useCallback<CreateAiOverlordGameHandler>(
    (id, opponents, onCreated) =>
      socket.emit(AI_OVERLORD_ACTIONS.CREATE_GAME, id, opponents, onCreated),
    [socket]
  );

  const initialiseAiOverlord = useCallback<InitialiseAiOverlordHandler>(
    (gameId) => socket.emit(AI_OVERLORD_ACTIONS.INITIALISE_AI, gameId),
    [socket]
  );

  const initialiseOpponent = useCallback<InitialiseAiOpponentHandler>(
    (gameId, opponentId) =>
      socket.emit(AI_OVERLORD_ACTIONS.INITIALISE_OPPONENT, gameId, opponentId),
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

  const finaliseGame = useCallback<MakeFinalRobotSummaryHandler>(
    (gameId) =>
      socket.emit(AI_OVERLORD_ACTIONS.MAKE_FINAL_ROBOT_SUMMARY, gameId),
    [socket]
  );

  const startThinking = useCallback(
    (gameId: string) => {
      setThinkingAis([...thinkingAis.filter((id) => id !== gameId), gameId]);
    },
    [thinkingAis]
  );

  const stopThinking = useCallback(
    (gameId: string) => {
      setThinkingAis(thinkingAis.filter((id) => id !== gameId));
    },
    [thinkingAis]
  );

  const clearRobotDebugMessage = useCallback(() => {
    setLastRobotMessage("");
  }, []);

  useEffect(() => {
    console.log("Setting up Ai Overlord socket connection");
    socket.on(
      AI_OVERLORD_ACTIONS.GAME_UPDATE,
      (aiOverlordGames: AiOverlordGame[]) => {
        setThinkingAis([]);
        setAiOverlordGames(aiOverlordGames);
      }
    );

    socket.on(AI_OVERLORD_ACTIONS.ROBOT_MESSAGE, (message: string) => {
      setLastRobotMessage(message);
    });

    return () => {
      console.log("Disconnecting Ai Overlord Socket");
      socket.off(AI_OVERLORD_ACTIONS.GAME_UPDATE);
      socket.off(AI_OVERLORD_ACTIONS.ROBOT_MESSAGE);
    };
  }, [socket]);

  return {
    aiOverlordGames,
    createAiOverlordGame,
    initialiseAiOverlord,
    initialiseOpponent,
    newOpponent,
    makeOpponentMove,
    makeRobotMove,
    startThinking,
    stopThinking,
    thinkingAis,
    lastRobotDebugMessage: lastRobotMessage,
    clearRobotDebugMessage,
    finaliseGame,
  };
}

//Helper for working with a single AiOverlord game
export const useAiOverlordGame = (
  gameId: string
): {
  aiOverlordGame: AiOverlordGame | undefined;
  initialiseAi: () => void;
  initialiseOpponent: (opponentId: string) => void;
  newOpponent: (opponentId: string) => void;
  makeOpponentMove: (opponentId: string, move: RPSMoveName) => void;
  makeRobotMove: (opponentId: string) => void;
  finaliseGame: () => void;
  startThinking: () => void;
  stopThinking: () => void;
  isThinking: boolean;
} => {
  const { aiOverlord } = useSocketIo();

  const aiOverlordGame = useMemo(
    () => aiOverlord.aiOverlordGames.find((game) => game.gameId === gameId),
    [aiOverlord.aiOverlordGames, gameId]
  );

  const initialiseAi = useCallback(() => {
    aiOverlord.initialiseAiOverlord(gameId);
  }, [aiOverlord, gameId]);

  const initialiseOpponent = useCallback(
    (opponentId: string) => {
      aiOverlord.initialiseOpponent(gameId, opponentId);
    },
    [aiOverlord, gameId]
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

  const finaliseGame = useCallback(() => {
    aiOverlord.finaliseGame(gameId);
  }, [aiOverlord, gameId]);

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
    initialiseAi,
    initialiseOpponent,
    newOpponent,
    makeOpponentMove,
    makeRobotMove,
    startThinking,
    stopThinking,
    isThinking,
    finaliseGame,
  };
};
