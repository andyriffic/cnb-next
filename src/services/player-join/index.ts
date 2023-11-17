import { Player } from "../../types/Player";
import { PlayerGroup } from "./types";

export function createPlayerJoinGroup(id: string): PlayerGroup {
  return {
    id,
    playerIds: [],
    players: [],
  };
}

export function addPlayerIdToGroup(
  playerId: string,
  playerGroup: PlayerGroup
): PlayerGroup {
  return playerGroup.playerIds.includes(playerId)
    ? playerGroup
    : { ...playerGroup, playerIds: [...playerGroup.playerIds, playerId] };
}

export function addPlayerToGroup(
  player: Player,
  playerGroup: PlayerGroup
): PlayerGroup {
  return playerGroup.playerIds.includes(player.id)
    ? playerGroup
    : {
        ...playerGroup,
        playerIds: [...playerGroup.playerIds, player.id],
        players: [...playerGroup.players, player],
      };
}
