import { customAlphabet } from "nanoid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { PLAYER_JOIN_ACTIONS } from "../../services/player-join/socket.io";
import { PlayerGroup } from "../../services/player-join/types";

export type GroupJoinSocketService = {
  playerGroups: PlayerGroup[];
  createPlayerGroup: (onCreated?: (groupId: string) => void) => void;
};

const generateGameId = customAlphabet("1234567890");

export function useGroupPlayerJoin(socket: Socket): GroupJoinSocketService {
  const [playerGroups, setPlayerGroups] = useState<PlayerGroup[]>([]);

  const createPlayerGroup = useCallback(
    (onCreated?: (groupId: string) => void) =>
      socket.emit(
        PLAYER_JOIN_ACTIONS.CREATE_JOIN_GROUP,
        generateGameId(4),
        onCreated
      ),
    [socket]
  );

  useEffect(() => {
    console.log("Setting up Player Group socket connection");
    socket.on(
      PLAYER_JOIN_ACTIONS.JOIN_GROUP_UPDATE,
      (playerGroups: PlayerGroup[]) => {
        setPlayerGroups(playerGroups);
      }
    );

    return () => {
      console.log("Disconnecting Player Group Socket");
      socket.off(PLAYER_JOIN_ACTIONS.JOIN_GROUP_UPDATE);
    };
  }, [socket]);

  return {
    playerGroups,
    createPlayerGroup,
  };
}
