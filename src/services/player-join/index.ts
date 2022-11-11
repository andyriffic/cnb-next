import { PlayerGroup } from "./types";

export function createPlayerJoinGroup(id: string): PlayerGroup {
  return {
    id,
    playerIds: [],
  };
}

export function addPlayerToGroup(
  playerId: string,
  playerGroup: PlayerGroup
): PlayerGroup {
  return playerGroup.playerIds.includes(playerId)
    ? playerGroup
    : { ...playerGroup, playerIds: [...playerGroup.playerIds, playerId] };
}
