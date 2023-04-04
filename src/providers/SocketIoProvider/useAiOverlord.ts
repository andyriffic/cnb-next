import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import {
  AI_OVERLORD_ACTIONS,
  CreateAiOverlordGameHandler,
  NewAiOverlordOpponentHandler,
} from "../../services/ai-overlord/socket.io";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { useSocketIo } from ".";

export type AiOverlordSocketService = {
  aiOverlordGames: AiOverlordGame[];
  createAiOverlordGame: CreateAiOverlordGameHandler;
  newOpponent: NewAiOverlordOpponentHandler;
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
  };
}

//Helper for working with a single AiOverlord game
export const useAiOverlordGame = (
  gameId: string
): {
  aiOverlordGame: AiOverlordGame | undefined;
  newOpponent: (opponentId: string) => void;
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

  return {
    aiOverlordGame,
    newOpponent,
  };
};
