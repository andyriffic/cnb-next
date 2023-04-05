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
  createAiOverlordGame: CreateAiOverlordGameHandler;
  newOpponent: NewAiOverlordOpponentHandler;
  makeOpponentMove: MakeAiOpponentMoveHandler;
  makeRobotMove: MakeAiRobotMoveHandler;
};

export function useAiOverlord(socket: Socket): AiOverlordSocketService {
  const [aiOverlordGames, setAiOverlordGames] = useState<AiOverlordGame[]>([]);

  const createAiOverlordGame = useCallback<CreateAiOverlordGameHandler>(
    (id, opponents, onCreated) =>
      socket.emit(
        AI_OVERLORD_ACTIONS.AI_OVERLORD_CREATE_GAME,
        id,
        opponents,
        onCreated
      ),
    [socket]
  );

  const newOpponent = useCallback<NewAiOverlordOpponentHandler>(
    (gameId, opponentId) =>
      socket.emit(
        AI_OVERLORD_ACTIONS.AI_OVERLORD_NEW_OPPONENT,
        gameId,
        opponentId
      ),
    [socket]
  );

  const makeOpponentMove = useCallback<MakeAiOpponentMoveHandler>(
    (gameId, opponentId, move) =>
      socket.emit(
        AI_OVERLORD_ACTIONS.AI_OVERLORD_MAKE_OPPONENT_MOVE,
        gameId,
        opponentId,
        move
      ),
    [socket]
  );

  const makeRobotMove = useCallback<MakeAiRobotMoveHandler>(
    (gameId, opponentId) =>
      socket.emit(
        AI_OVERLORD_ACTIONS.AI_OVERLORD_MAKE_ROBOT_MOVE,
        gameId,
        opponentId
      ),
    [socket]
  );

  useEffect(() => {
    console.log("Setting up Ai Overlord socket connection");
    socket.on(
      AI_OVERLORD_ACTIONS.AI_OVERLORD_GAME_UPDATE,
      (aiOverlordGames: AiOverlordGame[]) => {
        setAiOverlordGames(aiOverlordGames);
      }
    );

    return () => {
      console.log("Disconnecting Ai Overlord Socket");
      socket.off(AI_OVERLORD_ACTIONS.AI_OVERLORD_GAME_UPDATE);
    };
  }, [socket]);

  return {
    aiOverlordGames,
    createAiOverlordGame,
    newOpponent,
    makeOpponentMove,
    makeRobotMove,
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

  return {
    aiOverlordGame,
    newOpponent,
    makeOpponentMove,
    makeRobotMove,
  };
};
