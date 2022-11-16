import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { useSocketIo } from ".";
import {
  BETTING_ACTIONS,
  CreateBettingGameHandler,
} from "../../services/betting/socket.io";
import { GroupBettingGame } from "../../services/betting/types";

export type GroupBettingSocketService = {
  bettingGames: GroupBettingGame[];
  createGroupBettingGame: CreateBettingGameHandler;
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
    };
  }, [socket]);

  return {
    bettingGames,
    createGroupBettingGame,
  };
}

// Helper for individual betting game
export function useBettingGame(gameId: string): {
  bettingGame: GroupBettingGame | undefined;
} {
  const {
    groupBetting: { bettingGames },
  } = useSocketIo();

  const bettingGame = useMemo(() => {
    return bettingGames.find((g) => g.id === gameId);
  }, [gameId, bettingGames]);

  return { bettingGame };
}
