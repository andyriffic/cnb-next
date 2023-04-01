import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import {
  AI_OVERLORD_ACTIONS,
  CreateAiOverlordGameHandler,
} from "../../services/ai-overlord/socket.io";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { useSocketIo } from ".";

export type AiOverlordSocketService = {
  aiOverlordGames: AiOverlordGame[];
  createAiOverlordGame: CreateAiOverlordGameHandler;
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
  };
}

//Helper for working with a single AiOverlord game
export const useAiOverlordGame = (
  gameId: string
): { aiOverlordGame: AiOverlordGame | undefined } => {
  const { aiOverlord } = useSocketIo();

  const aiOverlordGame = useMemo(
    () => aiOverlord.aiOverlordGames.find((game) => game.gameId === gameId),
    [aiOverlord.aiOverlordGames, gameId]
  );

  return {
    aiOverlordGame,
  };
};
