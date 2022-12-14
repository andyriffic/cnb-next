import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  PlayerJoinGroupSocketHandler,
  PLAYER_JOIN_ACTIONS,
} from "../../services/player-join/socket.io";
import { PlayerGroup } from "../../services/player-join/types";
import { generateShortNumericId } from "../../utils/id";

export type GroupJoinSocketService = {
  playerGroups: PlayerGroup[];
  createPlayerGroup: (onCreated?: (groupId: string) => void) => void;
  joinGroup: PlayerJoinGroupSocketHandler;
};

export function useGroupPlayerJoin(socket: Socket): GroupJoinSocketService {
  const [playerGroups, setPlayerGroups] = useState<PlayerGroup[]>([]);

  const createPlayerGroup = useCallback(
    (onCreated?: (groupId: string) => void) =>
      socket.emit(
        PLAYER_JOIN_ACTIONS.CREATE_JOIN_GROUP,
        generateShortNumericId(),
        onCreated
      ),
    [socket]
  );

  const joinGroup = useCallback<PlayerJoinGroupSocketHandler>(
    (playerId, groupId, onJoined) =>
      socket.emit(
        PLAYER_JOIN_ACTIONS.PLAYER_JOIN_GROUP,
        playerId,
        groupId,
        onJoined
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
    joinGroup,
  };
}
